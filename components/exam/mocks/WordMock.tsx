import styles from "./Mocks.module.css";

export default function WordMock() {
  return (
    <div className={styles.wordContainer}>
      <div className={styles.wordHeader}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M4 4h16v16H4z"></path>
        </svg>
        文書
      </div>
      <div className={styles.wordBody}>
        <div className={styles.wordPage}>
           指示されたキーを入力...
        </div>
      </div>
    </div>
  );
}
