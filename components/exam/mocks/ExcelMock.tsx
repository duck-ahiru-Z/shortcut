import styles from "./Mocks.module.css";

export default function ExcelMock() {
  return (
    <div className={styles.excelContainer}>
      <div className={styles.excelHeader}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
        スプレッドシート
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
