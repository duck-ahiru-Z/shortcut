import fs from "node:fs";

const path = "scripts/archive/knowledge_pool.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));
const pool = data["knowledge-3kyu"];
const replaceIds = new Set([3001, 3002, 3003, 3005, 3006, 3007, 3008, 3013]);
const browserQuestions = [
  [3041, "ブラウザで新しいタブを開いて、別のページを調べたい。どのショートカットキーを使うか。", ["A. Ctrl + T", "B. Ctrl + W", "C. Ctrl + R", "D. Ctrl + H"], "A. Ctrl + T", "Ctrl + Tは新しいタブ（Tab）を開きます。現在のページを残したまま別の情報を調べるときに便利です。\n\n【他の選択肢】\n・Ctrl + W: 現在のタブを閉じる\n・Ctrl + R: ページを再読み込みする\n・Ctrl + H: 閲覧履歴を開く"],
  [3042, "ブラウザで閉じてしまったタブをもう一度開きたい。どのショートカットキーを使うか。", ["A. Ctrl + Shift + T", "B. Ctrl + Shift + W", "C. Ctrl + T", "D. Alt + Left"], "A. Ctrl + Shift + T", "Ctrl + Shift + Tは直前に閉じたタブを復元します。間違えてタブを閉じたときにすぐ戻せます。\n\n【他の選択肢】\n・Ctrl + Shift + W: ウィンドウを閉じる\n・Ctrl + T: 新しいタブを開く\n・Alt + Left: 前のページへ戻る"],
  [3043, "複数のタブを開いている。マウスを使わず右隣のタブへ移動するキーはどれか。", ["A. Ctrl + Tab", "B. Ctrl + W", "C. Ctrl + PageUp", "D. Alt + Tab"], "A. Ctrl + Tab", "Ctrl + Tabは右隣のタブへ移動します。調査中にタブを順番に確認するときに使います。\n\n【他の選択肢】\n・Ctrl + W: タブを閉じる\n・Ctrl + PageUp: 左隣のタブへ移動する\n・Alt + Tab: アプリを切り替える"],
  [3044, "あとで見返したいページをブックマークに登録したい。どのショートカットキーを使うか。", ["A. Ctrl + D", "B. Ctrl + B", "C. Ctrl + M", "D. Ctrl + K"], "A. Ctrl + D", "Ctrl + Dは現在のページをブックマーク（お気に入り）に追加します。よく使うページを保存するときに便利です。\n\n【他の選択肢】\n・Ctrl + B: 太字など、アプリによって異なる操作\n・Ctrl + M: ウィンドウを最小化する場合がある\n・Ctrl + K: 検索欄へフォーカスする"],
  [3045, "前に見ていたページへ戻りたい。ブラウザで使うショートカットキーはどれか。", ["A. Alt + Left", "B. Alt + Right", "C. Ctrl + R", "D. Ctrl + L"], "A. Alt + Left", "Alt + Leftはブラウザの履歴を1つ戻ります。リンクをたどったあと、前のページを見直すときに使います。\n\n【他の選択肢】\n・Alt + Right: 次の履歴へ進む\n・Ctrl + R: ページを再読み込みする\n・Ctrl + L: アドレスバーを選択する"],
  [3046, "入力した検索語を変えずに、検索結果のページだけ最新状態に更新したい。どのキーを使うか。", ["A. Ctrl + R", "B. Ctrl + N", "C. Ctrl + F", "D. F11"], "A. Ctrl + R", "Ctrl + Rは現在のページを再読み込み（Reload）します。フォーム入力を保ったまま更新したい場面で使います。\n\n【他の選択肢】\n・Ctrl + N: 新しいウィンドウを開く\n・Ctrl + F: ページ内を検索する\n・F11: 全画面表示を切り替える"],
  [3047, "以前に閲覧したページのタイトルやURLを確認したい。どのショートカットキーを使うか。", ["A. Ctrl + H", "B. Ctrl + J", "C. Ctrl + D", "D. Ctrl + P"], "A. Ctrl + H", "Ctrl + Hは閲覧履歴（History）を開きます。以前見たページを探し直すときに役立ちます。\n\n【他の選択肢】\n・Ctrl + J: ダウンロード履歴を開く\n・Ctrl + D: ブックマークに追加する\n・Ctrl + P: 印刷画面を開く"],
  [3048, "ブラウザでダウンロードしたファイルの一覧を確認したい。どのショートカットキーを使うか。", ["A. Ctrl + J", "B. Ctrl + H", "C. Ctrl + S", "D. Ctrl + O"], "A. Ctrl + J", "Ctrl + Jはダウンロード履歴を開きます。保存したファイルの場所を確認したいときに便利です。\n\n【他の選択肢】\n・Ctrl + H: 閲覧履歴を開く\n・Ctrl + S: ページを保存する\n・Ctrl + O: ファイルを開く"],
];
const generatedIds = new Set(browserQuestions.map(([id]) => id));
const retained = pool.filter((question) => !replaceIds.has(question.id) && !generatedIds.has(question.id));
for (const [id, question, choices, answer, explanation] of browserQuestions) retained.push({ id, question, choices, answer, explanation });
data["knowledge-3kyu"] = retained;
fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`knowledge-3kyu=${retained.length}`);
