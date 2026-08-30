export function getVsCodeInitialCode(question: string) {
  if (question.includes("マルチカーソル") || question.includes("同じ変数名が複数")) {
    return "const data = {\n  id_1: 100,\n  id_2: 200,\n  id_3: 300,\n  id_4: 400,\n  id_5: 500\n};";
  }
  if (question.includes("複製") || question.includes("コピー")) {
    return "export const API_ENDPOINT = 'https://api.example.com/v1';\n\n// カーソルは上の行にあります";
  }
  if (question.includes("行を移動")) {
    return "function init() {\n  console.log('2番目に実行したい');\n  console.log('1番目に実行したい');\n}";
  }
  if (question.includes("コメントアウト")) {
    return "function debug() {\n  // 以下の行をコメントアウトしてください\n  console.log('大量のログが出力されます');\n}";
  }
  if (question.includes("フォーマット")) {
    return "function poorlyFormatted() {\nlet x=1;\n    if(x) {\n console.log(x)\n  }\n}";
  }
  if (question.includes("リネーム") || question.includes("一括変更") || question.includes("定義へ移動")) {
    return "function calculate() {\n  let tmp = 0;\n  tmp += 10;\n  return tmp;\n}";
  }
  if (question.includes("markdown")) {
    return "# プロジェクト概要\n\nこのリポジトリは...\n\n## 使い方\n\n`npm run start`で起動します。\n";
  }
  return "import { useState } from 'react';\n\nexport default function App() {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n}";
}

export function getBrowserContent(question: string) {
  if (question.includes("URL") || question.includes("アドレスバー") || question.includes("複製")) {
    return { title: "【重要】ログイン障害の調査報告", url: "https://confluence.example.com/pages/viewpage.action?pageId=98765432", h1: "ログインAPIのタイムアウト障害について", p: "2024年8月20日 13:00頃から発生している認証エラーについての調査メモです。" };
  }
  if (question.includes("開発者ツール") || question.includes("エラーを確認")) {
    return { title: "顧客管理システム - 本番環境", url: "https://admin.example.com/customers", h1: "顧客一覧", p: "データの読み込みに失敗しました。画面が真っ白になっています。" };
  }
  if (question.includes("ダウンロード履歴")) {
    return { title: "売上データ.csv", url: "https://reports.example.com/download/sales_202408", h1: "ダウンロード完了", p: "売上データ_202408.csv のダウンロードが完了しました。" };
  }
  if (question.includes("復元") || question.includes("検索") || question.includes("ブックマーク")) {
    return { title: "リリースノート v2.4.0", url: "https://github.com/example/repo/releases/v2.4.0", h1: "Release v2.4.0", p: "このリリースには重要なバグ修正が含まれています。エラーコード: E-5002 が解消されました。" };
  }
  return { title: "開発ドキュメント", url: "https://docs.example.com/guide/getting-started", h1: "セットアップガイド", p: "このプロジェクトをローカル環境で動かすための手順を説明します。" };
}
