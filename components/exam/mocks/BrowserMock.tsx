import styles from "./BrowserMock.module.css";

type Props = { os?: "windows" | "mac"; isSuccess?: boolean; };
export default function BrowserMock({ os = "windows", isSuccess }: Props) {
  return (
    <div className={styles.browserContainer}>
      <div className={styles.browserHeader}>
        {os === "mac" ? (
          <>
            <div className={styles.browserDotRed}></div>
            <div className={styles.browserDotYellow}></div>
            <div className={styles.browserDotGreen}></div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '8px', paddingRight: '12px' }}>
             <div style={{ width: '12px', height: '2px', backgroundColor: '#888', alignSelf: 'center' }} />
             <div style={{ width: '10px', height: '10px', border: '1px solid #888', alignSelf: 'center' }} />
             <div style={{ fontSize: '12px', color: '#888', alignSelf: 'center', lineHeight: 1 }}>✕</div>
          </div>
        )}
        <div className={styles.browserAddress}>
          https://example.com
        </div>
      </div>
      <div className={styles.browserBody}>
        指示されたキーを入力...
      </div>
    
        {isSuccess && <div className={styles.successToast}>実行しました！</div>}
      </div>
  );
}
