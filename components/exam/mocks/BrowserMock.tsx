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
  const isLastTab = question.includes("最後のタブ") || question.includes("右端のタブ");
  const isTabMove = question.includes("次のタブ") || question.includes("前のタブ") || question.includes("左隣") || question.includes("右隣");
  
  // Specific legacy types checking
  // Search and copy/paste tasks need the same visible result area and answer
  // field.  The one-time-code task previously fell through to the generic
  // browser page because its wording contains neither "検索" nor "パスワード".
  const isFindTask = question.includes("探して") || question.includes("探し出し") || question.includes("パスワード") || question.includes("検索し、") || question.includes("ワンタイムコード");
  const isPrint = question.includes("印刷");
  const isCopyPasteURL = question.includes("URLをコピー");
  const isDownloads = question.includes("ダウンロード履歴") || question.includes("ダウンロードの履歴");

  const addressBarStyle = isAddressBar && isSuccess 
    ? { backgroundColor: "#cce5ff", color: "#000" } 
    : {};

  const displayedUrl = isDownloads && isSuccess
    ? "chrome://downloads"
    : isCopyPasteURL && q?.taskData?.targetText
    ? q.taskData.targetText 
    : (isFindTask ? "https://example.com/search-target" : content.url);

  const mainContainerStyle: any = {
    padding: "20px", display: "flex", flexDirection: "column", gap: "16px", backgroundColor: isPrivate ? "#333" : "#fff", color: isPrivate ? "#ddd" : "#333", height: "100%", position: "relative"
  };

  const findPasswordContent = useMemo(() => {
    if (!isFindTask) return null;
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let prefix = "";
    let suffix = "";
    for(let i=0; i<8000; i++) {
      prefix += chars.charAt(Math.floor(Math.random() * chars.length));
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return { prefix, suffix };
  }, [isFindTask]);

  return (
    <div className={styles.browserContainer}>
      <div className={styles.browserHeader} style={{ backgroundColor: isPrivate ? "#222" : "#f1f3f4" }}>
        {os === "mac" && <WindowControls os={os} />}
        
        <div className={styles.browserTabs} style={{ display: "flex", gap: "8px", marginLeft: "16px", alignItems: "flex-end", flex: 1, paddingTop: "8px" }}>
          {isLastTab && !isSuccess && ["開発ドキュメント", "障害調査メモ", "チケット #1842"].map((title, index) => (
            <div key={title} className={index === 2 ? styles.browserTabActive : styles.browserTab} style={{ backgroundColor: index === 2 ? "#fff" : "#e5e7eb", color: "#000", padding: "8px 12px", borderRadius: "8px 8px 0 0", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px", minWidth: "150px" }}>
              <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
              <div style={{ color: "#888" }}>×</div>
            </div>
          ))}
          {!isLastTab && !(isSuccess && isCloseTab) && (
            <div className={styles.browserTabActive} style={{ backgroundColor: isPrivate ? "#333" : "#fff", color: isPrivate ? "#fff" : "#000", padding: "8px 12px", borderRadius: "8px 8px 0 0", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px", minWidth: "150px" }}>
               <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{isFindTask ? "パスワード検索" : content.title}</div>
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
          {isTabMove && isSuccess && (
            <>
              {["開発ドキュメント", "障害調査メモ", "チケット #1842"].map((title, index) => (
                <div key={`moved-${title}`} className={index === 1 ? styles.browserTabActive : styles.browserTab} style={{ backgroundColor: index === 1 ? "#fff" : "#e5e7eb", color: "#000", padding: "8px 12px", borderRadius: "8px 8px 0 0", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px", minWidth: "120px" }}>
                  <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
                  <div style={{ color: "#888" }}>×</div>
                </div>
              ))}
            </>
          )}
        </div>
        
        {os === "windows" && <WindowControls os={os} />}
      </div>
      
      <div style={{ backgroundColor: isPrivate ? "#333" : "#fff", padding: "8px", display: "flex", gap: "8px", alignItems: "center", borderBottom: "1px solid #ccc" }}>
        {isReload && isSuccess ? (
          <div style={{ color: "#0b57d0", animation: "spin 1s linear infinite" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{ color: "#666" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
          </div>
        )}
        <div className={styles.browserAddress} style={{ ...addressBarStyle, flex: 1, padding: "4px 12px", borderRadius: "16px", border: "1px solid #ddd", fontSize: "12px" }}>
          {isNewTab && isSuccess ? "" : displayedUrl}
        </div>
        {isBookmark && (
          <div style={{ color: isSuccess ? "#f4b400" : "#ccc", fontSize: "16px" }}>★</div>
        )}
      </div>

      <div className={styles.browserBody} style={mainContainerStyle}>
        {isRestoreTab && isSuccess && (
          <div style={{ position: "absolute", top: 12, left: 12, right: 12, padding: "8px 12px", backgroundColor: "#e8f0fe", border: "1px solid #8ab4f8", borderRadius: "6px", color: "#174ea6", fontSize: "12px", display: "flex", justifyContent: "space-between", zIndex: 4 }}>
            <span>閉じたタブを復元しました</span><span>履歴: レポート編集ページ</span>
          </div>
        )}
        {isReload && isSuccess ? (
          <div style={{ margin: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", color: "#666" }}>
            <div style={{ fontSize: "32px", animation: "spin 1s linear infinite" }}>↻</div>
            <div style={{ fontSize: "18px" }}>ページを再読み込みしています...</div>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : isFindTask ? (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "16px" }}>
            <div style={{ flex: 1, overflowY: "auto", border: "1px solid #ddd", padding: "12px", fontSize: "12px", fontFamily: "monospace", wordBreak: "break-all", lineHeight: 1.5, maxHeight: "250px" }}>
              {q?.taskData?.targetText || (findPasswordContent ? (
                <>
                  {findPasswordContent.prefix}
                  <span>{q?.taskData?.anchor}{q?.taskData?.password}</span>
                  {findPasswordContent.suffix}
                </>
              ) : null)}
            </div>
            <div style={{ backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#555' }}>
                見つけた答えを入力して提出してください：
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="回答を入力..."
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
          </div>
        ) : isDownloads && isSuccess ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%" }}>
            <h1 style={{ margin: 0, fontSize: "24px" }}>ダウンロード</h1>
            <div style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
              {["shortcut_exam_guide.pdf", "practice_questions.xlsx"].map((name, index) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderBottom: index === 0 ? "1px solid #eee" : "none" }}>
                  <span style={{ fontSize: "22px" }}>📄</span>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>{name}</div><div style={{ color: "#666", fontSize: "12px" }}>{index === 0 ? "2026/09/06 14:32" : "2026/09/05 09:10"}</div></div>
                  <span style={{ color: "#0b57d0", fontSize: "12px" }}>フォルダを表示</span>
                </div>
              ))}
            </div>
          </div>
        ) : isPrint && isSuccess ? (
          <div style={{ margin: "auto", textAlign: "center", border: "1px solid #ccc", padding: "24px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <h2 style={{ marginTop: 0 }}>🖨 印刷プレビュー</h2>
            <p>1ページ印刷します</p>
            <button style={{ padding: "8px 16px", backgroundColor: "#0b57d0", color: "#fff", border: "none", borderRadius: "4px" }}>印刷</button>
          </div>
        ) : !(isNewTab && isSuccess) ? (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <h1 style={{ margin: 0, fontSize: "24px" }}>{content.h1}</h1>
            <p style={{ margin: 0, color: isPrivate ? "#aaa" : "#555", lineHeight: "1.6" }}>{content.p}</p>
            {isPrivate && <div style={{ marginTop: "20px", fontSize: "18px", fontWeight: "bold" }}>🕶 シークレットモードです</div>}
            
            {q?.question?.includes("URLをコピー") && (
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #ccc', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>ここにURLを貼り付け:</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={inputValue}
                    onChange={(e) => setInputValue && setInputValue(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '2px dashed #0b57d0', fontSize: '14px' }}
                  />
                  <button 
                    onClick={handleInputSubmit}
                    style={{ padding: '8px 16px', backgroundColor: '#0b57d0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    回答する
                  </button>
                </div>
              </div>
            )}
          </div>
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
      
      {isSuccess && !isFindTask && <div className={styles.successToast}>実行しました！</div>}
    </div>
  );
}
