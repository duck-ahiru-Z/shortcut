"use client";

import { useCallback } from "react";
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
    isLoading,
    isSubmitting,
    timeLeft,
    questions,
    currentIndex, setCurrentIndex,
    answers, setAnswers,
    handleStart,
    handleSubmit
  } = useExamSession(grade, false);

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
    handleSubmit
  );

  if (!started) {
    return (
      <ExamPreScreen 
        agreed={agreed} setAgreed={setAgreed}
        isLoading={isLoading}
        onStart={handleStart}
      />
    );
  }

  return (
    <ExamActiveScreen 
      questions={questions}
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      answers={answers}
      handleSelect={handleSelect}
      timeLeft={timeLeft}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
}
