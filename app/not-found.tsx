import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        <h1 style={{ fontSize: "6rem", fontWeight: 700, color: "var(--accent-primary)", margin: "0 0 16px 0", lineHeight: 1 }}>
          404
        </h1>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-color)", marginBottom: "24px" }}>
          ページが見つかりません
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "16px", marginBottom: "40px", lineHeight: 1.6 }}>
          お探しのページは削除されたか、URLが間違っている可能性があります。<br />
          正しいURLを入力するか、トップページにお戻りください。
        </p>
        
        <Link href="/" className="btn btn-primary" style={{ display: "inline-block", padding: "16px 40px", fontSize: "16px" }}>
          トップページへ戻る
        </Link>
      </div>
    </main>
  );
}
