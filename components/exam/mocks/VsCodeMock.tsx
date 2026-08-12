import styles from "./VsCodeMock.module.css";

type Props = {
  os?: "windows" | "mac";
  isSuccess?: boolean;
};

export default function VsCodeMock({ os = "windows", isSuccess }: Props) {
  return (
    <div className={styles.vscodeContainer}>
      <div className={styles.vscodeHeader}>
        {os === "mac" ? (
          <div className={styles.macButtons}>
            <div className={styles.browserDotRed}></div>
            <div className={styles.browserDotYellow}></div>
            <div className={styles.browserDotGreen}></div>
          </div>
        ) : null}
        <div className={styles.vscodeTitle}>index.ts - Visual Studio Code</div>
      </div>
      <div className={styles.vscodeBody}>
        <div className={styles.vscodeSidebar}>
          <div className={styles.vscodeFile}>📄 index.ts</div>
          <div className={styles.vscodeFile}>📄 app.tsx</div>
          <div className={styles.vscodeFile}>📄 style.css</div>
        </div>
        <div className={styles.vscodeEditor}>
          <textarea 
            className={styles.vscodeTextArea} 
            defaultValue={"const message = \"Hello World\";\n\nfunction init() {\n  // ここに入力したり選択できます\n  console.log(message);\n}\n"} 
            spellCheck={false}
          />
          {isSuccess && (
            <div className={styles.successToast}>
              実行しました！
            </div>
          )}
        </div>
      </div>
      <div className={styles.vscodeStatusBar}>
        <div>master*</div>
        <div>UTF-8</div>
      </div>
    </div>
  );
}
