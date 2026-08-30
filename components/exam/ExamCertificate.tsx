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
    <div className="certificate-section mt-12">
      <div className="certificate-title">合格証書 (IBT)</div>
      
      <div className="mt-4 mb-6">
        <button className="btn btn-primary px-8 py-3" onClick={handleDownloadPDF}>
          PDFで保存・印刷する
        </button>
      </div>
      
      {/* キャンバス版・合格証書（高画質でプレビュー・印刷対応）*/}
      <div className="mt-6 w-full text-center" style={{ width: "100%", textAlign: "center" }}>
        <canvas 
          id="resultCertCanvas" 
          ref={canvasRef} 
          style={{ width: "100%", maxWidth: "800px", height: "auto", border: "1px solid #ccc", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", margin: "0 auto" }}
        ></canvas>
      </div>
      <p className="text-[13px] text-[var(--text-muted)] mt-2">
        ※証書番号: {certNo}
      </p>
    </div>
  );
}
