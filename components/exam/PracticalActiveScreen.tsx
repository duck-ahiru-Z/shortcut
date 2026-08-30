"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import VirtualKeyboard from "./VirtualKeyboard";
import { usePracticalKeyboard } from "../../hooks/usePracticalKeyboard";
import styles from "./PracticalActiveScreen.module.css";
import GimmickRenderer from "./GimmickRenderer";

type Question = {
  id: number;
  question: string;
  expectedKeyCombo?: string[];
  expectedKeyComboHash?: string;
  type?: string;
  taskData?: any;
  answer?: string;
};

type Props = {
  grade: string;
  questions: Question[];
  currentIndex: number;
  timeLeft: number;
  isSubmitting: boolean;
  onAnswer: (qId: number, answerValue: string) => void;
  onSkip: (qId: number) => void;
};

export default function PracticalActiveScreen({
  grade,
  questions,
  currentIndex,
  timeLeft,
  isSubmitting,
  onAnswer,
  onSkip,
}: Props) {
  const q = questions[currentIndex];
  const containerRef = useRef<HTMLDivElement>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  
  // Define isMac at the component level so it's accessible everywhere
  const isMac = grade.includes("mac");
  
  // For find_password and copy_paste
  const [inputValue, setInputValue] = useState("");
  // Success state for animations
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset input and success when question changes
  useEffect(() => {
    setInputValue("");
    setIsSuccess(false);
  }, [currentIndex]);

  // Focus the container on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [currentIndex]);

  const handleInputSubmit = () => {
    if (!q || isSubmitting) return;
    onAnswer(q.id, inputValue);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    }
  };

  const handleSuccess = useCallback((qId: number) => {
    setIsSuccess(true);
    setTimeout(() => {
      onAnswer(qId, "CORRECT");
    }, 1000);
  }, [onAnswer]);

  // Keyboard shortcut listener extracted to a custom hook
  usePracticalKeyboard({ 
    q, 
    isSubmitting: isSubmitting || isSuccess, 
    onAnswer,
    onSuccess: handleSuccess
  });

  if (!q) return null;

  const currentIdxDisplay = currentIndex + 1;
  const totalDisplay = questions.length;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div 
      className={styles.container} 
      ref={containerRef} 
      tabIndex={0} 
    >
      <div className={styles.header}>
        <div className={styles.progress}>
          問題 {currentIdxDisplay} / {totalDisplay}
        </div>
        <div className={`${styles.timer} ${timeLeft < 60 ? styles.timerDanger : ""}`}>
          残り時間: {formatTime(timeLeft)}
        </div>
      </div>

      <div className={styles.questionBox}>
        <h2 className={styles.questionText}>{q.question}</h2>
        <GimmickRenderer
          q={q}
          isMac={isMac}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleInputKeyDown={handleInputKeyDown}
          handleInputSubmit={handleInputSubmit}
          isSuccess={isSuccess}
        />
      </div>

      <div className={styles.skipContainer} style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button 
          onClick={() => setShowKeyboard(prev => !prev)} 
          className="btn btn-outline"
        >
          キーボードを表示
        </button>
        <button 
          onClick={() => onSkip(q.id)} 
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          スキップして次へ
        </button>
      </div>

      {isSubmitting && (
        <div className={styles.submittingOverlay}>
          <div className={styles.spinner}></div>
          <p>解答を送信中...</p>
        </div>
      )}

      {/* 仮想キーボード */}
      {showKeyboard && (
        <VirtualKeyboard os={isMac ? "mac" : "windows"} onClose={() => setShowKeyboard(false)} />
      )}
    </div>
  );
}
