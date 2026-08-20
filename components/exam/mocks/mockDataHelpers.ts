export function getVsCodeInitialCode(type: string) {
  if (type.includes("multi_cursor") || type.includes("cursors_line_ends")) {
    return "const data = {\n  id_1: 100,\n  id_2: 200,\n  id_3: 300,\n  id_4: 400,\n  id_5: 500\n};";
  }
  if (type.includes("duplicate_line")) {
    return "export const API_ENDPOINT = 'https://api.example.com/v1';\n\n// カーソルは上の行にあります";
  }
  if (type.includes("move_line")) {
    return "function init() {\n  console.log('2番目に実行したい');\n  console.log('1番目に実行したい');\n}";
  }
  if (type.includes("comment")) {
    return "function debug() {\n  // 以下の行をコメントアウトしてください\n  console.log('大量のログが出力されます');\n}";
  }
  if (type.includes("format")) {
    return "function poorlyFormatted() {\nlet x=1;\n    if(x) {\n console.log(x)\n  }\n}";
  }
  if (type.includes("occurrences") || type.includes("change_all") || type.includes("rename_symbol")) {
    return "function calculate() {\n  let tmp = 0;\n  tmp += 10;\n  return tmp;\n}";
  }
  if (type.includes("markdown")) {
    return "# プロジェクト概要\n\nこのリポジトリは...\n\n## 使い方\n\n`npm run start`で起動します。\n";
  }
  return "import { useState } from 'react';\n\nexport default function App() {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n}";
}

export function getBrowserContent(type: string) {
  if (type.includes("copy_url") || type.includes("duplicate")) {
    return { title: "【重要】ログイン障害の調査報告", url: "https://confluence.example.com/pages/viewpage.action?pageId=98765432", h1: "ログインAPIのタイムアウト障害について", p: "2024年8月20日 13:00頃から発生している認証エラーについての調査メモです。" };
  }
  if (type.includes("devtools")) {
    return { title: "顧客管理システム - 本番環境", url: "https://admin.example.com/customers", h1: "顧客一覧", p: "データの読み込みに失敗しました。画面が真っ白になっています。" };
  }
  if (type.includes("downloads")) {
    return { title: "売上データ.csv", url: "https://reports.example.com/download/sales_202408", h1: "ダウンロード完了", p: "売上データ_202408.csv のダウンロードが完了しました。" };
  }
  if (type.includes("restore") || type.includes("find")) {
    return { title: "リリースノート v2.4.0", url: "https://github.com/example/repo/releases/v2.4.0", h1: "Release v2.4.0", p: "このリリースには重要なバグ修正が含まれています。エラーコード: E-5002 が解消されました。" };
  }
  return { title: "開発ドキュメント", url: "https://docs.example.com/guide/getting-started", h1: "セットアップガイド", p: "このプロジェクトをローカル環境で動かすための手順を説明します。" };
}
