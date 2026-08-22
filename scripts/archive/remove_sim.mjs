import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import fs from "fs";

// Parse .env.local manually
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
  const snap = await getDocs(collection(db, "exams"));
  for (const d of snap.docs) {
    const data = d.data();
    if (data.title && data.title.includes(" (実践シミュレータ)")) {
      const newTitle = data.title.replace(" (実践シミュレータ)", "");
      await updateDoc(doc(db, "exams", d.id), { title: newTitle });
      console.log(`Updated ${d.id} -> ${newTitle}`);
    }
  }
  console.log("Done!");
  process.exit(0);
}

run();
