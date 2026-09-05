import React, { useEffect, useState } from "react";
import styles from "./ExamPreScreen.module.css";

type Props = {
  agreed: boolean;
  setAgreed: (v: boolean) => void;
  lastName: string;
  setLastName: (v: string) => void;
  firstName: string;
  setFirstName: (v: string) => void;
  isLoading: boolean;
  onStart: () => void | Promise<void>;
};

export default function ExamPreScreen({
  agreed, setAgreed,
  lastName, setLastName,
  firstName, setFirstName,
  isLoading, onStart
}: Props) {
  const canStart = agreed && !isLoading && lastName.trim() !== "" && firstName.trim() !== "";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the device primarily uses touch (coarse pointer) or has a narrow screen
    const checkMobile = () => {
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const isNarrow = window.innerWidth <= 768;
      setIsMobile(isTouch || isNarrow);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={`card ${styles.container}`}>
      <h2 className="section-title">受験開始の確認</h2>
      
      {isMobile && (
        <div className={styles.warningBox}>
          <strong>【重要】PC環境での受験を推奨します</strong>
          <p className={styles.warningText}>
            本試験（特に実技シミュレーター）は、物理的なキーボード操作が必須となります。スマートフォン等のタッチデバイスでは正常に解答できない可能性があるため、PC環境での受験をお願いいたします。
          </p>
        </div>
      )}

      <p className={styles.instructionText}>
        準備ができたら以下の項目を入力・確認して、試験を開始してください。
      </p>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          受験者氏名 (合格証書に記載されます)
        </label>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="姓"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="名"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.agreementGroup}>
        <label className={styles.checkboxLabel}>
          <input 
            type="checkbox" 
            checked={agreed} 
            onChange={e => setAgreed(e.target.checked)} 
            className={styles.checkbox}
          />
          <span>
            【利用規約・不正行為への同意】<br />
            試験中の別タブへの切り替え、検索、開発者ツールの使用などの不正行為を行わないことに同意します。（不正な操作は記録されます）<br />
            <span style={{ color: '#d97706', fontWeight: 'bold' }}>※試験開始時に自動的にフルスクリーンになり、誤操作防止のためブラウザのショートカット機能が一時的にロックされます。（Escキー長押しで解除可能）</span>
          </span>
        </label>
      </div>

      <button 
        className={`btn ${canStart ? 'btn-primary' : 'btn-disabled'} ${styles.startButton}`} 
        onClick={async () => {
          // Start loading the exam immediately. Browser security APIs below are
          // best-effort and must not prevent the exam request from running.
          const startPromise = onStart();
          try {
            if (document.documentElement.requestFullscreen) {
              await document.documentElement.requestFullscreen();
            }
            if ('keyboard' in navigator && typeof (navigator as any).keyboard.lock === 'function') {
              // Lock only dangerous browser keys (Ctrl+W, Ctrl+T, Ctrl+N, Ctrl+R), allow Ctrl+F
              await (navigator as any).keyboard.lock(['KeyW', 'KeyT', 'KeyN', 'KeyR']);
            }
          } catch (e) {
            console.warn("Fullscreen or Keyboard Lock failed", e);
          }
          await startPromise;
        }}
        disabled={!canStart}
      >
        {isLoading ? '準備中...' : '試験を開始する'}
      </button>
    </div>
  );
}
