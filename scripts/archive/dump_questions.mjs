import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
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
  const grade5Ref = doc(db, "exams", "5kyu");
  const grade4Ref = doc(db, "exams", "4kyu");
  const pgrade5Ref = doc(db, "exams", "practical-5kyu");
  const pgrade4Ref = doc(db, "exams", "practical-4kyu");

  const grade5Snap = await getDoc(grade5Ref);
  const grade4Snap = await getDoc(grade4Ref);
  const pgrade5Snap = await getDoc(pgrade5Ref);
  const pgrade4Snap = await getDoc(pgrade4Ref);

  const data = {
    "5kyu": grade5Snap.exists() ? grade5Snap.data().pool : [],
    "4kyu": grade4Snap.exists() ? grade4Snap.data().pool : [],
    "practical-5kyu": pgrade5Snap.exists() ? pgrade5Snap.data().pool : [],
    "practical-4kyu": pgrade4Snap.exists() ? pgrade4Snap.data().pool : [],
  };

  fs.writeFileSync("questions_dump.json", JSON.stringify(data, null, 2));
  console.log(`Dumped ${data["5kyu"].length} 5kyu, ${data["4kyu"].length} 4kyu, ${data["practical-5kyu"].length} practical-5kyu, ${data["practical-4kyu"].length} practical-4kyu questions.`);
  process.exit(0);
}

main().catch(console.error);
