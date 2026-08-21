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

import styles from "./AdminResultsTable.module.css";

export default function AdminResultsTable({ results, gradeName }: Props) {
  const [selectedResult, setSelectedResult] = useState<ResultRecord | null>(null);

  return (
    <>
      <div className={styles.container}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeadRow}>
              <th className={styles.tableHeader}>日時</th>
              <th className={styles.tableHeader}>氏名</th>
              <th className={styles.tableHeader}>結果</th>
              <th className={styles.tableHeader}>スコア</th>
              <th className={styles.tableHeader}>所要時間</th>
              <th className={styles.tableHeader}>不正疑い</th>
              <th className={styles.tableHeader}>アクション</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={r.id} className={i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                <td className={styles.tableCellNowrap}>
                  {new Date(r.timestamp).toLocaleString("ja-JP", { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className={styles.tableCell}>{r.lastName || r.firstName ? `${r.lastName} ${r.firstName}` : "匿名"}</td>
                <td className={r.passed ? styles.tableCellPass : styles.tableCellFail}>
                  {r.passed ? '合格' : '不合格'}
                </td>
                <td className={styles.tableCell}>{r.score} / {r.total}</td>
                <td className={styles.tableCell}>
                  <span className={r.timerViolated ? styles.timerViolated : styles.timerNormal}>
                    {Math.floor(r.timeTakenSec / 60)}分{(r.timeTakenSec % 60).toString().padStart(2, '0')}秒
                  </span>
                </td>
                <td className={styles.tableCell}>
                  {r.tabSwitches > 0 ? (
                    <span className={styles.cheatDetected}>
                      切替 {r.tabSwitches}回
                    </span>
                  ) : (
                    <span className={styles.noCheat}>なし</span>
                  )}
                </td>
                <td className={styles.tableCell}>
                  <button onClick={() => setSelectedResult(r)} className={`btn btn-secondary ${styles.actionButton}`}>詳細</button>
                </td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.emptyCell}>
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
