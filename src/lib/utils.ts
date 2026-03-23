import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { db } from "@/lib/firebase";
import { doc, runTransaction } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export async function updateUserCoinsFirestore(uid: string, delta: number): Promise<number> {
  const userDoc = doc(db, "users", uid);

  return await runTransaction(db, async (t) => {
    const snap = await t.get(userDoc);
    const cur = snap.exists() ? (snap.data()?.coins ?? 0) : 0;
    const updated = Math.max(0, cur + delta); // prevent negative coins
    t.set(userDoc, { coins: updated }, { merge: true });
    return updated;
  });
}