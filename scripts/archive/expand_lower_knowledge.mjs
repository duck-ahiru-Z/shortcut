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
const explain = (answer, optionList) => {
  const key = answer.split(" + ").at(-1);
  const meanings = { S: "Save（保存）", P: "Print（印刷）", C: "Copy（コピー）", Z: "元に戻す", V: "貼り付け", X: "切り取り", A: "すべて選択", N: "新規作成", O: "Open（開く）", W: "閉じる", Y: "やり直す", F: "検索", L: "Lock（ロック）", I: "設定", D: "デスクトップ表示", E: "エクスプローラー", Esc: "タスクマネージャー", Tab: "アプリ切替", F1: "ヘルプ", F5: "更新", F11: "全画面表示" };
  const others = optionList.filter((choice) => choice !== answer).map((choice) => `${choice}`).join("、");
  return `${key}は${meanings[key] || "操作"}の頭文字・意味で覚えられます。こまめに使うことで作業を効率化できます。\n\n【他の選択肢】\n${others.split("、").map((choice) => `・${choice}`).join("\n")}`;
};
data["5kyu"] = (data["5kyu"] || []).filter((q) => q.id < 511);
for (let i = 0; i < basics.length; i++) {
  const id = 511 + i;
  const [question, answer] = basics[i];
  const rotated = [answer, ...choices.filter((choice) => choice !== answer)].slice(0, 4);
  const position = i % rotated.length;
  const ordered = [...rotated.slice(position), ...rotated.slice(0, position)];
  const answerLabel = `${String.fromCharCode(65 + (rotated.indexOf(answer) - position + 4) % 4)}. ${answer}`;
  const item = { id, question, choices: ordered.map((choice, n) => `${String.fromCharCode(65 + n)}. ${choice}`), answer: answerLabel, explanation: explain(answer, rotated) };
  const index = data["4kyu"].findIndex((q) => q.id === id);
  if (index >= 0) data["4kyu"][index] = item; else data["4kyu"].push(item);
}
for (const question of data["5kyu"]) {
  if (!question.explanation && question.answer) question.explanation = explain(question.answer.replace(/^[A-D]\.\s*/, ""), (question.choices || []).map((choice) => choice.replace(/^[A-D]\.\s*/, "")));
}
for (const question of data["4kyu"]) {
  if (!question.explanation && question.answer) question.explanation = explain(question.answer.replace(/^[A-D]\.\s*/, ""), (question.choices || []).map((choice) => choice.replace(/^[A-D]\.\s*/, "")));
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
