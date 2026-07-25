import React from "react";

type Props = {
  agreed: boolean;
  setAgreed: (v: boolean) => void;
  isLoading: boolean;
  onStart: () => void;
};

export default function ExamPreScreen({
  agreed, setAgreed,
  isLoading, onStart
}: Props) {
  const canStart = agreed && !isLoading;

  return (
    <div className="card" style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h2 className="section-title">受験開始の確認</h2>
      <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
        準備ができたら以下の項目に同意して、試験を開始してください。
      </p>

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
