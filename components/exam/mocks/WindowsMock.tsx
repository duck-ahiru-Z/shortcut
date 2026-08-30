import styles from "./WindowsMock.module.css";

type Props = { os?: "windows" | "mac"; isSuccess?: boolean; };
export default function WindowsMock({ os = "windows", isSuccess }: Props) {
  return (
    <div className={styles.windowsContainer}>
      <div className={styles.windowsBody}>
         <div className={styles.windowsPromptBox}>
           OS共通ショートカット
         </div>
         {isSuccess && (
           <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: "20px", backgroundColor: "rgba(0,0,0,0.7)", color: "#fff", borderRadius: "8px", fontSize: "24px" }}>
             処理を実行しました
           </div>
         )}
      </div>
      <div className={styles.windowsTaskbar} style={os === "mac" ? { justifyContent: 'center', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', margin: '4px 20%' } : {}}>
        {os === "mac" ? (
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
    
      {isSuccess && <div className={styles.successToast}>実行しました！</div>}
    </div>
  );
}
