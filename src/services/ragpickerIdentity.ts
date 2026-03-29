// src/services/ragpickerIdentity.ts
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  addDoc,
  Timestamp,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ── Types ────────────────────────────────────────────────────────────────────

export interface RagPickerProfile {
  id: string;                     // Firestore doc ID = SB-RP-XXXXXX
  name: string;
  phone: string;
  address: string;
  city: string;
  zone: string;
  aadhaarLast4?: string;          // last 4 digits only — privacy safe
  photoUrl?: string;
  registeredAt: Timestamp | Date;
  isVerified: boolean;
  swachhScore: number;            // 0–1000
  totalKgCollected: number;
  totalEarningsRs: number;
  activeMonths: number;
  bankLinked: boolean;
  insuranceLinked: boolean;
}

export interface CollectionRecord {
  id?: string;
  ragPickerId: string;
  date: Timestamp | Date;
  weightKg: number;
  materialType: "Plastic" | "Paper" | "Metal" | "Glass" | "E-Waste" | "Mixed";
  locationName: string;
  latitude?: number;
  longitude?: number;
  ratePerKg: number;              // ₹/kg paid
  earningsRs: number;             // weightKg × ratePerKg
  verifiedByEmployeeId?: string;
  notes?: string;
}

export interface MonthlySummary {
  ragPickerId: string;
  month: string;                  // "2025-03"
  totalKg: number;
  totalEarningsRs: number;
  collectionDays: number;
  materialsBreakdown: Record<string, number>; // { Plastic: 12, Paper: 8, … }
  swachhScoreDelta: number;
  certificateGenerated: boolean;
}

// ── Rate card (₹/kg) ─────────────────────────────────────────────────────────
export const RATE_CARD: Record<CollectionRecord["materialType"], number> = {
  Plastic: 12,
  Paper: 8,
  Metal: 25,
  Glass: 4,
  "E-Waste": 40,
  Mixed: 7,
};

// ── Swachh Score weights ─────────────────────────────────────────────────────
const SCORE_PER_KG = 2;
const SCORE_PER_DAY = 5;
const SCORE_BONUS_EWASTE = 10; // per kg of e-waste

// ── Helpers ──────────────────────────────────────────────────────────────────
const generateRagPickerId = () =>
  "SB-RP-" + Math.random().toString(36).substring(2, 8).toUpperCase();

// ── CRUD ─────────────────────────────────────────────────────────────────────

/** Register a new rag picker */
export const registerRagPicker = async (
  data: Omit<RagPickerProfile, "id" | "registeredAt" | "isVerified" | "swachhScore" | "totalKgCollected" | "totalEarningsRs" | "activeMonths" | "bankLinked" | "insuranceLinked">
): Promise<RagPickerProfile> => {
  const id = generateRagPickerId();
  const profile: RagPickerProfile = {
    ...data,
    id,
    registeredAt: Timestamp.now(),
    isVerified: false,
    swachhScore: 0,
    totalKgCollected: 0,
    totalEarningsRs: 0,
    activeMonths: 0,
    bankLinked: false,
    insuranceLinked: false,
  };
  await setDoc(doc(db, "ragpickers", id), profile);
  return profile;
};

/** Fetch a rag picker by ID */
export const getRagPickerById = async (id: string): Promise<RagPickerProfile | null> => {
  try {
    const snap = await getDoc(doc(db, "ragpickers", id));
    return snap.exists() ? (snap.data() as RagPickerProfile) : null;
  } catch (err: any) {
    // Collection may not exist yet — treat as not found
    if (err?.code === "permission-denied" || err?.code === "not-found") return null;
    throw err;
  }
};

/** Search rag pickers by phone */
export const findRagPickerByPhone = async (phone: string): Promise<RagPickerProfile | null> => {
  try {
    const q = query(
      collection(db, "ragpickers"),
      where("phone", "==", phone),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as RagPickerProfile;
  } catch (err: any) {
    // If collection doesn't exist yet Firestore returns an empty snapshot,
    // but if rules block it we get permission-denied — treat both as "not found"
    if (
      err?.code === "permission-denied" ||
      err?.code === "not-found" ||
      err?.message?.includes("index")
    ) {
      return null;
    }
    throw err;
  }
};

/** Get all rag pickers in a zone */
export const getRagPickersByZone = async (zone: string): Promise<RagPickerProfile[]> => {
  try {
    const q = query(collection(db, "ragpickers"), where("zone", "==", zone));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as RagPickerProfile);
  } catch {
    return [];
  }
};

/** Log a collection record */
export const logCollectionRecord = async (
  record: Omit<CollectionRecord, "id" | "earningsRs">
): Promise<CollectionRecord> => {
  const earningsRs = parseFloat((record.weightKg * record.ratePerKg).toFixed(2));
  const full: CollectionRecord = { ...record, earningsRs };

  const colRef = collection(db, "ragpickers", record.ragPickerId, "collections");
  const added  = await addDoc(colRef, full);

  // Compute score delta
  const scoreDelta =
    record.weightKg * SCORE_PER_KG +
    SCORE_PER_DAY +
    (record.materialType === "E-Waste" ? record.weightKg * SCORE_BONUS_EWASTE : 0);

  // Update aggregate on profile — use setDoc merge so it works even if doc is new
  await setDoc(
    doc(db, "ragpickers", record.ragPickerId),
    {
      totalKgCollected: increment(record.weightKg),
      totalEarningsRs:  increment(earningsRs),
      swachhScore:      increment(scoreDelta),
    },
    { merge: true }
  );

  return { ...full, id: added.id };
};

