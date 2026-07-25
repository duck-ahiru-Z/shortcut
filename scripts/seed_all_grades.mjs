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

function generatePracticalQuestions() {
  return [
    {
      id: 5001,
      type: "select_all",
      question: "下のテキストエリア内の文章をすべて選択してください。（マウスによるドラッグ選択禁止）",
      expectedKeyCombo: ["control", "a"],
      answer: "CORRECT"
    },
    {
      id: 5002,
      type: "find_password",
      question: "以下の大量のテキストの中から「パスワード」を探し出し、下の解答欄に入力してください。",
      expectedKeyCombo: ["control", "f"], // not strictly required if they type it, but good to have
      taskData: { password: "APPLE" },
      answer: "APPLE"
    },
    {
      id: 5003,
      type: "copy_paste",
      question: "下の複雑なURLをコピーして、すぐ下の入力欄に貼り付けてください。（右クリック禁止）",
      expectedKeyCombo: ["control", "v"], 
      taskData: { targetText: "https://example.com/secure/token=xyz987" },
      answer: "https://example.com/secure/token=xyz987"
    },
    {
      id: 5004,
      type: "save_file",
      question: "このファイルを上書き保存してください。",
      expectedKeyCombo: ["control", "s"],
      answer: "CORRECT"
    },
    {
      id: 5005,
      type: "rename_file",
      question: "選択されているファイルの名前を変更するモードに切り替えてください。",
      expectedKeyCombo: ["f2"],
      answer: "CORRECT"
    }
  ];
}

async function seed() {
  console.log("Parsing 4kyu questions...");
  const q4kyu = parse4kyu();
  console.log(`Parsed ${q4kyu.length} questions for 4kyu.`);

  const grades = [
    {
      id: "4kyu",
      title: "4級 (Windows版)",
      questionsCount: 30,
      passingRate: 0.8,
      duration: 1800,
      pool: q4kyu
    },
    {
      id: "3kyu",
      title: "3級 (Windows版)",
      questionsCount: 5,
      passingRate: 0.8,
      duration: 1800,
      pool: generateDummyQuestions("3級", 3000)
    },
    {
      id: "2kyu",
      title: "2級 (Windows版)",
      questionsCount: 5,
      passingRate: 0.8,
      duration: 1800,
      pool: generateDummyQuestions("2級", 2000)
    },
    {
      id: "1kyu",
      title: "1級 (Windows版)",
      questionsCount: 5,
      passingRate: 0.8,
      duration: 1800,
      pool: generateDummyQuestions("1級", 1000)
    },
    {
      id: "practical",
      title: "実務検定 (実践シミュレータ)",
      questionsCount: 5,
      passingRate: 0.8,
      duration: 1800,
      pool: generatePracticalQuestions()
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
