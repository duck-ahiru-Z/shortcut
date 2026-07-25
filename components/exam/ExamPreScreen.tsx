import React from "react";

type Props = {
  lastName: string;
  setLastName: (v: string) => void;
  firstName: string;
  setFirstName: (v: string) => void;
  agreed: boolean;
  setAgreed: (v: boolean) => void;
  isLoading: boolean;
  onStart: () => void;
};

export default function ExamPreScreen({
  lastName, setLastName,
  firstName, setFirstName,
  agreed, setAgreed,
  isLoading, onStart
}: Props) {
  const canStart = lastName && firstName && agreed && !isLoading;

  return (
    <div className="card" style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h2 className="section-title">受験者情報の入力</h2>
      <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
        合格証書に記載されるお名前を入力してください。
      </p>
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 700, fontSize: "14px" }}>姓</label>
          <input 
            type="text" 
            value={lastName} 
            onChange={e => setLastName(e.target.value)}
            placeholder="山田"
            style={{ width: "100%", padding: "12px", border: "2px solid var(--border-color)", fontSize: "16px", outline: "none" }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 700, fontSize: "14px" }}>名</label>
          <input 
            type="text" 
            value={firstName} 
            onChange={e => setFirstName(e.target.value)}
            placeholder="太郎"
            style={{ width: "100%", padding: "12px", border: "2px solid var(--border-color)", fontSize: "16px", outline: "none" }}
          />
        </div>
      </div>

      <div style={{ marginBottom: "32px", fontSize: "14px" }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", cursor: "pointer" }}>
          <input 
            type="checkbox" 
            checked={agreed} 
            onChange={e => setAgreed(e.target.checked)} 
            style={{ marginTop: "4px" }}
          />
          <span>
            【利用規約・不正行為への同意】<br />
            試験中の別タブへの切り替え、検索、開発者ツールの使用などの不正行為を行わないことに同意します。（不正な操作は記録されます）
          </span>
        </label>
      </div>

      <button 
        className={`btn ${canStart ? 'btn-primary' : 'btn-disabled'}`} 
        onClick={onStart}
        disabled={!canStart}
        style={{ width: "100%" }}
      >
        {isLoading ? '準備中...' : '試験を開始する'}
      </button>
    </div>
  );
}
