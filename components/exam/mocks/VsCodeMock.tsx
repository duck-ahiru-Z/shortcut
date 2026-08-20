import styles from "./VsCodeMock.module.css";
import { getVsCodeInitialCode } from "./mockDataHelpers";

type Props = {
  os?: "windows" | "mac";
  isSuccess?: boolean;
  q?: any;
};

export default function VsCodeMock({ os = "windows", isSuccess, q }: Props) {
  const defaultCode = getVsCodeInitialCode(q?.type || "");
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
        <div className={styles.vscodeEditor} style={{ display: "flex", flexDirection: "column" }}>
          <textarea 
            className={styles.vscodeTextArea} 
            style={{ flex: 1, padding: "16px", fontFamily: "Consolas, monospace", fontSize: "14px", lineHeight: "1.5" }}
            defaultValue={defaultCode} 
            spellCheck={false}
          />
          {q?.type?.includes("terminal") && (
            <div style={{ height: "40%", borderTop: "1px solid #333", backgroundColor: "#1e1e1e", color: "#ccc", padding: "8px", fontFamily: "monospace", fontSize: "12px", overflow: "hidden" }}>
              <div>C:\Project&gt; npm run dev</div>
              <div style={{ color: "#4caf50" }}>Starting development server...</div>
              <div>Compiled successfully!</div>
              {isSuccess && q?.type?.includes("clear") && <div style={{ color: "#888", marginTop: "8px" }}>(Terminal cleared)</div>}
              {isSuccess && q?.type?.includes("stop") && <div style={{ color: "#ffeb3b", marginTop: "8px" }}>^C<br/>C:\Project&gt;</div>}
            </div>
          )}
          {isSuccess && !q?.type?.includes("terminal") && (
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
