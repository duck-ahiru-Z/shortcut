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
      const pool = data.pool || [];
      let updated = false;

      for (const q of pool) {
        // Fix Explorer wording
        if (q.question.includes('エクスプローラー')) {
          q.question = q.question.replace(/エクスプローラー/g, 'Finder');
          updated = true;
        }
        if (q.question.includes('Windows')) {
          q.question = q.question.replace(/Windows/g, 'Mac');
          updated = true;
        }
        if (q.explanation && q.explanation.includes('エクスプローラー')) {
          q.explanation = q.explanation.replace(/エクスプローラー/g, 'Finder');
          updated = true;
        }
        if (q.explanation && q.explanation.includes('Windows')) {
          q.explanation = q.explanation.replace(/Windows/g, 'Mac');
          updated = true;
        }

        // Rename in Finder (was F2, now Enter)
        if (q.question.includes('名前を変更') && q.question.includes('Finder')) {
          if (JSON.stringify(q.expectedKeyCombo) === '["f2"]') {
            q.expectedKeyCombo = ["enter"];
            if (q.explanation) q.explanation = q.explanation.replace('F2', 'Return(Enter)');
            updated = true;
          }
        }
        
        // Edit cell in Excel (was F2, now Control+U)
        if (q.question.includes('編集モード') && q.question.includes('【Excel】')) {
          if (JSON.stringify(q.expectedKeyCombo) === '["f2"]') {
            q.expectedKeyCombo = ["control", "u"];
            if (q.explanation) q.explanation = q.explanation.replace('F2', 'Control + U');
            updated = true;
          }
        }

        // AutoSum in Excel (was Alt+=, now Cmd+Shift+T)
        if (q.question.includes('オートサム') && q.question.includes('【Excel】')) {
          q.expectedKeyCombo = ["meta", "shift", "t"];
          if (q.explanation) q.explanation = q.explanation.replace('Alt + =', 'Cmd + Shift + T');
          updated = true;
        }
        
        // Flash Fill (Cmd+E is what makeMac produced, but actually Ctrl+E on Mac?
        // Let's leave Flash fill as Cmd+E or Ctrl+E? Official Mac Excel says Ctrl+E but Cmd+E sometimes works. Let's just change it to Control+E just in case)
        if (q.question.includes('フラッシュフィル') && q.question.includes('【Excel】')) {
          if (JSON.stringify(q.expectedKeyCombo) === '["meta","e"]') {
            q.expectedKeyCombo = ["control", "e"];
            if (q.explanation) q.explanation = q.explanation.replace('Cmd + E', 'Control + E');
            updated = true;
          }
        }

        // F11 Fullscreen in browser (Mac is Cmd+Ctrl+F)
        if (q.question.includes('フルスクリーン') && q.question.includes('ブラウザ')) {
          if (JSON.stringify(q.expectedKeyCombo) === '["f11"]') {
            q.expectedKeyCombo = ["meta", "control", "f"];
            if (q.explanation) q.explanation = q.explanation.replace('F11', 'Cmd + Control + F');
            updated = true;
          }
        }
      }

      if (updated) {
        await setDoc(doc(db, "exams", grade), data);
        console.log(`Updated ${grade}`);
      }
    }
  }
  process.exit(0);
}

main().catch(console.error);
