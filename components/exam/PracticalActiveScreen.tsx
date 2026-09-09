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
  const [virtualClipboard, setVirtualClipboard] = useState("");
  // Success state for animations
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset input and success when question changes
  useEffect(() => {
    setInputValue("");
    setVirtualClipboard("");
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

  const handleVirtualKey = (key: string, modifiers: { ctrl: boolean; shift: boolean; alt: boolean; meta: boolean }) => {
    const text = q?.question || "";
    const isTypingTask = /検索|パスワード|コピー|すべて選択|名前を変更|名前の変更/.test(text);
    if (!isTypingTask) return;

    const lower = key.toLowerCase();
    if (modifiers.ctrl && lower === "c") {
      setVirtualClipboard(q?.taskData?.targetText || q?.taskData?.password || "");
      return;
    }
    if (modifiers.ctrl && lower === "v") {
      const pasted = virtualClipboard || q?.taskData?.targetText || "";
      if (pasted) setInputValue((previous) => previous + pasted);
      return;
    }
    if (modifiers.ctrl || modifiers.alt || modifiers.meta) return;
    if (key === "Backspace") {
      setInputValue((previous) => previous.slice(0, -1));
    } else if (key === "Enter") {
      handleInputSubmit();
    } else if (key.length === 1) {
      setInputValue((previous) => previous + (modifiers.shift ? key.toUpperCase() : key));
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
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#5f6368", fontSize: "12px" }}>
          <span style={{ padding: "3px 8px", borderRadius: "999px", background: "#e8f0fe", color: "#174ea6", fontWeight: 600 }}>実務シミュレーター</span>
          <span>画面上の対象を操作して解答してください</span>
        </div>
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
          aria-expanded={showKeyboard}
        >
          {showKeyboard ? "キーボードを閉じる" : "キーボードを表示"}
        </button>
        <button 
          onClick={() => onSkip(q.id)} 
          className="btn btn-secondary"
          disabled={isSubmitting || isSuccess}
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
        <VirtualKeyboard key={q.id} os={isMac ? "mac" : "windows"} onClose={() => setShowKeyboard(false)} onVirtualKey={handleVirtualKey} />
      )}
    </div>
  );
}
