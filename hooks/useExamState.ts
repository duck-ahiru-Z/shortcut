import { useState, useEffect } from "react";
import { ScrubbedQuestion } from "@/actions/exam";

export type ExamState = {
  clientStartTime: number;
  durationSeconds: number;
  questions: ScrubbedQuestion[];
  token: string;
  gradeTitle: string;
  lastName: string;
  firstName: string;
  answers: Record<number, string>;
  currentIndex: number;
  tabSwitches: number;
};

export function useExamState(grade: string) {
  const stateKey = `shortcut_exam_state_${grade}`;
  
  const [started, setStarted] = useState(false);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  
  const [deviceId, setDeviceId] = useState<string>("");
  const [tabSwitches, setTabSwitches] = useState(0);

  const [questions, setQuestions] = useState<ScrubbedQuestion[]>([]);
  const [examToken, setExamToken] = useState("");
  const [gradeTitle, setGradeTitle] = useState("");
  const [duration, setDuration] = useState(1800);
  const [clientStartTime, setClientStartTime] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Initialize deviceId and Try to Resume
  useEffect(() => {
    let id = localStorage.getItem("shortcut_exam_device_id");
    if (!id) {
      id = "device_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
      localStorage.setItem("shortcut_exam_device_id", id);
    }
    setDeviceId(id);

    // Try resume
    const saved = localStorage.getItem(stateKey);
    if (saved) {
      try {
        const parsed: ExamState = JSON.parse(saved);
        const elapsed = Math.floor((Date.now() - parsed.clientStartTime) / 1000);
        const remaining = parsed.durationSeconds - elapsed;
        
        if (remaining > 0) {
          setClientStartTime(parsed.clientStartTime);
          setDuration(parsed.durationSeconds);
          setQuestions(parsed.questions);
          setExamToken(parsed.token);
          setGradeTitle(parsed.gradeTitle);
          setLastName(parsed.lastName);
          setFirstName(parsed.firstName);
          setAnswers(parsed.answers);
          setCurrentIndex(parsed.currentIndex);
          setTabSwitches(parsed.tabSwitches);
          setStarted(true);
        } else {
          // Expired
          localStorage.removeItem(stateKey);
        }
      } catch (e) {
        localStorage.removeItem(stateKey);
      }
    }
  }, [grade, stateKey]);

  return {
    stateKey,
    started, setStarted,
    lastName, setLastName,
    firstName, setFirstName,
    deviceId, setDeviceId,
    tabSwitches, setTabSwitches,
    questions, setQuestions,
    examToken, setExamToken,
    gradeTitle, setGradeTitle,
    duration, setDuration,
    clientStartTime, setClientStartTime,
    currentIndex, setCurrentIndex,
    answers, setAnswers
  };
}
