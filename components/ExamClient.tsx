"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { startExam, gradeExam } from "@/actions/exam";
import { useExamState } from "@/hooks/useExamState";
import { useAntiCheat } from "@/hooks/useAntiCheat";
import { useExamTimer } from "@/hooks/useExamTimer";
import { useExamKeyboard } from "@/hooks/useExamKeyboard";

import ExamPreScreen from "./exam/ExamPreScreen";
import ExamActiveScreen from "./exam/ExamActiveScreen";

type Props = {
  grade: string;
};

export default function ExamClient({ grade }: Props) {
  const router = useRouter();
  
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. State hook
  const {
    stateKey,
    started, setStarted,
    lastName, setLastName,
    firstName, setFirstName,
    deviceId,
    tabSwitches, setTabSwitches,
    questions, setQuestions,
    examToken, setExamToken,
    gradeTitle, setGradeTitle,
    duration, setDuration,
    clientStartTime, setClientStartTime,
    currentIndex, setCurrentIndex,
    answers, setAnswers
  } = useExamState(grade);

  // Auto-Save State
  useEffect(() => {
    if (!started || isSubmitting) return;
    const state = {
      clientStartTime,
      durationSeconds: duration,
      questions,
      token: examToken,
      gradeTitle,
      lastName,
      firstName,
      answers,
      currentIndex,
      tabSwitches
    };
    localStorage.setItem(stateKey, JSON.stringify(state));
  }, [started, isSubmitting, clientStartTime, duration, questions, examToken, gradeTitle, lastName, firstName, answers, currentIndex, tabSwitches, stateKey]);

  // 2. Submit handler
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const tracking = {
        deviceId,
        tabSwitches,
        lastName,
        firstName
      };

      const result = await gradeExam(examToken, answers, tracking);
      
      if (result) {
        localStorage.removeItem(stateKey);
        sessionStorage.setItem("examResult", JSON.stringify({
          ...result,
          lastName,
          firstName,
          gradeTitle
        }));
        router.push("/exam/result");
      } else {
        alert("採点中にエラーが発生しました。");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      alert("通信エラーが発生しました。");
      setIsSubmitting(false);
    }
  }, [isSubmitting, deviceId, tabSwitches, lastName, firstName, examToken, answers, stateKey, gradeTitle, router]);

  // 3. Hooks
  useAntiCheat(started, isSubmitting, setTabSwitches);
  
  const { timeLeft } = useExamTimer(
    started, 
    isSubmitting, 
    clientStartTime, 
    duration, 
    handleSubmit // onExpire
  );

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

  // Start handler
  const handleStart = async () => {
    setIsLoading(true);
    try {
      const res = await startExam(grade);
      setQuestions(res.questions);
      setExamToken(res.token);
      
      const now = Date.now();
      setClientStartTime(now);
      setDuration(res.durationSeconds);
      setGradeTitle(res.title);
      setStarted(true);
    } catch (e) {
      alert("問題の取得に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  if (!started) {
    return (
      <ExamPreScreen 
        lastName={lastName} setLastName={setLastName}
        firstName={firstName} setFirstName={setFirstName}
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
