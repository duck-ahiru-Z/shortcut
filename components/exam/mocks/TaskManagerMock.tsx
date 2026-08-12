import styles from "./TaskManagerMock.module.css";

type Props = { os?: "windows" | "mac"; isSuccess?: boolean; };
export default function TaskManagerMock({ os = "windows", isSuccess }: Props) {
  return (
    <div className={styles.tmContainer}>
      <div className={styles.tmHeader}>
        タスクマネージャー
      </div>
      <div className={styles.tmTabs}>
        <div className={styles.tmTabActive}>プロセス</div>
        <div className={styles.tmTab}>パフォーマンス</div>
        <div className={styles.tmTab}>アプリの履歴</div>
        <div className={styles.tmTab}>スタートアップ</div>
      </div>
      <div className={styles.tmBody}>
        <table className={styles.tmTable}>
          <thead>
            <tr>
              <th>名前</th>
              <th>状態</th>
              <th>CPU</th>
              <th>メモリ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>📄 Google Chrome (15)</td>
              <td></td>
              <td>1.2%</td>
              <td>850 MB</td>
            </tr>
            <tr>
              <td>📊 Microsoft Excel</td>
              <td>応答なし</td>
              <td>0.0%</td>
              <td>210 MB</td>
            </tr>
            <tr>
              <td>📝 メモ帳</td>
              <td></td>
              <td>0.0%</td>
              <td>15 MB</td>
            </tr>
            <tr>
              <td>指示されたキーを入力...</td>
              <td></td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    
        {isSuccess && <div className={styles.successToast}>実行しました！</div>}
      </div>
  );
}
