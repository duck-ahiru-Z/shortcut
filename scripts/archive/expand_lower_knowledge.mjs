import fs from "node:fs";
import { execFileSync } from "node:child_process";

const path = "data/archive/questions_dump.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));
const basics = [
  ["新しい文書を作成したい。どのキーを押すか。", "Ctrl + N"],
  ["保存済みのファイルを開いて編集したい。どのキーを押すか。", "Ctrl + O"],
  ["作業中のタブや文書を閉じたい。どのキーを押すか。", "Ctrl + W"],
  ["取り消した操作をもう一度やり直したい。どのキーを押すか。", "Ctrl + Y"],
  ["長いページから特定の単語を探したい。どのキーを押すか。", "Ctrl + F"],
  ["コピーした文章をカーソル位置に入れたい。どのキーを押すか。", "Ctrl + V"],
  ["選択した文章を別の場所でも使いたい。どのキーを押すか。", "Ctrl + C"],
  ["選択した文章を移動するため、元の場所から切り取りたい。どのキーを押すか。", "Ctrl + X"],
  ["編集中の内容を失わないよう、すぐ保存したい。どのキーを押すか。", "Ctrl + S"],
  ["文書内の項目をまとめて選択したい。どのキーを押すか。", "Ctrl + A"],
  ["席を離れるので、Windowsをすぐロックしたい。どのキーを押すか。", "Windows + L"],
  ["Windowsの設定をキーボードだけで開きたい。どのキーを押すか。", "Windows + I"],
  ["アプリやファイルを名前で検索したい。どのキーを押すか。", "Windows + S"],
  ["開いているウィンドウを隠してデスクトップを確認したい。どのキーを押すか。", "Windows + D"],
  ["ファイルの一覧を表示して、別のファイルを探したい。どのキーを押すか。", "Windows + E"],
  ["応答しないアプリを終了するため管理画面を開きたい。どのキーを押すか。", "Ctrl + Shift + Esc"],
  ["マウスを使わず、別のアプリへ切り替えたい。どのキーを押すか。", "Alt + Tab"],
  ["ブラウザの表示を画面いっぱいに広げたい。このキーは何か。", "F11"],
  ["操作方法がわからないので、ヘルプを開きたい。このキーは何か。", "F1"],
  ["表示が古いページになっているので、最新状態に更新したい。このキーは何か。", "F5"],
];
const choices = ["Ctrl + S", "Ctrl + P", "Ctrl + C", "Ctrl + Z"];
const existing = new Set((data["5kyu"] || []).map((q) => q.id));
for (let i = 0; i < basics.length; i++) {
  const id = 511 + i;
  const [question, answer] = basics[i];
  const rotated = [answer, ...choices.filter((choice) => choice !== answer)].slice(0, 4);
  const position = i % rotated.length;
  const ordered = [...rotated.slice(position), ...rotated.slice(0, position)];
  const item = { id, question, choices: ordered.map((choice, n) => `${String.fromCharCode(65 + n)}. ${choice}`), answer: `${String.fromCharCode(65 + (rotated.indexOf(answer) - position + 4) % 4)}. ${answer}`, explanation: `${answer} は、この操作をすばやく実行するための基本ショートカットです。` };
  const index = data["5kyu"].findIndex((q) => q.id === id);
  if (index >= 0) data["5kyu"][index] = item; else data["5kyu"].push(item);
}
if (data["4kyu"].length < 30) {
  const historical = JSON.parse(execFileSync("git", ["show", "59aad70:questions_dump.json"], { encoding: "utf8" }))["4kyu"];
  const ids = new Set(data["4kyu"].map((q) => q.id));
  for (const question of historical) {
    if (data["4kyu"].length >= 30) break;
    if (!ids.has(question.id)) { data["4kyu"].push(question); ids.add(question.id); }
  }
}
fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`5kyu=${data["5kyu"].length}, 4kyu=${data["4kyu"].length}`);
