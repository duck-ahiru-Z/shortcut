import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const knowledgePoolStr = fs.readFileSync(path.join(__dirname, "knowledge_pool.json"), "utf8");
const knowledgePool = JSON.parse(knowledgePoolStr);

const practicalPoolStr = fs.readFileSync(path.join(__dirname, "practical_pool.json"), "utf8");
const practicalPool = JSON.parse(practicalPoolStr);

// Parse 4kyu questions
function parse4kyu() {
  const filePath = path.join(__dirname, '..', 'ショートカットキー検定４級　問題.txt');
  const text = fs.readFileSync(filePath, 'utf-8');
  const lines = text.split('\n').filter(l => l.trim());
  
  const questions = [];
  let idCounter = 1001; 

  for (const line of lines) {
    const match = line.match(/^\d+[\s\t]*問題文:[\s\t]*(.+?)[\s\t]*選択肢:[\s\t]*(.*)/);
    if (match) {
      const qText = match[1].trim();
      let choicesText = match[2].trim();
      
      const choices = choicesText.split(/　|\s{2,}/).map(c => c.trim()).filter(c => c);
      
      const answer = choices.length > 0 ? choices[0] : "";
      
      questions.push({
        id: idCounter++,
        question: qText,
        choices: choices,
        answer: answer
      });
    }
  }
  return questions;
}

function generateDummyQuestions(gradePrefix, startId) {
  const dummyData = [
    {
      q: `【${gradePrefix}】現在開いているウィンドウをすべて最小化するショートカットキーはどれか。`,
      c: ["A. Windows + D", "B. Windows + M", "C. Ctrl + D", "D. Alt + Tab"],
      a: "A. Windows + D"
    },
    {
      q: `【${gradePrefix}】ブラウザで直前に閉じたタブを復元するショートカットキーはどれか。`,
      c: ["A. Ctrl + Shift + T", "B. Ctrl + T", "C. Alt + Left", "D. Ctrl + R"],
      a: "A. Ctrl + Shift + T"
    },
    {
      q: `【${gradePrefix}】ファイル名を変更するショートカットキーはどれか。`,
      c: ["A. F2", "B. F4", "C. F5", "D. F12"],
      a: "A. F2"
    },
    {
      q: `【${gradePrefix}】クリップボードの履歴を表示するショートカットキーはどれか。`,
      c: ["A. Windows + V", "B. Ctrl + V", "C. Windows + C", "D. Alt + V"],
      a: "A. Windows + V"
    },
    {
      q: `【${gradePrefix}】エクスプローラーを開くショートカットキーはどれか。`,
      c: ["A. Windows + E", "B. Windows + R", "C. Ctrl + E", "D. Alt + E"],
      a: "A. Windows + E"
    }
  ];

  return dummyData.map((d, i) => ({
    id: startId + i,
    question: d.q,
    choices: d.c,
    answer: d.a
  }));
}

function generatePracticalQuestions(grade, os = "windows") {
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
      type: "browser_address",
      question: "ブラウザの「アドレスバー」を選択（フォーカス）してください。",
      expectedKeyCombo: [ctrl, "l"],
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
}

async function seed() {
  const grades = [
    {
      id: "5kyu",
      title: "5級 (Windows版)",
      questionsCount: 5,
      passingRate: 0.8,
      duration: 1800,
      pool: generateDummyQuestions("5級", 5000)
    },
    {
      id: "4kyu",
      title: "4級 (Windows版)",
      questionsCount: 30,
      passingRate: 0.8,
      duration: 1800,
      pool: parse4kyu()
    },
    {
      id: "3kyu",
      title: "3級 (Windows版)",
      questionsCount: 30,
      passingRate: 0.8,
      duration: 1800,
      pool: knowledgePool["3kyu"]
    },
    {
      id: "2kyu",
      title: "2級 (Windows版)",
      questionsCount: 30,
      passingRate: 0.8,
      duration: 1800,
      pool: knowledgePool["2kyu"]
    },
    {
      id: "1kyu",
      title: "1級 (Windows版)",
      questionsCount: 30,
      passingRate: 0.8,
      duration: 1800,
      pool: knowledgePool["1kyu"]
    },
        // Practical Exams
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
    },
    {
      id: "practical-3kyu",
      title: "3級 実務検定 (実践シミュレータ)",
      questionsCount: 30,
      passingRate: 0.8,
      duration: 1800,
      pool: practicalPool["practical-3kyu"]
    },
    {
      id: "practical-2kyu",
      title: "2級 実務検定 (実践シミュレータ)",
      questionsCount: 30,
      passingRate: 0.8,
      duration: 1800,
      pool: practicalPool["practical-2kyu"]
    },
    {
      id: "practical-1kyu",
      title: "1級 実務検定 (実践シミュレータ)",
      questionsCount: 30,
      passingRate: 0.8,
      duration: 1800,
      pool: practicalPool["practical-1kyu"]
    }
  ];

  for (const grade of grades) {
    console.log(`Seeding ${grade.id}...`);
    await setDoc(doc(db, "exams", grade.id), grade);
    console.log(`Saved ${grade.id}`);
  }

  console.log("All seeded successfully!");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
