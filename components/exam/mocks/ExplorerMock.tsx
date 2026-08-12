import styles from "./ExplorerMock.module.css";

type Props = { os?: "windows" | "mac"; isSuccess?: boolean; };
export default function ExplorerMock({ os = "windows", isSuccess }: Props) {
  return (
    <div className={styles.explorerContainer}>
      <div className={styles.explorerHeader}>
        {os === "mac" ? (
          <div style={{ display: 'flex', gap: '6px', marginRight: '16px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
          </div>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#f3d32a">
            <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path>
          </svg>
        )}
        <span className={styles.explorerTitle}>{os === "mac" ? "Finder" : "PC > ドキュメント"}</span>
      </div>
      <div className={styles.explorerBody}>
        <div className={styles.explorerSidebar}>
          <div className={styles.explorerSidebarItem1}></div>
          <div className={styles.explorerSidebarItem2}></div>
          <div className={styles.explorerSidebarItem3}></div>
        </div>
        <div className={styles.explorerMain}>
          指示されたキーを入力...
        </div>
      </div>
    
        {isSuccess && <div className={styles.successToast}>実行しました！</div>}
      </div>
  );
}
