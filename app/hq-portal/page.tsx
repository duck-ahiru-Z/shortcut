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

import AdminGlobalDashboard from "@/components/admin/AdminGlobalDashboard";
import { ALL_GRADES_LIST } from "@/config/grades";

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

  const grades = ALL_GRADES_LIST;

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
      <AdminGlobalDashboard 
        grades={grades} 
        allStats={allStats} 
        errorMsg={errorMsg} 
      />
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
