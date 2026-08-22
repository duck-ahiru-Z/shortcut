const fs = require('fs');
const path = require('path');

const pageContent = `"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [os, setOs] = useState("windows");
  
  const osLabel = os === "windows" ? "Windows版" : "Mac版";
  const osPrefix = os === "windows" ? "" : "mac-";

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
        <p style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "24px", lineHeight: "1.6" }}>
          現在のスキルレベルに合わせて、ご希望の試験をお選びください。初めての方は5級からの受験をおすすめします。
        </p>
        
        {/* OS選択トグル */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', background: 'var(--card-bg)', borderRadius: '8px', padding: '4px', border: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => setOs("windows")}
              style={{ 
                padding: '8px 32px', 
                borderRadius: '6px',
                border: 'none',
                background: os === "windows" ? 'var(--primary-color)' : 'transparent',
                color: os === "windows" ? 'white' : 'var(--text-color)',
                fontWeight: os === "windows" ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '15px'
              }}
            >
              Windows
            </button>
            <button 
              onClick={() => setOs("mac")}
              style={{ 
                padding: '8px 32px', 
                borderRadius: '6px',
                border: 'none',
                background: os === "mac" ? 'var(--primary-color)' : 'transparent',
                color: os === "mac" ? 'white' : 'var(--text-color)',
                fontWeight: os === "mac" ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '15px'
              }}
            >
              Mac
            </button>
          </div>
        </div>
        
        <div className="grade-grid">
          {/* 5級 */}
          <div className="grade-card">
            <div className="grade-header">
              <span className="grade-badge badge-available">受験可能</span>
              <h3 className="grade-title">5級 ({osLabel})</h3>
              <p className="grade-desc">
                基本的なファイルのコピー＆ペースト、保存、元に戻すなどの基礎操作など、すべてのPCユーザーが身につけるべき必須ショートカットキーを出題します。
              </p>
            </div>
            <div>
              <div className="grade-meta">
                <p><strong>出題数:</strong> 30問 (実務: 5問)</p>
                <p><strong>合格基準:</strong> 正答率80%以上</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link href={\`/exam?grade=\${osPrefix}5kyu\`} className="btn btn-primary">
                  5級 知識試験を受験する
                </Link>
                <Link href={\`/exam?grade=practical-\${osPrefix}5kyu\`} className="btn btn-primary" style={{ backgroundColor: "#8a2be2" }}>
                  5級 実務試験に挑戦する
                </Link>
              </div>
            </div>
          </div>

          {/* 4級 */}
          <div className="grade-card">
            <div className="grade-header">
              <span className="grade-badge badge-available">受験可能</span>
              <h3 className="grade-title">4級 ({osLabel})</h3>
              <p className="grade-desc">
                ウィンドウ操作や文字の範囲選択、ブラウザの高度なタブ操作など、ワンランク上の実務向けショートカットキーを出題します。
              </p>
            </div>
            <div>
              <div className="grade-meta">
                <p><strong>出題数:</strong> 30問 (実務: 5問)</p>
                <p><strong>合格基準:</strong> 正答率80%以上</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link href={\`/exam?grade=\${osPrefix}4kyu\`} className="btn btn-primary">
                  4級 知識試験を受験する
                </Link>
                <Link href={\`/exam?grade=practical-\${osPrefix}4kyu\`} className="btn btn-primary" style={{ backgroundColor: "#8a2be2" }}>
                  4級 実務試験に挑戦する
                </Link>
              </div>
            </div>
          </div>

          {/* 3級 */}
          <div className="grade-card">
            <div className="grade-header">
              <span className="grade-badge badge-upcoming">テスト運用中</span>
              <h3 className="grade-title">3級 ({osLabel})</h3>
              <p className="grade-desc">【仮問題】WordやExcelなどの各アプリ固有の操作など、応用的なショートカットを出題予定です。</p>
            </div>
            <div>
              <div className="grade-meta">
                <p><strong>出題数:</strong> 30問 (実務: 5問)</p>
                <p><strong>合格基準:</strong> 正答率80%以上</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link href={\`/exam?grade=\${osPrefix}3kyu\`} className="btn btn-primary">
                  3級 知識試験を受験する
                </Link>
                <Link href={\`/exam?grade=practical-\${osPrefix}3kyu\`} className="btn btn-primary" style={{ backgroundColor: "#8a2be2" }}>
                  3級 実務試験に挑戦する
                </Link>
              </div>
            </div>
          </div>

          {/* 2級 */}
          <div className="grade-card">
            <div className="grade-header">
              <span className="grade-badge badge-upcoming">テスト運用中</span>
              <h3 className="grade-title">2級 ({osLabel})</h3>
              <p className="grade-desc">【仮問題】さらに高度な操作や、PCの設定周りのショートカットなどを出題予定です。</p>
            </div>
            <div>
              <div className="grade-meta">
                <p><strong>出題数:</strong> 30問 (実務: 5問)</p>
                <p><strong>合格基準:</strong> 正答率80%以上</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link href={\`/exam?grade=\${osPrefix}2kyu\`} className="btn btn-primary">
                  2級 知識試験を受験する
                </Link>
                <Link href={\`/exam?grade=practical-\${osPrefix}2kyu\`} className="btn btn-primary" style={{ backgroundColor: "#8a2be2" }}>
                  2級 実務試験に挑戦する
                </Link>
              </div>
            </div>
          </div>

          {/* 1級 */}
          <div className="grade-card">
            <div className="grade-header">
              <span className="grade-badge badge-upcoming">テスト運用中</span>
              <h3 className="grade-title">1級 ({osLabel})</h3>
              <p className="grade-desc">【仮問題】あらゆるアプリをマウスなしで操作する、プロフェッショナル向けの最難関試験です。</p>
            </div>
            <div>
              <div className="grade-meta">
                <p><strong>出題数:</strong> 30問 (実務: 5問)</p>
                <p><strong>合格基準:</strong> 正答率80%以上</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link href={\`/exam?grade=\${osPrefix}1kyu\`} className="btn btn-primary">
                  1級 知識試験を受験する
                </Link>
                <Link href={\`/exam?grade=practical-\${osPrefix}1kyu\`} className="btn btn-primary" style={{ backgroundColor: "#8a2be2" }}>
                  1級 実務試験に挑戦する
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
`;

fs.writeFileSync(path.join(process.cwd(), 'app', 'page.tsx'), pageContent, 'utf8');
console.log('Successfully updated app/page.tsx');
