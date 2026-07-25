import React from "react";

type Props = {
  totalTakes: number;
  passedCount: number;
  passRate: number;
};

export default function AdminStatsCards({ totalTakes, passedCount, passRate }: Props) {
  return (
    <div className="result-grid" style={{ marginBottom: "40px" }}>
      <div className="result-card">
        <div className="result-val">{totalTakes}</div>
        <div className="result-lbl">総受験回数</div>
      </div>
      <div className="result-card">
        <div className="result-val" style={{ color: "var(--success)" }}>{passedCount}</div>
        <div className="result-lbl">合格者数</div>
      </div>
      <div className="result-card">
        <div className="result-val">{passRate}%</div>
        <div className="result-lbl">合格率</div>
      </div>
    </div>
  );
}
