import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAuAsWLctHoBp6Eh2UN2sIM3wE1YJZIxvQ",
  authDomain: "shortcut-key-exam.firebaseapp.com",
  projectId: "shortcut-key-exam",
  storageBucket: "shortcut-key-exam.firebasestorage.app",
  messagingSenderId: "522459442819",
  appId: "1:522459442819:web:3a390baf5d2b6e001075b6",
  measurementId: "G-7TRX1BYWC2"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
