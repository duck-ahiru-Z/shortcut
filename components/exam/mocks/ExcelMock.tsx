import styles from "./Mocks.module.css";

export default function ExcelMock({ os = "windows" }: { os?: "windows" | "mac" }) {
  return (
    <div className={styles.excelContainer}>
      <div className={styles.excelHeader}>
        {os === "mac" ? (
          <div style={{ display: 'flex', gap: '6px', marginRight: '16px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
          </div>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
        )}
        {os === "mac" ? "Numbers / Excel" : "スプレッドシート"}
      </div>
      <div className={styles.excelBody}>
        <div className={styles.excelBodyInner}>
           <div className={styles.promptBox}>
             指示されたキーを入力...
           </div>
        </div>
      </div>
    </div>
  );
}
