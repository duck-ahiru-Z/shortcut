"use client";

import { useCallback } from "react";
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

  const handleAnswer = useCallback((qId: number, answerValue: string) => {
    setAnswers(prev => ({ ...prev, [qId]: answerValue }));
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  }, [currentIndex, questions.length, handleSubmit, setCurrentIndex, setAnswers]);

  const handleSkip = useCallback((qId: number) => {
    setAnswers(prev => ({ ...prev, [qId]: "SKIPPED" }));
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  }, [currentIndex, questions.length, handleSubmit, setCurrentIndex, setAnswers]);

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
    <PracticalActiveScreen 
      grade={grade}
      questions={questions}
      currentIndex={currentIndex}
      timeLeft={timeLeft}
      isSubmitting={isSubmitting}
      onAnswer={handleAnswer}
      onSkip={handleSkip}
    />
  );
}
