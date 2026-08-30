import WindowControls from "./WindowControls";
import styles from "./SlackMock.module.css";

type Props = { os?: "windows" | "mac"; isSuccess?: boolean; q?: any; };
export default function SlackMock({ os = "windows", isSuccess, q }: Props) {
  const question = q?.question || "";
  
  const isSearch = question.includes("探すのが大変") || question.includes("検索");
  const isUnread = question.includes("未読メッセージ") || question.includes("次の「未読");

  return (
    <div className={styles.slackContainer}>
      <div className={styles.slackHeader}>
        {os === "mac" && <WindowControls os={os} />}
        <div className={styles.slackSearch} style={isSearch && isSuccess ? { backgroundColor: "#fff", color: "#000", border: "2px solid #1164A3" } : {}}>
          🔍 {isSearch && isSuccess ? "何をお探しですか？|" : "検索..."}
        </div>
        {os === "windows" && <WindowControls os={os} />}
      </div>
      <div className={styles.slackBody}>
        <div className={styles.slackSidebar}>
          <div className={!isUnread || !isSuccess ? styles.slackChannelActive : styles.slackChannel}># general</div>
          <div className={styles.slackChannel}># random</div>
          <div className={styles.slackChannel} style={isUnread && !isSuccess ? { fontWeight: "bold", color: "#fff" } : {}}>
            # project-a {isUnread && !isSuccess && <span style={{ backgroundColor: "#cd201f", padding: "2px 6px", borderRadius: "10px", fontSize: "10px", marginLeft: "4px" }}>3</span>}
          </div>
          {isUnread && isSuccess && (
            <div className={styles.slackChannelActive}># project-a</div>
          )}
        </div>
        <div className={styles.slackMain}>
          <div className={styles.slackMessages}>
            <div className={styles.slackMessage}>
              <strong>User A</strong> <span className={styles.slackTime}>10:00</span>
              <p>よろしくお願いします！</p>
            </div>
            
            {isUnread && isSuccess ? (
              <>
                <div style={{ borderTop: "1px solid #cd201f", margin: "16px 0", position: "relative" }}>
                  <span style={{ position: "absolute", top: "-10px", right: "10px", backgroundColor: "#fff", color: "#cd201f", fontSize: "12px", padding: "0 4px" }}>ここから未読</span>
                </div>
                <div className={styles.slackMessage}>
                  <strong>User B</strong> <span className={styles.slackTime}>10:05</span>
                  <p>仕様書の修正完了しました。確認お願いします。</p>
                </div>
                <div className={styles.slackMessage}>
                  <strong>User C</strong> <span className={styles.slackTime}>10:12</span>
                  <p>LGTM!</p>
                </div>
              </>
            ) : (
              <div className={styles.slackMessage}>
                <strong>User B</strong> <span className={styles.slackTime}>10:05</span>
                <p>指定されたキーを入力してください...</p>
              </div>
            )}
            
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
