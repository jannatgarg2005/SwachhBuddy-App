import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ReferralData {
  userId: string;
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  pendingReferrals: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReferralRecord {
  id: string;
  referrerId: string;
  refereeId: string;
  referralCode: string;
  status: "pending" | "completed";
  coinsAwarded: number;
  createdAt: Date;
  completedAt?: Date;
}

export const generateReferralCode = async (userId: string): Promise<string> => {
  try {


    const userReferralRef = doc(db, "referrals", userId);
    const userReferralSnap = await getDoc(userReferralRef);

    if (userReferralSnap.exists()) {
      return userReferralSnap.data().referralCode;
    }

    let referralCode: string = "";
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      attempts++;
      referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existingSnap = await getDocs(
        query(collection(db, "referrals"), where("referralCode", "==", referralCode))
      );
      if (existingSnap.empty) isUnique = true;
    }

    if (!isUnique) throw new Error("Failed to generate unique referral code after maximum attempts");

    const referralData: ReferralData = {
      userId,
      referralCode,
      totalReferrals: 0,
      totalEarnings: 0,
      pendingReferrals: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(userReferralRef, referralData);
    return referralCode;
  } catch (error) {
    const isOffline =
      error instanceof Error &&
      (error.message.includes("offline") ||
        (error as any).code === "failed-precondition");

    if (isOffline) {
      return `TEMP${userId.substring(0, 4).toUpperCase()}`;
    }

    console.error("Error generating referral code:", error);
    throw new Error("Failed to generate referral code");
  }
};

export const getReferralStats = async (userId: string) => {
  const defaultStats = { totalReferrals: 0, totalEarnings: 0, pendingReferrals: 0 };
  try {

    const snap = await getDoc(doc(db, "referrals", userId));
    if (!snap.exists()) return defaultStats;
    const data = snap.data();
    return {
      totalReferrals: data.totalReferrals || 0,
      totalEarnings: data.totalEarnings || 0,
      pendingReferrals: data.pendingReferrals || 0,
    };
  } catch (error) {
    const isOffline =
      error instanceof Error &&
      (error.message.includes("offline") ||
        (error as any).code === "failed-precondition");
    if (isOffline) return defaultStats;
    console.error("Error getting referral stats:", error);
    throw new Error("Failed to get referral statistics");
  }
};

export const validateReferralCode = async (referralCode: string) => {
  const invalid = { isValid: false, referrerId: null, referralCode: null };
  try {

    const upperCaseCode = referralCode.toUpperCase();
    const snap = await getDocs(
      query(collection(db, "referrals"), where("referralCode", "==", upperCaseCode))
    );
    if (snap.empty) return invalid;
    const data = snap.docs[0].data();
    return { isValid: true, referrerId: data.userId, referralCode: data.referralCode };
  } catch (error) {
    console.error("Error validating referral code:", error);
    return invalid;
  }
};

export const processReferralSignup = async (
  newUserId: string,
  referralCode: string
): Promise<boolean> => {
  try {

    const validation = await validateReferralCode(referralCode);
    if (!validation.isValid || !validation.referrerId) return false;

    const referralRecordRef = doc(collection(db, "referralRecords"));
    const referralRecord: ReferralRecord = {
      id: referralRecordRef.id,
      referrerId: validation.referrerId,
      refereeId: newUserId,
      referralCode: validation.referralCode!,
      status: "pending",
      coinsAwarded: 0,
      createdAt: new Date(),
    };

    await setDoc(referralRecordRef, referralRecord);
    await updateDoc(doc(db, "referrals", validation.referrerId), {
      pendingReferrals: increment(1),
      updatedAt: new Date(),
    });

    return true;
  } catch (error) {
    console.error("Error processing referral signup:", error);
    return false;
  }
};

export const completeReferralReward = async (userId: string): Promise<boolean> => {
  try {


    const referralQuery = query(
      collection(db, "referralRecords"),
      where("refereeId", "==", userId),
      where("status", "==", "pending")
    );
    const snap = await getDocs(referralQuery);
    if (snap.empty) return false;

    const referralDoc = snap.docs[0];
    const referralData = referralDoc.data() as ReferralRecord;
    const COINS_PER_REFERRAL = 10;

    const batch = writeBatch(db);

    batch.update(referralDoc.ref, {
      status: "completed",
      coinsAwarded: COINS_PER_REFERRAL,
      completedAt: new Date(),
    });

    const referrerRef = doc(db, "referrals", referralData.referrerId);
    batch.update(referrerRef, {
      totalReferrals: increment(1),
      totalEarnings: increment(COINS_PER_REFERRAL),
      pendingReferrals: increment(-1),
      updatedAt: new Date(),
    });

    const referrerUserRef = doc(db, "users", referralData.referrerId);
    batch.update(referrerUserRef, { coins: increment(COINS_PER_REFERRAL) });

    const refereeUserRef = doc(db, "users", userId);
    batch.update(refereeUserRef, { coins: increment(COINS_PER_REFERRAL) });

    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error completing referral reward:", error);
    return false;
  }
};