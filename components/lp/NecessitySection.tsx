export default function NecessitySection() {
  return (
    <section style={{ marginBottom: '80px', padding: '40px', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
      <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>なぜ今、ショートカットキー検定が必要なのか？</h2>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ fontSize: '16px', color: 'var(--text-color)', lineHeight: 1.8, marginBottom: '48px' }}>
          日本のビジネスシーンにおいて、日常的なパソコン操作のスピードは企業の生産性に直結します。しかし、多くの企業が「見えない時間的負債」を抱え、さらに次世代のIT基礎力不足という深刻な課題に直面しています。
          Windows / Mac ショートカットキー検定は、これらの課題を可視化し、客観的なスキル証明と生産性向上を実現するための全く新しいソリューションです。
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Point 1 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0, 164, 239, 0.1)', color: '#00a4ef' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold' }}>1. 企業を蝕む「マウス税（Mouse Tax）」の正体</h3>
            </div>
            <p style={{ color: 'var(--text-color)', fontSize: '15px', lineHeight: 1.8, marginBottom: '16px' }}>
              マウスを使った操作は直感的でわかりやすい反面、作業効率の観点では大きなロスを生み出しています。
            </p>
            <ul style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, paddingLeft: '24px', marginBottom: '16px', listStyleType: 'disc' }}>
              <li style={{ marginBottom: '8px' }}><strong>学術的根拠に基づくタイムロス:</strong> HCI（ヒューマン・コンピュータ・インタラクション）の世界的基準である「KLM」の研究によると、キーボードからマウスへ手を移動させる「ホーミング」には0.4秒かかります。</li>
              <li style={{ marginBottom: '8px' }}><strong>ポインティングの遅延:</strong> さらに、マウスで画面上のターゲットを指し示す「ポインティング」には平均1.1秒かかるとされ、マウスに手を伸ばしてクリックするだけで1回約1.5秒〜2秒の時間が奪われています。</li>
              <li><strong>年間64時間（8労働日分）の損失:</strong> アメリカのEdTech企業の試算によれば、1分間に1回、2秒のロスが発生した場合、年間で約64時間（労働日換算で8日分）の損失となります。</li>
            </ul>
            <div style={{ padding: '16px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', borderLeft: '4px solid #00a4ef', fontSize: '15px', lineHeight: 1.6 }}>
              仮に時給2,000円の社員が100名いる企業の場合、ショートカットキーを使わないことによる損失は<strong>年間1,280万円</strong>にのぼります。この見えないコストを削減する最も効果的な方法が、ショートカットキーの習得です。
            </div>
          </div>

          {/* Point 2 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(138, 43, 226, 0.1)', color: '#8a2be2' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold' }}>2. スマホネイティブ世代の「PCスキル不足」問題</h3>
            </div>
            <p style={{ color: 'var(--text-color)', fontSize: '15px', lineHeight: 1.8, marginBottom: '16px' }}>
              昨今、スマートフォンの普及により、若年層のPCリテラシー低下が社会問題化しています。
            </p>
            <ul style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, paddingLeft: '24px', marginBottom: '16px', listStyleType: 'disc' }}>
              <li style={{ marginBottom: '8px' }}><strong>7割以上がPC操作に自信なし:</strong> 調査によれば、大学生の7割以上が自身のPCスキルに自信を持てておらず、企業の採用担当者の約6割が「新入社員のPCスキル不足」を実感しています。</li>
              <li style={{ marginBottom: '8px' }}><strong>スマホネイティブ特有の「過信」:</strong> 教育現場の調査データでも、約7割の学生がパソコンよりもスマートフォンの方が得意であると回答しています。</li>
              <li><strong>自己流学習の限界:</strong> 若年層は「慣れればできる」と過信する傾向がありますが、ショートカットキーを用いた効率的な業務遂行は、自己流のままでは決して身につきません。</li>
            </ul>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8 }}>
              企業が「業務の中で自然に覚えるだろう」と放置することは、新入社員の成長を妨げ、長期的な生産性低下を招くリスクとなります。
            </p>
          </div>

          {/* Point 3 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(39, 201, 63, 0.1)', color: '#27c93f' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold' }}>3. 「知っている」から「無意識に使える」へ</h3>
            </div>
            <p style={{ color: 'var(--text-color)', fontSize: '15px', lineHeight: 1.8, marginBottom: '16px' }}>
              ショートカットキーは、知識として暗記しているだけでは実務の役には立ちません。思考を途切れさせることなく、反射的に指が動くレベルに達して初めて業務効率化に貢献します。
              当検定システムでは、以下の独自アプローチで真の実務能力を測定します。
            </p>
            <ul style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, paddingLeft: '24px', listStyleType: 'decimal' }}>
              <li style={{ marginBottom: '8px' }}><strong>実践的なモックUIシステム:</strong> 単なるテキストの4択問題ではなく、ブラウザ上に構築された精巧なソフトウェアモック上で、実際にキーを叩いて効果を体感できる「実技試験」を採用しています。</li>
              <li style={{ marginBottom: '8px' }}><strong>客観的なスキル証明:</strong> これまで履歴書に書きづらかった「PC操作のスピードと正確性」を、公式の検定としてスコア化し、就職活動や企業内評価の明確な基準を提供します。</li>
              <li><strong>弱点の可視化とデータ蓄積:</strong> 個人情報を保護しつつ、どの操作につまずきやすいかという統計データを分析し、効率的なスキルアップを支援します。</li>
            </ul>
          </div>
          
        </div>
      </div>
    </section>
  );
}
