import WindowControls from "./WindowControls";
import styles from "./ExplorerMock.module.css";

type Props = { os?: "windows" | "mac"; isSuccess?: boolean; q?: any; };
export default function ExplorerMock({ os = "windows", isSuccess, q }: Props) {
  const question = q?.question || "";
  
  const isNewFolder = question.includes("新しいフォルダ");
  const isRename = (question.includes("名前を変更") || question.includes("ファイル名を")) && !question.includes("コピー");
  const isCopy = question.includes("コピー");
  const isUndo = question.includes("間違えて閉じてしまったフォルダ");

  const isFileSelected = isRename || isCopy || question.includes("選択中のファイル");

  return (
    <div className={styles.explorerContainer}>
      <div className={styles.explorerHeader}>
        {os === "mac" && <WindowControls os={os} />}
        {os === "windows" && <svg style={{ marginLeft: "12px" }} width="18" height="18" viewBox="0 0 24 24" fill="#f3d32a"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path></svg>}
        <span className={styles.explorerTitle}>{os === "mac" ? "Finder" : "PC > ドキュメント"}</span>
        {os === "windows" && <WindowControls os={os} />}
      </div>
      
      <div style={{ padding: "8px", borderBottom: "1px solid #ccc", display: "flex", gap: "8px", backgroundColor: os === "mac" ? "#ececec" : "#f9f9f9" }}>
        <div style={{ color: "#666" }}>←</div>
        <div style={{ color: "#666" }}>→</div>
        <div style={{ color: "#666" }}>↑</div>
        <div style={{ flex: 1, backgroundColor: "#fff", border: "1px solid #ccc", padding: "2px 8px", fontSize: "12px" }}>
          {os === "mac" ? "Macintosh HD / ユーザ / 書類 / Projects" : "C:\\Users\\Documents\\Projects"}
        </div>
        <div style={{ width: "150px", backgroundColor: "#fff", border: "1px solid #ccc", padding: "2px 8px", fontSize: "12px", color: "#888" }}>
          検索
        </div>
      </div>

      <div className={styles.explorerBody} style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div className={styles.explorerSidebar} style={{ width: "150px", borderRight: "1px solid #ddd", padding: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ height: "20px", backgroundColor: "#eee", borderRadius: "4px" }}></div>
          <div style={{ height: "20px", backgroundColor: "#eee", borderRadius: "4px" }}></div>
          <div style={{ height: "20px", backgroundColor: "#eee", borderRadius: "4px" }}></div>
        </div>
        <div className={styles.explorerMain} style={{ flex: 1, padding: "16px", display: "flex", flexWrap: "wrap", gap: "16px", alignContent: "flex-start", backgroundColor: "#fff" }}>
          
          <div style={{ width: "80px", textAlign: "center" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill={os === "mac" ? "#54aeff" : "#f3d32a"}><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path></svg>
            <div style={{ fontSize: "12px", marginTop: "4px" }}>src</div>
          </div>
          
          <div style={{ width: "80px", textAlign: "center", backgroundColor: (isFileSelected && !isSuccess) || (isCopy && isSuccess) ? "#cce5ff" : "transparent", padding: "4px", borderRadius: "4px" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#ccc"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path></svg>
            {isRename && isSuccess ? (
              <input type="text" defaultValue="report_v2.txt" autoFocus style={{ width: "100%", fontSize: "12px", textAlign: "center", border: "1px solid #0b57d0" }} />
            ) : (
              <div style={{ fontSize: "12px", marginTop: "4px" }}>report.txt</div>
            )}
          </div>
          
          {isNewFolder && isSuccess && (
            <div style={{ width: "80px", textAlign: "center", padding: "4px", backgroundColor: "#e3f2fd", borderRadius: "4px" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill={os === "mac" ? "#54aeff" : "#f3d32a"}><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path></svg>
              <input type="text" defaultValue={os === "mac" ? "名称未設定フォルダ" : "新しいフォルダー"} autoFocus style={{ width: "100%", fontSize: "12px", textAlign: "center", border: "1px solid #0b57d0" }} />
            </div>
          )}
          
        </div>
      </div>
    
      {isSuccess && (
        <div className={styles.successToast}>
          {isCopy ? "コピーしました！" : "実行しました！"}
        </div>
      )}
    </div>
  );
}
