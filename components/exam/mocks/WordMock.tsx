import styles from "./WordMock.module.css";

type Props = {
  os?: "windows" | "mac";
  isSuccess?: boolean;
};

export default function WordMock({ os = "windows", isSuccess }: Props) {
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
        <textarea 
          className={styles.wordPage} 
          defaultValue={`議事録

1. 挨拶
2. 前回の振り返り
3. 今後の課題

以上`}
          spellCheck={false}
        />
        {isSuccess && (
          <div className={styles.successToast}>
            実行しました！
          </div>
        )}
      </div>
    </div>
  );
}
