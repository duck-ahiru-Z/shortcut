"use client";

import { useEffect, useState, useRef } from "react";
import LegacyGimmicks from "./mocks/LegacyGimmicks";
import ExcelMock from "./mocks/ExcelMock";
import WordMock from "./mocks/WordMock";
import BrowserMock from "./mocks/BrowserMock";
import ExplorerMock from "./mocks/ExplorerMock";
import WindowsMock from "./mocks/WindowsMock";
import styles from "./PracticalActiveScreen.module.css";

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
  
  // For find_password and copy_paste
  const [inputValue, setInputValue] = useState("");

  // Reset input when question changes
  useEffect(() => {
    setInputValue("");
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

  // Keyboard shortcut listener (for traditional keyCombo tasks)
  useEffect(() => {
    if (!q || (!q.expectedKeyCombo && !q.expectedKeyComboHash) || isSubmitting) return;

    // For tasks that require typing, we shouldn't prevent default on everything.
    const isTypingTask = q.type === "find_password" || q.type === "copy_paste";

    const handleKeyDown = async (e: KeyboardEvent) => {
      // Only prevent default if it's an action-based task, to avoid interfering with copy/paste/typing
      if (!isTypingTask) {
        e.preventDefault();
      }

      const pressed = new Set<string>();
      if (e.ctrlKey) pressed.add("control");
      if (e.shiftKey) pressed.add("shift");
      if (e.altKey) pressed.add("alt");
      if (e.metaKey) pressed.add("meta");

      const keyMap: Record<string, string> = { 
        " ": "space",
        ".": "period",
        ",": "comma",
        "+": "plus",
        "-": "minus",
        "=": "equal",
        ";": "semicolon",
        "'": "apostrophe",
        "/": "slash",
        "`": "grave",
        "pause": "break"
      };
      let mainKey = e.key.toLowerCase();
      if (keyMap[mainKey]) mainKey = keyMap[mainKey];
      
      if (!["control", "shift", "alt", "meta", "os"].includes(mainKey)) {
        pressed.add(mainKey);
      }

      let isMatch = false;

      if (q.expectedKeyComboHash) {
        const sortedPressed = Array.from(pressed).sort().join("+");
        const encoder = new TextEncoder();
        const data = encoder.encode(sortedPressed);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        isMatch = (hashHex === q.expectedKeyComboHash);
      } else if (q.expectedKeyCombo) {
        const expected = q.expectedKeyCombo.map((k: string) => k.toLowerCase());
        isMatch = expected.every((k: string) => pressed.has(k)) && pressed.size === expected.length;
      }

      // If it's a pure key combo task, mark success.
      // If it's select_all, we already check selection, but we can also use this as fallback.
      if (isMatch && !isTypingTask) {
        onAnswer(q.id, "CORRECT");
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [q, isSubmitting, onAnswer]);

  if (!q) return null;

  const renderGimmick = () => {
    // 1. Legacy type-based gimmicks
    const legacyTypes = ["select_all", "find_password", "copy_paste", "rename_file", "save_file", "undo_action", "bold_text", "print_doc"];
    if (q.type && legacyTypes.includes(q.type)) {
      return (
        <LegacyGimmicks
          type={q.type}
          taskData={q.taskData}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleInputKeyDown={handleInputKeyDown}
          handleInputSubmit={handleInputSubmit}
        />
      );
    }

    // 2. Context-aware generic mock UI
    const getUIContext = (text: string) => {
      if (/(Excel|セル|シート|数式|オートSUM)/i.test(text)) return "excel";
      if (/(Word|段落|文書|文字|書式)/i.test(text)) return "word";
      if (/(ブラウザ|タブ|ページ|ダウンロード|再読み込み|ブックマーク|履歴)/i.test(text)) return "browser";
      if (/(エクスプローラー|フォルダ|ファイル)/i.test(text)) return "explorer";
      if (/(Windows|タスクバー|デスクトップ|仮想|設定|アプリ|画面|パソコン|システム|スタートメニュー)/i.test(text)) return "windows";
      return "default";
    };

    const ctx = getUIContext(q.question);
    const isMac = grade.includes("mac");
    
    switch (ctx) {
      case "excel": return <ExcelMock os={isMac ? "mac" : "windows"} />;
      case "word": return <WordMock os={isMac ? "mac" : "windows"} />;
      case "browser": return <BrowserMock os={isMac ? "mac" : "windows"} />;
      case "explorer": return <ExplorerMock os={isMac ? "mac" : "windows"} />;
      case "windows": return <WindowsMock os={isMac ? "mac" : "windows"} />;
      default:
        return (
          <div className={styles.defaultGimmick}>
            <div className={styles.defaultGimmickBox}>
              指示されたキーを入力...
            </div>
          </div>
        );
    }
  };

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
        {renderGimmick()}
      </div>

      <div className={styles.skipContainer}>
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
    </div>
  );
}