/** Get collection history for a rag picker (latest 30) */
export const getCollectionHistory = async (ragPickerId: string): Promise<CollectionRecord[]> => {
  try {
    // Try with orderBy first (requires index)
    const q = query(
      collection(db, "ragpickers", ragPickerId, "collections"),
      orderBy("date", "desc"),
      limit(30)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as CollectionRecord));
  } catch (err: any) {
    // Fallback: fetch without orderBy if index not yet built
    if (err?.message?.includes("index") || err?.code === "failed-precondition") {
      try {
        const q2 = query(
          collection(db, "ragpickers", ragPickerId, "collections"),
          limit(30)
        );
        const snap2 = await getDocs(q2);
        const records = snap2.docs.map(d => ({ id: d.id, ...d.data() } as CollectionRecord));
        // Sort client-side
        return records.sort((a, b) => {
          const da = a.date instanceof Timestamp ? a.date.toMillis() : new Date(a.date).getTime();
          const db2 = b.date instanceof Timestamp ? b.date.toMillis() : new Date(b.date).getTime();
          return db2 - da;
        });
      } catch {
        return [];
      }
    }
    return [];
  }
};

/** Build a monthly summary for a given month (YYYY-MM) */
export const getMonthlySummary = async (
  ragPickerId: string,
  month: string
): Promise<MonthlySummary> => {
  const allRecords = await getCollectionHistory(ragPickerId);
  const records = allRecords.filter(r => {
    const d = r.date instanceof Timestamp ? r.date.toDate() : new Date(r.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === month;
  });

  const materialsBreakdown: Record<string, number> = {};
  let totalKg = 0;
  let totalEarningsRs = 0;
  const days = new Set<string>();
  let scoreDelta = 0;

  for (const r of records) {
    totalKg += r.weightKg;
    totalEarningsRs += r.earningsRs;
    materialsBreakdown[r.materialType] = (materialsBreakdown[r.materialType] || 0) + r.weightKg;
    const d = r.date instanceof Timestamp ? r.date.toDate() : new Date(r.date);
    days.add(d.toDateString());
    scoreDelta +=
      r.weightKg * SCORE_PER_KG +
      SCORE_PER_DAY +
      (r.materialType === "E-Waste" ? r.weightKg * SCORE_BONUS_EWASTE : 0);
  }

  return {
    ragPickerId,
    month,
    totalKg: parseFloat(totalKg.toFixed(2)),
    totalEarningsRs: parseFloat(totalEarningsRs.toFixed(2)),
    collectionDays: days.size,
    materialsBreakdown,
    swachhScoreDelta: parseFloat(scoreDelta.toFixed(0)),
    certificateGenerated: false,
  };
};

/** Verify a rag picker (municipal employee action) */
export const verifyRagPicker = async (ragPickerId: string, employeeId: string) => {
  await updateDoc(doc(db, "ragpickers", ragPickerId), {
    isVerified: true,
    verifiedBy: employeeId,
    verifiedAt: Timestamp.now(),
  });
};

/** Mark bank as linked */
export const markBankLinked = async (ragPickerId: string) => {
  await updateDoc(doc(db, "ragpickers", ragPickerId), { bankLinked: true });
};

/** Generate a text-based income certificate (no PDF dep needed) */
export const generateIncomeCertificateText = (
  profile: RagPickerProfile,
  summary: MonthlySummary,
  monthLabel: string
): string => {
  const lines = [
    "════════════════════════════════════════════════════════",
    "         SWACHH BUDDY — VERIFIED INCOME CERTIFICATE",
    "════════════════════════════════════════════════════════",
    "",
    `  Rag Picker ID  : ${profile.id}`,
    `  Name           : ${profile.name}`,
    `  City / Zone    : ${profile.city} — ${profile.zone}`,
    `  Swachh Score   : ${profile.swachhScore} pts`,
    `  Verified       : ${profile.isVerified ? "✅ YES" : "⏳ PENDING"}`,
    "",
    `  ── Income Summary for ${monthLabel} ──`,
    `  Active Days     : ${summary.collectionDays}`,
    `  Total Collected : ${summary.totalKg} kg`,
    `  Total Earnings  : ₹ ${summary.totalEarningsRs}`,
    "",
    "  ── Material Breakdown ──",
    ...Object.entries(summary.materialsBreakdown).map(
      ([mat, kg]) => `  ${mat.padEnd(10)} : ${kg.toFixed(2)} kg`
    ),
    "",
    "  ── Eligible For ──",
    "  ✅ Jan Dhan Bank Account",
    "  ✅ PM Suraksha Bima Yojana (Insurance)",
    "  ✅ Pradhan Mantri Shram Yogi Maandhan",
    "  ✅ Micro-loan from SHG / MFI",
    "",
    `  Certificate Date : ${new Date().toLocaleDateString("en-IN")}`,
    "  Issued by        : SwachhBuddy Digital Platform",
    "════════════════════════════════════════════════════════",
  ];
  return lines.join("\n");
};