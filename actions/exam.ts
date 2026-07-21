"use server";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ScrubbedQuestion = {
  id: number;
  question: string;
  choices: string[];
};

export type ExamData = {
  title: string;
  questionsCount: number;
  passingRate: number;
  duration: number;
  pool: ScrubbedQuestion[];
};

export type GradeResult = {
  score: number;
  total: number;
  rate: number;
  passed: boolean;
};

// Fetch questions but DO NOT send answers to the client
export async function getExamData(grade: string): Promise<ExamData | null> {
  try {
    const docRef = doc(db, "exams", grade);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    
    // Scrub the answers
    const scrubbedPool: ScrubbedQuestion[] = data.pool.map((q: any) => ({
      id: q.id,
      question: q.question,
      choices: q.choices,
    }));

    return {
      title: data.title,
      questionsCount: data.questionsCount,
      passingRate: data.passingRate,
      duration: data.duration,
      pool: scrubbedPool,
    };
  } catch (error) {
    console.error("Error fetching exam data:", error);
    return null;
  }
}

// Grade the exam securely on the server
export async function gradeExam(grade: string, userAnswers: Record<number, string>): Promise<GradeResult | null> {
  try {
    const docRef = doc(db, "exams", grade);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    const realQuestions = data.pool;

    let score = 0;
    const total = realQuestions.length; // Actually, the exam is 30 questions. Let's grade out of the provided answers.
    // Wait, the exam selects 30 random questions from a larger pool.
    // userAnswers will be an object like { 5: "Ctrl + C", 12: "Alt + Tab", ... }
    
    let attemptedQuestions = 0;
    
    // We only grade the questions the user actually attempted (which should be 30).
    const answeredIds = Object.keys(userAnswers).map(Number);
    const examQuestionsCount = data.questionsCount; // 30

    for (const q of realQuestions) {
      if (answeredIds.includes(q.id)) {
        if (q.answer === userAnswers[q.id]) {
          score++;
        }
      }
    }

    const rate = Math.round((score / examQuestionsCount) * 100);
    const passingRatePercent = data.passingRate * 100; // e.g. 0.8 * 100 = 80
    const passed = rate >= passingRatePercent;

    return {
      score,
      total: examQuestionsCount,
      rate,
      passed
    };
  } catch (error) {
    console.error("Error grading exam:", error);
    return null;
  }
}
