"use client";

import { useEffect, useState, useRef } from "react";
import { CertificateApp, CertificateData } from "@/lib/certificate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import { GradeResult, WrongAnswerInfo } from "@/actions/exam";

type StoredResult = GradeResult & {
  lastName: string;
  firstName: string;
  gradeTitle: string;
};

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<StoredResult | null>(null);
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

      const certData: CertificateData = {
        score: result.score,
        rate: result.rate,
        certNo: result.certNo || "IBT-00000000-0000",
        dateStr,
        gradeTitle: result.gradeTitle || "5級 (Windows版)",
        lastName: result.lastName,
        firstName: result.firstName,
      };

      CertificateApp.generate(canvasRef.current, certData);
    }
  }, [result]);

  const handleDownloadPDF = () => {
    if (!canvasRef.current) return;
    
    // Create jsPDF instance (A4 landscape)
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvasRef.current.toDataURL('image/png');
    // Add image to PDF. 297x210 is A4 landscape in mm
    doc.addImage(imgData, 'PNG', 0, 0, 297, 210);
    
    const gradeName = result?.gradeTitle?.replace(/\s+/g, '_') || 'certificate';
    doc.save(`${gradeName}.pdf`);
  };

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

        {/* 間違えた問題の振り返りセクション */}
        <div style={{ marginTop: "40px" }}>
          <h3 className="section-title">結果の振り返り</h3>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px" }}>
            不正解だった問題と正しい解答を確認できます。（解説は準備中です）
          </p>
          
          {result.wrongAnswers && result.wrongAnswers.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {result.wrongAnswers.map((wrongObj: WrongAnswerInfo, i: number) => (
                <div key={i} style={{ border: "1px solid var(--border-color)", padding: "16px", backgroundColor: "var(--bg-tertiary)" }}>
                  <p style={{ fontWeight: 700, marginBottom: "12px", lineHeight: "1.5" }}>
                    Q. {wrongObj.question}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "14px" }}>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <span style={{ color: "var(--danger)", fontWeight: 700 }}>× あなたの解答:</span>
                      <div style={{ marginTop: "4px", padding: "8px", border: "1px solid var(--danger)", backgroundColor: "var(--danger-bg)" }}>
                        {wrongObj.userAnswer}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <span style={{ color: "var(--success)", fontWeight: 700 }}>○ 正しい解答:</span>
                      <div style={{ marginTop: "4px", padding: "8px", border: "1px solid var(--success)", backgroundColor: "var(--success-bg)" }}>
                        {wrongObj.correctAnswer}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed var(--border-light)", fontSize: "13px", color: "var(--text-muted)" }}>
                    <strong>【解説】</strong> 現在準備中です。
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "24px", border: "1px solid var(--success)", backgroundColor: "var(--success-bg)", color: "var(--success)", textAlign: "center", fontWeight: 700 }}>
              全問正解です！素晴らしい成績です。
            </div>
          )}
        </div>

        {result.passed && (
          <div className="certificate-section" style={{ marginTop: "48px" }}>
            <div className="certificate-title">合格証書 (IBT)</div>
            
            <div style={{ marginTop: "16px", marginBottom: "16px" }}>
              <button className="btn btn-primary" onClick={handleDownloadPDF} style={{ padding: "12px 32px" }}>
                PDFでダウンロードする
              </button>
            </div>
            
            <div className="certificate-preview-container">
              <canvas id="certificateCanvas" ref={canvasRef} style={{ pointerEvents: "none" }}></canvas>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "8px" }}>
              ※証書番号: {result.certNo}
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
