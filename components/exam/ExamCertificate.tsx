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
      
      {/* キャンバス版の合格証書（高画質でプレビュー＆印刷対応） */}
      <div className="mt-6 w-full text-center">
        <canvas 
          id="resultCertCanvas" 
          ref={canvasRef} 
          className="w-full max-w-[800px] h-auto aspect-[1.414/1] border border-[var(--border-color)] shadow-md"
        ></canvas>
      </div>
      <p className="text-[13px] text-[var(--text-muted)] mt-2">
        ※証書番号: {certNo}
      </p>
    </div>
  );
}
