import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
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
  let totalIssues = 0;

  for (const d of snap.docs) {
    const grade = d.id;
    const data = d.data();
    const pool = data.pool || [];
    
    console.log(`\n========================================`);
    console.log(`Auditing Grade: ${grade} (Questions: ${pool.length})`);
    console.log(`========================================`);

    const seenQuestions = new Set();
    
    for (const q of pool) {
      let issues = [];

      // 1. Check duplicate question text
      if (seenQuestions.has(q.question)) {
        issues.push(`Duplicate question text found.`);
      }
      seenQuestions.add(q.question);
      
      if (grade.startsWith('practical')) {
        // Practical Exam validation
        if (!q.expectedKeyCombo && !q.expectedKeySequence && !q.type) {
          issues.push(`Missing 'expectedKeyCombo', 'expectedKeySequence' AND 'type'.`);
        } else if (!q.expectedKeyCombo && !q.expectedKeySequence) {
          if (!['copy_paste', 'find_password', 'select_all'].includes(q.type)) {
            issues.push(`Missing key combo/sequence and unknown type: ${q.type}`);
          }
        }
      } else {
        // Knowledge Exam validation
        if (!q.choices || q.choices.length !== 4) {
          issues.push(`Expected 4 choices, found ${q.choices ? q.choices.length : 0}.`);
        } else {
          // Check for duplicate choices
          const uniqueChoices = new Set(q.choices);
          if (uniqueChoices.size !== q.choices.length) {
            issues.push(`Contains duplicate choices.`);
          }
          // Check if answer is in choices
          if (!q.choices.includes(q.answer)) {
            issues.push(`Answer "${q.answer}" is NOT exactly present in choices.`);
          }
        }
      }

      if (issues.length > 0) {
        console.log(`\n[!] Issue in Question ID: ${q.id}`);
        console.log(`    Q: ${q.question.substring(0, 80)}...`);
        issues.forEach(i => console.log(`    - ${i}`));
        totalIssues++;
      }
    }
    
    if (totalIssues === 0) {
      console.log(`No issues found in ${grade}.`);
    }
  }

  console.log(`\nTotal Issues Found Across All Exams: ${totalIssues}`);
  process.exit(0);
}
run();
