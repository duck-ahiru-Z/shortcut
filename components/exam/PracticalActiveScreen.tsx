"use client";

import { useEffect, useState, useRef } from "react";

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
  questions: Question[];
  currentIndex: number;
  timeLeft: number;
  isSubmitting: boolean;
  onAnswer: (qId: number, answerValue: string) => void;
  onSkip: (qId: number) => void;
};

export default function PracticalActiveScreen({
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

  // Check selection for select_all
  useEffect(() => {
    if (!q || q.type !== "select_all" || isSubmitting) return;
    
    const checkSelection = () => {
      const activeEl = document.activeElement as HTMLTextAreaElement;
      if (activeEl && activeEl.tagName === "TEXTAREA") {
        if (activeEl.selectionEnd - activeEl.selectionStart === activeEl.value.length && activeEl.value.length > 0) {
          onAnswer(q.id, "CORRECT");
        }
      }
    };

    document.addEventListener("selectionchange", checkSelection);
    return () => document.removeEventListener("selectionchange", checkSelection);
  }, [q, isSubmitting]);

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

      default: {
        const getUIContext = (text: string) => {
          if (/(Excel|セル|シート|数式|オートSUM)/i.test(text)) return "excel";
          if (/(Word|段落|文書|文字|書式)/i.test(text)) return "word";
          if (/(ブラウザ|タブ|ページ|ダウンロード|再読み込み|ブックマーク|履歴)/i.test(text)) return "browser";
          if (/(エクスプローラー|フォルダ|ファイル)/i.test(text)) return "explorer";
          if (/(Windows|タスクバー|デスクトップ|仮想|設定|アプリ|画面|パソコン|システム|スタートメニュー)/i.test(text)) return "windows";
          return "default";
        };

        const ctx = getUIContext(q.question);
        
        switch (ctx) {
          case "excel":
            return (
              <div style={{ border: "1px solid #107c41", borderRadius: "6px", overflow: "hidden", width: "100%", maxWidth: "500px", margin: "20px auto 0", backgroundColor: "white" }}>
                <div style={{ backgroundColor: "#107c41", color: "white", padding: "8px 12px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                  スプレッドシート
                </div>
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px", backgroundImage: "linear-gradient(#e0e0e0 1px, transparent 1px), linear-gradient(90deg, #e0e0e0 1px, transparent 1px)", backgroundSize: "80px 30px", height: "180px" }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                     <div style={{ backgroundColor: "var(--bg-primary)", padding: "12px 24px", borderRadius: "8px", border: "1px solid var(--border-color)", color: "var(--text-primary)", fontWeight: "bold", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                       指示されたキーを入力...
                     </div>
                  </div>
                </div>
              </div>
            );
          case "word":
            return (
              <div style={{ border: "1px solid #185abd", borderRadius: "6px", overflow: "hidden", width: "100%", maxWidth: "500px", margin: "20px auto 0", backgroundColor: "#f3f2f1" }}>
                <div style={{ backgroundColor: "#185abd", color: "white", padding: "8px 12px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M4 4h16v16H4z"></path></svg>
                  文書
                </div>
                <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
                  <div style={{ width: "85%", height: "180px", backgroundColor: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", padding: "20px", color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", borderRadius: "2px" }}>
                     指示されたキーを入力...
                  </div>
                </div>
              </div>
            );
          case "browser":
            return (
              <div style={{ border: "1px solid var(--border-color)", borderRadius: "8px", overflow: "hidden", width: "100%", maxWidth: "600px", margin: "20px auto 0", backgroundColor: "var(--bg-primary)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                <div style={{ backgroundColor: "var(--bg-secondary)", display: "flex", padding: "8px 12px", gap: "8px", alignItems: "center", borderBottom: "1px solid var(--border-color)" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ff5f56" }}></div>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ffbd2e" }}></div>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#27c93f" }}></div>
                  <div style={{ flex: 1, backgroundColor: "var(--bg-primary)", borderRadius: "16px", padding: "4px 16px", fontSize: "12px", color: "var(--text-muted)", marginLeft: "12px", border: "1px solid var(--border-light)" }}>
                    https://example.com
                  </div>
                </div>
                <div style={{ height: "180px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)", fontWeight: "bold" }}>
                  指示されたキーを入力...
                </div>
              </div>
            );
          case "explorer":
            return (
              <div style={{ border: "1px solid var(--border-color)", borderRadius: "6px", overflow: "hidden", width: "100%", maxWidth: "500px", margin: "20px auto 0", backgroundColor: "var(--bg-primary)" }}>
                <div style={{ backgroundColor: "var(--bg-secondary)", display: "flex", padding: "8px 12px", gap: "8px", alignItems: "center", borderBottom: "1px solid var(--border-color)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#f3d32a"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path></svg>
                  <span style={{ fontSize: "14px", color: "var(--text-primary)" }}>PC &gt; ドキュメント</span>
                </div>
                <div style={{ display: "flex", height: "180px" }}>
                  <div style={{ width: "120px", borderRight: "1px solid var(--border-color)", padding: "12px", display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "var(--bg-secondary)" }}>
                    <div style={{ height: "8px", backgroundColor: "var(--border-light)", borderRadius: "4px" }}></div>
                    <div style={{ height: "8px", backgroundColor: "var(--border-light)", borderRadius: "4px", width: "80%" }}></div>
                    <div style={{ height: "8px", backgroundColor: "var(--border-light)", borderRadius: "4px", width: "90%" }}></div>
                  </div>
                  <div style={{ flex: 1, padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)", fontWeight: "bold" }}>
                    指示されたキーを入力...
                  </div>
                </div>
              </div>
            );
          case "windows":
            return (
              <div style={{ border: "1px solid var(--border-color)", borderRadius: "8px", overflow: "hidden", width: "100%", maxWidth: "500px", margin: "20px auto 0", backgroundColor: "#0078d4", position: "relative", height: "220px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <div style={{ backgroundColor: "var(--bg-primary)", padding: "12px 24px", borderRadius: "8px", color: "var(--text-primary)", fontWeight: "bold", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                     指示されたキーを入力...
                   </div>
                </div>
                <div style={{ position: "absolute", bottom: 0, width: "100%", height: "40px", backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", padding: "0 16px", gap: "12px", backdropFilter: "blur(4px)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#00a4ef"><rect x="2" y="2" width="9" height="9"></rect><rect x="13" y="2" width="9" height="9"></rect><rect x="2" y="13" width="9" height="9"></rect><rect x="13" y="13" width="9" height="9"></rect></svg>
                  <div style={{ width: "20px", height: "20px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "4px" }}></div>
                  <div style={{ width: "20px", height: "20px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "4px" }}></div>
                </div>
              </div>
            );
          default:
            return (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '30px' }}>
                <div style={{ padding: "16px 32px", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "8px", color: "var(--text-primary)", fontWeight: "bold" }}>
                  指示されたキーを入力...
                </div>
              </div>
            );
        }
      }
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
      </div>
    </div>
  );
}
