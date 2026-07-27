import styles from "./Mocks.module.css";

export default function WordMock({ os = "windows" }: { os?: "windows" | "mac" }) {
  return (
    <div className={styles.wordContainer}>
      <div className={styles.wordHeader}>
        {os === "mac" ? (
          <div style={{ display: 'flex', gap: '6px', marginRight: '16px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
          </div>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M4 4h16v16H4z"></path>
          </svg>
        )}
        {os === "mac" ? "Pages / Word" : "文書"}
      </div>
      <div className={styles.wordBody}>
        <div className={styles.wordPage}>
           指示されたキーを入力...
        </div>
      </div>
    </div>
  );
}
