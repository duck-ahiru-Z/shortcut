import WindowControls from "./WindowControls";
import styles from "./BrowserMock.module.css";
import { getBrowserContent } from "./mockDataHelpers";

type Props = { os?: "windows" | "mac"; isSuccess?: boolean; q?: any; };
export default function BrowserMock({ os = "windows", isSuccess, q }: Props) {
  const content = getBrowserContent(q?.question || "");
  return (
    <div className={styles.browserContainer}>
      <div className={styles.browserHeader}>
        {os === "mac" && <WindowControls os={os} />}
        <div className={styles.browserTabs} style={{ display: "flex", gap: "8px", marginLeft: "16px" }}>
          <div className={styles.browserTabActive} style={{ backgroundColor: "#fff", padding: "4px 12px", borderRadius: "8px 8px 0 0", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
             <div style={{ flex: 1 }}>{content.title}</div>
             <div style={{ color: '#888' }}>✕</div>
          </div>
          {(q?.question || "").includes("複製") && isSuccess && (
            <div className={styles.browserTabActive} style={{ backgroundColor: "#fff", padding: "4px 12px", borderRadius: "8px 8px 0 0", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
               <div style={{ flex: 1 }}>{content.title}</div>
               <div style={{ color: '#888' }}>✕</div>
            </div>
          )}
        </div>
        <div className={styles.browserAddress} style={(q?.question || "").includes("URL") && isSuccess ? { backgroundColor: "#cce5ff", color: "#000" } : {}}>
          {content.url}
        </div>
        {os === "windows" && <WindowControls os={os} />}
      </div>
      <div className={styles.browserBody} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "#fff", color: "#333", height: "100%" }}>
        <h1 style={{ margin: 0, fontSize: "24px" }}>{content.h1}</h1>
        <p style={{ margin: 0, color: "#555", lineHeight: "1.6" }}>{content.p}</p>
        
        {(q?.question || "").includes("開発者ツール") || (q?.question || "").includes("エラーを確認") && isSuccess && (
          <div style={{ marginTop: "auto", height: "150px", borderTop: "1px solid #ccc", backgroundColor: "#f3f3f3", padding: "8px", fontFamily: "monospace", fontSize: "12px", color: "#d32f2f" }}>
            Uncaught TypeError: Cannot read properties of undefined (reading 'map')<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;at renderList (app.js:42)
          </div>
        )}
      </div>
      {isSuccess && !(q?.question || "").includes("開発者ツール") || (q?.question || "").includes("エラーを確認") && <div className={styles.successToast}>実行しました！</div>}
    </div>
  );
}
