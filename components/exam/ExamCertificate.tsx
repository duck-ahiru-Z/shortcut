import React, { useEffect, useRef } from "react";
import { CertificateApp, CertificateData } from "@/lib/certificate";

type Props = {
  certData: CertificateData;
  certNo: string;
};

export default function ExamCertificate({ certData, certNo }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (certData && canvasRef.current) {
      CertificateApp.generate(canvasRef.current, certData);
    }
  }, [certData]);

  const handleDownloadPDF = () => {
    // 印刷ダイアログを呼び出し、ブラウザの機能でベクターPDFとして保存させる
    window.print();
  };

  return (
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
        ※証書番号: {certNo}
      </p>
    </div>
  );
}
