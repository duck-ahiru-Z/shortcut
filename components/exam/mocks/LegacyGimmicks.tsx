import { useState, useMemo } from "react";
import styles from "./LegacyGimmicks.module.css";

type LegacyGimmickProps = {
  type: string;
  taskData: any;
  inputValue: string;
  setInputValue: (val: string) => void;
  handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleInputSubmit: () => void;
  isSuccess?: boolean;
};

export default function LegacyGimmicks({
  type,
  taskData,
  inputValue,
  setInputValue,
  handleInputKeyDown,
  handleInputSubmit,
  isSuccess
}: LegacyGimmickProps) {
  const findPasswordContent = useMemo(() => {
    if (type !== "find_password") return null;
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let prefix = "";
    let suffix = "";
    // Generate a massive block of random alphanumeric text
    for(let i=0; i<8000; i++) {
      prefix += chars.charAt(Math.floor(Math.random() * chars.length));
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return { prefix, suffix };
  }, [type]);

  switch (type) {
    case "select_all":
      return (
        <div className={styles.legacyContainer}>
          <textarea
            readOnly
            onMouseDown={(e) => {
              e.preventDefault();
              (e.target as HTMLTextAreaElement).focus();
            }}
            onContextMenu={(e) => e.preventDefault()}
            className={styles.legacyTextarea}
            defaultValue={`【社内情報セキュリティ基本方針】

第1条（目的）
本方針は、当社の保有する情報資産を様々な脅威から保護し、社会的信頼に応えるとともに、事業の継続的かつ安定的な発展に寄与することを目的とする。

第2条（適用範囲）
本方針は、役員、正社員、契約社員、派遣社員を含むすべての従業者に適用される。

第3条（情報資産の保護）
1. 従業者は、業務上知り得た機密情報を第三者に漏洩してはならない。
2. 許可されていない私物デバイスの業務利用（BYOD）を原則禁止する。
3. 不審なメールやファイルを受信した場合は、速やかにシステム管理部門に報告すること。

第4条（監査と罰則）
1. 情報セキュリティ委員は、定期的にセキュリティ監査を実施する。
2. 本方針に違反する行為が確認された場合、就業規則に基づき懲戒処分の対象となる。

第5条（改定）
本方針の改定は、取締役会の承認を経て行うものとする。

以上`}
          />
          <p className={styles.legacyWarning}>
            ※マウスによる選択・右クリックは禁止されています。
          </p>
        </div>
      );
    
    case "find_password":
      return (
        <div className={styles.legacyColumnGroup}>
          <div className={styles.legacyScrollBox} style={{ fontSize: "14px", lineHeight: "1.6", color: "#333", wordBreak: "break-all", fontFamily: "monospace" }}>
            {findPasswordContent?.prefix}
            <span>{taskData?.anchor}{taskData?.password}</span>
            {findPasswordContent?.suffix}
          </div>
          <div className={styles.legacyRowGroup}>
            <input
              type="text"
              placeholder="見つけたパスワードを入力"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className={styles.legacyInput}
            />
            <button 
              onClick={handleInputSubmit}
              className={`btn btn-primary ${styles.legacyButton}`}
            >
              回答する
            </button>
          </div>
        </div>
      );

    case "copy_paste":
      return (
        <div className={styles.legacyColumnGroup}>
          <div 
            onContextMenu={(e) => e.preventDefault()}
            className={styles.legacyStaticBox}
          >
            {taskData?.targetText}
          </div>
          <p className={styles.legacyWarningTop}>
            ※右クリックは禁止されています。
          </p>
          <div className={styles.legacyRowGroup}>
            <input
              type="text"
              placeholder="ここにペースト"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onContextMenu={(e) => e.preventDefault()}
              className={styles.legacyInput}
            />
            <button 
              onClick={handleInputSubmit}
              className={`btn btn-primary ${styles.legacyButton}`}
            >
              回答する
            </button>
          </div>
        </div>
      );

    case "rename_file":
      return (
        <div className={styles.legacyContainerLarge}>
          <div className={styles.legacyFileIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
            <div className={styles.legacyFileName}>
              report.pdf
            </div>
          </div>
        </div>
      );

    case "save_file":
      return (
        <div className={styles.legacyContainerLarge}>
          <div className={styles.legacyWindowBox}>
            <div className={styles.legacyWindowHeader}>
              <div className={styles.legacyDotRed}></div>
              <div className={styles.legacyDotYellow}></div>
              <div className={styles.legacyDotGreen}></div>
            </div>
            <div className={styles.legacyLine80}></div>
            <div className={styles.legacyLine60}></div>
            <div className={styles.legacyLine90}></div>
            <div className={styles.legacyRightAlign}>
              <span className={styles.legacyMutedText}>未保存の変更があります*</span>
            </div>
          </div>
        </div>
      );

    case "undo_action":
      return (
        <div className={styles.legacyContainerLarge}>
          <div className={styles.legacyCodeBox}>
            <div>const data = fetchData();</div>
            <div className={styles.legacyDeletedCode}>
              processData(data); // Accidentally deleted!
            </div>
            <div>return data;</div>
            <p className={styles.legacyInstructionText}>
              直前の操作を取り消してください。
            </p>
          </div>
        </div>
      );

    case "bold_text":
      return (
        <div className={styles.legacyContainerLarge}>
          <div className={styles.legacyTextBox}>
            <p>
              本日は晴天なり。明日の会議資料の<span className={styles.legacyHighlight}>重要ポイント</span>について説明します。
            </p>
            <p className={styles.legacyInstructionText}>
              選択中のテキストを太字にしてください。
            </p>
          </div>
        </div>
      );

    case "print_doc":
      return (
        <div className={styles.legacyContainerLarge}>
          <div className={styles.legacyPrintBox}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.legacyPrintIcon}>
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            <h3 className={styles.legacyPrintTitle}>月次報告書.pdf</h3>
            <p className={styles.legacyPrintDesc}>全5ページ</p>
          </div>
        </div>
      );

    default:
      return null;
  }
}
