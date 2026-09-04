import styles from "./WindowsMock.module.css";

type Props = { 
  os?: "windows" | "mac"; 
  isSuccess?: boolean; 
  q?: any; 
};

export default function WindowsMock({ os = "windows", isSuccess, q }: Props) {
  const question = q?.question || "";
  const isCancel = question.includes("キャンセル") || question.includes("ダイアログ") || question.includes("ポップアップ");
  const isCut = question.includes("切り取り") || question.includes("カット");
  const isCopy = question.includes("コピー");
  const isUndo = question.includes("元に戻す");
  const isMac = os === "mac";

  return (
    <div className={styles.windowsContainer} style={isMac ? { background: "linear-gradient(145deg, #315b7d, #a86b81)" } : undefined}>
      <div className={styles.windowsBody}>
        {isCancel ? (
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            {/* Desktop Background */}
            <div style={{ position: "absolute", inset: 0, padding: "20px", background: isMac ? "linear-gradient(145deg, #315b7d, #a86b81)" : undefined }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 60px)", gap: "20px" }}>
                <div style={{ width: "60px", height: "60px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "4px" }}></div>
                <div style={{ width: "60px", height: "60px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "4px" }}></div>
                <div style={{ width: "60px", height: "60px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "4px" }}></div>
              </div>
            </div>
            
            {/* Annoying Dialog */}
            {!isSuccess && (
              <div style={{ position: "absolute", zIndex: 2, top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "300px", backgroundColor: "#fff", borderRadius: isMac ? "12px" : "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", overflow: "hidden", border: "1px solid #ccc" }}>
                <div style={{ backgroundColor: "#f3f3f3", padding: "8px 12px", fontSize: "12px", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between", color: "#333" }}>
                  {isMac ? <span style={{ color: "#ff5f57", fontSize: "18px", lineHeight: 1 }}>●</span> : <span>警告</span>}
                  <span style={{ cursor: "pointer" }}>{isMac ? "システム設定" : "×"}</span>
                </div>
                <div style={{ padding: "24px 16px", color: "#333", fontSize: "14px", textAlign: "center" }}>
                  システムの設定を変更しようとしています。続行しますか？
                </div>
                <div style={{ backgroundColor: "#f9f9f9", padding: "12px", display: "flex", justifyContent: "flex-end", gap: "8px", borderTop: "1px solid #eee" }}>
                  <button style={{ padding: "6px 16px", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#fff", color: "#333" }}>キャンセル</button>
                  <button style={{ padding: "6px 16px", border: "none", borderRadius: "4px", backgroundColor: isMac ? "#007aff" : "#0b57d0", color: "#fff" }}>OK</button>
                </div>
              </div>
            )}
            
            {isSuccess && (
               <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: "20px", backgroundColor: "rgba(0,0,0,0.7)", color: "#fff", borderRadius: "8px", fontSize: "24px" }}>
                 {question.includes("ポップアップ") ? "閉じました" : "キャンセルしました"}
               </div>
            )}
          </div>
        ) : (isCut || isCopy) ? (
          <div style={{ width: "100%", height: "100%", position: "relative", backgroundColor: "#fff", color: "#333" }}>
            <div style={{ padding: "12px", borderBottom: "1px solid #ccc", backgroundColor: "#f3f3f3", fontSize: "14px", display: "flex", gap: "16px" }}>
              <span>{isMac ? "Finder" : "ファイル"}</span><span>{isMac ? "編集" : "ホーム"}</span><span>共有</span><span>表示</span>
            </div>
            <div style={{ padding: "24px", display: "flex", gap: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: (isCut && isSuccess) ? 0.3 : 1 }}>
                <div style={{ width: "64px", height: "64px", backgroundColor: isMac ? "#54aeff" : "#ffca28", borderRadius: "4px", position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "30%", height: "20%", backgroundColor: isMac ? "#86c8ff" : "#ffb300", borderRadius: "4px 4px 0 0", transform: "translateY(-50%)" }}></div>
                </div>
                <div style={{ fontSize: "12px", backgroundColor: (isCut && isSuccess) ? "transparent" : "#cce5ff", padding: "2px 8px", borderRadius: "4px" }}>重要データ</div>
              </div>
            </div>
            {isSuccess && (
               <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: "20px", backgroundColor: "rgba(0,0,0,0.7)", color: "#fff", borderRadius: "8px", fontSize: "24px" }}>
                 {isCut ? "切り取りました" : "コピーしました"}
               </div>
            )}
          </div>
        ) : isUndo ? (
          <div style={{ width: "100%", height: "100%", position: "relative", backgroundColor: "#fff", color: "#333" }}>
            <div style={{ padding: "12px", borderBottom: "1px solid #ccc", backgroundColor: "#f3f3f3", fontSize: "14px", display: "flex", gap: "16px" }}>
              <span>ごみ箱</span><span>ホーム</span><span>共有</span><span>表示</span>
            </div>
            <div style={{ padding: "24px", display: "flex", gap: "24px" }}>
              {!isSuccess && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "64px", height: "64px", backgroundColor: "#ffca28", borderRadius: "4px", position: "relative", opacity: 0.5 }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: "30%", height: "20%", backgroundColor: "#ffb300", borderRadius: "4px 4px 0 0", transform: "translateY(-50%)" }}></div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#666", padding: "2px 8px" }}>誤って削除したデータ</div>
                </div>
              )}
            </div>
            {isSuccess && (
               <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: "20px", backgroundColor: "rgba(0,0,0,0.7)", color: "#fff", borderRadius: "8px", fontSize: "24px" }}>
                 元に戻しました
               </div>
            )}
          </div>
        ) : (
          <>
            <div className={styles.windowsPromptBox}>
              OS共通ショートカット
            </div>
            {isSuccess && (
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: "20px", backgroundColor: "rgba(0,0,0,0.7)", color: "#fff", borderRadius: "8px", fontSize: "24px" }}>
                処理を実行しました
              </div>
            )}
          </>
        )}
      </div>
      <div className={styles.windowsTaskbar} style={isMac ? { left: '20%', width: '60%', justifyContent: 'center', background: 'rgba(255,255,255,0.35)', borderRadius: '12px', marginBottom: '4px' } : {}}>
        {isMac ? (
          <>
            <div style={{ width: '24px', height: '24px', backgroundColor: '#eee', borderRadius: '4px' }}></div>
            <div style={{ width: '24px', height: '24px', backgroundColor: '#00a4ef', borderRadius: '4px', marginLeft: '8px' }}></div>
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#00a4ef">
              <rect x="2" y="2" width="9" height="9"></rect>
              <rect x="13" y="2" width="9" height="9"></rect>
              <rect x="2" y="13" width="9" height="9"></rect>
              <rect x="13" y="13" width="9" height="9"></rect>
            </svg>
            <div className={styles.windowsTaskbarIcon}></div>
            <div className={styles.windowsTaskbarIcon}></div>
          </>
        )}
      </div>
    
    </div>
  );
}
