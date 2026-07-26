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

function generatePracticalQuestions(grade) {
  // Base gimmicks (5kyu)
  let questions = [
    {
      id: 5001,
      type: "select_all",
      question: "下のテキストエリア内の文章をすべて選択してください。（マウスによるドラッグ選択禁止）",
      expectedKeyCombo: ["control", "a"],
      answer: "CORRECT"
    },
    {
      id: 5002,
      type: "copy_paste",
      question: "下の複雑なURLをコピーして、すぐ下の入力欄に貼り付けてください。（右クリック禁止）",
      expectedKeyCombo: ["control", "v"], 
      taskData: { targetText: "https://example.com/secure/token=xyz987" },
      answer: "https://example.com/secure/token=xyz987"
    },
    {
      id: 5003,
      type: "save_file",
      question: "このファイルを上書き保存してください。",
      expectedKeyCombo: ["control", "s"],
      answer: "CORRECT"
    },
    {
      id: 5004,
      type: "find_password",
      question: "以下の大量のテキストの中から「パスワード」を探し出し、下の解答欄に入力してください。",
      expectedKeyCombo: ["control", "f"],
      taskData: { password: "APPLE" },
      answer: "APPLE"
    },
    {
      id: 5005,
      type: "rename_file",
      question: "選択されているファイルの名前を変更するモードに切り替えてください。",
      expectedKeyCombo: ["f2"],
      answer: "CORRECT"
    }
  ];

  // For higher grades, we mix in new gimmicks
  if (grade === "4kyu") {
    questions[0] = {
      id: 4001,
      type: "undo_action",
      question: "誤って削除してしまったテキストを「元に戻す」ショートカットを使用してください。",
      expectedKeyCombo: ["control", "z"],
      answer: "CORRECT"
    };
    questions[3].taskData.password = "BANANA";
    questions[3].answer = "BANANA";
  } else if (grade === "3kyu") {
    questions[1] = {
      id: 3002,
      type: "bold_text",
      question: "選択中のテキストを「太字」にするショートカットを使用してください。",
      expectedKeyCombo: ["control", "b"],
      answer: "CORRECT"
    };
    questions[3].taskData.password = "CHERRY";
    questions[3].answer = "CHERRY";
  } else if (grade === "2kyu") {
    questions[2] = {
      id: 2003,
      type: "print_doc",
      question: "このドキュメントを「印刷」するダイアログを呼び出してください。",
      expectedKeyCombo: ["control", "p"],
      answer: "CORRECT"
    };
    questions[3].taskData.password = "DRAGON";
    questions[3].answer = "DRAGON";
  } else if (grade === "1kyu") {
    questions[0] = {
      id: 1001,
      type: "undo_action",
      question: "誤って削除してしまったテキストを「元に戻す」ショートカットを使用してください。",
      expectedKeyCombo: ["control", "z"],
      answer: "CORRECT"
    };
    questions[1] = {
      id: 1002,
      type: "bold_text",
      question: "選択中のテキストを「太字」にするショートカットを使用してください。",
      expectedKeyCombo: ["control", "b"],
      answer: "CORRECT"
    };
    questions[2] = {
      id: 1003,
      type: "print_doc",
      question: "このドキュメントを「印刷」するダイアログを呼び出してください。",
      expectedKeyCombo: ["control", "p"],
      answer: "CORRECT"
    };
    questions[3].taskData.password = "EAGLE";
    questions[3].answer = "EAGLE";
  }

  return questions;
}

async function seed() {
  const grades = [
    {
      id: "5kyu",
      title: "5級 (Windows版)",
      questionsCount: 30,
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
      pool: generateDummyQuestions("3級", 3000)
    },
    {
      id: "2kyu",
      title: "2級 (Windows版)",
      questionsCount: 30,
      passingRate: 0.8,
      duration: 1800,
      pool: generateDummyQuestions("2級", 2000)
    },
    {
      id: "1kyu",
      title: "1級 (Windows版)",
      questionsCount: 30,
      passingRate: 0.8,
      duration: 1800,
      pool: generateDummyQuestions("1級", 1000)
    },
    // Practical Exams
    {
      id: "practical-5kyu",
      title: "5級 実務検定 (実践シミュレータ)",
      questionsCount: 5,
      passingRate: 0.8,
      duration: 1800,
      pool: generatePracticalQuestions("5kyu")
    },
    {
      id: "practical-4kyu",
      title: "4級 実務検定 (実践シミュレータ)",
      questionsCount: 5,
      passingRate: 0.8,
      duration: 1800,
      pool: generatePracticalQuestions("4kyu")
    },
    {
      id: "practical-3kyu",
      title: "3級 実務検定 (実践シミュレータ)",
      questionsCount: 5,
      passingRate: 0.8,
      duration: 1800,
      pool: generatePracticalQuestions("3kyu")
    },
    {
      id: "practical-2kyu",
      title: "2級 実務検定 (実践シミュレータ)",
      questionsCount: 5,
      passingRate: 0.8,
      duration: 1800,
      pool: generatePracticalQuestions("2kyu")
    },
    {
      id: "practical-1kyu",
      title: "1級 実務検定 (実践シミュレータ)",
      questionsCount: 5,
      passingRate: 0.8,
      duration: 1800,
      pool: generatePracticalQuestions("1kyu")
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
