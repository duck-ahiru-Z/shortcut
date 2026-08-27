import { DEFAULT_GRADE_ID } from '@/config/grades';
"use client";

import React, { useEffect, useRef } from "react";
import { CertificateApp, CertificateData } from "@/lib/certificate";

const mockCerts: CertificateData[] = [
  {
    score: 50,
    rate: 100,
    certNo: "IBT-TEST-1000",
    dateStr: "2026年8月12日",
    gradeTitle: "1級 (プロフェッショナル)",
    lastName: "山田",
    firstName: "太郎",
    gradeId: "1kyu",
  },
  {
    score: 30,
    rate: 100,
    certNo: "IBT-TEST-1001",
    dateStr: "2026年8月12日",
    gradeTitle: "実務1級 (プロフェッショナル)",
    lastName: "山田",
    firstName: "太郎",
    gradeId: "practical-1kyu",
  },
  {
    score: 50,
    rate: 100,
    certNo: "IBT-TEST-2000",
    dateStr: "2026年8月12日",
    gradeTitle: "2級 (エキスパート)",
    lastName: "佐藤",
    firstName: "花子",
    gradeId: "2kyu",
  },
  {
    score: 30,
    rate: 100,
    certNo: "IBT-TEST-2001",
    dateStr: "2026年8月12日",
    gradeTitle: "実務2級 (エキスパート)",
    lastName: "佐藤",
    firstName: "花子",
    gradeId: "practical-2kyu",
  },
  {
    score: 50,
    rate: 100,
    certNo: "IBT-TEST-3000",
    dateStr: "2026年8月12日",
    gradeTitle: "3級 (スタンダード)",
    lastName: "鈴木",
    firstName: "一郎",
    gradeId: DEFAULT_GRADE_ID,
  },
  {
    score: 30,
    rate: 100,
    certNo: "IBT-TEST-3001",
    dateStr: "2026年8月12日",
    gradeTitle: "実務3級 (スタンダード)",
    lastName: "鈴木",
    firstName: "一郎",
    gradeId: "practical-3kyu",
  },
  {
    score: 50,
    rate: 100,
    certNo: "IBT-TEST-5000",
    dateStr: "2026年8月12日",
    gradeTitle: "5級 (ビギナー)",
    lastName: "高橋",
    firstName: "次郎",
    gradeId: "5kyu",
  },
];

function CertPreview({ data }: { data: CertificateData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      CertificateApp.generate(canvasRef.current, data);
    }
  }, [data]);

  return (
    <div style={{ marginBottom: "40px", border: "1px solid #ccc", padding: "20px", borderRadius: "8px", background: "#f8f9fa" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px", color: "#333" }}>{data.gradeTitle}</h2>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          maxWidth: "800px",
          height: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: "4px"
        }}
      />
    </div>
  );
}

export default function CertPreviewPage() {
  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "32px", color: "#111" }}>証書デザイン一覧プレビュー</h1>
      <p style={{ marginBottom: "32px", color: "#666" }}>各級および実務・知識別の合格証書デザインを一覧で確認できる仮ページです。</p>
      
      {mockCerts.map((cert) => (
        <CertPreview key={cert.certNo} data={cert} />
      ))}
    </div>
  );
}
