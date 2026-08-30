import WindowControls from "./WindowControls";
import styles from "./PowerpointMock.module.css";

type Props = { os?: "windows" | "mac"; isSuccess?: boolean; q?: any; };
export default function PowerpointMock({ os = "windows", isSuccess, q }: Props) {
  return (
    <div className={styles.pptContainer}>
      <div className={styles.pptHeader}>
        {os === "mac" && <WindowControls os={os} />}
        <div className={styles.pptTitle}>プレゼンテーション1 - PowerPoint</div>
      </div>
      <div className={styles.pptToolbar}>
        <div>ファイル</div><div>ホーム</div><div>挿入</div><div>描画</div><div>デザイン</div><div>画面切り替え</div><div>アニメーション</div><div>スライドショー</div>
      </div>
      <div className={styles.pptBody}>
        <div className={styles.pptSidebar}>
          <div className={`${styles.pptThumbnail} ${styles.pptThumbnailActive}`}>1</div>
          <div className={styles.pptThumbnail}>2</div>
          {(q?.question || "").includes("new_slide") && isSuccess && <div className={`${styles.pptThumbnail} ${styles.pptThumbnailActive}`} style={{ border: "2px solid #d83b01" }}>3</div>}
        </div>
        <div className={styles.pptMain}>
          <div className={styles.pptSlide} style={(q?.question || "").includes("blackout") && isSuccess ? { backgroundColor: "#000" } : {}}>
            {!((q?.question || "").includes("blackout") && isSuccess) && (
              <>
                <h2 style={(q?.question || "").includes("font") && isSuccess ? { fontSize: "48px", transition: "0.2s" } : { transition: "0.2s" }}>
                  {(q?.question || "").includes("new_slide") && isSuccess ? "タイトルを入力" : "四半期売上報告"}
                </h2>
                <div className={styles.pptContentBox}>
                  {(q?.question || "").includes("duplicate") ? (
                    <div style={{ display: "flex", gap: "16px" }}>
                      <div style={{ width: "100px", height: "100px", backgroundColor: "#0078d4" }}></div>
                      {isSuccess && <div style={{ width: "100px", height: "100px", backgroundColor: "#0078d4", border: (q?.question || "").includes("group") ? "2px dashed #000" : "none" }}></div>}
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
      
      {isSuccess && !(q?.question || "").includes("blackout") && (
        <div className={styles.successToast}>
          実行しました！
        </div>
      )}
    </div>
  );
}
