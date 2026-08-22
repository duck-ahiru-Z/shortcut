"use server";

import { doc, getDoc, collection, addDoc, setDoc, increment, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import crypto from "crypto";
import { shuffleArray, formatKeyCombo, formatKeySequence } from "@/lib/examHelpers";

// Secret for HMAC signing (in production, use process.env.SECRET_KEY)
const SECRET_KEY = process.env.SECRET_KEY || "shortcut_exam_secret_key_2026";

export type ScrubbedQuestion = {
  id: number;
  question: string;
  choices: string[];
};

export type QuestionData = {
  id: number;
  type?: string;
  question: string;
  choices?: string[];
  answer: string;
  expectedKeyCombo?: string[];
  expectedKeyComboHash?: string;
  expectedKeySequence?: { keys: string[] }[];
  expectedKeySequenceHashes?: string[];
  taskData?: any;
  explanation?: string;
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
  explanation?: string;
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

// Utility functions removed to lib/examHelpers.ts

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

  const dynamicAnswers: Record<number, string> = {};

  const shuffledPool = shuffleArray(data.pool);
  const selectedQuestions = shuffledPool.slice(0, data.questionsCount).map((q: any) => {
    const qData: any = {
      id: q.id,
      question: q.question,
    };
    if (q.choices) {
      qData.choices = shuffleArray<string>(q.choices);
    }
    if (q.type) qData.type = q.type;
    if (q.expectedKeyCombo) {
      const sortedCombo = [...q.expectedKeyCombo].sort().join("+");
      qData.expectedKeyComboHash = crypto.createHash('sha256').update(sortedCombo).digest('hex');
    }
    if (q.expectedKeySequence) {
      qData.expectedKeySequenceHashes = q.expectedKeySequence.map((step: any) => {
        const sortedCombo = [...step.keys].sort().join("+");
        return crypto.createHash('sha256').update(sortedCombo).digest('hex');
      });
    }
    
    // Generate dynamic passwords
    if (q.type === 'find_password') {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let pwd = "";
      for (let i = 0; i < 8; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
      
      const lowerChars = "abcdefghijklmnopqrstuvwxyz";
      let anchor = "";
      for (let i = 0; i < 12; i++) anchor += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));

      dynamicAnswers[q.id] = pwd;
      qData.taskData = { ...q.taskData, password: pwd, anchor };
      qData.question = `以下の大量の文字列の中から「${anchor}」を検索し、その直後に書かれている8桁のパスワードを入力してください。`;
    } else if (q.type === 'copy_paste') {
      dynamicAnswers[q.id] = q.taskData.targetText;
      qData.taskData = { ...q.taskData };
    } else if (q.type === 'select_all') {
      const baseText = `【社内情報セキュリティ基本方針】

第1条（目的）
本方針は、当社の保有する情報資産を様々な脅威から保護し、社会的信頼に応えるとともに、事業の継続的かつ安定的な発展に寄与することを目的とする。

第2条（適用範囲）
本方針は、役員、正社員、契約社員、派遣社員を含むすべての従業者に適用される。

第3条（情報資産の保護）
1. 従業者は、業務上知り得た機密情報を第三者に漏洩してはならない。
2. 許可されていない私物デバイスの業務利用（BYOD）を原則禁止する。
3. 不審なメールやファイルを受信した場合は、速やかにシステム管理部門に報告すること。

第4条（監査と罰則）
1. 情報セキュリティ委員は、定期的にセキュリティ監査を実施する。
2. 本方針に違反する行為が確認された場合、就業規則に基づき懲戒処分の対象となる。

第5条（改定）
本方針の改定は、取締役会の承認を経て行うものとする。

`;
      let longText = "";
      for (let i = 1; i <= 100; i++) {
        longText += `[改定履歴 第${i}版]\n` + baseText;
      }
      dynamicAnswers[q.id] = longText;
      qData.taskData = { ...q.taskData, targetText: longText };
      qData.question = "左のテキストエリア内の文章を「すべて選択」してコピーし、右のテキストエリアに貼り付けて回答してください。（※マウスでの選択・右クリックは禁止されています）";
    } else if (q.taskData) {
      qData.taskData = q.taskData;
    }
    
    return qData;
  });

  const token = signPayload({
    grade,
    startTime: Date.now(),
    duration: data.duration,
    dynamicAnswers
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

  const { grade, startTime, duration, dynamicAnswers } = payload;
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

  // Helper formatKeyCombo moved to lib/examHelpers

  for (const q of realQuestions) {
    if (answeredIds.includes(q.id)) {
      const correctAnswer = (dynamicAnswers && dynamicAnswers[q.id]) ? dynamicAnswers[q.id] : q.answer;
      if (correctAnswer === userAnswers[q.id]) {
        score++;
      } else {
        let displayCorrect = correctAnswer;
        if (q.type === 'copy_paste') {
          displayCorrect = `${correctAnswer} (正しくペースト)`;
        } else if (q.type === 'select_all') {
          displayCorrect = `全文を正しくペースト (Ctrl+A -> Ctrl+C -> Ctrl+V)`;
        } else if (q.type === 'find_password') {
          displayCorrect = `${correctAnswer} (正しく入力)`;
        } else if (q.expectedKeySequence) {
          displayCorrect = formatKeySequence(q.expectedKeySequence);
        } else if (q.expectedKeyCombo) {
          displayCorrect = formatKeyCombo(q.expectedKeyCombo);
        }
        
        let displayUser = userAnswers[q.id] || "無回答";
        if (displayUser === "SKIPPED") {
          displayUser = "スキップ (時間切れ等)";
        } else if ((q.expectedKeyCombo || q.expectedKeySequence) && displayUser !== "SKIPPED") {
          // In practical exams, user answers are either correct or skipped,
          // but just in case we have other values, leave them as is
        }

        wrongAnswers.push({
          id: q.id,
          question: q.question,
          userAnswer: displayUser,
          correctAnswer: displayCorrect,
          explanation: q.explanation
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

    // Check if this is a unique device
    const prevQuery = query(collection(db, "exam_results"), where("grade", "==", grade), where("deviceId", "==", tracking.deviceId), limit(1));
    const prevSnap = await getDocs(prevQuery);
    const isUnique = prevSnap.empty;

    // Update aggregated stats (using increment to save reads)
    const statsRef = doc(db, "exam_stats", grade);
    const updates: Record<string, any> = {
      totalTakes: increment(1),
    };
    if (isUnique) updates.uniqueUsers = increment(1);
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
