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
  const isFormatTask = question.includes("フォーマット") || question.includes("自動整形") || question.includes("インデントや改行が乱れて");
  const isDefinitionTask = question.includes("定義へ") || question.includes("定義元") || question.includes("実装へジャンプ");
  const isPeekTask = question.includes("ピーク表示") || question.includes("中身だけチラ見");
  const isReferencesTask = question.includes("参照一覧") || question.includes("利用箇所");
  const isQuickFixTask = question.includes("クイックフィックス") || question.includes("修正候補");
  const isMultiCursorTask = question.includes("マルチカーソル") || question.includes("同じ単語") || question.includes("一括で");
  const isCurrentLineTask = question.includes("現在行") || question.includes("現在の行");
  const lineMatch = question.match(/(\d+)行目/);
  const currentLine = lineMatch ? Number(lineMatch[1]) : (isCurrentLineTask ? 3 : 1);
  const lineNumbers = Array.from({ length: 12 }, (_, index) => index + 1);
  
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
          <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
            <div aria-label="行番号" style={{ width: "42px", padding: "16px 8px 16px 0", backgroundColor: "#1e1e1e", color: "#858585", textAlign: "right", fontFamily: "Consolas, monospace", fontSize: "14px", lineHeight: "1.5", userSelect: "none" }}>
              {lineNumbers.map((line) => (
                <div key={line} style={{ backgroundColor: line === currentLine ? "#264f78" : "transparent", color: line === currentLine ? "#fff" : "#858585" }}>{line}</div>
              ))}
            </div>
            <textarea
              key={`${q?.id ?? "vscode"}-${isSuccess ? "success" : "initial"}`}
              className={styles.vscodeTextArea}
              aria-label={`コードエディタ（${currentLine}行目が対象）`}
              style={{ flex: 1, minWidth: 0, padding: "16px", fontFamily: "Consolas, monospace", fontSize: "14px", lineHeight: "1.5", backgroundColor: "#1e1e1e", color: "#d4d4d4", border: "none", outline: "none", resize: "none" }}
              defaultValue={isFormatTask && isSuccess ? "function poorlyFormatted() {\n  let x = 1;\n  if (x) {\n    console.log(x);\n  }\n}" : defaultCode}
              spellCheck={false}
            />
          </div>
          {isSuccess && (isDefinitionTask || isPeekTask || isReferencesTask || isQuickFixTask || isMultiCursorTask) && (
            <div style={{ position: "absolute", inset: "42px 12px auto 132px", backgroundColor: "#252526", border: "1px solid #454545", borderRadius: "4px", boxShadow: "0 4px 12px rgba(0,0,0,.45)", zIndex: 4, color: "#d4d4d4", fontSize: "12px" }}>
              <div style={{ padding: "7px 10px", backgroundColor: "#333", borderBottom: "1px solid #454545", fontWeight: 600 }}>
                {isDefinitionTask ? "定義へ移動" : isPeekTask ? "定義のピーク" : isReferencesTask ? "参照" : isQuickFixTask ? "クイックフィックス" : "マルチカーソル"}
              </div>
              <div style={{ padding: "10px", lineHeight: 1.6 }}>
                {isDefinitionTask && <><div style={{ color: "#4ec9b0" }}>function calculate()</div><div>src/utils/calculate.ts:1</div></>}
                {isPeekTask && <><div style={{ color: "#4ec9b0" }}>function calculate(a: number)</div><div style={{ color: "#9cdcfe" }}>return a * 2;</div></>}
                {isReferencesTask && <><div>calculate — 3 件の参照</div><div style={{ color: "#9cdcfe" }}>src/app.tsx:12　src/tests/calc.test.ts:4</div></>}
                {isQuickFixTask && <><div style={{ color: "#4ec9b0" }}>✓ import {`{ useState }`} from 'react';</div><div style={{ color: "#888" }}>修正候補を適用しました</div></>}
                {isMultiCursorTask && <><div style={{ color: "#4ec9b0" }}>3 個の選択範囲を追加</div><div style={{ color: "#888" }}>同時編集モードが有効です</div></>}
              </div>
            </div>
          )}
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
