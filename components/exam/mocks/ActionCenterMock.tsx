import styles from "./ActionCenterMock.module.css";

type Props = { os?: "windows" | "mac"; isSuccess?: boolean; };
export default function ActionCenterMock({ os = "windows", isSuccess }: Props) {
  return (
    <div className={styles.acContainer}>
      <div className={styles.acHeader}>
        <span>アクションセンター</span>
        <span style={{ color: '#0078d7', cursor: 'pointer' }}>すべてクリア</span>
      </div>
      <div style={{ flex: 1, fontSize: '13px', color: '#ccc' }}>
        新しい通知はありません。
        <div style={{ marginTop: '20px', color: '#fff', fontSize: '14px' }}>
          指示されたキーを入力...
        </div>
      </div>
      <div className={styles.acButtons}>
        <div className={`${styles.acBtn} ${styles.acBtnActive}`}>
          <div style={{ fontSize: '20px' }}>📶</div>
          <div style={{ fontSize: '10px', marginTop: '4px' }}>Wi-Fi</div>
        </div>
        <div className={`${styles.acBtn} ${styles.acBtnActive}`}>
          <div style={{ fontSize: '20px' }}>🦷</div>
          <div style={{ fontSize: '10px', marginTop: '4px' }}>Bluetooth</div>
        </div>
        <div className={styles.acBtn}>
          <div style={{ fontSize: '20px' }}>✈️</div>
          <div style={{ fontSize: '10px', marginTop: '4px' }}>機内モード</div>
        </div>
        <div className={styles.acBtn}>
          <div style={{ fontSize: '20px' }}>🌙</div>
          <div style={{ fontSize: '10px', marginTop: '4px' }}>集中モード</div>
        </div>
        <div className={styles.acBtn}>
          <div style={{ fontSize: '20px' }}>🔋</div>
          <div style={{ fontSize: '10px', marginTop: '4px' }}>バッテリー</div>
        </div>
        <div className={styles.acBtn}>
          <div style={{ fontSize: '20px' }}>⚙️</div>
          <div style={{ fontSize: '10px', marginTop: '4px' }}>すべての設定</div>
        </div>
      </div>
    
        {isSuccess && <div className={styles.successToast}>実行しました！</div>}
      </div>
  );
}
