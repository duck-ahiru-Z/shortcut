import { DEFAULT_GRADE_ID } from '@/config/grades';
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GradeResult, WrongAnswerInfo } from "@/actions/exam";
import { CertificateData } from "@/lib/certificate";
import ExamResultReview from "@/components/exam/ExamResultReview";
import ExamCertificate from "@/components/exam/ExamCertificate";

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

  if (!result) {
    return <div style={{ padding: "40px", textAlign: "center" }}>結果を読み込み中...</div>;
  }

  // SNSシェア用のURL生成
  const displayTitle = result.gradeTitle.replace(' (実践シミュレータ)', '');
  const shareText = `ショートカットキー検定 ${displayTitle} を受験しました！\nスコア: ${result.score}点 (正答率: ${result.rate}%)\n結果: ${result.passed ? '合格' : '不合格'}\n\n`;
  
  // NOTE: process.env.NEXT_PUBLIC_BASE_URL MUST be set in production for this to work correctly when shared
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  const shareUrl = `${baseUrl}/share?grade=${result.gradeId || DEFAULT_GRADE_ID}&gradeTitle=${encodeURIComponent(displayTitle)}&score=${result.score}&rate=${result.rate}&passed=${result.passed}`;
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

        <ExamResultReview 
          score={result.score} 
          total={result.total} 
          wrongAnswers={result.wrongAnswers || []} 
        />

        {result.passed && certData && (
          <ExamCertificate certData={certData} certNo={result.certNo || "IBT-0000"} />
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
