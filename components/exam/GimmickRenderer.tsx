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
  const getUIContext = (text: string) => {
    // 1. Exact Tag Matching (Highest Priority)
    if (text.includes('【Excel】') || text.includes('（Excel）')) return "excel";
    if (text.includes('【ブラウザ】') || text.includes('（ブラウザ）') || text.includes('（フォーム入力）')) return "browser";
    if (text.includes('【VS Code】') || text.includes('（VS Code）')) return "vscode";
    if (text.includes('【ターミナル】') || text.includes('（ターミナル）')) return "vscode";
    if (text.includes('【Slack】') || text.includes('（Slack）')) return "slack";
    if (text.includes('【Word】') || text.includes('（Word）') || text.includes('ドキュメントを「印刷」')) return "word";
    if (text.includes('【Word/PowerPoint】')) return "word";
    if (text.includes('【PowerPoint】') || text.includes('（PowerPoint）')) return "powerpoint";
    if (text.includes('【エクスプローラー/共通】') || text.includes('（エクスプローラー）')) return "explorer";
    if (text.includes('【Windows共通】') || text.includes('【Mac共通】')) return "windows";
    
    // 2. Fuzzy Text Matching (Fallback)
    if (/(Excel|セル|シート|数式|オートサム|フラッシュフィル|表の|データが)/i.test(text)) return "excel";
    if (/(Word|段落|文字|文章|書式|議事録|テキスト)/i.test(text)) return "word";
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

  const ctx = getUIContext(q.question);
  const os = isMac ? "mac" : "windows";
  
  switch (ctx) {
    case "excel": return <ExcelMock os={os} isSuccess={isSuccess} />;
    case "word": return <WordMock os={os} isSuccess={isSuccess} />;
    case "browser": return <BrowserMock os={os} isSuccess={isSuccess} />;
    case "explorer": return <ExplorerMock os={os} isSuccess={isSuccess} />;
    case "windows": return <WindowsMock os={os} isSuccess={isSuccess} />;
    case "vscode": return <VsCodeMock os={os} isSuccess={isSuccess} />;
    case "powerpoint": return <PowerpointMock os={os} isSuccess={isSuccess} />;
    case "slack": return <SlackMock os={os} isSuccess={isSuccess} />;
    case "taskmanager": return <TaskManagerMock os={os} isSuccess={isSuccess} />;
    case "rundialog": return <RunDialogMock os={os} isSuccess={isSuccess} />;
    case "actioncenter": return <ActionCenterMock os={os} isSuccess={isSuccess} />;
    case "taskview": return <TaskViewMock os={os} isSuccess={isSuccess} />;
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
