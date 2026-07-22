import React, { useRef, useEffect } from "react";
import { CertificateApp, CertificateData } from "@/lib/certificate";
import jsPDF from "jspdf";
import { WrongAnswerInfo } from "@/actions/exam";

type ResultRecord = {
  id: string;
  grade: string;
  deviceId: string;
  lastName: string;
  firstName: string;
  score: number;
  total: number;
  rate: number;
  passed: boolean;
  tabSwitches: number;
  timeTakenSec: number;
  timerViolated: boolean;
  timestamp: string;
  certNo: string | null;
  wrongAnswers?: WrongAnswerInfo[];
};

type Props = {
  selectedResult: ResultRecord | null;
  gradeName: string;
  onClose: () => void;
};

export default function AdminResultDetailModal({ selectedResult, gradeName, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate certificate on modal open if passed
  useEffect(() => {
    if (selectedResult && selectedResult.passed && canvasRef.current) {
      const date = new Date(selectedResult.timestamp);
      const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

      const certData: CertificateData = {
        score: selectedResult.score,
        rate: selectedResult.rate,
        certNo: selectedResult.certNo || "IBT-00000000-0000",
        dateStr,
        gradeTitle: gradeName,
        lastName: selectedResult.lastName,
        firstName: selectedResult.firstName,
      };

      CertificateApp.generate(canvasRef.current, certData);
    }
  }, [selectedResult, gradeName]);

  const handleDownloadPDF = () => {
    if (!canvasRef.current || !selectedResult) return;
    
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvasRef.current.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 0, 0, 297, 210);
    
    const safeGradeName = gradeName.replace(/\s+/g, '_');
    doc.save(`${selectedResult.lastName}_${selectedResult.firstName}_${safeGradeName}.pdf`);
  };

  if (!selectedResult) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: "rgba(0,0,0,0.6)", zIndex: 9999,
      display: "flex", justifyContent: "center", alignItems: "center", padding: "20px"
    }}>
      <div className="card" style={{ 
        width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", 
        position: "relative", backgroundColor: "var(--bg-primary)" 
      }}>
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "var(--text-muted)" }}
        >
          ×
        </button>
        
        <h2 className="section-title" style={{ fontSize: "20px", marginBottom: "24px" }}>
          受験詳細: {selectedResult.lastName} {selectedResult.firstName}
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px", fontSize: "14px" }}>
          <div style={{ padding: "12px", backgroundColor: "var(--bg-secondary)", borderRadius: "8px" }}>
            <p><strong>スコア:</strong> <span style={{ color: selectedResult.passed ? "var(--success)" : "var(--danger)", fontWeight: 700 }}>{selectedResult.score} / {selectedResult.total} ({selectedResult.rate}%) - {selectedResult.passed ? '合格' : '不合格'}</span></p>
            <p><strong>受験日時:</strong> {new Date(selectedResult.timestamp).toLocaleString("ja-JP")}</p>
            <p><strong>所要時間:</strong> {Math.floor(selectedResult.timeTakenSec / 60)}分{(selectedResult.timeTakenSec % 60).toString().padStart(2, '0')}秒</p>
          </div>
          <div style={{ padding: "12px", backgroundColor: "var(--bg-secondary)", borderRadius: "8px" }}>
            <p><strong>端末ID:</strong> <span style={{ fontSize: "11px", color: "var(--text-muted)", wordBreak: "break-all" }}>{selectedResult.deviceId}</span></p>
            <p><strong>タブ切替回数:</strong> <span style={{ color: selectedResult.tabSwitches > 0 ? "var(--danger)" : "inherit", fontWeight: 700 }}>{selectedResult.tabSwitches}回</span></p>
            <p><strong>タイマー違反:</strong> <span style={{ color: selectedResult.timerViolated ? "var(--danger)" : "inherit", fontWeight: 700 }}>{selectedResult.timerViolated ? "あり (超過)" : "なし"}</span></p>
          </div>
        </div>

        {selectedResult.passed && (
          <div style={{ marginBottom: "32px", padding: "16px", border: "1px solid var(--border-color)", borderRadius: "8px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "16px" }}>合格証書プレビュー</h3>
            <div className="certificate-preview-container" style={{ marginBottom: "16px", transform: "scale(0.8)", transformOrigin: "top left", height: "auto" }}>
              <canvas id="adminCertCanvas" ref={canvasRef} style={{ pointerEvents: "none" }}></canvas>
            </div>
            <button onClick={handleDownloadPDF} className="btn btn-primary">PDFでダウンロード</button>
          </div>
        )}

        <div>
          <h3 style={{ fontSize: "16px", marginBottom: "16px" }}>間違えた問題一覧</h3>
          {selectedResult.wrongAnswers && selectedResult.wrongAnswers.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {selectedResult.wrongAnswers.map((w, i) => (
                <div key={i} style={{ padding: "12px", border: "1px solid var(--border-light)", backgroundColor: "var(--bg-tertiary)", fontSize: "14px" }}>
                  <p style={{ fontWeight: 700, marginBottom: "8px" }}>Q. {w.question}</p>
                  <p><span style={{ color: "var(--danger)" }}>✖ ユーザーの解答:</span> {w.userAnswer}</p>
                  <p><span style={{ color: "var(--success)" }}>〇 正解:</span> {w.correctAnswer}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              {selectedResult.wrongAnswers ? "全問正解です" : "詳細データが記録されていません（アップデート前の受験データ等）"}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
