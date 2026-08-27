import React from "react";
import LegacyGimmicks from "./mocks/LegacyGimmicks";
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
  // 1. Legacy type-based gimmicks
  const legacyTypes = ["select_all", "find_password", "copy_paste", "rename_file", "save_file", "undo_action", "bold_text", "print_doc"];
  if (q.type && legacyTypes.includes(q.type)) {
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <LegacyGimmicks
          type={q.type}
          taskData={q.taskData}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleInputKeyDown={handleInputKeyDown}
          handleInputSubmit={handleInputSubmit}
          isSuccess={isSuccess}
        />
        {isSuccess && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            backgroundColor: 'var(--success)', color: 'white', padding: '16px 32px',
            borderRadius: '8px', fontSize: '24px', fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 100,
            animation: 'fadeInOut 1s forwards'
          }}>
            実行しました！
          </div>
        )}
      </div>
    );
  }

  // 2. Context-aware generic mock UI
  const getUIContext = (text: string) => {
    if (/(Excel|セル|シート|数式|オートSUM)/i.test(text)) return "excel";
    if (/(Word|段落|文書|文字|書式)/i.test(text)) return "word";
    if (/(ブラウザ|タブ|ページ|ダウンロード|再読み込み|ブックマーク|履歴|Chrome)/i.test(text)) return "browser";
    if (/(エクスプローラー|フォルダ|ファイル)/i.test(text)) return "explorer";
    if (/(VS Code|エディタ|マルチカーソル|コメントアウト|ターミナル|統合ターミナル|リネーム|関数|コマンドパレット)/i.test(text)) return "vscode";
    if (/(PowerPoint|スライド|プレゼンテーション|図形)/i.test(text)) return "powerpoint";
    if (/(Slack|Teams|チャット|チャンネル|メッセージ)/i.test(text)) return "slack";
    if (/(タスクマネージャー)/i.test(text)) return "taskmanager";
    if (/(ファイル名を指定して実行)/i.test(text)) return "rundialog";
    if (/(通知パネル|アクションセンター)/i.test(text)) return "actioncenter";
    if (/(タスクビュー|仮想デスクトップ)/i.test(text)) return "taskview";
    if (/(Windows|タスクバー|デスクトップ|仮想|設定|アプリ|画面|パソコン|システム|スタートメニュー|コマンドプロンプト|電卓|メモ帳|クイックリンクメニュー|PC|クリップボード)/i.test(text)) return "windows";
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
