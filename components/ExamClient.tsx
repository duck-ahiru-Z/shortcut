"use client";

import { useCallback, useState } from "react";
import { useExamSession } from "@/hooks/useExamSession";
import { useExamKeyboard } from "@/hooks/useExamKeyboard";

import ExamPreScreen from "./exam/ExamPreScreen";
import ExamActiveScreen from "./exam/ExamActiveScreen";

type Props = {
  grade: string;
};

export default function ExamClient({ grade }: Props) {
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
  } = useExamSession(grade, false);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmSubmit = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const doSubmit = useCallback(() => {
    setShowConfirm(false);
    handleSubmit();
  }, [handleSubmit]);

  const handleSelect = useCallback((qId: number, choice: string) => {
    setAnswers(prev => ({ ...prev, [qId]: choice }));
  }, [setAnswers]);

  useExamKeyboard(
    started, 
    isSubmitting, 
    currentIndex, 
    questions, 
    setCurrentIndex, 
    handleSelect, 
    handleConfirmSubmit
  );

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
      <ExamActiveScreen 
        questions={questions}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        answers={answers}
        handleSelect={handleSelect}
        timeLeft={timeLeft}
        isSubmitting={isSubmitting}
        onSubmit={handleConfirmSubmit}
      />
      
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 p-8 rounded-xl shadow-2xl text-white max-w-md w-full border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-blue-400">📝</span> 試験の提出
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
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-bold shadow-lg shadow-blue-500/30"
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
