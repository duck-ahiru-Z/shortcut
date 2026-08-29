import WindowControls from "./WindowControls";
import styles from "./WordMock.module.css";

type Props = {
  os?: "windows" | "mac";
  isSuccess?: boolean;
};

export default function WordMock({ os = "windows", isSuccess }: Props) {
  return (
    <div className={styles.wordContainer}>
      <div className={styles.wordHeader}>
        {os === "mac" && <WindowControls os={os} />}
        {os === "mac" ? "Pages / Word" : "文書"}
        {os === "windows" && <WindowControls os={os} />}
      </div>
      <div className={styles.wordBody}>
        <textarea 
          className={styles.wordPage} 
          defaultValue={`議事録

1. 挨拶
2. 前回の振り返り
3. 今後の課題

以上`}
          spellCheck={false}
        />
        {isSuccess && (
          <div className={styles.successToast}>
            実行しました！
          </div>
        )}
      </div>
    </div>
  );
}
