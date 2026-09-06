import dotenv from "dotenv";
import fs from "node:fs";
import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

dotenv.config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const pools = JSON.parse(fs.readFileSync("scripts/archive/knowledge_pool.json", "utf8"));

// 3級の中でも、複数キーの組み合わせやOffice固有の機能を使う問題を2級へ移す。
const moveFrom3 = new Set([3010, 3011, 3013, 3016, 3017, 3019, 3026, 3030, 3033, 3036, 3038, 3039]);
// 2級の後半は仮想デスクトップ、DevTools、VS Code等の上級操作なので1級へ移す。
const moveFrom2 = new Set(pools["knowledge-2kyu"]
  .map((question) => question.id)
  .filter((id) => id >= 2021));

function rebalance(lowerKey, upperKey, ids) {
  const moving = pools[lowerKey].filter((question) => ids.has(question.id));
  pools[lowerKey] = pools[lowerKey].filter((question) => !ids.has(question.id));
  const existing = new Set(pools[upperKey].map((question) => question.id));
  pools[upperKey].push(...moving.filter((question) => !existing.has(question.id)));
  return moving.length;
}

const moved3 = rebalance("knowledge-3kyu", "knowledge-2kyu", moveFrom3);
const moved2 = rebalance("knowledge-2kyu", "knowledge-1kyu", moveFrom2);

const updates = [
  ["3kyu", pools["knowledge-3kyu"]],
  ["2kyu", pools["knowledge-2kyu"]],
  ["1kyu", pools["knowledge-1kyu"]],
];

for (const [grade, pool] of updates) {
  const ref = doc(db, "exams", grade);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    console.warn(`Skipped ${grade}: Firestore document does not exist`);
    continue;
  }
  await setDoc(ref, { pool }, { merge: true });
  console.log(`Updated ${grade}: ${pool.length} questions in pool`);
}

console.log(`Moved ${moved3} questions from 3kyu to 2kyu and ${moved2} questions from 2kyu to 1kyu.`);
