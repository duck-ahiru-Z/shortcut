export default function FeaturesSection() {
  return (
    <section style={{ marginBottom: '60px' }}>
      <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>ショートカットキー検定の3つの特徴</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        
        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ marginBottom: '16px', color: '#00a4ef', display: 'flex', justifyContent: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
              <path d="M6 8h.001"></path><path d="M10 8h.001"></path><path d="M14 8h.001"></path><path d="M18 8h.001"></path>
              <path d="M8 12h.001"></path><path d="M12 12h.001"></path><path d="M16 12h.001"></path>
              <path d="M7 16h10"></path>
            </svg>
          </div>
          <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>暗記ではなく「実技」</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
            本検定の最大の特徴は、実際の画面を模した「実務シミュレータ」を採用している点です。頭で覚えるだけでなく、指が覚えているかを測ります。
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ marginBottom: '16px', color: '#8a2be2', display: 'flex', justifyContent: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>圧倒的に充実した解説</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
            受験終了後には、全問題に対する丁寧な解説と、関連する便利なショートカットが提示されます。受験そのものが最高の学習になります。
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ marginBottom: '16px', color: '#27c93f', display: 'flex', justifyContent: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>即効性のあるスキル</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
            明日からの業務や開発で即座に使えるスキルのみを厳選。Windows / Mac 両方の環境にネイティブ対応し、あなたのOSに合わせた出題を行います。
          </p>
        </div>

      </div>
    </section>
  );
}
