import WindowControls from "./WindowControls";
import styles from "./PowerpointMock.module.css";

type Props = { os?: "windows" | "mac"; isSuccess?: boolean; q?: any; };
export default function PowerpointMock({ os = "windows", isSuccess, q }: Props) {
  const question = q?.question || "";
  
  const isNewSlide = question.includes("新しいスライド");
  const isDuplicate = question.includes("複製");
  const isGroup = question.includes("一つにまとめてグループ化") || question.includes("グループ化");
  const isUngroup = question.includes("ひとまとめになっている図形の一部") || question.includes("グループ解除");
  const isSlideshow = question.includes("スライドショー") || question.includes("最初から") || question.includes("現在のスライドから");
  const isBlackout = question.includes("真っ黒に");
  
  if (isSlideshow && isSuccess) {
    return (
      <div className={styles.pptContainer} style={{ backgroundColor: "#000", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "80%", height: "80%", backgroundColor: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}>
           <h1 style={{ fontSize: "64px" }}>四半期売上報告</h1>
           <p style={{ fontSize: "32px", color: "#555" }}>2024年度 第2四半期</p>
        </div>
        <div className={styles.successToast}>実行しました！</div>
      </div>
    );
  }

  return (
    <div className={styles.pptContainer}>
      <div className={styles.pptHeader}>
        {os === "mac" && <WindowControls os={os} />}
        <div className={styles.pptTitle}>プレゼンテーション1 - PowerPoint</div>
        {os === "windows" && <WindowControls os={os} />}
      </div>
      <div className={styles.pptToolbar}>
        <div>ファイル</div><div>ホーム</div><div>挿入</div><div>描画</div><div>デザイン</div><div>画面切り替え</div><div>アニメーション</div><div>スライドショー</div>
      </div>
      <div className={styles.pptBody}>
        <div className={styles.pptSidebar}>
          <div className={`${styles.pptThumbnail} ${!isNewSlide || !isSuccess ? styles.pptThumbnailActive : ''}`}>1</div>
          <div className={styles.pptThumbnail}>2</div>
          {isNewSlide && isSuccess && <div className={`${styles.pptThumbnail} ${styles.pptThumbnailActive}`} style={{ border: "2px solid #d83b01" }}>3</div>}
        </div>
        <div className={styles.pptMain}>
          <div className={styles.pptSlide} style={isBlackout && isSuccess ? { backgroundColor: "#000" } : {}}>
            {!(isBlackout && isSuccess) && (
              <>
                <h2>
                  {isNewSlide && isSuccess ? "タイトルを入力" : "四半期売上報告"}
                </h2>
                <div className={styles.pptContentBox}>
                  {isDuplicate || isGroup || isUngroup ? (
                    <div style={{ display: "flex", gap: "16px", padding: "20px", border: isGroup && isSuccess ? "2px dashed #666" : "none", position: "relative" }}>
                      {isGroup && isSuccess && <div style={{ position: "absolute", top: -10, left: -10, backgroundColor: "#fff", padding: "2px", fontSize: "10px", border: "1px solid #ccc" }}>グループ化済み</div>}
                      
                      <div style={{ width: "100px", height: "100px", backgroundColor: "#0078d4", border: (isUngroup && isSuccess) ? "2px solid #ffb900" : "none" }}></div>
                      
                      {(isDuplicate && isSuccess) || isGroup || isUngroup ? (
                        <div style={{ width: "100px", height: "100px", backgroundColor: "#0078d4", border: (isUngroup && !isSuccess) ? "none" : "none" }}></div>
                      ) : null}
                    </div>
                  ) : (
                    "テキストを入力"
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {isSuccess && !isBlackout && (
        <div className={styles.successToast}>
          実行しました！
        </div>
      )}
    </div>
  );
}
