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
  const questions = [];
  for (let i = 1; i <= 5; i++) {
    questions.push({
      id: startId + i,
      question: `これは${gradePrefix}の仮の問題${i}です。正しい選択肢を選んでください。`,
      choices: [
        `A. 正解の選択肢`,
        `B. 間違いの選択肢1`,
        `C. 間違いの選択肢2`,
        `D. 間違いの選択肢3`
      ],
      answer: `A. 正解の選択肢`
    });
  }
  return questions;
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
      title: "実務検定 (フットペダル・実践)",
      questionsCount: 5,
      passingRate: 0.8,
      duration: 1800,
      pool: generateDummyQuestions("実務検定", 5000)
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
