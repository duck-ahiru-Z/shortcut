import React from "react";
import ExcelMock from "./mocks/ExcelMock";
import WordMock from "./mocks/WordMock";
import BrowserMock from "./mocks/BrowserMock";
import ExplorerMock from "./mocks/ExplorerMock";
import WindowsMock from "./mocks/WindowsMock";
import VsCodeMock from "./mocks/VsCodeMock";
import PowerpointMock from "./mocks/PowerpointMock";
import SlackMock from "./mocks/SlackMock";
import TaskManagerMock from "./mocks/TaskManagerMock";
import RunDialogMock from "./mocks/RunDialogMock";
import ActionCenterMock from "./mocks/ActionCenterMock";
import TaskViewMock from "./mocks/TaskViewMock";
import styles from "./PracticalActiveScreen.module.css";

type Question = {
  id: number;
  question: string;
  expectedKeyCombo?: string[];
  expectedKeyComboHash?: string;
  type?: string;
  taskData?: any;
  answer?: string;
};

type Props = {
  q: Question;
  isMac: boolean;
  inputValue: string;
  setInputValue: (val: string) => void;
  handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleInputSubmit: () => void;
  isSuccess: boolean;
};

export default function GimmickRenderer({
  q,
  isMac,
  inputValue,
  setInputValue,
  handleInputKeyDown,
  handleInputSubmit,
  isSuccess
}: Props) {
  // 2. Context-aware generic mock UI
  const getUIContext = (question: Question) => {
    const text = question.question;
    // 1. Exact Tag Matching (Highest Priority)
    if (text.includes('【Finder') || text.includes('（Finder）')) return "explorer";
    if (text.includes('【Excel】') || text.includes('（Excel）')) return "excel";
    if (text.includes('【ブラウザ】') || text.includes('（ブラウザ）') || text.includes('（フォーム入力）')) return "browser";
    if (text.includes('大量の文字列') || text.includes('パスワード')) return "browser";
    if (text.includes('【VS Code】') || text.includes('（VS Code）')) return "vscode";
    if (text.includes('【ターミナル】') || text.includes('（ターミナル）')) return "vscode";
    if (text.includes('【Slack】') || text.includes('（Slack）')) return "slack";
    if (text.includes('【Word】') || text.includes('（Word）') || text.includes('ドキュメントを「印刷」') || text.includes('ファイルを保存') || text.includes('上書き保存')) return "word";
    if (text.includes('【Word/PowerPoint】')) return "word";
    if (text.includes('【PowerPoint】') || text.includes('（PowerPoint）')) return "powerpoint";
    if (text.includes('【エクスプローラー/共通】') || text.includes('（エクスプローラー）')) return "explorer";
    if (text.includes('【Windows共通】') || text.includes('【Mac共通】')) return "windows";

    // 2. Explicit question type matching. This is more reliable than keywords.
    const type = question.type || "";
    if (type.startsWith("browser_") || type === "find_password" || type === "copy_paste" || type === "form_previous_field") return "browser";
    if (type.startsWith("excel_")) return "excel";
    if (type.startsWith("explorer_") || type === "basic_copy_filename") return "explorer";
    if (type.startsWith("word_") || ["save_file", "document_save", "print_doc", "bold_text", "undo_action", "mail_undo_loss", "basic_cut_paragraph", "basic_redo", "select_all"].includes(type)) return "word";
    
    // 3. Fuzzy Text Matching (Fallback)
    if (/(Excel|セル|シート|数式|オートサム|フラッシュフィル|表の|データ入力)/i.test(text)) return "excel";
    if (/(Word|段落|文章|文字|書式|議事録|テキスト|メール|白紙同然)/i.test(text)) return "word";
    if (/(ブラウザ|タブ|ページ|ダウンロード|再読み込み|ブックマーク|履歴|Chrome|キャッシュ|シークレット|URL)/i.test(text)) return "browser";
    if (/(エクスプローラー|フォルダ|ファイル|Finder)/i.test(text)) return "explorer";
    if (/(VS Code|エディタ|マルチカーソル|コメントアウト|統合ターミナル|リネーム|関数|コマンドパレット|定義へ移動|行ごと削除|フォーマット|クイックオープン)/i.test(text)) return "vscode";
    if (/(PowerPoint|スライド|プレゼンテーション|図形)/i.test(text)) return "powerpoint";
    if (/(Slack|Teams|チャット|チャンネル|メッセージ|未読)/i.test(text)) return "slack";
    if (/(ターミナル|コマンドプロンプト|シェル|コマンド履歴|リバースサーチ)/i.test(text)) return "vscode";
    if (/(タスクマネージャー)/i.test(text)) return "taskmanager";
    if (/(ファイル名を指定して実行)/i.test(text)) return "rundialog";
    if (/(通知パネル|アクションセンター)/i.test(text)) return "actioncenter";
    if (/(タスクビュー|仮想デスクトップ)/i.test(text)) return "taskview";
    if (/(Windows|Mac|タスクバー|デスクトップ|仮想|設定|アプリ|画面|パソコン|システム|スタートメニュー|電卓|メモ帳|クイックリンクメニュー|PC|クリップボード|ロック)/i.test(text)) return "windows";
    
    return "default";
  };

  const ctx = getUIContext(q);
  const os: "mac" | "windows" = isMac ? "mac" : "windows";
  const mockProps = { os, isSuccess, q, inputValue, setInputValue, handleInputKeyDown, handleInputSubmit };

  switch (ctx) {
    case "excel": return <ExcelMock {...mockProps} />;
    case "word": return <WordMock {...mockProps} />;
    case "browser": return <BrowserMock {...mockProps} />;
    case "explorer": return <ExplorerMock {...mockProps} />;
    case "windows": return <WindowsMock {...mockProps} />;
    case "vscode": return <VsCodeMock {...mockProps} />;
    case "powerpoint": return <PowerpointMock {...mockProps} />;
    case "slack": return <SlackMock {...mockProps} />;
    case "taskmanager": return <TaskManagerMock {...mockProps} />;
    case "rundialog": return <RunDialogMock {...mockProps} />;
    case "actioncenter": return <ActionCenterMock {...mockProps} />;
    case "taskview": return <TaskViewMock {...mockProps} />;
    default:
      return (
        <div className={styles.defaultGimmick}>
          <div className={styles.defaultGimmickBox}>
            指示されたキーを入力...
          </div>
        </div>
      );
  }
}
