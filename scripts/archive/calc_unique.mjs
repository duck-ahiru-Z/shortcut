import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, setDoc } from "firebase/firestore";
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
  const resultsSnap = await getDocs(collection(db, "exam_results"));
  
  // Aggregate unique deviceIds per grade
  const uniqueDevices = {};
  
  for (const d of resultsSnap.docs) {
    const data = d.data();
    if (!data.grade || !data.deviceId) continue;
    
    if (!uniqueDevices[data.grade]) {
      uniqueDevices[data.grade] = new Set();
    }
    uniqueDevices[data.grade].add(data.deviceId);
  }
  
  console.log("Calculated unique users per grade:");
  for (const grade of Object.keys(uniqueDevices)) {
    const count = uniqueDevices[grade].size;
    console.log(`${grade}: ${count} unique users`);
    
    // Update exam_stats
    await setDoc(doc(db, "exam_stats", grade), { uniqueUsers: count }, { merge: true });
  }
  
  console.log("Done updating exam_stats!");
  process.exit(0);
}

run();
