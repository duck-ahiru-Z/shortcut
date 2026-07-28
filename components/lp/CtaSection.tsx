import Link from "next/link";

export default function CtaSection() {
  return (
    <section style={{ textAlign: 'center', padding: '40px', background: 'linear-gradient(135deg, rgba(138,43,226,0.1) 0%, rgba(0,164,239,0.1) 100%)', borderRadius: '16px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>今すぐ実力を試してみませんか？</h2>
      <Link href="/exams" className="btn btn-primary" style={{ fontSize: '20px', padding: '16px 48px', borderRadius: '30px', backgroundColor: '#8a2be2' }}>
        無料で受験する
      </Link>
    </section>
  );
}
