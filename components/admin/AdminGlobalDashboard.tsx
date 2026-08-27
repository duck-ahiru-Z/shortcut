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
    <main className="max-w-[1000px] mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="hero-title text-3xl m-0">HQ Portal (総合ダッシュボード)</h1>
        <Link href="/" className="btn btn-secondary">トップページへ戻る</Link>
      </div>

      <AdminGradeSelector currentGrade="all" grades={grades} />

      {errorMsg && (
        <div className="p-4 bg-[var(--danger-bg)] text-[var(--danger)] border border-[var(--danger)] mb-6 rounded-md">
          {errorMsg}
        </div>
      )}

      <div className="card p-6">
        <h2 className="section-title text-xl mb-4">全試験の統計一覧</h2>
        <p className="mb-4 text-[var(--text-muted)]">
          各試験の行をクリックすると、その試験の詳細データおよび問題編集画面へ移動します。
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[var(--bg-tertiary)] border-b-2 border-[var(--border-color)]">
                <th className="py-3 px-4 font-bold">試験名</th>
                <th className="py-3 px-4 font-bold">総受験回数</th>
                <th className="py-3 px-4 font-bold">実受験人数</th>
                <th className="py-3 px-4 font-bold">合格者数</th>
                <th className="py-3 px-4 font-bold">合格率</th>
              </tr>
            </thead>
            <tbody>
              {grades.map(g => {
                const s = allStats.find(stat => stat.id === g.id) || { id: g.id, totalTakes: 0, passedCount: 0, uniqueUsers: 0 };
                const rate = s.totalTakes > 0 ? Math.round((s.passedCount / s.totalTakes) * 100) : 0;
                const uniqueStr = s.uniqueUsers ? `${s.uniqueUsers} 人` : (s.totalTakes > 0 ? `不明 (${s.totalTakes}人以下)` : "0 人");
                return (
                  <tr 
                    key={g.id} 
                    className="border-b border-[var(--border-color)] cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors duration-200"
                    onClick={() => window.location.href = `/hq-portal?grade=${g.id}`}
                  >
                    <td className="py-3 px-4">
                      <Link href={`/hq-portal?grade=${g.id}`} className="text-[var(--accent-primary)] font-bold hover:underline">
                        {g.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4">{s.totalTakes} 回</td>
                    <td className="py-3 px-4">{uniqueStr}</td>
                    <td className="py-3 px-4">{s.passedCount} 回</td>
                    <td className="py-3 px-4">
                      <span 
                        className={rate >= 80 ? "text-[var(--success)] font-bold" : (rate > 0 ? "" : "text-[var(--text-muted)]")}
                      >
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
