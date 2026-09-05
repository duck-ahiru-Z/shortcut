import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import fs from "fs";

const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line.includes("="))
    .map((line) => {
      const [key, ...value] = line.split("=");
      return [key.trim(), value.join("=").trim().replace(/['"]/g, "")];
    }),
);

const app = initializeApp({
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const db = getFirestore(app);
const targetDuration = 30 * 60;
const gradeIds = [
  "practical-mac-3kyu",
  "practical-mac-4kyu",
  "practical-mac-5kyu",
];

for (const gradeId of gradeIds) {
  const examRef = doc(db, "exams", gradeId);
  const before = await getDoc(examRef);
  if (!before.exists()) throw new Error(`Missing exam: ${gradeId}`);

  await updateDoc(examRef, { duration: targetDuration });

  const after = await getDoc(examRef);
  if (after.data().duration !== targetDuration) {
    throw new Error(`Duration verification failed: ${gradeId}`);
  }
  console.log(`${gradeId}: ${before.data().duration} -> ${after.data().duration}`);
}

process.exit(0);
