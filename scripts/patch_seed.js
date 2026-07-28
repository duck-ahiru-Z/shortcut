const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'scripts', 'seed_all_grades.mjs');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace generatePracticalQuestions function
const generatePracticalBlock = `function generatePracticalQuestions(grade, os = "windows") {
  const ctrl = os === "mac" ? "meta" : "control";
  
  const pool = [
    {
      id: 5001,
      type: "select_all",
      question: "下のテキストエリア内の文章をすべて選択してください。（マウスによるドラッグ選択禁止）",
      expectedKeyCombo: [ctrl, "a"],
      answer: "CORRECT"
    },
    {
      id: 5002,
      type: "copy_paste",
      question: "下の複雑なURLをコピーして、すぐ下の入力欄に貼り付けてください。（右クリック禁止）",
      expectedKeyCombo: [ctrl, "v"], 
      taskData: { targetText: "https://example.com/secure/token=xyz987" },
      answer: "https://example.com/secure/token=xyz987"
    },
    {
      id: 5003,
      type: "save_file",
      question: "このファイルを上書き保存してください。",
      expectedKeyCombo: [ctrl, "s"],
      answer: "CORRECT"
    },
    {
      id: 5004,
      type: "find_password",
      question: "以下の大量のテキストの中から「パスワード」を探し出し、下の解答欄に入力してください。",
      expectedKeyCombo: [ctrl, "f"],
      taskData: { password: "APPLE" },
      answer: "APPLE"
    },
    {
      id: 5005,
      type: "rename_file",
      question: "選択されているファイルの名前を変更するモードに切り替えてください。",
      expectedKeyCombo: os === "mac" ? ["enter"] : ["f2"],
      answer: "CORRECT"
    },
    {
      id: 5006,
      type: "browser_reload",
      question: "ブラウザ画面を「リロード（再読み込み）」してください。",
      expectedKeyCombo: [ctrl, "r"],
      answer: "CORRECT"
    },
    {
      id: 5007,
      type: "browser_bookmark",
      question: "このページを「ブックマーク（お気に入りに追加）」してください。",
      expectedKeyCombo: [ctrl, "d"],
      answer: "CORRECT"
    },
    {
      id: 5008,
      type: "browser_open_file",
      question: "ブラウザで「ファイルを開く」ダイアログを呼び出してください。",
      expectedKeyCombo: [ctrl, "o"],
      answer: "CORRECT"
    }
  ];

  if (grade === "4kyu") {
    pool.push({
      id: 4001,
      type: "undo_action",
      question: "誤って削除してしまったテキストを「元に戻す」ショートカットを使用してください。",
      expectedKeyCombo: [ctrl, "z"],
      answer: "CORRECT"
    });
    pool.push({
      id: 4002,
      type: "bold_text",
      question: "選択中のテキストを「太字」にするショートカットを使用してください。",
      expectedKeyCombo: [ctrl, "b"],
      answer: "CORRECT"
    });
    pool.push({
      id: 4003,
      type: "print_doc",
      question: "このドキュメントを「印刷」するダイアログを呼び出してください。",
      expectedKeyCombo: [ctrl, "p"],
      answer: "CORRECT"
    });
  }

  return pool;
}`;

content = content.replace(/function generatePracticalQuestions\(grade\) \{[\s\S]*?return questions;\s*\}/, generatePracticalBlock);


// 2. Add Mac versions to the grades array in seed()
const practicalGrades = `    // Practical Exams
    {
      id: "practical-5kyu",
      title: "5級 実務検定 (実践シミュレータ) - Windows",
      questionsCount: 5,
      passingRate: 0.8,
      duration: 1800,
      pool: generatePracticalQuestions("5kyu", "windows")
    },
    {
      id: "practical-mac-5kyu",
      title: "5級 実務検定 (実践シミュレータ) - Mac",
      questionsCount: 5,
      passingRate: 0.8,
      duration: 1800,
      pool: generatePracticalQuestions("5kyu", "mac")
    },
    {
      id: "practical-4kyu",
      title: "4級 実務検定 (実践シミュレータ) - Windows",
      questionsCount: 5,
      passingRate: 0.8,
      duration: 1800,
      pool: generatePracticalQuestions("4kyu", "windows")
    },
    {
      id: "practical-mac-4kyu",
      title: "4級 実務検定 (実践シミュレータ) - Mac",
      questionsCount: 5,
      passingRate: 0.8,
      duration: 1800,
      pool: generatePracticalQuestions("4kyu", "mac")
    },`;

content = content.replace(/\/\/ Practical Exams[\s\S]*?pool: generatePracticalQuestions\("4kyu"\)\s*\},/, practicalGrades);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully patched seed_all_grades.mjs!");
