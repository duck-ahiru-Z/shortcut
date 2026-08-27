"use server";

import { cookies } from "next/headers";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Admin password must be set via environment variable
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function loginAdmin(password: string): Promise<boolean> {
  if (!ADMIN_PASSWORD) {
    throw new Error("ADMIN_PASSWORD environment variable is not set");
  }

  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return true;
  }
  return false;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
}

export async function getRawQuestions(grade: string) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_auth")?.value !== "true") {
    throw new Error("Unauthorized");
  }

  const docRef = doc(db, "exams", grade);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Grade not found");
  }

  const data = docSnap.data();
  return data.pool || [];
}

export async function updateQuestions(grade: string, pool: any[]) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_auth")?.value !== "true") {
    throw new Error("Unauthorized");
  }

  const docRef = doc(db, "exams", grade);
  await updateDoc(docRef, {
    pool: pool
  });
  
  return true;
}
