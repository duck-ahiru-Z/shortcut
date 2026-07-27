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

async function upload() {
  try {
    const data = JSON.parse(fs.readFileSync("../shortcut/questions/questions_5kyu.json", "utf-8"));
    const questions = data.pool;
    console.log(`Found ${questions.length} questions. Uploading...`);
    
    // We will store the entire array in a single document for easy fetching,
    // or store them in a subcollection. Let's store them in a single document `exams/5kyu` to make it easy.
    // Or in `questions/5kyu`.
    await setDoc(doc(db, "exams", "5kyu"), {
      title: data.title,
      questionsCount: data.questionsCount,
      passingRate: data.passingRate,
      duration: data.duration,
      pool: questions
    });
    console.log("Successfully uploaded 5kyu data to Firestore (exams/5kyu).");
    process.exit(0);
  } catch (error) {
    console.error("Error uploading to Firestore:", error);
    process.exit(1);
  }
}

upload();
