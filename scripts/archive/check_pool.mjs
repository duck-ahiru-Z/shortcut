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

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const snap = await getDocs(collection(db, 'exams'));
  for (const d of snap.docs) {
    const data = d.data();
    const count = data.questionsCount;
    const poolSize = data.pool ? data.pool.length : 0;
    console.log(d.id, 'count:', count, 'pool:', poolSize);
    
    // Fix if count != poolSize for practical exams
    if (d.id.includes('practical') && count !== poolSize) {
      console.log(`Fixing ${d.id}: updating questionsCount from ${count} to ${poolSize}`);
      await setDoc(doc(db, 'exams', d.id), { questionsCount: poolSize }, { merge: true });
    }
  }
  process.exit(0);
}
run();
