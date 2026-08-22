import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc } from "firebase/firestore";
import fs from "fs";

const envPath = "./.env.local";
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  envConfig.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2].trim().replace(/^"|"$/g, "");
    }
  });
}

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});
const db = getFirestore(app);

const gradeConfigs = {
  "5kyu": 15, "4kyu": 15, "3kyu": 20, "2kyu": 20, "1kyu": 20,
  "mac-5kyu": 15, "mac-4kyu": 15, "mac-3kyu": 20, "mac-2kyu": 20, "mac-1kyu": 20,
  "practical-5kyu": 5, "practical-4kyu": 5, "practical-3kyu": 10, "practical-2kyu": 10, "practical-1kyu": 15,
  "practical-mac-5kyu": 5, "practical-mac-4kyu": 5, "practical-mac-3kyu": 10, "practical-mac-2kyu": 10, "practical-mac-1kyu": 15
};

async function run() {
  const snap = await getDocs(collection(db, 'exams'));
  for (const d of snap.docs) {
    const data = d.data();
    const correctCount = gradeConfigs[d.id] || 5;
    console.log(`Reverting ${d.id} to questionsCount: ${correctCount}`);
    await setDoc(doc(db, 'exams', d.id), { questionsCount: correctCount }, { merge: true });
  }
  process.exit(0);
}
run();
