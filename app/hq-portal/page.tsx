import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { cookies } from "next/headers";
import AdminLogin from "@/components/AdminLogin";
import AdminResultsTable from "@/components/AdminResultsTable";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import AdminWrongRankings from "@/components/admin/AdminWrongRankings";
import AdminQuestionEditor from "@/components/admin/AdminQuestionEditor";
import AdminGradeSelector from "@/components/admin/AdminGradeSelector";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ grade?: string }>;
}) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("admin_auth")?.value === "true";

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const sp = await searchParams;
  const grade = sp.grade || "all";

  const grades = [
    { id: "5kyu", name: "5級 (Win知識)" },
    { id: "4kyu", name: "4級 (Win知識)" },
    { id: "3kyu", name: "3級 (Win知識)" },
    { id: "2kyu", name: "2級 (Win知識)" },
    { id: "1kyu", name: "1級 (Win知識)" },
    { id: "practical-5kyu", name: "5級 (Win実務)" },
    { id: "practical-4kyu", name: "4級 (Win実務)" },
    { id: "practical-3kyu", name: "3級 (Win実務)" },
    { id: "practical-2kyu", name: "2級 (Win実務)" },
    { id: "practical-1kyu", name: "1級 (Win実務)" },
    { id: "mac-5kyu", name: "5級 (Mac知識)" },
    { id: "mac-4kyu", name: "4級 (Mac知識)" },
    { id: "mac-3kyu", name: "3級 (Mac知識)" },
    { id: "mac-2kyu", name: "2級 (Mac知識)" },
    { id: "mac-1kyu", name: "1級 (Mac知識)" },
    { id: "practical-mac-5kyu", name: "5級 (Mac実務)" },
    { id: "practical-mac-4kyu", name: "4級 (Mac実務)" },
    { id: "practical-mac-3kyu", name: "3級 (Mac実務)" },
    { id: "practical-mac-2kyu", name: "2級 (Mac実務)" },
    { id: "practical-mac-1kyu", name: "1級 (Mac実務)" }
  ];

  let errorMsg = "";

  // GLOBAL DASHBOARD VIEW
  if (grade === "all") {
    let allStats: any[] = [];
    try {
      const snap = await getDocs(collection(db, "exam_stats"));
      allStats = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error(err);
      errorMsg = "統計データの取得に失敗しました。";
    }

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
                  const s = allStats.find(stat => stat.id === g.id) || { totalTakes: 0, passedCount: 0, uniqueUsers: 0 };
                  const rate = s.totalTakes > 0 ? Math.round((s.passedCount / s.totalTakes) * 100) : 0;
                  // If uniqueUsers is missing (old data), just show '-' or estimate
                  const uniqueStr = s.uniqueUsers ? `${s.uniqueUsers} 人` : (s.totalTakes > 0 ? `不明 (${s.totalTakes}人以下)` : "0 人");
                  return (
                    <tr key={g.id} style={{ borderBottom: "1px solid var(--border-color)", cursor: "pointer", transition: "background 0.2s" }} onClick={`window.location.href='/hq-portal?grade=${g.id}'` as any}>
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

  // SPECIFIC EXAM VIEW
  let stats: any = null;
  let recentResults: any[] = [];

  try {
    const statsDoc = await getDoc(doc(db, "exam_stats", grade));
    if (statsDoc.exists()) {
      stats = statsDoc.data();
    }

    const resultsQuery = query(
      collection(db, "exam_results"),
      orderBy("timestamp", "desc"),
      limit(100)
    );
    const resultsSnap = await getDocs(resultsQuery);
    
    const allResults = resultsSnap.docs.map(d => ({
      id: d.id,
      ...d.data()
    } as any));

    recentResults = allResults.filter(r => r.grade === grade).slice(0, 20);

  } catch (err: any) {
    console.error(err);
    errorMsg = "データの取得に失敗しました。";
  }

  const wrongCounts: Record<string, number> = stats?.wrongCounts || {};
  const wrongRankings = Object.entries(wrongCounts)
    .sort((a, b) => b[1] - a[1]) // Sort descending by count
    .slice(0, 10);

  const totalTakes = stats?.totalTakes || 0;
  const passedCount = stats?.passedCount || 0;
  const passRate = totalTakes > 0 ? Math.round((passedCount / totalTakes) * 100) : 0;

  return (
    <main style={{ maxWidth: "1000px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 className="hero-title" style={{ fontSize: "28px", margin: 0 }}>HQ Portal (管理者ダッシュボード)</h1>
        <Link href="/" className="btn btn-secondary">トップページへ戻る</Link>
      </div>

      <AdminGradeSelector currentGrade={grade} grades={grades} />

      {errorMsg && (
        <div style={{ padding: "16px", backgroundColor: "var(--danger-bg)", color: "var(--danger)", border: "1px solid var(--danger)", marginBottom: "24px" }}>
          {errorMsg}
        </div>
      )}

      {/* サマリー統計 */}
      <AdminStatsCards 
        totalTakes={totalTakes} 
        passedCount={passedCount} 
        passRate={passRate} 
      />

      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", marginBottom: "32px" }}>
        
        {/* 間違えやすい問題ランキング */}
        <div style={{ flex: "1 1 300px" }}>
          <AdminWrongRankings wrongRankings={wrongRankings} />
        </div>

        {/* 直近の受験履歴 */}
        <div style={{ flex: "2 1 500px" }}>
          <div className="card" style={{ padding: "24px", height: "100%" }}>
            <h2 className="section-title" style={{ fontSize: "18px", marginBottom: "16px" }}>
              直近の受験記録
            </h2>
            
            <AdminResultsTable 
              results={recentResults} 
              gradeName={grades.find(g => g.id === grade)?.name || grade} 
            />
            
          </div>
        </div>
      </div>

      {/* 問題エディタ */}
      <AdminQuestionEditor grade={grade} />
      
    </main>
  );
}
