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

async function main() {
  const data = JSON.parse(fs.readFileSync("questions_dump.json", "utf8"));
  
  const macGrades = ['mac-5kyu', 'mac-4kyu', 'practical-mac-5kyu', 'practical-mac-4kyu'];
  
  for (const grade of macGrades) {
    if (!data[grade]) continue;
    
    // ExamData structure
    const examData = {
      title: grade.includes('5kyu') ? '5級 (Mac版)' : '4級 (Mac版)',
      questionsCount: grade.includes('practical') ? 5 : 30,
      passingRate: 80,
      duration: grade.includes('practical') ? 10 * 60 : 30 * 60,
      pool: data[grade]
    };

    await setDoc(doc(db, "exams", grade), examData);
    console.log(`Uploaded ${grade} with ${data[grade].length} questions.`);
  }

  console.log('Successfully uploaded Mac grades to Firestore.');
  process.exit(0);
}

main().catch(console.error);
