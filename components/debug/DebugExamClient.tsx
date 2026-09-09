"use client";

import { useMemo, useState } from "react";
import ExamActiveScreen from "@/components/exam/ExamActiveScreen";
import PracticalActiveScreen from "@/components/exam/PracticalActiveScreen";

type Question = {
  id: number;
  question: string;
  choices?: string[];
  answer?: string;
  expectedKeyCombo?: string[];
  expectedKeyComboHash?: string;
  expectedKeySequence?: { keys: string[] }[];
  expectedKeySequenceHashes?: string[];
  type?: string;
  taskData?: unknown;
};

export default function DebugExamClient({ grade, pool }: { grade: string; pool: unknown[] }) {
  const questions = useMemo(() => pool as Question[], [pool]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);
  const isPractical = grade.startsWith("practical-");
  const current = questions[currentIndex];
  const handleAnswer = (id: number, value: string) => {
    // Practical input tasks submit the entered value (URL, search text, etc.)
    // instead of the sentinel used by shortcut-only tasks. In debug mode the
    // interaction itself is what is being verified, so count any submitted
    // non-skip value as a correct response.
    const normalizedValue = isPractical && value !== "SKIPPED" ? "CORRECT" : value;
    setAnswers((previous) => ({ ...previous, [id]: normalizedValue }));
    if (isPractical && currentIndex < questions.length - 1) setCurrentIndex((index) => index + 1);
  };
  const correct = questions.filter((question) => answers[question.id] === (question.answer || "CORRECT")).length;

  if (!questions.length) return <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>この級の問題データはありません。</div>;
  if (finished) return <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}><h1>デバッグ受験完了</h1><p>{questions.length}問中 {correct}問を正解しました。</p><a href="/debug">問題一覧へ戻る</a></div>;

  return <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <strong>デバッグ全問受験：{grade}</strong>
      <button onClick={() => setFinished(true)} className="btn btn-secondary">採点して終了</button>
    </div>
    {isPractical ? <PracticalActiveScreen grade={grade} questions={questions} currentIndex={currentIndex} timeLeft={9999} isSubmitting={false} onAnswer={handleAnswer} onSkip={(id) => handleAnswer(id, "SKIPPED")} /> : <ExamActiveScreen questions={questions as never} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} answers={answers} handleSelect={handleAnswer} timeLeft={9999} isSubmitting={false} onSubmit={() => setFinished(true)} />}
  </div>;
}
