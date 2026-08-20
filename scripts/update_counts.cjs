const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc } = require('firebase/firestore');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  if (line.includes('=')) {
    const [key, ...rest] = line.split('=');
    env[key.trim()] = rest.join('=').trim().replace(/['"]/g, '');
  }
}

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const counts = {
  '5kyu': 15,
  '4kyu': 15,
  '3kyu': 20,
  '2kyu': 20,
  '1kyu': 20,
  'practical-5kyu': 5,
  'practical-4kyu': 5,
  'practical-3kyu': 20,
  'practical-2kyu': 20,
  'practical-1kyu': 20,
  'mac-5kyu': 15,
  'mac-4kyu': 15,
  'mac-3kyu': 20,
  'mac-2kyu': 20,
  'mac-1kyu': 20,
  'practical-mac-5kyu': 5,
  'practical-mac-4kyu': 5,
  'practical-mac-3kyu': 20,
  'practical-mac-2kyu': 20,
  'practical-mac-1kyu': 20
};

async function run() {
  for (const [grade, count] of Object.entries(counts)) {
    try {
      await updateDoc(doc(db, 'exams', grade), { questionsCount: count });
      console.log('Updated ' + grade + ' to ' + count);
    } catch(e) {
      console.error(e);
    }
  }
}
run().then(() => process.exit(0));
