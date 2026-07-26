import styles from "./Mocks.module.css";

export default function ExplorerMock() {
  return (
    <div className={styles.explorerContainer}>
      <div className={styles.explorerHeader}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#f3d32a">
          <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path>
        </svg>
        <span className={styles.explorerTitle}>PC &gt; ドキュメント</span>
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
    </div>
  );
}
