import WindowControls from "./WindowControls";
import styles from "./WordMock.module.css";

type Props = {
  os?: "windows" | "mac";
  isSuccess?: boolean;
  q?: any;
  inputValue?: string;
  setInputValue?: (val: string) => void;
  handleInputKeyDown?: (e: any) => void;
  handleInputSubmit?: () => void;
};

export default function WordMock({ os = "windows", isSuccess, q, inputValue = "", setInputValue, handleInputKeyDown, handleInputSubmit }: Props) {
  const question = q?.question || "";
  
  const isSelectAll = question.includes("すべて選択");
  const isBold = question.includes("太字");
  const isItalic = question.includes("斜体");
  const isUnderline = question.includes("下線");
  const isPreSelected = question.includes("選択中");
  const isRedo = question.includes("やり直す");
  const isUndo = (question.includes("元に戻す") || question.includes("取り消し")) && !isRedo;
  const isPrint = question.includes("印刷");
  const isSave = question.includes("保存");
  const isCut = question.includes("切り取って");
  // Ensure we match the exact copy paste question to avoid triggering on other things
  const isCopyPaste = question.includes("左のテキストエリア") || question.includes("右のテキストエリア") || question.includes("貼り付けて回答");

  const isEmailUndo = question.includes("白紙同然");
  let content = q?.taskData?.targetText || `議事録\n\n1. 挨拶\n2. 前回の振り返り\n3. 今後の課題\n以上`;
  
  if (isCut) {
    if (isSuccess) {
      content = `議事録\n\n1. 挨拶\n`;
    } else {
      content = `議事録\n\n1. 挨拶\n2. 前回の振り返り`;
    }
  }

  if (isEmailUndo) {
    if (!isSuccess) {
      content = `\n\n---\n株式会社〇〇営業部\n山田太郎`;
    } else {
      content = `お世話になっております。株式会社〇〇の山田でございます。\n\n先日の打ち合わせにてご相談いただいた新プランのお見積りについてですが...（長文）\n\n---\n株式会社〇〇営業部\n山田太郎`;
    }
  } else if (isUndo && !isSuccess) {
    content = `議事録\n\n1. 挨拶\n`; 
  }
  if (isRedo && isSuccess) {
    content = `議事録\n\n1. 挨拶\n`; 
  }
  
  const textAreaStyle: any = {
    backgroundColor: ((isSuccess && isSelectAll && !isCopyPaste) || isPreSelected || (isCut && !isSuccess)) ? "#cce5ff" : "transparent",
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
      <div className={styles.wordBody} style={isCopyPaste ? { flexDirection: 'row', gap: '16px', padding: '16px', backgroundColor: '#f5f5f5' } : {}}>
        
        {isCopyPaste ? (
          <>
            <textarea 
              readOnly
              onMouseDown={(e) => { e.preventDefault(); (e.target as HTMLTextAreaElement).focus(); }}
              className={styles.wordPage} 
              defaultValue={content}
              style={{ ...textAreaStyle, flex: 1, margin: 0, height: '100%', resize: 'none', cursor: 'text' }}
              spellCheck={false}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea 
                className={styles.wordPage}
                placeholder="ここにペースト"
                value={inputValue}
                onChange={e => setInputValue && setInputValue(e.target.value)}
                style={{ flex: 1, margin: 0, height: '100%', border: '2px dashed #0b57d0', resize: 'none' }}
                spellCheck={false}
              />
              <button 
                onClick={handleInputSubmit} 
                className="btn btn-primary"
                style={{ padding: '8px', width: '100%' }}
              >
                回答する
              </button>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
        
        {isSuccess && !isCopyPaste && (
          <div className={styles.successToast} style={isPrint ? { 
            width: '300px', height: '200px', backgroundColor: '#f0f0f0', color: '#333', 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)', border: '1px solid #ccc' 
          } : isSave ? {
            backgroundColor: '#4CAF50'
          } : {}}>
            {isPrint ? (
              <>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="#666"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
                <div style={{ marginTop: '16px', fontWeight: 'bold' }}>印刷プレビュー</div>
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>印刷中...</div>
              </>
            ) : isSave ? "保存しました！" : "実行しました！"}
          </div>
        )}
      </div>
    </div>
  );
}
