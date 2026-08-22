import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";

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
  const mergedData = {
    "5kyu": [],
    "4kyu": [],
    "practical-5kyu": [],
    "practical-4kyu": []
  };

  const TOTAL_CHUNKS = 15;
  let totalProcessed = 0;

  for (let i = 1; i <= TOTAL_CHUNKS; i++) {
    const filePath = `chunk_${i}_done.json`;
    if (!fs.existsSync(filePath)) {
      console.error(`Missing file: ${filePath}`);
      process.exit(1);
    }
    const chunk = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    for (const q of chunk) {
      const grade = q.grade;
      delete q.grade; // Remove the temporary grade field
      if (mergedData[grade]) {
        mergedData[grade].push(q);
        totalProcessed++;
      } else {
        console.warn(`Unknown grade ${grade} for question ${q.id}`);
      }
    }
  }

  console.log(`Merged ${totalProcessed} questions.`);

  for (const grade of Object.keys(mergedData)) {
    if (mergedData[grade].length > 0) {
      const docRef = doc(db, "exams", grade);
      await setDoc(docRef, { pool: mergedData[grade] }, { merge: true });
      console.log(`Updated ${grade} with ${mergedData[grade].length} questions.`);
    }
  }

  console.log("Database update complete!");
  process.exit(0);
}

main().catch(console.error);
