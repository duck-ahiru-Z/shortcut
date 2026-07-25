import React from "react";

type Props = {
  wrongRankings: [string, number][];
};

export default function AdminWrongRankings({ wrongRankings }: Props) {
  return (
    <div className="card" style={{ padding: "24px", height: "100%" }}>
      <h2 className="section-title" style={{ fontSize: "18px", marginBottom: "16px" }}>
        よく間違えられる問題ランキング (Top 10)
      </h2>
      {wrongRankings.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {wrongRankings.map(([qId, count], index) => (
            <li key={qId} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border-light)" }}>
              <div>
                <span style={{ fontWeight: 700, color: "var(--accent-primary)", marginRight: "8px" }}>#{index + 1}</span>
                <span>問題ID: {qId}</span>
              </div>
              <div style={{ fontWeight: 700, color: "var(--danger)" }}>
                {count} 回
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>まだデータがありません。</p>
      )}
    </div>
  );
}
