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

import styles from "./AdminResultDetailModal.module.css";

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
    const namePart = selectedResult.lastName || selectedResult.firstName ? `${selectedResult.lastName}_${selectedResult.firstName}` : "anonymous";
    doc.save(`${namePart}_${safeGradeName}.pdf`);
  };

  if (!selectedResult) return null;

  return (
    <div className={styles.overlay}>
      <div className={`card ${styles.modalContent}`}>
        <button 
          onClick={onClose}
          className={styles.closeButton}
        >
          ×
        </button>
        
        <h2 className={`section-title ${styles.title}`}>
          受験詳細: {selectedResult.lastName || selectedResult.firstName ? `${selectedResult.lastName} ${selectedResult.firstName}` : "匿名"}
        </h2>
        
        <div className={styles.statsGrid}>
          <div className={styles.statsBox}>
            <p><strong>スコア:</strong> <span className={selectedResult.passed ? styles.successText : styles.dangerText}>{selectedResult.score} / {selectedResult.total} ({selectedResult.rate}%) - {selectedResult.passed ? '合格' : '不合格'}</span></p>
            <p><strong>受験日時:</strong> {new Date(selectedResult.timestamp).toLocaleString("ja-JP")}</p>
            <p><strong>所要時間:</strong> {Math.floor(selectedResult.timeTakenSec / 60)}分{(selectedResult.timeTakenSec % 60).toString().padStart(2, '0')}秒</p>
          </div>
          <div className={styles.statsBox}>
            <p><strong>端末ID:</strong> <span className={styles.deviceIdText}>{selectedResult.deviceId}</span></p>
            <p><strong>タブ切替回数:</strong> <span className={selectedResult.tabSwitches > 0 ? styles.dangerText : ""}>{selectedResult.tabSwitches}回</span></p>
            <p><strong>タイマー違反:</strong> <span className={selectedResult.timerViolated ? styles.dangerText : ""}>{selectedResult.timerViolated ? "あり (超過)" : "なし"}</span></p>
          </div>
        </div>

        {selectedResult.passed && (
          <div className={styles.certPreviewSection}>
            <h3 className={styles.sectionHeading}>合格証書プレビュー</h3>
            <div className={`certificate-preview-container ${styles.certPreviewContainer}`}>
              <canvas id="adminCertCanvas" ref={canvasRef} className={styles.certCanvas}></canvas>
            </div>
            <button onClick={handleDownloadPDF} className="btn btn-primary">PDFでダウンロード</button>
          </div>
        )}

        <div>
          <h3 className={styles.sectionHeading}>間違えた問題一覧</h3>
          {selectedResult.wrongAnswers && selectedResult.wrongAnswers.length > 0 ? (
            <div className={styles.wrongAnswersList}>
              {selectedResult.wrongAnswers.map((w, i) => (
                <div key={i} className={styles.wrongAnswerItem}>
                  <p className={styles.questionText}>Q. {w.question}</p>
                  <p><span className={styles.userAnswerMark}>✖ ユーザーの解答:</span> {w.userAnswer}</p>
                  <p><span className={styles.correctAnswerMark}>〇 正解:</span> {w.correctAnswer}</p>
                  {w.explanation && (
                    <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed var(--border-light)", fontSize: "13px", color: "var(--text-muted)", whiteSpace: "pre-wrap" }}>
                      <strong>【解説】</strong><br/>
                      {w.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyMessage}>
              {selectedResult.wrongAnswers ? "全問正解です" : "詳細データが記録されていません（アップデート前の受験データ等）"}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
