"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GradeResult, WrongAnswerInfo } from "@/actions/exam";
import { CertificateApp, CertificateData } from "@/lib/certificate";

type StoredResult = GradeResult & {
  lastName: string;
  firstName: string;
  gradeTitle: string;
  gradeId?: string;
};

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<StoredResult | null>(null);
  const [certData, setCertData] = useState<CertificateData | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("examResult");
    if (!data) {
      router.push("/");
      return;
    }

    try {
      const parsed = JSON.parse(data);
      setResult(parsed);
      
      if (parsed.passed) {
        const date = new Date();
        const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
        setCertData({
          score: parsed.score,
          rate: parsed.rate,
          certNo: parsed.certNo || "IBT-00000000-0000",
          dateStr,
          gradeTitle: parsed.gradeTitle || "5級 (Windows版)",
          lastName: parsed.lastName,
          firstName: parsed.firstName,
          gradeId: parsed.gradeId,
        });
      }
    } catch (e) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (certData && canvasRef.current) {
      CertificateApp.generate(canvasRef.current, certData);
    }
  }, [certData]);

  const handleDownloadPDF = () => {
    // 印刷ダイアログを呼び出し、ブラウザの機能でベクターPDFとして保存させる
    window.print();
  };

  if (!result) {
    return <div style={{ padding: "40px", textAlign: "center" }}>結果を読み込み中...</div>;
  }

  // SNSシェア用のURL生成
  const displayTitle = result.gradeTitle.replace(' (実践シミュレータ)', '');
  const shareText = `ショートカットキー検定 ${displayTitle} を受験しました！\nスコア: ${result.score}点 (正答率: ${result.rate}%)\n結果: ${result.passed ? '合格' : '不合格'}\n\n`;
  
  // NOTE: process.env.NEXT_PUBLIC_BASE_URL MUST be set in production for this to work correctly when shared
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  const shareUrl = `${baseUrl}/share?grade=${result.gradeId || '3kyu'}&gradeTitle=${encodeURIComponent(displayTitle)}&score=${result.score}&rate=${result.rate}&passed=${result.passed}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent('ショートカットキー検定')}`;

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
            不正解だった問題と正しい解答、および詳細な解説を確認できます。
          </p>
          
          {result.score === result.total ? (
            <div style={{ padding: "24px", border: "1px solid var(--success)", backgroundColor: "var(--success-bg)", color: "var(--success)", textAlign: "center", fontWeight: 700 }}>
              全問正解です！素晴らしい成績です。
            </div>
          ) : result.wrongAnswers && result.wrongAnswers.length > 0 ? (
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
                  {wrongObj.explanation && (
                    <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed var(--border-light)", fontSize: "13px", color: "var(--text-muted)", whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                      <strong>【解説】</strong><br/>
                      {wrongObj.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "24px", border: "1px solid var(--warning)", backgroundColor: "var(--warning-bg, #fff8e1)", color: "#b27b00", textAlign: "center", fontWeight: 700 }}>
              未解答の問題がありました。（間違えた問題のデータがありません）
            </div>
          )}
        </div>

        {result.passed && certData && (
          <div className="certificate-section" style={{ marginTop: "48px" }}>
            <div className="certificate-title">合格証書 (IBT)</div>
            
            <div style={{ marginTop: "16px", marginBottom: "24px" }}>
              <button className="btn btn-primary" onClick={handleDownloadPDF} style={{ padding: "12px 32px" }}>
                PDFで保存・印刷する
              </button>
            </div>
            
            {/* キャンバス版の合格証書（高画質でプレビュー＆印刷対応） */}
            <div style={{ marginTop: "24px", maxWidth: "100%", textAlign: "center" }}>
              <canvas 
                id="resultCertCanvas" 
                ref={canvasRef} 
                style={{ width: "100%", maxWidth: "800px", height: "auto", aspectRatio: "1.414 / 1", border: "1px solid var(--border-color)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
              ></canvas>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "8px" }}>
              ※証書番号: {result.certNo}
            </p>
          </div>
        )}

        <div style={{ marginTop: "40px", textAlign: "center", display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <a 
            href={twitterShareUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn"
            style={{ backgroundColor: "#000", color: "#fff", padding: "12px 32px", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
            Xでシェアする
          </a>
          <Link href="/" className="btn btn-secondary" style={{ padding: "12px 32px" }}>
            トップへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
