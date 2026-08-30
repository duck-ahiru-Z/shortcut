import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, doc } from "firebase/firestore";
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
  const result = {};
  for (const grade of grades) {
    const d = await getDoc(doc(db, "exams", grade));
    if (d.exists()) {
      result[grade] = d.data().pool || [];
    }
  }
  fs.writeFileSync("mac_pools.json", JSON.stringify(result, null, 2));
  console.log("Dumped to mac_pools.json");
  process.exit(0);
}

main().catch(console.error);
