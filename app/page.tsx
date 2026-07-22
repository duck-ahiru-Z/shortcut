import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* ヒーローエリア */}
      <div className="hero-card" style={{ marginBottom: "40px" }}>
        <h1 className="hero-title">PC操作を劇的に高速化する実戦スキル</h1>
        <p className="hero-desc">
          ショートカットキー検定は、日常の業務や学習で頻繁に使われるショートカットキーの習得度を客観的に測定・評価するIBT試験です。マウス操作をキーボード操作に置き換えることで、業務効率化と生産性向上を図ることができます。
        </p>
      </div>

      {/* 級別セクション */}
      <div>
        <h2 className="section-title">受験可能な試験一覧</h2>
        <p style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "32px", lineHeight: "1.6" }}>
          現在のスキルレベルに合わせて、ご希望の試験をお選びください。初めての方は5級からの受験をおすすめします。
        </p>
        
        <div className="grade-grid">
          {/* 5級 */}
          <div className="grade-card">
            <div className="grade-header">
              <span className="grade-badge badge-available">受験可能</span>
              <h3 className="grade-title">5級 (Windows版)</h3>
              <p className="grade-desc">
                基本的なファイルのコピー＆ペースト、保存、元に戻すなどの基礎操作など、すべてのPCユーザーが身につけるべき必須ショートカットキーを出題します。
              </p>
            </div>
            <div>
              <div className="grade-meta">
                <p><strong>出題数:</strong> 30問</p>
                <p><strong>制限時間:</strong> 30分</p>
                <p><strong>合格基準:</strong> 正答率80%以上</p>
              </div>
              <Link href="/exam?grade=5kyu" className="btn btn-primary">
                5級を受験する (IBT試験へ)
              </Link>
            </div>
          </div>

          {/* 4級 (準備中) */}
          <div className="grade-card">
            <div className="grade-header">
              <span className="grade-badge badge-upcoming">準備中</span>
              <h3 className="grade-title">4級 (Windows版)</h3>
              <p className="grade-desc">現在準備中です。公開までお待ちください。</p>
            </div>
            <div>
              <button className="btn btn-disabled" disabled>準備中</button>
            </div>
          </div>

          {/* 3級 (準備中) */}
          <div className="grade-card">
            <div className="grade-header">
              <span className="grade-badge badge-upcoming">準備中</span>
              <h3 className="grade-title">3級 (Windows版)</h3>
              <p className="grade-desc">現在準備中です。公開までお待ちください。</p>
            </div>
            <div>
              <button className="btn btn-disabled" disabled>準備中</button>
            </div>
          </div>

          {/* 2級 (準備中) */}
          <div className="grade-card">
            <div className="grade-header">
              <span className="grade-badge badge-upcoming">準備中</span>
              <h3 className="grade-title">2級 (Windows版)</h3>
              <p className="grade-desc">現在準備中です。公開までお待ちください。</p>
            </div>
            <div>
              <button className="btn btn-disabled" disabled>準備中</button>
            </div>
          </div>

          {/* 1級 (準備中) */}
          <div className="grade-card">
            <div className="grade-header">
              <span className="grade-badge badge-upcoming">準備中</span>
              <h3 className="grade-title">1級 (Windows版)</h3>
              <p className="grade-desc">現在準備中です。公開までお待ちください。</p>
            </div>
            <div>
              <button className="btn btn-disabled" disabled>準備中</button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
