"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { startExam, gradeExam } from "@/actions/exam";
import { useExamState } from "@/hooks/useExamState";
import { useExamTimer } from "@/hooks/useExamTimer";

import ExamPreScreen from "./exam/ExamPreScreen";
import PracticalActiveScreen from "./exam/PracticalActiveScreen";

type Props = {
  grade: string;
};

export default function PracticalExamClient({ grade }: Props) {
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
        tabSwitches, // Although anti-cheat is disabled, we still send the tracking object to backend.
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
  // We DELIBERATELY remove useAntiCheat here because practical keyboard simulator 
  // might accidentally trigger OS/Browser shortcuts (like Ctrl+N, Windows+D) that switch tabs.
  // We don't want to unfairly penalize them.
  
  const { timeLeft } = useExamTimer(
    started, 
    isSubmitting, 
    clientStartTime, 
    duration, 
    handleSubmit // onExpire
  );

  const handleCorrect = useCallback((qId: number) => {
    setAnswers(prev => ({ ...prev, [qId]: "CORRECT" }));
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
    <PracticalActiveScreen 
      questions={questions}
      currentIndex={currentIndex}
      timeLeft={timeLeft}
      isSubmitting={isSubmitting}
      onCorrect={handleCorrect}
      onSkip={handleSkip}
    />
  );
}
