"use client";

import { useEffect, useState, useRef } from "react";
import LegacyGimmicks from "./mocks/LegacyGimmicks";
import ExcelMock from "./mocks/ExcelMock";
import WordMock from "./mocks/WordMock";
import BrowserMock from "./mocks/BrowserMock";
import ExplorerMock from "./mocks/ExplorerMock";
import WindowsMock from "./mocks/WindowsMock";
import VsCodeMock from "./mocks/VsCodeMock";
import PowerpointMock from "./mocks/PowerpointMock";
import SlackMock from "./mocks/SlackMock";
import TaskManagerMock from "./mocks/TaskManagerMock";
import RunDialogMock from "./mocks/RunDialogMock";
import ActionCenterMock from "./mocks/ActionCenterMock";
import TaskViewMock from "./mocks/TaskViewMock";
import VirtualKeyboard from "./VirtualKeyboard";
import { usePracticalKeyboard } from "../../hooks/usePracticalKeyboard";
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

  const handleSuccess = (qId: number) => {
    setIsSuccess(true);
    setTimeout(() => {
      onAnswer(qId, "CORRECT");
    }, 1000);
  };

  // Keyboard shortcut listener extracted to a custom hook
  usePracticalKeyboard({ 
    q, 
    isSubmitting: isSubmitting || isSuccess, 
    onAnswer,
    onSuccess: handleSuccess
  });

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
      if (/(VS Code|エディタ|マルチカーソル|コメントアウト|ターミナル|リネーム|関数|コマンドパレット)/i.test(text)) return "vscode";
      if (/(PowerPoint|スライド|プレゼンテーション|図形)/i.test(text)) return "powerpoint";
      if (/(Slack|Teams|チャット|チャンネル|メッセージ)/i.test(text)) return "slack";
      if (/(タスクマネージャー)/i.test(text)) return "taskmanager";
      if (/(ファイル名を指定して実行)/i.test(text)) return "rundialog";
      if (/(通知パネル|アクションセンター)/i.test(text)) return "actioncenter";
      if (/(タスクビュー|仮想デスクトップ)/i.test(text)) return "taskview";
      if (/(Windows|タスクバー|デスクトップ|仮想|設定|アプリ|画面|パソコン|システム|スタートメニュー|コマンドプロンプト|電卓|メモ帳|クイックリンクメニュー|PC|クリップボード)/i.test(text)) return "windows";
      return "default";
    };

    const ctx = getUIContext(q.question);
    
    switch (ctx) {
      case "excel": return <ExcelMock os={isMac ? "mac" : "windows"} isSuccess={isSuccess} />;
      case "word": return <WordMock os={isMac ? "mac" : "windows"} isSuccess={isSuccess} />;
      case "browser": return <BrowserMock os={isMac ? "mac" : "windows"} isSuccess={isSuccess} />;
      case "explorer": return <ExplorerMock os={isMac ? "mac" : "windows"} isSuccess={isSuccess} />;
      case "windows": return <WindowsMock os={isMac ? "mac" : "windows"} isSuccess={isSuccess} />;
      case "vscode": return <VsCodeMock os={isMac ? "mac" : "windows"} isSuccess={isSuccess} />;
      case "powerpoint": return <PowerpointMock os={isMac ? "mac" : "windows"} isSuccess={isSuccess} />;
      case "slack": return <SlackMock os={isMac ? "mac" : "windows"} isSuccess={isSuccess} />;
      case "taskmanager": return <TaskManagerMock os={isMac ? "mac" : "windows"} isSuccess={isSuccess} />;
      case "rundialog": return <RunDialogMock os={isMac ? "mac" : "windows"} isSuccess={isSuccess} />;
      case "actioncenter": return <ActionCenterMock os={isMac ? "mac" : "windows"} isSuccess={isSuccess} />;
      case "taskview": return <TaskViewMock os={isMac ? "mac" : "windows"} isSuccess={isSuccess} />;
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

      {/* モバイル用仮想キーボード */}
      <VirtualKeyboard os={isMac ? "mac" : "windows"} />
    </div>
  );
}
