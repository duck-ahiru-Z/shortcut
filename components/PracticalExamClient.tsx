"use client";

import { useCallback, useState } from "react";
import { useExamSession } from "@/hooks/useExamSession";

import ExamPreScreen from "./exam/ExamPreScreen";
import PracticalActiveScreen from "./exam/PracticalActiveScreen";

type Props = {
  grade: string;
};

export default function PracticalExamClient({ grade }: Props) {
  const {
    started,
    agreed, setAgreed,
    lastName, setLastName,
    firstName, setFirstName,
    isLoading,
    isSubmitting,
    timeLeft,
    questions,
    currentIndex, setCurrentIndex,
    answers, setAnswers,
    handleStart,
    handleSubmit
  } = useExamSession(grade, true); // true = disable anticheat for practical exam

  const [showConfirm, setShowConfirm] = useState(false);

  const handleAnswer = useCallback((qId: number, answerValue: string) => {
    const nextAnswers = { ...answers, [qId]: answerValue };
    setAnswers(nextAnswers);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowConfirm(true);
    }
  }, [answers, currentIndex, questions.length, setCurrentIndex, setAnswers]);

  const handleSkip = useCallback((qId: number) => {
    const nextAnswers = { ...answers, [qId]: "SKIPPED" };
    setAnswers(nextAnswers);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowConfirm(true);
    }
  }, [answers, currentIndex, questions.length, setCurrentIndex, setAnswers]);

  const doSubmit = useCallback(() => {
    setShowConfirm(false);
    handleSubmit(answers);
  }, [handleSubmit, answers]);

  if (!started) {
    return (
      <ExamPreScreen 
        agreed={agreed} setAgreed={setAgreed}
        lastName={lastName} setLastName={setLastName}
        firstName={firstName} setFirstName={setFirstName}
        isLoading={isLoading}
        onStart={handleStart}
      />
    );
  }

  return (
    <>
      <PracticalActiveScreen 
        grade={grade}
        questions={questions}
        currentIndex={currentIndex}
        timeLeft={timeLeft}
        isSubmitting={isSubmitting}
        onAnswer={handleAnswer}
        onSkip={handleSkip}
      />

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 p-8 rounded-xl shadow-2xl text-white max-w-md w-full border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-emerald-400">⌨️</span> 試験の提出
            </h2>
            <p className="mb-8 text-slate-300 leading-relaxed">
              最後の問題まで到達しました。<br/>
              試験を終了して、採点結果を確認しますか？
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowConfirm(false)} 
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-200 font-medium"
                disabled={isSubmitting}
              >
                キャンセル
              </button>
              <button 
                onClick={doSubmit} 
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors font-bold shadow-lg shadow-emerald-500/30"
                disabled={isSubmitting}
              >
                提出して採点する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
