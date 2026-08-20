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

const poolStr = fs.readFileSync("scripts/practical_pool.json", "utf8");
const pool = JSON.parse(poolStr);
const p3 = pool["practical-3kyu"];

async function update() {
  await setDoc(doc(db, "exams", "practical-3kyu"), {
    id: "practical-3kyu", title: "3級 実務検定 (実践シミュレータ)", questionsCount: p3.length, passingRate: 0.8, duration: 1800, pool: p3
  });
  console.log("Updated practical-3kyu in Firestore.");
}

update().catch(console.error).finally(() => process.exit(0));
