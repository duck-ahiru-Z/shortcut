import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, doc, setDoc } from "firebase/firestore";
import fs from "fs";

const envFile = fs.readFileSync(".env.local", "utf-8");
envFile.split("\n").forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
  }
});

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const grades = [
  "practical-mac-5kyu",
  "practical-mac-4kyu",
  "practical-mac-3kyu",
  "practical-mac-2kyu",
  "practical-mac-1kyu"
];

async function main() {
  for (const grade of grades) {
    const d = await getDoc(doc(db, "exams", grade));
    if (d.exists()) {
      const data = d.data();
      let updated = false;
      for (const q of data.pool || []) {
        if (JSON.stringify(q.expectedKeyCombo) === '["f2"]' && q.question.includes('Finder')) {
          q.expectedKeyCombo = ["enter"];
          if (q.explanation) q.explanation = q.explanation.replace(/F2/g, 'Return(Enter)');
          updated = true;
        }
      }
      if (updated) {
        await setDoc(doc(db, "exams", grade), data);
        console.log(`Fixed F2 -> Enter in ${grade}`);
      }
    }
  }
  process.exit(0);
}

main().catch(console.error);
