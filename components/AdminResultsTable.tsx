"use client";

import { useState } from "react";
import AdminResultDetailModal from "./admin/AdminResultDetailModal";
import { WrongAnswerInfo } from "@/actions/exam";

type ResultRecord = {
  id: string;
  grade: string;
  deviceId: string;
  lastName: string;
  firstName: string;
  score: number;
  total: number;
  rate: number;
  passed: boolean;
  tabSwitches: number;
  timeTakenSec: number;
  timerViolated: boolean;
  timestamp: string;
  certNo: string | null;
  wrongAnswers?: WrongAnswerInfo[];
};

type Props = {
  results: ResultRecord[];
  gradeName: string;
};

export default function AdminResultsTable({ results, gradeName }: Props) {
  const [selectedResult, setSelectedResult] = useState<ResultRecord | null>(null);

  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border-color)", backgroundColor: "var(--bg-tertiary)" }}>
              <th style={{ padding: "12px" }}>日時</th>
              <th style={{ padding: "12px" }}>氏名</th>
              <th style={{ padding: "12px" }}>結果</th>
              <th style={{ padding: "12px" }}>スコア</th>
              <th style={{ padding: "12px" }}>所要時間</th>
              <th style={{ padding: "12px" }}>不正疑い</th>
              <th style={{ padding: "12px" }}>アクション</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: "1px solid var(--border-light)", backgroundColor: i % 2 === 0 ? "var(--bg-secondary)" : "var(--bg-tertiary)" }}>
                <td style={{ padding: "12px", whiteSpace: "nowrap" }}>
                  {new Date(r.timestamp).toLocaleString("ja-JP", { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td style={{ padding: "12px" }}>{r.lastName} {r.firstName}</td>
                <td style={{ padding: "12px", fontWeight: 700, color: r.passed ? "var(--success)" : "var(--danger)" }}>
                  {r.passed ? '合格' : '不合格'}
                </td>
                <td style={{ padding: "12px" }}>{r.score} / {r.total}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{ color: r.timerViolated ? "var(--danger)" : "inherit" }}>
                    {Math.floor(r.timeTakenSec / 60)}分{(r.timeTakenSec % 60).toString().padStart(2, '0')}秒
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  {r.tabSwitches > 0 ? (
                    <span style={{ color: "var(--danger)", fontWeight: 700, padding: "4px 8px", border: "1px solid var(--danger)" }}>
                      切替 {r.tabSwitches}回
                    </span>
                  ) : (
                    <span style={{ color: "var(--text-muted)" }}>なし</span>
                  )}
                </td>
                <td style={{ padding: "12px" }}>
                  <button onClick={() => setSelectedResult(r)} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "12px" }}>詳細</button>
                </td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>
                  まだ受験記録がありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AdminResultDetailModal 
        selectedResult={selectedResult}
        gradeName={gradeName}
        onClose={() => setSelectedResult(null)}
      />
    </>
  );
}
