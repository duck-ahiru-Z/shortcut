import WindowControls from "./WindowControls";
import styles from "./VsCodeMock.module.css";
import { getVsCodeInitialCode } from "./mockDataHelpers";

type Props = {
  os?: "windows" | "mac";
  isSuccess?: boolean;
  q?: any;
};

export default function VsCodeMock({ os = "windows", isSuccess, q }: Props) {
  const question = q?.question || "";
  const defaultCode = getVsCodeInitialCode(question);
  
  const isTerminal = question.includes("ターミナル") || question.includes("コマンドプロンプト") || question.includes("シェル") || question.includes("リバースサーチ");
  const isClear = question.includes("いっぱいに流れて見づらく") || question.includes("クリア");
  const isCancel = question.includes("強制終了") || question.includes("キャンセル");
  const isReverseSearch = question.includes("リバースサーチ") || question.includes("過去に打った");
  const isCommandPalette = question.includes("コマンドパレット");
  
  return (
    <div className={styles.vscodeContainer}>
      <div className={styles.vscodeHeader}>
        {os === "mac" && <WindowControls os={os} />}
        <div className={styles.vscodeTitle}>index.ts - Visual Studio Code</div>
        {os === "windows" && <WindowControls os={os} />}
      </div>
      
      {isCommandPalette && isSuccess && (
        <div style={{ position: "absolute", top: "35px", left: "50%", transform: "translateX(-50%)", width: "400px", backgroundColor: "#252526", border: "1px solid #454545", borderRadius: "6px", boxShadow: "0 4px 6px rgba(0,0,0,0.5)", zIndex: 10 }}>
          <div style={{ padding: "8px", borderBottom: "1px solid #333", display: "flex", alignItems: "center" }}>
            <span style={{ color: "#d4d4d4" }}>&gt;</span>
            <input type="text" autoFocus style={{ backgroundColor: "transparent", border: "none", color: "#fff", outline: "none", width: "100%", marginLeft: "8px" }} />
          </div>
          <div style={{ padding: "8px", color: "#ccc", fontSize: "12px", maxHeight: "100px", overflow: "hidden" }}>
            <div style={{ padding: "4px", backgroundColor: "#062f4a" }}>Format Document</div>
            <div style={{ padding: "4px" }}>Reload Window</div>
          </div>
        </div>
      )}

      <div className={styles.vscodeBody} style={{ position: "relative" }}>
        <div className={styles.vscodeSidebar}>
          <div className={styles.vscodeFile}>📄 index.ts</div>
          <div className={styles.vscodeFile}>📄 app.tsx</div>
          <div className={styles.vscodeFile}>📄 style.css</div>
        </div>
        <div className={styles.vscodeEditor} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <textarea 
            className={styles.vscodeTextArea} 
            style={{ flex: 1, padding: "16px", fontFamily: "Consolas, monospace", fontSize: "14px", lineHeight: "1.5", backgroundColor: "#1e1e1e", color: "#d4d4d4", border: "none", outline: "none", resize: "none" }}
            defaultValue={defaultCode} 
            spellCheck={false}
          />
          {isTerminal && (
            <div style={{ height: "40%", borderTop: "1px solid #333", backgroundColor: "#1e1e1e", color: "#ccc", padding: "8px", fontFamily: "monospace", fontSize: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "16px", borderBottom: "1px solid #333", paddingBottom: "4px", marginBottom: "8px" }}>
                <span style={{ color: "#fff", borderBottom: "1px solid #fff", paddingBottom: "4px" }}>ターミナル</span>
                <span>出力</span>
                <span>デバッグコンソール</span>
              </div>
              
              {!isClear || !isSuccess ? (
                <>
                  <div>C:\Project&gt; npm run dev</div>
                  <div style={{ color: "#4caf50" }}>Starting development server...</div>
                  <div>Compiled successfully!</div>
                  <div style={{ color: "#888" }}>[webpack.Progress] 100%</div>
                  <div>... (大量のログ) ...</div>
                </>
              ) : null}
              
              {isClear && isSuccess && (
                <div style={{ marginTop: "auto", color: "#888" }}></div> // Cleared terminal
              )}
              
              {isCancel && isSuccess && (
                <div style={{ color: "#ffeb3b", marginTop: "8px" }}>^C<br/>C:\Project&gt; </div>
              )}
              
              {isReverseSearch && isSuccess && (
                <div style={{ color: "#fff", marginTop: "8px" }}>(reverse-i-search)`<span style={{ backgroundColor: "#555" }}>npm</span>': npm run dev</div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.vscodeStatusBar}>
        <div style={{ display: "flex", gap: "12px" }}>
          <span>master*</span>
          <span>⊗ 0 ⚠ 0</span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <span>UTF-8</span>
          <span>TypeScript JSX</span>
        </div>
      </div>
      
      {isSuccess && (!isTerminal && !isCommandPalette) && (
        <div className={styles.successToast}>
          実行しました！
        </div>
      )}
    </div>
  );
}
