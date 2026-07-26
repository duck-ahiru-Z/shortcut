import { useState } from "react";

type LegacyGimmickProps = {
  type: string;
  taskData: any;
  inputValue: string;
  setInputValue: (val: string) => void;
  handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleInputSubmit: () => void;
};

export default function LegacyGimmicks({
  type,
  taskData,
  inputValue,
  setInputValue,
  handleInputKeyDown,
  handleInputSubmit
}: LegacyGimmickProps) {
  switch (type) {
    case "select_all":
      return (
        <div style={{ marginTop: "20px" }}>
          <textarea
            readOnly
            onMouseDown={(e) => {
              e.preventDefault();
              (e.target as HTMLTextAreaElement).focus();
            }}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              width: "100%", height: "200px", padding: "16px",
              fontSize: "16px", border: "2px solid var(--border-color)",
              userSelect: "none"
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
            <span style={{ color: "black", fontWeight: "bold" }}>パスワード：{taskData?.password}</span>
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
            {taskData?.targetText}
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
      return null;
  }
}
