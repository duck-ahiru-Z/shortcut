"use client";

import { useCallback, useState } from "react";
import { useExamSession } from "@/hooks/useExamSession";
import { useExamKeyboard } from "@/hooks/useExamKeyboard";

import ExamPreScreen from "./exam/ExamPreScreen";
import ExamActiveScreen from "./exam/ExamActiveScreen";
import SubmitConfirmModal from "./exam/SubmitConfirmModal";

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
      
      <SubmitConfirmModal 
        isOpen={showConfirm}
        isSubmitting={isSubmitting}
        onCancel={() => setShowConfirm(false)}
        onSubmit={doSubmit}
      />
    </>
  );
}
