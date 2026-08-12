export default function FlowSection() {
  return (
    <section style={{ marginBottom: '60px' }}>
      <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>受験のステップアップ</h2>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
        {[
          { grade: '5級', desc: '基礎操作 (全ユーザー向け)', color: '#6c757d' },
          { grade: '4級', desc: '実務・ウィンドウ操作', color: '#00a4ef' },
          { grade: '3級', desc: 'アプリ別応用', color: '#27c93f' },
          { grade: '2級', desc: '高度・設定操作', color: '#ffbd2e' },
          { grade: '1級', desc: '完全マウスレス', color: '#ff5f56' },
        ].map((g, i) => (
          <div key={i} style={{ 
            background: 'var(--card-bg)', border: `1px solid ${g.color}`, borderRadius: '12px', 
            padding: '24px', width: '220px', textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: g.color, marginBottom: '8px' }}>{g.grade}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-color)' }}>{g.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
