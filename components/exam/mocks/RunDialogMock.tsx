import styles from "./RunDialogMock.module.css";

type Props = { os?: "windows" | "mac"; isSuccess?: boolean; };
export default function RunDialogMock({ os = "windows", isSuccess }: Props) {
  return (
    <div className={styles.runContainer}>
      <div className={styles.runHeader}>
        <span>ファイル名を指定して実行</span>
        <span style={{ cursor: 'pointer' }}>✕</span>
      </div>
      <div className={styles.runBody}>
        <div className={styles.runIconRow}>
          <div className={styles.runIcon}>🏃</div>
          <div>実行するプログラム名、または開くフォルダーやドキュメント名、インターネット リソース名を入力してください。</div>
        </div>
        <div className={styles.runInputRow}>
          <label>名前(O):</label>
          <div className={styles.runInput}>
            指示されたキーを入力...
          </div>
        </div>
        <div className={styles.runButtons}>
          <div className={styles.runBtn} style={{ border: '1px solid #0078d7', backgroundColor: '#e1f0fa' }}>OK</div>
          <div className={styles.runBtn}>キャンセル</div>
          <div className={styles.runBtn}>参照(B)...</div>
        </div>
      </div>
    
        {isSuccess && <div className={styles.successToast}>実行しました！</div>}
      </div>
  );
}
