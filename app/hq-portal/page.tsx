import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { cookies } from "next/headers";
import AdminLogin from "@/components/AdminLogin";
import AdminResultsTable from "@/components/AdminResultsTable";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import AdminWrongRankings from "@/components/admin/AdminWrongRankings";

// Server Component (Admin Dashboard)
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
  const grade = sp.grade || "5kyu";

  let stats: any = null;
  let recentResults: any[] = [];
  let errorMsg = "";

  try {
    // 1. Fetch Aggregated Stats
    const statsDoc = await getDoc(doc(db, "exam_stats", grade));
    if (statsDoc.exists()) {
      stats = statsDoc.data();
    }

    // 2. Fetch Recent 20 Results
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

  // Calculate most frequently missed questions
  const wrongCounts: Record<string, number> = stats?.wrongCounts || {};
  const wrongRankings = Object.entries(wrongCounts)
    .sort((a, b) => b[1] - a[1]) // Sort descending by count
    .slice(0, 10); // Top 10

  const totalTakes = stats?.totalTakes || 0;
  const passedCount = stats?.passedCount || 0;
  const passRate = totalTakes > 0 ? Math.round((passedCount / totalTakes) * 100) : 0;

  const grades = [
    { id: "5kyu", name: "5級" },
    { id: "4kyu", name: "4級" },
    { id: "3kyu", name: "3級" },
    { id: "2kyu", name: "2級" },
    { id: "1kyu", name: "1級" },
    { id: "practical", name: "実務検定" }
  ];

  return (
    <main style={{ maxWidth: "1000px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 className="hero-title" style={{ fontSize: "28px", margin: 0 }}>HQ Portal (管理者ダッシュボード)</h1>
        <Link href="/" className="btn btn-secondary">トップページへ戻る</Link>
      </div>

      <div style={{ marginBottom: "32px", display: "flex", gap: "8px", overflowX: "auto" }}>
        {grades.map(g => (
          <Link 
            key={g.id} 
            href={`/hq-portal?grade=${g.id}`}
            style={{ 
              padding: "8px 16px", 
              borderRadius: "4px", 
              backgroundColor: grade === g.id ? "var(--accent-primary)" : "var(--bg-tertiary)",
              color: grade === g.id ? "#fff" : "inherit",
              textDecoration: "none",
              fontWeight: grade === g.id ? 700 : 400
            }}
          >
            {g.name}
          </Link>
        ))}
      </div>

      <h2 style={{ marginBottom: "24px", fontSize: "20px" }}>対象データ: {grades.find(g => g.id === grade)?.name}</h2>

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

      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
        
        {/* 間違えやすい問題ランキング */}
        <div style={{ flex: "1 1 300px" }}>
          <AdminWrongRankings wrongRankings={wrongRankings} />
        </div>

        {/* 直近の受験履歴 */}
        <div style={{ flex: "2 1 500px" }}>
          <div className="card" style={{ padding: "24px" }}>
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
    </main>
  );
}
