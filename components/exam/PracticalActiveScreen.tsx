"use client";

import { useEffect, useState, useRef } from "react";

type Question = {
  id: number;
  question: string;
  expectedKeyCombo?: string[];
  type?: string;
  taskData?: any;
  answer?: string;
};

type Props = {
  questions: Question[];
  currentIndex: number;
  timeLeft: number;
  isSubmitting: boolean;
  onCorrect: (qId: number) => void;
  onSkip: (qId: number) => void;
};

export default function PracticalActiveScreen({
  questions,
  currentIndex,
  timeLeft,
  isSubmitting,
  onCorrect,
  onSkip,
}: Props) {
  const q = questions[currentIndex];
  const [successAnim, setSuccessAnim] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // For find_password and copy_paste
  const [inputValue, setInputValue] = useState("");

  // Reset input when question changes
  useEffect(() => {
    setInputValue("");
    setSuccessAnim(false);
  }, [currentIndex]);

  // Focus the container on mount
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [currentIndex]);

  const handleInputSubmit = () => {
    if (!q || successAnim || isSubmitting) return;
    if (inputValue === q.answer) {
      triggerSuccess();
    } else {
      alert("不正解です。もう一度確認してください。");
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    }
  };

  // Check selection for select_all
  useEffect(() => {
    if (!q || q.type !== "select_all" || successAnim || isSubmitting) return;
    
    const checkSelection = () => {
      const activeEl = document.activeElement as HTMLTextAreaElement;
      if (activeEl && activeEl.tagName === "TEXTAREA") {
        if (activeEl.selectionEnd - activeEl.selectionStart === activeEl.value.length && activeEl.value.length > 0) {
          triggerSuccess();
        }
      }
    };

    document.addEventListener("selectionchange", checkSelection);
    return () => document.removeEventListener("selectionchange", checkSelection);
  }, [q, successAnim, isSubmitting]);

  // Keyboard shortcut listener (for traditional keyCombo tasks)
  useEffect(() => {
    if (!q || !q.expectedKeyCombo || isSubmitting || successAnim) return;

    // For tasks that require typing, we shouldn't prevent default on everything.
    const isTypingTask = q.type === "find_password" || q.type === "copy_paste";

    const expected = q.expectedKeyCombo.map((k: string) => k.toLowerCase());

    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow F5 and F12 and Escape
      if (e.key === "F5" || e.key === "F12" || e.key === "Escape") return;

      // Only prevent default if it's an action-based task, to avoid interfering with copy/paste/typing
      if (!isTypingTask) {
        e.preventDefault();
      }

      const pressed = new Set<string>();
      if (e.ctrlKey) pressed.add("control");
      if (e.shiftKey) pressed.add("shift");
      if (e.altKey) pressed.add("alt");
      if (e.metaKey) pressed.add("meta");

      const keyMap: Record<string, string> = { " ": "space" };
      let mainKey = e.key.toLowerCase();
      if (keyMap[mainKey]) mainKey = keyMap[mainKey];
      
      if (!["control", "shift", "alt", "meta", "os"].includes(mainKey)) {
        pressed.add(mainKey);
      }

      const isMatch = expected.every((k: string) => pressed.has(k)) && pressed.size === expected.length;

      // If it's a pure key combo task (like save_file or rename_file), mark success.
      // If it's select_all, we already check selection, but we can also use this as fallback.
      if (isMatch && (
        q.type === "save_file" || 
        q.type === "rename_file" || 
        q.type === "select_all" ||
        q.type === "undo_action" ||
        q.type === "bold_text" ||
        q.type === "print_doc"
      )) {
        triggerSuccess();
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [q, isSubmitting, successAnim]);

  const triggerSuccess = () => {
    setSuccessAnim(true);
    setTimeout(() => {
      setSuccessAnim(false);
      onCorrect(q.id);
    }, 800);
  };

  if (!q) return null;

  const renderGimmick = () => {
    switch (q.type) {
      case "select_all":
        return (
          <div style={{ marginTop: "20px" }}>
            <textarea
              readOnly
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent mouse drag selection
                (e.target as HTMLTextAreaElement).focus(); // Allow click to focus
              }}
              onContextMenu={(e) => e.preventDefault()} // Prevent right click
              style={{
                width: "100%", height: "200px", padding: "16px",
                fontSize: "16px", border: "2px solid var(--border-color)",
                userSelect: "none" // mostly cosmetic here since we prevent mouse down
              }}
              defaultValue={"ダミーテキストダミーテキストダミーテキスト...\n".repeat(20)}
            />
            <p style={{ marginTop: "10px", fontSize: "14px", color: "var(--danger)" }}>
              ※マウスによる選択・右クリックは禁止されています。
            </p>
          </div>
        );
      
      case "find_password":
        return (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{
              width: "100%", height: "200px", overflowY: "scroll",
              padding: "16px", border: "2px solid var(--border-color)",
              backgroundColor: "var(--bg-tertiary)", fontSize: "14px", color: "var(--text-muted)"
            }}>
              {"あ".repeat(3000)}
              <span style={{ color: "black", fontWeight: "bold" }}>パスワード：{q.taskData?.password}</span>
              {"あ".repeat(3000)}
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="text"
                placeholder="見つけたパスワードを入力"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                style={{
                  flex: 1, padding: "12px", fontSize: "16px",
                  border: "2px solid var(--border-color)"
                }}
              />
              <button 
                onClick={handleInputSubmit}
                className="btn btn-primary"
                style={{ padding: "0 24px" }}
              >
                回答する
              </button>
            </div>
          </div>
        );

      case "copy_paste":
        return (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div 
              onContextMenu={(e) => e.preventDefault()}
              style={{
                padding: "16px", backgroundColor: "var(--bg-tertiary)",
                border: "2px solid var(--border-color)", wordBreak: "break-all"
              }}
            >
              {q.taskData?.targetText}
            </div>
            <p style={{ fontSize: "14px", color: "var(--danger)", margin: "-10px 0 0 0" }}>
              ※右クリックは禁止されています。
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="text"
                placeholder="ここにペースト"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                onContextMenu={(e) => e.preventDefault()}
                style={{
                  flex: 1, padding: "12px", fontSize: "16px",
                  border: "2px solid var(--border-color)"
                }}
              />
              <button 
                onClick={handleInputSubmit}
                className="btn btn-primary"
                style={{ padding: "0 24px" }}
              >
                回答する
              </button>
            </div>
          </div>
        );

      case "rename_file":
        return (
          <div style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}>
            <div style={{
              width: "120px", height: "120px", border: "2px solid var(--accent-primary)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              backgroundColor: "var(--bg-secondary)", borderRadius: "8px", cursor: "pointer"
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
              <div style={{ marginTop: "12px", fontSize: "14px", backgroundColor: "var(--accent-primary)", color: "white", padding: "2px 8px" }}>
                report.pdf
              </div>
            </div>
          </div>
        );

      case "save_file":
        return (
          <div style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}>
            <div style={{
              width: "100%", maxWidth: "400px", border: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-secondary)", borderRadius: "8px", padding: "16px"
            }}>
              <div style={{ borderBottom: "1px solid var(--border-light)", paddingBottom: "12px", marginBottom: "12px", display: "flex", gap: "8px" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "var(--danger)" }}></div>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "var(--warning)" }}></div>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "var(--success)" }}></div>
              </div>
              <div style={{ height: "10px", width: "80%", backgroundColor: "var(--border-light)", marginBottom: "8px" }}></div>
              <div style={{ height: "10px", width: "60%", backgroundColor: "var(--border-light)", marginBottom: "8px" }}></div>
              <div style={{ height: "10px", width: "90%", backgroundColor: "var(--border-light)", marginBottom: "8px" }}></div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>未保存の変更があります*</span>
              </div>
            </div>
          </div>
        );

      case "undo_action":
        return (
          <div style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}>
            <div style={{
              width: "100%", maxWidth: "500px", border: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-secondary)", borderRadius: "8px", padding: "24px",
              fontFamily: "monospace", fontSize: "16px"
            }}>
              <div>const data = fetchData();</div>
              <div style={{ color: "var(--danger)", textDecoration: "line-through", opacity: 0.7, margin: "8px 0" }}>
                processData(data); // Accidentally deleted!
              </div>
              <div>return data;</div>
              <p style={{ marginTop: "24px", fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>
                直前の操作を取り消してください。
              </p>
            </div>
          </div>
        );

      case "bold_text":
        return (
          <div style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}>
            <div style={{
              width: "100%", maxWidth: "500px", border: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-secondary)", borderRadius: "8px", padding: "24px",
              fontSize: "18px"
            }}>
              <p>
                本日は晴天なり。明日の会議資料の<span style={{ backgroundColor: "var(--accent-primary)", color: "white", padding: "2px 4px" }}>重要ポイント</span>について説明します。
              </p>
              <p style={{ marginTop: "24px", fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>
                選択中のテキストを太字にしてください。
              </p>
            </div>
          </div>
        );

      case "print_doc":
        return (
          <div style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}>
            <div style={{
              width: "100%", maxWidth: "400px", border: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-secondary)", borderRadius: "8px", padding: "24px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center"
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: "16px", color: "var(--text-muted)" }}>
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              <h3 style={{ margin: "0 0 8px 0" }}>月次報告書.pdf</h3>
              <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)" }}>全5ページ</p>
            </div>
          </div>
        );

      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
              指示されたショートカットキーを押してください...
            </p>
          </div>
        );
    }
  };

  return (
    <div 
      className="exam-container" 
      ref={containerRef}
      tabIndex={0}
      style={{ outline: 'none', display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}
    >
      <div className="exam-header" style={{ position: 'absolute', top: 0, width: '100%', maxWidth: '800px' }}>
        <div className="exam-progress-bar">
          <div 
            className="exam-progress-fill"
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          />
        </div>
        <div className="exam-header-inner">
          <div className="exam-status">
            問題 {currentIndex + 1} / {questions.length}
          </div>
          <div className={`exam-timer ${timeLeft < 600 ? "timer-warning" : ""}`}>
            残り時間: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: "600px", margin: "40px auto" }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--text-color)' }}>
          {q.question}
        </h2>

        {successAnim ? (
          <div style={{ color: '#4caf50', fontSize: '3rem', fontWeight: 'bold', animation: 'popIn 0.3s ease-out', textAlign: 'center', marginTop: '50px' }}>
            正解！
          </div>
        ) : (
          <div>
            {renderGimmick()}
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <button 
                onClick={() => onSkip(q.id)}
                className="btn btn-secondary"
              >
                わからない（スキップ）
              </button>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}
