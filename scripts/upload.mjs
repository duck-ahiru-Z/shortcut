import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = {
  apiKey: "AIzaSyAuAsWLctHoBp6Eh2UN2sIM3wE1YJZIxvQ",
  authDomain: "shortcut-key-exam.firebaseapp.com",
  projectId: "shortcut-key-exam",
  storageBucket: "shortcut-key-exam.firebasestorage.app",
  messagingSenderId: "522459442819",
  appId: "1:522459442819:web:3a390baf5d2b6e001075b6",
  measurementId: "G-7TRX1BYWC2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function upload() {
  try {
    const data = JSON.parse(fs.readFileSync("../shortcut/questions/questions_5kyu.json", "utf-8"));
    const questions = data.pool;
    console.log(`Found ${questions.length} questions. Uploading...`);
    
    // We will store the entire array in a single document for easy fetching,
    // or store them in a subcollection. Let's store them in a single document `exams/5kyu` to make it easy.
    // Or in `questions/5kyu`.
    await setDoc(doc(db, "exams", "5kyu"), {
      title: data.title,
      questionsCount: data.questionsCount,
      passingRate: data.passingRate,
      duration: data.duration,
      pool: questions
    });
    console.log("Successfully uploaded 5kyu data to Firestore (exams/5kyu).");
    process.exit(0);
  } catch (error) {
    console.error("Error uploading to Firestore:", error);
    process.exit(1);
  }
}

upload();
