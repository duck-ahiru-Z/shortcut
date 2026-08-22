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

const newTitles = {
  "1kyu": "1級 知識試験 (Windows版)",
  "2kyu": "2級 知識試験 (Windows版)",
  "3kyu": "3級 知識試験 (Windows版)",
  "4kyu": "4級 知識試験 (Windows版)",
  "5kyu": "5級 知識試験 (Windows版)",
  "mac-1kyu": "1級 知識試験 (Mac版)",
  "mac-2kyu": "2級 知識試験 (Mac版)",
  "mac-3kyu": "3級 知識試験 (Mac版)",
  "mac-4kyu": "4級 知識試験 (Mac版)",
  "mac-5kyu": "5級 知識試験 (Mac版)",
  
  "practical-1kyu": "1級 実務検定 (Windows版)",
  "practical-2kyu": "2級 実務検定 (Windows版)",
  "practical-3kyu": "3級 実務検定 (Windows版)",
  "practical-4kyu": "4級 実務検定 (Windows版)",
  "practical-5kyu": "5級 実務検定 (Windows版)",
  "practical-mac-1kyu": "1級 実務検定 (Mac版)",
  "practical-mac-2kyu": "2級 実務検定 (Mac版)",
  "practical-mac-3kyu": "3級 実務検定 (Mac版)",
  "practical-mac-4kyu": "4級 実務検定 (Mac版)",
  "practical-mac-5kyu": "5級 実務検定 (Mac版)",
};

async function run() {
  const snap = await getDocs(collection(db, 'exams'));
  for (const d of snap.docs) {
    if (newTitles[d.id]) {
      console.log(`Renaming ${d.id} to ${newTitles[d.id]}`);
      await setDoc(doc(db, 'exams', d.id), { title: newTitles[d.id] }, { merge: true });
    }
  }
  process.exit(0);
}
run();
