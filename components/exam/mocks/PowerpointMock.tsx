import styles from "./PowerpointMock.module.css";

type Props = { os?: "windows" | "mac"; isSuccess?: boolean; };
export default function PowerpointMock({ os = "windows", isSuccess }: Props) {
  return (
    <div className={styles.pptContainer}>
      <div className={styles.pptHeader}>
        {os === "mac" ? (
          <div className={styles.macButtons}>
            <div className={styles.browserDotRed}></div>
            <div className={styles.browserDotYellow}></div>
            <div className={styles.browserDotGreen}></div>
          </div>
        ) : null}
        <div className={styles.pptTitle}>プレゼンテーション - PowerPoint</div>
      </div>
      <div className={styles.pptRibbon}>
        <span>ホーム</span><span>挿入</span><span>描画</span><span>デザイン</span><span>画面切り替え</span><span>アニメーション</span><span>スライドショー</span>
      </div>
      <div className={styles.pptBody}>
        <div className={styles.pptSidebar}>
          <div className={styles.pptSlideThumbActive}>1</div>
          <div className={styles.pptSlideThumb}>2</div>
          <div className={styles.pptSlideThumb}>3</div>
        </div>
        <div className={styles.pptMain}>
          <div className={styles.pptSlide}>
            <h2>タイトル</h2>
            <div className={styles.pptContentBox}>
              指示されたキーを入力...
            </div>
          </div>
        </div>
      </div>
    
        {isSuccess && <div className={styles.successToast}>実行しました！</div>}
      </div>
  );
}
