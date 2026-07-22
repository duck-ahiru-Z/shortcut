"use server";

import { doc, getDoc, collection, addDoc, setDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import crypto from "crypto";

// Secret for HMAC signing (in production, use process.env.SECRET_KEY)
const SECRET_KEY = process.env.SECRET_KEY || "shortcut_exam_secret_key_2026";

export type ScrubbedQuestion = {
  id: number;
  question: string;
  choices: string[];
};

export type QuestionData = {
  id: number;
  question: string;
  choices: string[];
  answer: string;
};

export type ExamData = {
  title: string;
  questionsCount: number;
  passingRate: number;
  duration: number;
  pool: QuestionData[];
};

export type WrongAnswerInfo = {
  id: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
};

export type GradeResult = {
  score: number;
  total: number;
  rate: number;
  passed: boolean;
  wrongAnswers: WrongAnswerInfo[];
  timeTaken: number;
  certNo: string;
};

// In-memory cache to save Firestore reads (persists per Vercel serverless instance)
const examCache: Record<string, { data: ExamData; timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

async function getCachedExamData(grade: string): Promise<ExamData | null> {
  const now = Date.now();
  if (examCache[grade] && now - examCache[grade].timestamp < CACHE_TTL) {
    return examCache[grade].data;
  }

  try {
    const docRef = doc(db, "exams", grade);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data() as ExamData;
    examCache[grade] = { data, timestamp: now };
    return data;
  } catch (error) {
    console.error("Error fetching exam data:", error);
    return null;
  }
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function signPayload(payload: any): string {
  const dataStr = JSON.stringify(payload);
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(dataStr);
  const signature = hmac.digest('hex');
  return Buffer.from(JSON.stringify({ data: payload, signature })).toString('base64');
}

function verifyPayload(token: string): any | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const { data, signature } = JSON.parse(decoded);
    const hmac = crypto.createHmac('sha256', SECRET_KEY);
    hmac.update(JSON.stringify(data));
    const expectedSignature = hmac.digest('hex');
    if (signature === expectedSignature) return data;
    return null;
  } catch (e) {
    return null;
  }
}

// Start exam: returns random questions and a secure token
export async function startExam(grade: string) {
  const data = await getCachedExamData(grade);
  if (!data) throw new Error("Exam not found");

  const shuffledPool = shuffleArray(data.pool);
  const selectedQuestions = shuffledPool.slice(0, data.questionsCount).map((q: QuestionData) => ({
    id: q.id,
    question: q.question,
    choices: shuffleArray<string>(q.choices)
  }));

  const token = signPayload({
    grade,
    startTime: Date.now(),
    duration: data.duration
  });

  return {
    title: data.title,
    durationSeconds: data.duration,
    questions: selectedQuestions,
    token
  };
}

type TrackingData = {
  deviceId: string;
  tabSwitches: number;
  lastName: string;
  firstName: string;
};

// Grade the exam securely on the server
export async function gradeExam(token: string, userAnswers: Record<number, string>, tracking: TrackingData): Promise<GradeResult | null> {
  const payload = verifyPayload(token);
  if (!payload) {
    console.error("Invalid or tampered token");
    return null;
  }

  const { grade, startTime, duration } = payload;
  const data = await getCachedExamData(grade);
  if (!data) return null;

  const now = Date.now();
  const timeTakenSec = Math.floor((now - startTime) / 1000);
  
  // Strict timer check: allow 60 seconds grace period for network latency
  if (timeTakenSec > duration + 60) {
    console.warn(`Timer violation for ${tracking.deviceId}: took ${timeTakenSec}s, allowed ${duration}s`);
    // Depending on strictness, we could fail them or just flag them. We will flag them in the DB.
  }

  const realQuestions = data.pool;
  const examQuestionsCount = data.questionsCount;
  
  let score = 0;
  const wrongAnswers: WrongAnswerInfo[] = [];
  const wrongIds: Record<string, number> = {};

  const answeredIds = Object.keys(userAnswers).map(Number);

  for (const q of realQuestions) {
    if (answeredIds.includes(q.id)) {
      if (q.answer === userAnswers[q.id]) {
        score++;
      } else {
        wrongAnswers.push({
          id: q.id,
          question: q.question,
          userAnswer: userAnswers[q.id] || "無回答",
          correctAnswer: q.answer
        });
        wrongIds[q.id.toString()] = 1; // Mark for stats
      }
    }
  }

  // Count unattempted questions as wrong
  if (answeredIds.length < examQuestionsCount) {
    // Assuming they didn't finish, we don't know exactly which questions they missed unless we track the 30 selected IDs in the token.
    // For simplicity, we just won't include unattempted in the wrongAnswers list, but it affects the score.
  }

  const rate = Math.round((score / examQuestionsCount) * 100);
  const passingRatePercent = data.passingRate * 100;
  const passed = rate >= passingRatePercent;

  const dateObj = new Date();
  // Format: IBT-YYYYMMDD-XXXX (Random 4 digits for simplicity, or DB ID)
  const certNo = `IBT-${dateObj.getFullYear()}${String(dateObj.getMonth() + 1).padStart(2, '0')}${String(dateObj.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

  try {
    // Save to exam_results
    await addDoc(collection(db, "exam_results"), {
      grade,
      deviceId: tracking.deviceId,
      lastName: tracking.lastName,
      firstName: tracking.firstName,
      score,
      total: examQuestionsCount,
      rate,
      passed,
      tabSwitches: tracking.tabSwitches,
      timeTakenSec,
      timerViolated: timeTakenSec > duration + 60,
      timestamp: dateObj.toISOString(),
      certNo: passed ? certNo : null,
      wrongAnswers: wrongAnswers
    });

    // Update aggregated stats (using increment to save reads)
    const statsRef = doc(db, "exam_stats", grade);
    const updates: Record<string, any> = {
      totalTakes: increment(1),
    };
    if (passed) updates.passedCount = increment(1);
    
    // Increment wrong answer counts for each missed question
    for (const qId of Object.keys(wrongIds)) {
      updates[`wrongCounts.${qId}`] = increment(1);
    }
    
    await setDoc(statsRef, updates, { merge: true });

  } catch (error) {
    console.error("Error saving exam result to DB:", error);
    // Continue and return result even if DB write fails, or throw error.
  }

  return {
    score,
    total: examQuestionsCount,
    rate,
    passed,
    wrongAnswers,
    timeTaken: timeTakenSec,
    certNo: passed ? certNo : ""
  };
}
