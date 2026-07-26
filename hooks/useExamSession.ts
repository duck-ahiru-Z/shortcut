import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { startExam, gradeExam } from "@/actions/exam";
import { useExamState } from "@/hooks/useExamState";
import { useExamTimer } from "@/hooks/useExamTimer";
import { useAntiCheat } from "@/hooks/useAntiCheat";

/**
 * useExamSession
 * 
 * Manages the high-level exam session lifecycle:
 * - Starting the exam (fetching data from server)
 * - Auto-saving to localStorage
 * - Submitting the exam
 * - Anti-cheat tracking
 */
export function useExamSession(grade: string, disableAntiCheat = false) {
  const router = useRouter();
  
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Core State
  const stateHooks = useExamState(grade);
  const {
    stateKey,
    started, setStarted,
    lastName,
    firstName,
    deviceId,
    tabSwitches, setTabSwitches,
    questions, setQuestions,
    examToken, setExamToken,
    gradeTitle, setGradeTitle,
    duration, setDuration,
    clientStartTime, setClientStartTime,
    currentIndex,
    answers
  } = stateHooks;

  // 2. Auto-Save State
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

  // 3. Submit handler
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

  // 4. Timer & Anti-Cheat
  const { timeLeft } = useExamTimer(
    started, 
    isSubmitting, 
    clientStartTime, 
    duration, 
    handleSubmit // auto-submit on expire
  );

  useAntiCheat(disableAntiCheat ? false : started, isSubmitting, setTabSwitches);

  // 5. Start handler
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

  return {
    ...stateHooks, // Export all state setters just in case
    agreed, setAgreed,
    isLoading,
    isSubmitting,
    timeLeft,
    handleStart,
    handleSubmit
  };
}
