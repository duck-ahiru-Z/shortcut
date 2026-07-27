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

async function upload() {
  try {
    const txtPath = path.join(process.cwd(), "ショートカットキー検定５級　問題.txt");
    const rawText = fs.readFileSync(txtPath, "utf-8");
    const lines = rawText.split('\n').filter(l => l.trim().length > 0);

    const pool = lines.map((line, i) => {
      line = line.trim();
      const qIdx = line.indexOf("問題文:");
      const cIdx = line.indexOf("選択肢:");
      const aIdx = line.indexOf("回答:");
      
      if (qIdx === -1 || cIdx === -1 || aIdx === -1) {
          throw new Error("Invalid format on line " + (i+1) + ": " + line);
      }
      
      const idStr = line.substring(0, qIdx).trim();
      const id = parseInt(idStr, 10);
      
      const question = line.substring(qIdx + 4, cIdx).trim();
      
      const choicesStr = line.substring(cIdx + 4, aIdx).trim();
      const answerStr = line.substring(aIdx + 3).trim();
      
      const idxA = choicesStr.indexOf('A.');
      const idxB = choicesStr.indexOf('B.');
      const idxC = choicesStr.indexOf('C.');
      const idxD = choicesStr.indexOf('D.');
      
      const cleanChoice = (str) => str.trim().replace(/^　+|　+$/g, '');

      const choiceA = cleanChoice(choicesStr.substring(idxA + 2, idxB));
      const choiceB = cleanChoice(choicesStr.substring(idxB + 2, idxC));
      const choiceC = cleanChoice(choicesStr.substring(idxC + 2, idxD));
      const choiceD = cleanChoice(choicesStr.substring(idxD + 2));
      
      // Extract answer text, e.g. "A. Control + C" -> "Control + C"
      const answer = answerStr.replace(/^[A-D]\.\s*/, "").trim().replace(/^　+|　+$/g, '');
      
      return {
          id,
          question,
          choices: [choiceA, choiceB, choiceC, choiceD],
          answer
      };
    });

    console.log(`Parsed ${pool.length} questions.`);

    await setDoc(doc(db, "exams", "5kyu"), {
      title: "ショートカットキー検定 5級 (Windows版)",
      questionsCount: 30,
      passingRate: 0.8,
      duration: 1800,
      pool: pool
    });
    console.log("Successfully uploaded new 5kyu data to Firestore.");
    process.exit(0);
  } catch (error) {
    console.error("Error parsing or uploading:", error);
    process.exit(1);
  }
}

upload();
