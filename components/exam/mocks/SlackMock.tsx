import WindowControls from "./WindowControls";
import styles from "./SlackMock.module.css";

type Props = { os?: "windows" | "mac"; isSuccess?: boolean; };
export default function SlackMock({ os = "windows", isSuccess }: Props) {
  return (
    <div className={styles.slackContainer}>
      <div className={styles.slackHeader}>
        {os === "mac" && <WindowControls os={os} />}
        <div className={styles.slackSearch}>🔍 検索...</div>
        {os === "windows" && <WindowControls os={os} />}
      </div>
      <div className={styles.slackBody}>
        <div className={styles.slackSidebar}>
          <div className={styles.slackChannelActive}># general</div>
          <div className={styles.slackChannel}># random</div>
          <div className={styles.slackChannel}># project-a</div>
        </div>
        <div className={styles.slackMain}>
          <div className={styles.slackMessages}>
            <div className={styles.slackMessage}>
              <strong>User A</strong> <span className={styles.slackTime}>10:00</span>
              <p>よろしくお願いします！</p>
            </div>
            <div className={styles.slackMessage}>
              <strong>User B</strong> <span className={styles.slackTime}>10:05</span>
              <p>指示されたキーを入力...</p>
            </div>
          </div>
          <div className={styles.slackInputBox}>
            メッセージを送信
          </div>
        </div>
      </div>
    
        {isSuccess && <div className={styles.successToast}>実行しました！</div>}
      </div>
  );
}
