import styles from "./Mocks.module.css";

export default function BrowserMock() {
  return (
    <div className={styles.browserContainer}>
      <div className={styles.browserHeader}>
        <div className={styles.browserDotRed}></div>
        <div className={styles.browserDotYellow}></div>
        <div className={styles.browserDotGreen}></div>
        <div className={styles.browserAddress}>
          https://example.com
        </div>
      </div>
      <div className={styles.browserBody}>
        指示されたキーを入力...
      </div>
    </div>
  );
}
