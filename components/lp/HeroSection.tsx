import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
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
  );
}
