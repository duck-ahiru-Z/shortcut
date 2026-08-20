"use client";

import { GradeConfig } from "../../config/grades";

type GradeCardProps = {
  config: GradeConfig;
  onOpenModal: (gradeId: string, isPractical: boolean) => void;
};

export default function GradeCard({ config, onOpenModal }: GradeCardProps) {
  return (
    <div className="grade-card">
      <div className="grade-header">
        <h3 className="grade-title">{config.title}</h3>
        <p className="grade-desc">{config.description}</p>
      </div>
      <div>
        <div className="grade-meta">
          <p><strong>出題数:</strong> {config.knowledgeCount}問 (実務: {config.practicalCount}問)</p>
          <p><strong>合格基準:</strong> 正答率{config.passingRate}以上</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button onClick={() => onOpenModal(config.id, false)} className="btn btn-primary">
            {config.title} 知識試験を受験する
          </button>
          <button onClick={() => onOpenModal(config.id, true)} className="btn btn-primary" style={{ backgroundColor: "#8a2be2" }}>
            {config.title} 実務試験に挑戦する
          </button>
        </div>
      </div>
    </div>
  );
}
