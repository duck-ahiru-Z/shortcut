import React, { useEffect, useState } from "react";

type Props = {
  agreed: boolean;
  setAgreed: (v: boolean) => void;
  lastName: string;
  setLastName: (v: string) => void;
  firstName: string;
  setFirstName: (v: string) => void;
  isLoading: boolean;
  onStart: () => void;
};

export default function ExamPreScreen({
  agreed, setAgreed,
  lastName, setLastName,
  firstName, setFirstName,
  isLoading, onStart
}: Props) {
  const canStart = agreed && !isLoading && lastName.trim() !== "" && firstName.trim() !== "";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the device primarily uses touch (coarse pointer) or has a narrow screen
    const checkMobile = () => {
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const isNarrow = window.innerWidth <= 768;
      setIsMobile(isTouch || isNarrow);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="card" style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h2 className="section-title">受験開始の確認</h2>
      
      {isMobile && (
        <div style={{ padding: "16px", backgroundColor: "var(--warning-bg, #fff8e1)", border: "1px solid var(--warning, #ffb300)", borderRadius: "8px", marginBottom: "24px", color: "#b27b00" }}>
          <strong>【重要】PC環境での受験を推奨します</strong>
          <p style={{ fontSize: "14px", marginTop: "8px", margin: 0 }}>
            本試験（特に実務シミュレータ）は、物理的なキーボード操作が必須となります。スマートフォン等のタッチデバイスでは正常に解答できない可能性があるため、PC環境での受験をお願いいたします。
          </p>
        </div>
      )}

      <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
        準備ができたら以下の項目を入力・確認して、試験を開始してください。
      </p>

      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
          受験者氏名 (合格証書に記載されます)
        </label>
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            type="text"
            placeholder="姓"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{ flex: 1, padding: "10px", border: "1px solid var(--border-color)", borderRadius: "4px" }}
          />
          <input
            type="text"
            placeholder="名"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ flex: 1, padding: "10px", border: "1px solid var(--border-color)", borderRadius: "4px" }}
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
