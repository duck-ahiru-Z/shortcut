"use client";

import { useEffect, useState, useRef } from "react";
import { CertificateApp, CertificateData } from "@/lib/certificate";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("examResult");
    if (!data) {
      router.push("/");
      return;
    }

    try {
      const parsed = JSON.parse(data);
      setResult(parsed);
    } catch (e) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (result && result.passed && canvasRef.current) {
      const date = new Date();
      const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
      const certNo = `IBT-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

      const certData: CertificateData = {
        score: result.score,
        rate: result.rate,
        certNo,
        dateStr,
        gradeTitle: result.gradeTitle || "5級 (Windows版)",
        lastName: result.lastName,
        firstName: result.firstName,
      };

      CertificateApp.generate(canvasRef.current, certData);
    }
  }, [result]);

  if (!result) return null;

  return (
    <main>
      <div className="card">
        <div className="result-status">
          {result.passed ? (
            <>
              <div className="status-badge status-pass">合 格</div>
              <p className="status-msg">おめでとうございます！合格基準を満たしました。</p>
            </>
          ) : (
            <>
              <div className="status-badge status-fail">不 合 格</div>
              <p className="status-msg">残念ながら合格基準に達しませんでした。</p>
            </>
          )}
        </div>

        <div className="result-grid">
          <div className="result-card">
            <div className="result-val" style={{ color: "var(--accent-primary)" }}>{result.score}</div>
            <div className="result-lbl">正解数</div>
          </div>
          <div className="result-card">
            <div className="result-val">{result.total}</div>
            <div className="result-lbl">出題数</div>
          </div>
          <div className="result-card">
            <div className="result-val">{result.rate}%</div>
            <div className="result-lbl">正答率</div>
          </div>
        </div>

        {result.passed && (
          <div className="certificate-section">
            <div className="certificate-title">合格証書 (IBT)</div>
            <div className="certificate-preview-container">
              <canvas id="certificateCanvas" ref={canvasRef}></canvas>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "8px" }}>
              ※画像として保存（右クリックまたは長押し）してご利用いただけます。
            </p>
          </div>
        )}

        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <Link href="/" className="btn btn-secondary">
            トップページに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
