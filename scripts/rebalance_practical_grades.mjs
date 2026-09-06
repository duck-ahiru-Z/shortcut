import dotenv from "dotenv";
import fs from "node:fs";
import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

dotenv.config({ path: ".env.local" });
const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});
const db = getFirestore(app);
const pools = JSON.parse(fs.readFileSync("scripts/archive/practical_pool.json", "utf8"));

// 3級から、IDEの専門操作・DevTools・未読管理を2級へ移す。
const moveFrom3 = {
  "practical-3kyu": new Set([3032, 3033, 3034, 3035, 3036, 3040]),
  "practical-mac-3kyu": new Set([13032, 13033, 13034, 13035, 13036, 13040]),
};
// 2級から、複数アプリにまたがる複数手順やワークスペース操作を1級へ移す。
const moveFrom2 = {
  "practical-2kyu": new Set([2001, 2002, 2005, 2010, 2012, 2014, 2015, 2016, 2021, 2022, 2026, 2027, 2029]),
  "practical-mac-2kyu": new Set([12001, 12002, 12005, 12010, 12012, 12014, 12015, 12016, 12021, 12022, 12026, 12027, 12029]),
};

function move(lowerKey, upperKey, ids) {
  const moving = pools[lowerKey].filter((question) => ids.has(question.id));
  pools[lowerKey] = pools[lowerKey].filter((question) => !ids.has(question.id));
  const existing = new Set(pools[upperKey].map((question) => question.id));
  pools[upperKey].push(...moving.filter((question) => !existing.has(question.id)));
  return moving.length;
}

let moved = 0;
moved += move("practical-3kyu", "practical-2kyu", moveFrom3["practical-3kyu"]);
moved += move("practical-mac-3kyu", "practical-mac-2kyu", moveFrom3["practical-mac-3kyu"]);
moved += move("practical-2kyu", "practical-1kyu", moveFrom2["practical-2kyu"]);
moved += move("practical-mac-2kyu", "practical-mac-1kyu", moveFrom2["practical-mac-2kyu"]);

const updates = [
  ["practical-3kyu", pools["practical-3kyu"]],
  ["practical-2kyu", pools["practical-2kyu"]],
  ["practical-1kyu", pools["practical-1kyu"]],
  ["practical-mac-3kyu", pools["practical-mac-3kyu"]],
  ["practical-mac-2kyu", pools["practical-mac-2kyu"]],
  ["practical-mac-1kyu", pools["practical-mac-1kyu"]],
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
console.log(`Moved ${moved} practical questions across Windows and Mac grade pools.`);
