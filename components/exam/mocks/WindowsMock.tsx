import styles from "./Mocks.module.css";

export default function WindowsMock() {
  return (
    <div className={styles.windowsContainer}>
      <div className={styles.windowsBody}>
         <div className={styles.windowsPromptBox}>
           指示されたキーを入力...
         </div>
      </div>
      <div className={styles.windowsTaskbar}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#00a4ef">
          <rect x="2" y="2" width="9" height="9"></rect>
          <rect x="13" y="2" width="9" height="9"></rect>
          <rect x="2" y="13" width="9" height="9"></rect>
          <rect x="13" y="13" width="9" height="9"></rect>
        </svg>
        <div className={styles.windowsTaskbarIcon}></div>
        <div className={styles.windowsTaskbarIcon}></div>
      </div>
    </div>
  );
}
