import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  if (line.includes("=")) {
    const [key, ...rest] = line.split("=");
    env[key.trim()] = rest.join("=").trim().replace(/['"]/g, '');
  }
}

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const k5 = [
  { id: 501, question: "ファイルを上書き保存するショートカットキーはどれか。", choices: ["A. Ctrl + S", "B. Ctrl + P", "C. Ctrl + C", "D. Ctrl + Z"], answer: "A. Ctrl + S", explanation: "SはSave（保存）の頭文字です。こまめに押すことで、作業中のデータ消失を防ぐ最も重要なショートカットキーです。\n\n【他の選択肢】\n・Ctrl + P: 印刷 (Print)\n・Ctrl + C: コピー (Copy)\n・Ctrl + Z: 元に戻す" },
  { id: 502, question: "選択したテキストをコピーするショートカットキーはどれか。", choices: ["A. Ctrl + C", "B. Ctrl + X", "C. Ctrl + V", "D. Ctrl + A"], answer: "A. Ctrl + C", explanation: "CはCopy（コピー）の頭文字です。選択した文字やファイルをクリップボードに記憶させます。\n\n【他の選択肢】\n・Ctrl + X: 切り取り (カット)\n・Ctrl + V: 貼り付け (ペースト)\n・Ctrl + A: すべて選択 (All)" },
  { id: 503, question: "コピーしたテキストを貼り付けるショートカットキーはどれか。", choices: ["A. Ctrl + V", "B. Ctrl + P", "C. Ctrl + B", "D. Ctrl + S"], answer: "A. Ctrl + V", explanation: "Vの由来には諸説ありますが、キーボード上でCのすぐ隣に配置されているため、コピー（C）とセットで素早く操作できるようになっています。\n\n【他の選択肢】\n・Ctrl + P: 印刷 (Print)\n・Ctrl + B: 太字 (Bold)\n・Ctrl + S: 保存 (Save)" },
  { id: 504, question: "直前の操作を元に戻すショートカットキーはどれか。", choices: ["A. Ctrl + Z", "B. Ctrl + Y", "C. Ctrl + R", "D. Ctrl + U"], answer: "A. Ctrl + Z", explanation: "誤って文字を消してしまったり、ファイルを移動してしまった場合に、時間を1つ巻き戻すことができる強力なショートカットです。\n\n【他の選択肢】\n・Ctrl + Y: やり直し (元に戻した操作の取り消し)\n・Ctrl + R: リロード／右揃え\n・Ctrl + U: 下線 (Underline)" },
  { id: 505, question: "テキスト全体を「すべて選択」するショートカットキーはどれか。", choices: ["A. Ctrl + A", "B. Ctrl + F", "C. Ctrl + E", "D. Ctrl + W"], answer: "A. Ctrl + A", explanation: "AはAll（すべて）の頭文字です。長文を最初から最後まで選択したい場合に、マウスでドラッグする手間を省けます。\n\n【他の選択肢】\n・Ctrl + F: 検索 (Find)\n・Ctrl + E: 中央揃え／検索バーへのフォーカス\n・Ctrl + W: タブやウィンドウを閉じる" },
  { id: 506, question: "印刷ダイアログを開くショートカットキーはどれか。", choices: ["A. Ctrl + P", "B. Ctrl + O", "C. Ctrl + I", "D. Ctrl + D"], answer: "A. Ctrl + P", explanation: "PはPrint（印刷）の頭文字です。WebページやWord文書などをすぐに印刷したい場合に便利です。\n\n【他の選択肢】\n・Ctrl + O: ファイルを開く (Open)\n・Ctrl + I: 斜体 (Italic)\n・Ctrl + D: お気に入り追加／フォント設定" },
  { id: 507, question: "ページ内の文字を検索するショートカットキーはどれか。", choices: ["A. Ctrl + F", "B. Ctrl + S", "C. Ctrl + K", "D. Ctrl + L"], answer: "A. Ctrl + F", explanation: "FはFind（見つける）の頭文字です。Webページや文書の中から特定のキーワードを瞬時に探し出すことができます。\n\n【他の選択肢】\n・Ctrl + S: 保存 (Save)\n・Ctrl + K: リンクの挿入／ブラウザの検索バー\n・Ctrl + L: アドレスバーの選択" },
  { id: 508, question: "選択したテキストを切り取るショートカットキーはどれか。", choices: ["A. Ctrl + X", "B. Ctrl + C", "C. Ctrl + T", "D. Ctrl + K"], answer: "A. Ctrl + X", explanation: "Xはハサミの形に見えることから、文字やファイルを「切り取る（カット）」ショートカットとして割り当てられています。\n\n【他の選択肢】\n・Ctrl + C: コピー (Copy)\n・Ctrl + T: 新しいタブを開く\n・Ctrl + K: リンクの挿入" },
  { id: 509, question: "文字を太字にするショートカットキーはどれか。", choices: ["A. Ctrl + B", "B. Ctrl + I", "C. Ctrl + U", "D. Ctrl + N"], answer: "A. Ctrl + B", explanation: "BはBold（太字）の頭文字です。WordやExcelなどで、強調したい文字を素早く太字に変更できます。\n\n【他の選択肢】\n・Ctrl + I: 斜体 (Italic)\n・Ctrl + U: 下線 (Underline)\n・Ctrl + N: 新規作成 (New)" },
  { id: 510, question: "ブラウザを再読み込み（リロード）するショートカットキーはどれか。", choices: ["A. Ctrl + R", "B. Ctrl + E", "C. Ctrl + W", "D. Ctrl + T"], answer: "A. Ctrl + R", explanation: "RはReload（再読み込み）の頭文字です。ページが正しく表示されない場合や、最新の情報に更新したい場合に使用します。（F5キーでも同じ動作になります）\n\n【他の選択肢】\n・Ctrl + E: 検索バーにフォーカス\n・Ctrl + W: タブを閉じる\n・Ctrl + T: 新しいタブを開く" }
];

const k4 = [
  { id: 401, question: "ブラウザで新しいタブを開くショートカットキーはどれか。", choices: ["A. Ctrl + T", "B. Ctrl + N", "C. Ctrl + W", "D. Ctrl + J"], answer: "A. Ctrl + T", explanation: "TはTab（タブ）の頭文字です。現在見ているページを残したまま、新しく検索などをしたい時に使います。\n\n【他の選択肢】\n・Ctrl + N: 新しいウィンドウを開く (New)\n・Ctrl + W: 現在のタブを閉じる\n・Ctrl + J: ダウンロード履歴を開く" },
  { id: 402, question: "ブラウザで現在のタブを閉じるショートカットキーはどれか。", choices: ["A. Ctrl + W", "B. Ctrl + Q", "C. Ctrl + E", "D. Ctrl + D"], answer: "A. Ctrl + W", explanation: "不要になったタブをマウスの小さな×ボタンで閉じる手間を省けます。\n\n【他の選択肢】\n・Ctrl + Q: アプリケーション全体の終了（Macなど）\n・Ctrl + E: 検索バーにフォーカス\n・Ctrl + D: お気に入り（ブックマーク）に追加" },
  { id: 403, question: "誤って閉じたタブを復元するショートカットキーはどれか。", choices: ["A. Ctrl + Shift + T", "B. Ctrl + Alt + T", "C. Ctrl + Shift + W", "D. Ctrl + Z"], answer: "A. Ctrl + Shift + T", explanation: "「新しいタブを開く（Ctrl+T）」にShiftを加えることで、「閉じてしまったタブを復活させる」という強力な復元機能になります。\n\n【他の選択肢】\n・Ctrl + Alt + T: （Linuxなどで）ターミナルを開く\n・Ctrl + Shift + W: すべてのタブ（ウィンドウごと）を閉じる\n・Ctrl + Z: テキスト入力などを元に戻す（タブ復元には使えません）" },
  { id: 404, question: "エクスプローラーを開くショートカットキーはどれか。", choices: ["A. Windows + E", "B. Windows + F", "C. Windows + X", "D. Ctrl + E"], answer: "A. Windows + E", explanation: "EはExplorer（エクスプローラー）の頭文字です。ファイル探しを始める際に、スタートメニューから探す手間を省いて一発で起動できます。\n\n【他の選択肢】\n・Windows + F: フィードバックHubを開く\n・Windows + X: クイックリンクメニューを開く\n・Ctrl + E: 検索バーにフォーカス（ブラウザなど）" },
  { id: 405, question: "デスクトップを表示する（全ウィンドウ最小化）ショートカットキーはどれか。", choices: ["A. Windows + D", "B. Windows + M", "C. Windows + L", "D. Alt + D"], answer: "A. Windows + D", explanation: "DはDesktop（デスクトップ）の頭文字です。もう一度同じキーを押すと、元のウィンドウ配置に復元できるため非常に便利です。\n\n【他の選択肢】\n・Windows + M: すべてのウィンドウを最小化する（復元はShift+Win+M）\n・Windows + L: パソコンをロックする (Lock)\n・Alt + D: ブラウザのアドレスバーを選択する" },
  { id: 406, question: "ファイルやフォルダの名前を変更するショートカットキーはどれか。", choices: ["A. F2", "B. F4", "C. F5", "D. F12"], answer: "A. F2", explanation: "右クリックから「名前の変更」を探す必要がなくなり、ファイル整理のスピードが格段に上がります。\n\n【他の選択肢】\n・F4: アドレスバーの履歴を開く（エクスプローラー）\n・F5: 更新（リロード）\n・F12: 名前を付けて保存（Officeなど）、または開発者ツール（ブラウザ）" },
  { id: 407, question: "新しいフォルダを作成するショートカットキーはどれか。", choices: ["A. Ctrl + Shift + N", "B. Ctrl + N", "C. Ctrl + Alt + N", "D. Shift + N"], answer: "A. Ctrl + Shift + N", explanation: "NはNew（新規）の頭文字です。右クリックから「新規作成」＞「フォルダー」とたどる煩わしい手順をスキップできます。\n\n【他の選択肢】\n・Ctrl + N: 新しいウィンドウを開く\n・Ctrl + Alt + N: （特定のアプリの機能）\n・Shift + N: （単なる大文字のN入力）" },
  { id: 408, question: "クリップボードの履歴を表示するショートカットキーはどれか。", choices: ["A. Windows + V", "B. Ctrl + V", "C. Alt + V", "D. Windows + C"], answer: "A. Windows + V", explanation: "過去にコピーしたテキストや画像の履歴から選んで貼り付けることができる、Windowsの非常に強力な機能です。（※初回は機能をオンにする必要があります）\n\n【他の選択肢】\n・Ctrl + V: 直前にコピーしたものだけを貼り付ける\n・Alt + V: 表示（View）メニューを開くなど\n・Windows + C: Copilot（Cortana）を開く" },
  { id: 409, question: "ブラウザのアドレスバーを選択するショートカットキーはどれか。", choices: ["A. Ctrl + L", "B. Ctrl + K", "C. Alt + D", "D. AとCの両方"], answer: "D. AとCの両方", explanation: "アドレスバーを選択すると、そのまま検索キーワードを入力したり、URLをコピーしたりできます。どちらのショートカットも広く使われています。\n\n【他の選択肢】\n・Ctrl + L: アドレスバーを選択 (Location)\n・Alt + D: アドレスバーを選択\n・Ctrl + K: 検索エンジンによる検索状態にする" },
  { id: 410, question: "パソコンの画面をロックするショートカットキーはどれか。", choices: ["A. Windows + L", "B. Windows + K", "C. Ctrl + L", "D. Alt + L"], answer: "A. Windows + L", explanation: "LはLock（ロック）の頭文字です。離席する際に他人にパソコンを操作されないよう、一瞬でセキュリティを確保する社会人の必須ショートカットです。\n\n【他の選択肢】\n・Windows + K: キャスト（ワイヤレス接続）メニューを開く\n・Ctrl + L: ブラウザのアドレスバーを選択する\n・Alt + L: （特定のアプリの機能）" }
];

const p5 = [
  {"id":5001,"type":"select_all","question":"下のテキストエリア内の文章をすべて選択してください。（マウスによるドラッグ選択禁止）","expectedKeyCombo":["control","a"],"answer":"CORRECT","explanation":"長文をマウスでドラッグして選択するのは時間がかかり、ミスも起きやすくなります。Ctrl+A（All）を使えば、どんなに長い文章でも一瞬で全選択できます。"},
  {"id":5002,"type":"copy_paste","question":"下の複雑なURLをコピーして、すぐ下の入力欄に貼り付けてください。（右クリック禁止）","expectedKeyCombo":["control","v"],"taskData":{"targetText":"https://example.com/secure/token=xyz987"},"answer":"https://example.com/secure/token=xyz987","explanation":"URLやパスワードなど、絶対に間違えてはいけない文字列は手入力せず、必ずコピー（Ctrl+C）とペースト（Ctrl+V）を使用して正確に入力しましょう。"},
  {"id":5003,"type":"save_file","question":"このファイルを「上書き保存」してください。","expectedKeyCombo":["control","s"],"answer":"CORRECT","explanation":"PCのフリーズや不慮のエラーに備え、作業中は息をするようにCtrl+S（Save）を押すクセをつけましょう。数秒の操作が数時間の作業データを救います。"},
  {"id":5004,"type":"find_password","question":"以下の大量のテキストの中から「パスワード」を探し出し、下の解答欄に入力してください。","expectedKeyCombo":["control","f"],"taskData":{"password":"APPLE"},"answer":"APPLE","explanation":"大量の文字列から目視で目的の単語を探すのは非効率です。Ctrl+F（Find）を使えば、数万文字の中からでも瞬時に目的の箇所へジャンプできます。"},
  {"id":5005,"type":"undo_action","question":"（Word）誤って削除してしまったテキストを「元に戻す」ショートカットを使用してください。","expectedKeyCombo":["control","z"],"answer":"CORRECT","explanation":"誤って大切なテキストを消してしまった時は慌てずにCtrl+Zを押しましょう。ほとんどのアプリで「直前の操作を取り消して元に戻す」ことができます。"},
  {"id":5006,"type":"browser_reload","question":"ブラウザ画面を「リロード（再読み込み）」してください。","expectedKeyCombo":["control","r"],"answer":"CORRECT","explanation":"Webページの動作がおかしい時や、最新の情報を取得し直したい時はCtrl+R（Reload）を押します。F5キーでも同様にリロードが可能です。"},
  {"id":5007,"type":"bold_text","question":"（Word）選択中のテキストを「太字」にするショートカットを使用してください。","expectedKeyCombo":["control","b"],"answer":"CORRECT","explanation":"文書作成において、マウスでメニューから「B」のアイコンを探してクリックするよりも、Ctrl+B（Bold）を押す方が圧倒的に早く文字を強調できます。"},
  {"id":5008,"type":"print_doc","question":"このドキュメントを「印刷」するダイアログを呼び出してください。","expectedKeyCombo":["control","p"],"answer":"CORRECT","explanation":"資料を印刷する際、メニューをたどって「印刷」を探す必要はありません。Ctrl+P（Print）を押せば、いつでもすぐに印刷設定画面を呼び出せます。"},
  {"id":5031,"type":"mail_undo_loss","question":"（メール）30分かけて作成した顧客向けメールが、誤って全選択状態のまま上書きされ白紙同然になりました。直前の操作を取り消してください。","expectedKeyCombo":["control","z"],"answer":"CORRECT","explanation":"Ctrl+Zは直前の操作を取り消すショートカットです。文章を消してしまった、入力内容を上書きしてしまった、といった実務上の事故からすばやく復旧できます。"},
  {"id":5032,"type":"copy_paste","question":"請求システムに入力するワンタイムコードをコピーし、入力欄に貼り付けてください。","taskData":{"targetText":"PAY-8G2Q-19ZK"},"expectedKeyCombo":["control","v"],"answer":"PAY-8G2Q-19ZK","explanation":"Ctrl+Vはコピーした内容を貼り付けるショートカットです。英数字が混ざったコードは手入力ミスが起きやすいため、コピー＆ペーストで正確に入力するのが安全です。"},
  {"id":5033,"type":"select_all","question":"長い障害対応ログを丸ごとコピーする必要があります。テキストエリア内の内容をすべて選択してください。","expectedKeyCombo":["control","a"],"answer":"CORRECT","explanation":"Ctrl+Aは現在の入力欄や文書内の内容をすべて選択するショートカットです。長文をドラッグで選択する手間を省き、コピーや削除を一瞬で行えます。"},
  {"id":5034,"type":"document_save","question":"（文書編集）議事録を作成中にPCのバッテリー残量低下通知が出ました。今すぐ作業中のファイルを保存してください。","expectedKeyCombo":["control","s"],"answer":"CORRECT","explanation":"Ctrl+Sは保存のショートカットです。作業中の文書や表計算ファイルは、トラブルに備えてこまめに保存する習慣が重要です。"},
  {"id":5035,"type":"find_password","question":"長い手順書の中に埋もれている確認コードを、ページ内検索で探してください。","taskData":{"password":"R7x-42Q"},"expectedKeyCombo":["control","f"],"answer":"R7x-42Q","explanation":"Ctrl+Fはページ内や文書内を検索するショートカットです。長いマニュアルやログから必要な文字列を探す時、目視で探すより圧倒的に速く正確です。"},
  {"id":5036,"type":"browser_reload","question":"（ブラウザ）勤怠入力画面のボタンが表示されません。まず現在のページを再読み込みしてください。","expectedKeyCombo":["control","r"],"answer":"CORRECT","explanation":"Ctrl+Rはブラウザでページを再読み込みするショートカットです。表示が崩れている、最新情報が反映されていない、といった時の基本的な確認操作です。"},
  {"id":5037,"type":"basic_copy_filename","question":"選択中のファイル名をチャットに共有するため、クリップボードにコピーしてください。","expectedKeyCombo":["control","c"],"answer":"CORRECT","explanation":"Ctrl+Cは選択中の文字列やファイルをコピーするショートカットです。元の内容を残したまま、別の場所へ同じ内容を貼り付けたい時に使います。"},
  {"id":5038,"type":"basic_cut_paragraph","question":"報告書の段落を別の見出しの下へ移動したいです。選択中の段落を切り取ってください。","expectedKeyCombo":["control","x"],"answer":"CORRECT","explanation":"Ctrl+Xは切り取りのショートカットです。選択した内容を元の場所から削除し、貼り付け先へ移動する準備ができます。文章や表の並べ替えでよく使います。"},
  {"id":5039,"type":"basic_redo","question":"取り消し操作を押しすぎて、必要な修正まで戻ってしまいました。取り消した操作をやり直してください。","expectedKeyCombo":["control","y"],"answer":"CORRECT","explanation":"Ctrl+Yは、Ctrl+Zで取り消した操作をやり直すショートカットです。戻しすぎた編集を再適用したい時に便利です。"},
  {"id":5040,"type":"escape_close_overlay","question":"検索バーや小さなポップアップが画面に残っていて作業の邪魔です。キーボードで閉じてください。","expectedKeyCombo":["escape"],"answer":"CORRECT","explanation":"Escapeキーは、検索バー、メニュー、ダイアログなどを閉じる時によく使います。マウスで閉じるボタンを探さずに、すばやく元の作業へ戻れます。"}
];

const p4 = [
  {"id":4001,"type":"browser_new_tab","question":"（ブラウザ）「新しいタブ」を開いてください。","expectedKeyCombo":["control","t"],"answer":"CORRECT","explanation":"調べ物をしている最中に、今見ているページを消さずに別の検索を始めたい時にCtrl+Tが役立ちます。"},
  {"id":4002,"type":"browser_close_tab","question":"（ブラウザ）「現在のタブ」を閉じてください。","expectedKeyCombo":["control","w"],"answer":"CORRECT","explanation":"タブが増えすぎるとPCの動作が重くなります。マウスカーソルを小さな×ボタンに合わせる手間なく、Ctrl+Wでサクサク閉じましょう。"},
  {"id":4003,"type":"browser_reopen_tab","question":"（ブラウザ）誤って閉じてしまったタブを「復元」してください。","expectedKeyCombo":["control","shift","t"],"answer":"CORRECT","explanation":"「あっ、間違えて消しちゃった！」という時でも大丈夫です。Ctrl+Shift+Tを押せば、閉じたタブを履歴ごと魔法のように復活させることができます。"},
  {"id":4004,"type":"browser_address","question":"（ブラウザ）「アドレスバー」を選択（フォーカス）してください。","expectedKeyCombo":["control","l"],"answer":"CORRECT","explanation":"今見ているページのURLをコピーして誰かに送りたい時や、すぐに別の検索を始めたい時は、マウスで上部をクリックするよりCtrl+Lが最速です。"},
  {"id":4005,"type":"browser_bookmark","question":"（ブラウザ）このページを「ブックマーク（お気に入り）」に追加してください。","expectedKeyCombo":["control","d"],"answer":"CORRECT","explanation":"よく見るページやお気に入りのページを保存したい時は、Ctrl+D（Bookmark / 語尾のD）を使えば一瞬でブックマークバーに追加できます。"},
  {"id":4006,"type":"explorer_rename","question":"（エクスプローラー）選択されているファイルの名前を変更するモードに切り替えてください。","expectedKeyCombo":["f2"],"answer":"CORRECT","explanation":"ファイル整理の基本です。右クリックから「名前の変更」を選ぶのは時間がかかりますが、F2キーなら一発でファイル名編集モードに入れます。"},
  {"id":4007,"type":"explorer_new_folder","question":"（エクスプローラー）「新しいフォルダ」を作成してください。","expectedKeyCombo":["control","shift","n"],"answer":"CORRECT","explanation":"資料をまとめるためのフォルダを作りたい時、右クリックメニューの深い階層をたどらずとも、Ctrl+Shift+Nで一瞬にして新しいフォルダが誕生します。"},
  {"id":4008,"type":"word_redo","question":"（Word）「元に戻す」で取り消した操作を「やり直す（リドゥ）」ショートカットを使用してください。","expectedKeyCombo":["control","y"],"answer":"CORRECT","explanation":"「元に戻す（Ctrl+Z）」を押しすぎてしまい、戻しすぎた！という時はCtrl+Y（やり直し）で進めることができます。"},
  {"id":4009,"type":"excel_top","question":"（Excel）表の「先頭（A1セル）」へ一気に移動してください。","expectedKeyCombo":["control","home"],"answer":"CORRECT","explanation":"数千行・数百列ある巨大なExcelデータでも、Ctrl+Homeを押せば一瞬でスタート地点（A1セル）に帰ってくることができます。"},
  {"id":4010,"type":"excel_bottom","question":"（Excel）データが入力されている「右下端のセル」へ一気に移動してください。","expectedKeyCombo":["control","end"],"answer":"CORRECT","explanation":"巨大なデータの最後尾に新しいデータを追加したい時、マウスで延々とスクロールするのは時間の無駄です。Ctrl+Endで一気に末尾へジャンプしましょう。"},
  {"id":4011,"type":"browser_back","question":"（ブラウザ）前のページへ「戻る」ショートカットを使用してください。","expectedKeyCombo":["alt","arrowleft"],"answer":"CORRECT","explanation":"マウスを画面左上の「←」ボタンまで動かさなくても、Altキーと左矢印キーを組み合わせるだけで前のページに戻ることができます。"},
  {"id":4012,"type":"word_italic","question":"（Word）選択中のテキストを「斜体（イタリック）」にするショートカットを使用してください。","expectedKeyCombo":["control","i"],"answer":"CORRECT","explanation":"英語の引用や専門用語など、文字を少し斜めに傾けて（イタリック体）目立たせたい時はCtrl+Iを使います。"},
  {"id":4013,"type":"word_underline","question":"（Word）選択中のテキストに「下線（アンダーライン）」を引くショートカットを使用してください。","expectedKeyCombo":["control","u"],"answer":"CORRECT","explanation":"重要なキーワードに下線（アンダーライン）を引きたい時は、マウスでUのアイコンを探さずともCtrl+Uでスピーディに装飾できます。"},
  {"id":4014,"type":"word_search","question":"（Word）文書内の文字を検索・置換するダイアログを開いてください。","expectedKeyCombo":["control","h"],"answer":"CORRECT","explanation":"大量の文書の中から特定の単語を見つけ出し、別の単語に一括で書き換えたい（置換したい）場合はCtrl+Hが非常に便利です。"},
  {"id":4015,"type":"browser_downloads","question":"（ブラウザ）「ダウンロード履歴」のページを開いてください。","expectedKeyCombo":["control","j"],"answer":"CORRECT","explanation":"「さっきダウンロードしたファイル、どこに行ったっけ？」と探す時間をゼロにするのがCtrl+J（ダウンロード履歴）です。"},
  {"id":4031,"type":"browser_restore_tab","question":"（ブラウザ）リサーチ中に30個近くタブを開いています。重要な資料ページを誤って閉じてしまったので、直前に閉じたタブを復元してください。","expectedKeyCombo":["control","shift","t"],"answer":"CORRECT","explanation":"Ctrl+Shift+Tは直前に閉じたブラウザタブを復元するショートカットです。誤って閉じたページを履歴から探し直す手間を省けます。"},
  {"id":4032,"type":"browser_new_tab","question":"（ブラウザ）今見ている資料ページを残したまま、別のキーワードで検索するために新しいタブを開いてください。","expectedKeyCombo":["control","t"],"answer":"CORRECT","explanation":"Ctrl+Tはブラウザで新しいタブを開くショートカットです。現在のページを閉じずに別の調査や作業を始められます。"},
  {"id":4033,"type":"browser_close_tab","question":"（ブラウザ）確認し終わったプレビュー画面がタブに残っています。現在のタブを閉じて作業画面を整理してください。","expectedKeyCombo":["control","w"],"answer":"CORRECT","explanation":"Ctrl+Wは現在のタブを閉じるショートカットです。不要なタブをすばやく閉じることで、調査中や作業中のタブ迷子を防げます。"},
  {"id":4034,"type":"browser_hard_reload","question":"（ブラウザ）「デザインを更新しました」と連絡が来ましたが、自分の画面だけ古い表示のままです。キャッシュを無視して強制的に再読み込みしてください。","expectedKeyCombo":["control","shift","r"],"answer":"CORRECT","explanation":"Ctrl+Shift+Rは、ブラウザでキャッシュを無視して再読み込みする時に使います。CSSや画像などの古いキャッシュが残っている時の確認に有効です。"},
  {"id":4035,"type":"browser_zoom_reset","question":"（ブラウザ）誤操作でWebページが極小サイズになり、文字が読めません。表示倍率を標準に戻してください。","expectedKeyCombo":["control","0"],"answer":"CORRECT","explanation":"Ctrl+0はブラウザの表示倍率を100%に戻すショートカットです。拡大・縮小しすぎた画面を一瞬で標準表示に戻せます。"},
  {"id":4036,"type":"form_previous_field","question":"（フォーム入力）長い申請フォームを入力中、一つ上の住所欄に入力ミスを見つけました。マウスを使わず前の入力欄へ戻ってください。","expectedKeyCombo":["shift","tab"],"answer":"CORRECT","explanation":"Shift+Tabは、フォームや入力欄で一つ前の項目へ戻るショートカットです。Tabで次へ進み、Shift+Tabで戻る操作を覚えると、入力作業がかなり速くなります。"},
  {"id":4037,"type":"explorer_rename","question":"（エクスプローラー）資料フォルダ内のファイル名を連番付きに整理しています。選択中のファイル名を変更できる状態にしてください。","expectedKeyCombo":["f2"],"answer":"CORRECT","explanation":"F2は、選択中のファイルやフォルダの名前変更に使います。右クリックメニューを開かずにリネームできるため、ファイル整理の効率が上がります。"},
  {"id":4038,"type":"explorer_new_folder","question":"（エクスプローラー）案件資料を整理するため、現在の場所に新しいフォルダーを作成してください。","expectedKeyCombo":["control","shift","n"],"answer":"CORRECT","explanation":"Ctrl+Shift+Nは、エクスプローラーで新しいフォルダーを作成するショートカットです。資料整理や案件別フォルダー作成をマウス操作なしで行えます。"},
  {"id":4039,"type":"word_underline","question":"（Word）議事録の中で、提出期限だけを目立たせたいです。選択中のテキストに下線を付けてください。","expectedKeyCombo":["control","u"],"answer":"CORRECT","explanation":"Ctrl+Uは選択中の文字に下線を付けるショートカットです。期限、注意点、重要語句などを強調したい時に使えます。"},
  {"id":4040,"type":"excel_last_cell","question":"（Excel）10万行ある顧客リストの末尾に追記したいです。スクロールせず、入力済み範囲の最後のセルへ一気に移動してください。","expectedKeyCombo":["control","end"],"answer":"CORRECT","explanation":"Ctrl+Endは、Excelで使用中の範囲の最後のセルへ移動するショートカットです。巨大な表の末尾へ移動する時、マウスホイールで延々とスクロールする必要がなくなります。"}
];

async function update() {
  await setDoc(doc(db, "exams", "5kyu"), {
    id: "5kyu", title: "5級 (Windows版)", questionsCount: 5, passingRate: 0.8, duration: 1800, pool: k5
  });
  await setDoc(doc(db, "exams", "4kyu"), {
    id: "4kyu", title: "4級 (Windows版)", questionsCount: 5, passingRate: 0.8, duration: 1800, pool: k4
  });
  await setDoc(doc(db, "exams", "practical-5kyu"), {
    id: "practical-5kyu", title: "5級 実務検定 (実践シミュレータ)", questionsCount: 5, passingRate: 0.8, duration: 1800, pool: p5
  });
  await setDoc(doc(db, "exams", "practical-4kyu"), {
    id: "practical-4kyu", title: "4級 実務検定 (実践シミュレータ)", questionsCount: 5, passingRate: 0.8, duration: 1800, pool: p4
  });
  console.log("Updated 5kyu and 4kyu in Firestore.");
}

update().catch(console.error).finally(() => process.exit(0));
