const fs = require('fs');
const path = require('path');

const pageContent = `import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main style={{ paddingBottom: "80px" }}>
      {/* ヒーローセクション */}
      <section style={{ 
        textAlign: 'center', 
        padding: '60px 20px', 
        background: 'linear-gradient(135deg, rgba(0,164,239,0.1) 0%, rgba(138,43,226,0.1) 100%)',
        borderRadius: '16px',
        marginBottom: '40px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <Image src="/logo.png" alt="Shortcut Key Exam Logo" width={120} height={120} style={{ objectFit: 'contain' }} />
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', lineHeight: 1.3 }}>
          PC操作を劇的に高速化する<br />実戦スキル証明
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.6 }}>
          ショートカットキー検定は、マウスに依存した操作から脱却し、
          エンジニアやビジネスパーソンの生産性を底上げするための新しいIBT試験です。
        </p>
        <Link href="/exams" className="btn btn-primary" style={{ fontSize: '18px', padding: '16px 40px', borderRadius: '30px', backgroundColor: '#00a4ef' }}>
          検定一覧・受験はこちら
        </Link>
      </section>

      {/* 検定の特徴 */}
      <section style={{ marginBottom: '60px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>ショートカットキー検定の3つの特徴</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🖱️🚫</div>
            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>暗記ではなく「実技」</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
              本検定の最大の特徴は、実際の画面を模した「実務シミュレータ」を採用している点です。頭で覚えるだけでなく、指が覚えているかを測ります。
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖✨</div>
            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>圧倒的に充実した解説</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
              受験終了後には、全問題に対する丁寧な解説と、関連する便利なショートカットが提示されます。受験そのものが最高の学習になります。
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡️💻</div>
            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>即効性のあるスキル</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
              明日からの業務や開発で即座に使えるスキルのみを厳選。Windows / Mac 両方の環境にネイティブ対応し、あなたのOSに合わせた出題を行います。
            </p>
          </div>

        </div>
      </section>

      {/* 試験の効果 */}
      <section style={{ marginBottom: '60px', padding: '40px', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>この試験を受ける効果・メリット</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(0, 164, 239, 0.1)', color: '#00a4ef', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' }}>1</div>
            <div>
              <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>作業スピードの劇的な向上</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>キーボードから手を離してマウスに持ち替える時間は、1回あたり約1〜2秒と言われています。これを1日数百回削減することで、年間で数十時間の時短に繋がります。</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(138, 43, 226, 0.1)', color: '#8a2be2', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' }}>2</div>
            <div>
              <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>エンジニア・クリエイターの「基礎体力」構築</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>エディタの操作、ターミナルの操作、ブラウザでの調査。すべてのIT業務の根底にあるPC操作を最適化することは、タイピング速度を上げるのと同じくらい重要な基礎スキルです。</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(39, 201, 63, 0.1)', color: '#27c93f', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' }}>3</div>
            <div>
              <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>客観的なスキルの証明</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>「PC操作が得意です」という曖昧なアピールを、「ショートカットキー検定○級取得」という客観的な指標に変えることができます。就職活動や自己研鑽の目標として最適です。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ステップアップ */}
      <section style={{ marginBottom: '60px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>受験のステップアップ</h2>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {[
            { grade: '5級', desc: '基礎操作 (全ユーザー向け)', color: '#6c757d' },
            { grade: '4級', desc: '実務・ウィンドウ操作', color: '#00a4ef' },
            { grade: '3級', desc: 'アプリ別応用 (準備中)', color: '#27c93f' },
            { grade: '2級', desc: '高度・設定操作 (準備中)', color: '#ffbd2e' },
            { grade: '1級', desc: '完全マウスレス (準備中)', color: '#ff5f56' },
          ].map((g, i) => (
            <div key={i} style={{ 
              background: 'var(--card-bg)', border: \`1px solid \${g.color}\`, borderRadius: '12px', 
              padding: '24px', width: '220px', textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: g.color, marginBottom: '8px' }}>{g.grade}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-color)' }}>{g.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '40px', background: 'linear-gradient(135deg, rgba(138,43,226,0.1) 0%, rgba(0,164,239,0.1) 100%)', borderRadius: '16px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>今すぐ実力を試してみませんか？</h2>
        <Link href="/exams" className="btn btn-primary" style={{ fontSize: '20px', padding: '16px 48px', borderRadius: '30px', backgroundColor: '#8a2be2' }}>
          無料で受験する
        </Link>
      </section>

    </main>
  );
}
`;

fs.writeFileSync(path.join(process.cwd(), 'app', 'page.tsx'), pageContent, 'utf8');
console.log('Successfully created app/page.tsx');
