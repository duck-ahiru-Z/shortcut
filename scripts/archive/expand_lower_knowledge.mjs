import fs from "node:fs";
import { execFileSync } from "node:child_process";

const path = "data/archive/questions_dump.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));
const basics = [
  ["新しいウィンドウを開くショートカットキーはどれか。", "Ctrl + N"],
  ["ファイルを開くショートカットキーはどれか。", "Ctrl + O"],
  ["ファイルを閉じるショートカットキーはどれか。", "Ctrl + W"],
  ["操作をやり直すショートカットキーはどれか。", "Ctrl + Y"],
  ["テキストを検索するショートカットキーはどれか。", "Ctrl + F"],
  ["選択したテキストを貼り付けるショートカットキーはどれか。", "Ctrl + V"],
  ["選択したテキストをコピーするショートカットキーはどれか。", "Ctrl + C"],
  ["選択したテキストを切り取るショートカットキーはどれか。", "Ctrl + X"],
  ["ファイルを保存するショートカットキーはどれか。", "Ctrl + S"],
  ["すべての項目を選択するショートカットキーはどれか。", "Ctrl + A"],
  ["画面をロックするショートカットキーはどれか。", "Windows + L"],
  ["設定画面を開くショートカットキーはどれか。", "Windows + I"],
  ["検索画面を開くショートカットキーはどれか。", "Windows + S"],
  ["デスクトップを表示するショートカットキーはどれか。", "Windows + D"],
  ["エクスプローラーを開くショートカットキーはどれか。", "Windows + E"],
  ["タスクマネージャーを開くショートカットキーはどれか。", "Ctrl + Shift + Esc"],
  ["アプリを切り替えるショートカットキーはどれか。", "Alt + Tab"],
  ["画面を全画面表示にするキーはどれか。", "F11"],
  ["ヘルプを表示するキーはどれか。", "F1"],
  ["ページを更新するキーはどれか。", "F5"],
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
