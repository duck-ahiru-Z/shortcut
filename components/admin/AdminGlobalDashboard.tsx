"use client";
import React from "react";
import Link from "next/link";
import AdminGradeSelector from "@/components/admin/AdminGradeSelector";

type StatItem = {
  id: string;
  totalTakes: number;
  passedCount: number;
  uniqueUsers?: number;
};

type GradeItem = {
  id: string;
  name: string;
};

type Props = {
  grades: GradeItem[];
  allStats: StatItem[];
  errorMsg: string;
};

export default function AdminGlobalDashboard({ grades, allStats, errorMsg }: Props) {
  return (
    <main style={{ maxWidth: "1000px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 className="hero-title" style={{ fontSize: "28px", margin: 0 }}>HQ Portal (総合ダッシュボード)</h1>
        <Link href="/" className="btn btn-secondary">トップページへ戻る</Link>
      </div>

      <AdminGradeSelector currentGrade="all" grades={grades} />

      {errorMsg && (
        <div style={{ padding: "16px", backgroundColor: "var(--danger-bg)", color: "var(--danger)", border: "1px solid var(--danger)", marginBottom: "24px" }}>
          {errorMsg}
        </div>
      )}

      <div className="card" style={{ padding: "24px" }}>
        <h2 className="section-title" style={{ fontSize: "20px", marginBottom: "16px" }}>全試験の統計一覧</h2>
        <p style={{ marginBottom: "16px", color: "var(--text-muted)" }}>
          各試験の行をクリックすると、その試験の詳細データおよび問題編集画面へ移動します。
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-tertiary)", borderBottom: "2px solid var(--border-color)" }}>
                <th style={{ padding: "12px 16px" }}>試験名</th>
                <th style={{ padding: "12px 16px" }}>総受験回数</th>
                <th style={{ padding: "12px 16px" }}>実受験人数</th>
                <th style={{ padding: "12px 16px" }}>合格者数</th>
                <th style={{ padding: "12px 16px" }}>合格率</th>
              </tr>
            </thead>
            <tbody>
              {grades.map(g => {
                const s = allStats.find(stat => stat.id === g.id) || { id: g.id, totalTakes: 0, passedCount: 0, uniqueUsers: 0 };
                const rate = s.totalTakes > 0 ? Math.round((s.passedCount / s.totalTakes) * 100) : 0;
                const uniqueStr = s.uniqueUsers ? `${s.uniqueUsers} 人` : (s.totalTakes > 0 ? `不明 (${s.totalTakes}人以下)` : "0 人");
                return (
                  <tr key={g.id} style={{ borderBottom: "1px solid var(--border-color)", cursor: "pointer", transition: "background 0.2s" }} onClick={() => window.location.href = `/hq-portal?grade=${g.id}`}>
                    <td style={{ padding: "12px 16px" }}>
                      <Link href={`/hq-portal?grade=${g.id}`} style={{ color: "var(--accent-primary)", textDecoration: "none", fontWeight: "bold" }}>
                        {g.name}
                      </Link>
                    </td>
                    <td style={{ padding: "12px 16px" }}>{s.totalTakes} 回</td>
                    <td style={{ padding: "12px 16px" }}>{uniqueStr}</td>
                    <td style={{ padding: "12px 16px" }}>{s.passedCount} 回</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ color: rate >= 80 ? "var(--success)" : rate > 0 ? "inherit" : "var(--text-muted)", fontWeight: rate >= 80 ? "bold" : "normal" }}>
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
