import styles from "./TaskViewMock.module.css";

type Props = { os?: "windows" | "mac"; isSuccess?: boolean; };
export default function TaskViewMock({ os = "windows", isSuccess }: Props) {
  return (
    <div className={styles.tvContainer}>
      <div className={styles.tvHeader}>
        タスクビュー
      </div>
      <div className={styles.tvDesktops}>
        <div className={`${styles.tvDesktop} ${styles.tvDesktopActive}`}>デスクトップ 1</div>
        <div className={styles.tvDesktop}>デスクトップ 2</div>
        <div className={styles.tvDesktop} style={{ fontSize: '24px' }}>+</div>
      </div>
      <div className={styles.tvWindows}>
        <div className={styles.tvWindow}>
          <div style={{ color: '#0078d7', fontSize: '24px', marginBottom: '8px' }}>E</div>
          <div>Edge</div>
        </div>
        <div className={styles.tvWindow}>
          <div style={{ color: '#27c93f', fontSize: '24px', marginBottom: '8px' }}>X</div>
          <div>Excel</div>
        </div>
        <div className={styles.tvWindow}>
          <div style={{ color: '#ffbd2e', fontSize: '24px', marginBottom: '8px' }}>📁</div>
          <div>指示キー入力...</div>
        </div>
      </div>
    
        {isSuccess && <div className={styles.successToast}>実行しました！</div>}
      </div>
  );
}
