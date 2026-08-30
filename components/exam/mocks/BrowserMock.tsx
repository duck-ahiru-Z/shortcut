import { useMemo } from "react";
import WindowControls from "./WindowControls";
import styles from "./BrowserMock.module.css";
import { getBrowserContent } from "./mockDataHelpers";

type Props = { 
  os?: "windows" | "mac"; 
  isSuccess?: boolean; 
  q?: any; 
  inputValue?: string; 
  setInputValue?: (val: string) => void; 
  handleInputKeyDown?: (e: any) => void; 
  handleInputSubmit?: () => void; 
};

export default function BrowserMock({ os = "windows", isSuccess, q, inputValue = "", setInputValue, handleInputKeyDown, handleInputSubmit }: Props) {
  const question = q?.question || "";
  const content = getBrowserContent(question);
  
  const isDuplicate = question.includes("複製");
  const isCloseTab = question.includes("現在のタブを閉じ");
  const isNewTab = question.includes("新しいタブ");
  const isAddressBar = question.includes("アドレスバー") || question.includes("URL");
  const isDevTools = question.includes("開発者ツール") || question.includes("エラーを確認") || question.includes("レイアウト崩れ");
  const isRestoreTab = question.includes("復元");
  const isBookmark = question.includes("ブックマーク");
  const isReload = question.includes("リロード") || question.includes("再読み込み");
  const isPrivate = question.includes("シークレット");
  
  // Specific legacy types checking
  const isFindPassword = question.includes("検索し、その直後に書かれている") || question.includes("パスワード");
  const isPrint = question.includes("印刷");

  const addressBarStyle = isAddressBar && isSuccess 
    ? { backgroundColor: "#cce5ff", color: "#000" } 
    : {};

  const mainContainerStyle: any = {
    padding: "20px", display: "flex", flexDirection: "column", gap: "16px", backgroundColor: isPrivate ? "#333" : "#fff", color: isPrivate ? "#ddd" : "#333", height: "100%", position: "relative"
  };

  const findPasswordContent = useMemo(() => {
    if (!isFindPassword) return null;
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let prefix = "";
    let suffix = "";
    for(let i=0; i<8000; i++) {
      prefix += chars.charAt(Math.floor(Math.random() * chars.length));
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return { prefix, suffix };
  }, [isFindPassword]);

  return (
    <div className={styles.browserContainer}>
      <div className={styles.browserHeader} style={{ backgroundColor: isPrivate ? "#222" : "#f1f3f4" }}>
        {os === "mac" && <WindowControls os={os} />}
        
        <div className={styles.browserTabs} style={{ display: "flex", gap: "8px", marginLeft: "16px", alignItems: "flex-end", flex: 1, paddingTop: "8px" }}>
          {!(isSuccess && isCloseTab) && (
            <div className={styles.browserTabActive} style={{ backgroundColor: isPrivate ? "#333" : "#fff", color: isPrivate ? "#fff" : "#000", padding: "8px 12px", borderRadius: "8px 8px 0 0", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px", minWidth: "150px" }}>
               <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{isFindPassword ? "パスワード検索" : content.title}</div>
               <div style={{ color: '#888', cursor: 'pointer' }}>×</div>
            </div>
          )}
          
          {(isSuccess && (isDuplicate || isNewTab || isRestoreTab)) && (
            <div className={styles.browserTabActive} style={{ backgroundColor: isPrivate ? "#333" : "#fff", color: isPrivate ? "#fff" : "#000", padding: "8px 12px", borderRadius: "8px 8px 0 0", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px", minWidth: "150px" }}>
               <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                 {isNewTab ? "新しいタブ" : content.title}
               </div>
               <div style={{ color: '#888', cursor: 'pointer' }}>×</div>
            </div>
          )}
        </div>
        
        {os === "windows" && <WindowControls os={os} />}
      </div>
      
      <div style={{ backgroundColor: isPrivate ? "#333" : "#fff", padding: "8px", display: "flex", gap: "8px", alignItems: "center", borderBottom: "1px solid #ccc" }}>
        <div style={{ color: isReload && isSuccess ? "#0b57d0" : "#666" }}>↻</div>
        <div className={styles.browserAddress} style={{ ...addressBarStyle, flex: 1, padding: "4px 12px", borderRadius: "16px", border: "1px solid #ddd", fontSize: "12px" }}>
          {isNewTab && isSuccess ? "" : (isFindPassword ? "https://example.com/password-list" : content.url)}
        </div>
        {isBookmark && (
          <div style={{ color: isSuccess ? "#f4b400" : "#ccc", fontSize: "16px" }}>★</div>
        )}
      </div>

      <div className={styles.browserBody} style={mainContainerStyle}>
        {isReload && isSuccess ? (
          <div style={{ margin: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", color: "#666" }}>
            <div style={{ fontSize: "32px", animation: "spin 1s linear infinite" }}>↻</div>
            <div style={{ fontSize: "18px" }}>ページを再読み込みしています...</div>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : isFindPassword ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', gap: '12px' }}>
            <div style={{ flex: 1, overflowY: "auto", fontSize: "14px", lineHeight: "1.6", color: "#333", wordBreak: "break-all", fontFamily: "monospace", border: "1px solid #ddd", padding: "8px", borderRadius: "4px" }}>
              {findPasswordContent?.prefix}
              <span>{q?.taskData?.anchor}{q?.taskData?.password}</span>
              {findPasswordContent?.suffix}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="パスワードを入力..."
                value={inputValue}
                onChange={(e) => setInputValue && setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
              />
              <button 
                onClick={handleInputSubmit}
                style={{ padding: '8px 16px', backgroundColor: '#0b57d0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                回答する
              </button>
            </div>
          </div>
        ) : isPrint && isSuccess ? (
          <div style={{ margin: "auto", textAlign: "center", border: "1px solid #ccc", padding: "24px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <h2 style={{ marginTop: 0 }}>🖨 印刷プレビュー</h2>
            <p>1ページ印刷します</p>
            <button style={{ padding: "8px 16px", backgroundColor: "#0b57d0", color: "#fff", border: "none", borderRadius: "4px" }}>印刷</button>
          </div>
        ) : !(isNewTab && isSuccess) ? (
          <>
            <h1 style={{ margin: 0, fontSize: "24px" }}>{content.h1}</h1>
            <p style={{ margin: 0, color: isPrivate ? "#aaa" : "#555", lineHeight: "1.6" }}>{content.p}</p>
            {isPrivate && <div style={{ marginTop: "20px", fontSize: "18px", fontWeight: "bold" }}>🕶 シークレットモードです</div>}
          </>
        ) : (
          <div style={{ margin: "auto", fontSize: "24px", color: "#ccc" }}>Google</div>
        )}
        
        {isDevTools && isSuccess && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "150px", borderTop: "1px solid #ccc", backgroundColor: "#f3f3f3", padding: "8px", fontFamily: "monospace", fontSize: "12px", color: "#d32f2f", overflowY: "auto" }}>
            <div style={{ color: "#333", borderBottom: "1px solid #ccc", paddingBottom: "4px", marginBottom: "4px" }}>
              Elements | Console | Sources | Network
            </div>
            Uncaught TypeError: Cannot read properties of undefined (reading 'map')<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;at renderList (app.js:42)
          </div>
        )}
      </div>
      
      {isSuccess && !isFindPassword && <div className={styles.successToast}>実行しました！</div>}
    </div>
  );
}
