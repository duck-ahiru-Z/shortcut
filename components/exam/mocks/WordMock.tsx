import WindowControls from "./WindowControls";
import styles from "./WordMock.module.css";

type Props = {
  os?: "windows" | "mac";
  isSuccess?: boolean;
  q?: any;
};

export default function WordMock({ os = "windows", isSuccess, q }: Props) {
  const question = q?.question || "";
  
  let content = `議事録\n\n1. 挨拶\n2. 前回の振り返り\n3. 今後の課題\n以上`;
  if (question.includes("パスワード")) {
    content = `システム仕様書\n\n1. 概要\n当システムは社内のデータを一元管理するためのものです。\n\n2. 認証情報\nテスト環境のパスワードは「h0gEh0gE」です。\n絶対に外部に漏らさないでください。\n\n3. 今後の課題\n特になし。`;
  }
  
  const isSelectAll = question.includes("すべて選択");
  const isBold = question.includes("太字");
  const isItalic = question.includes("斜体");
  const isUnderline = question.includes("下線");
  
  const textAreaStyle: any = {
    backgroundColor: (isSuccess && isSelectAll) ? "#e3f2fd" : "transparent",
    fontWeight: (isSuccess && isBold) ? "bold" : "normal",
    fontStyle: (isSuccess && isItalic) ? "italic" : "normal",
    textDecoration: (isSuccess && isUnderline) ? "underline" : "none",
  };

  return (
    <div className={styles.wordContainer}>
      <div className={styles.wordHeader}>
        {os === "mac" && <WindowControls os={os} />}
        <div style={{ flex: 1, textAlign: os === "mac" ? "center" : "left", marginLeft: os === "mac" ? "0" : "16px" }}>
          {os === "mac" ? "Pages / Word" : "文書 - Word"}
        </div>
        {os === "windows" && <WindowControls os={os} />}
      </div>
      <div className={styles.wordBody}>
        {question.includes("検索") && isSuccess && (
          <div style={{ position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', border: '1px solid #ccc', padding: '8px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontSize: '12px', zIndex: 10 }}>
            🔍 検索: _________________ [次へ]
          </div>
        )}
        <textarea 
          className={styles.wordPage} 
          defaultValue={content}
          style={textAreaStyle}
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
