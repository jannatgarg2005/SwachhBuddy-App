import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const generateSimpleCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

export const initializeDatabase = async (userId: string, userEmail: string) => {
  try {
    const userData = {
      uid: userId,
      email: userEmail,
      coins: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", userId), userData);

    const referralData = {
      userId,
      referralCode: generateSimpleCode(),
      totalReferrals: 0,
      totalEarnings: 0,
      pendingReferrals: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, "referrals", userId), referralData);

    return { success: true, referralCode: referralData.referralCode };
  } catch (error) {
    console.error("Error initializing database:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const checkDatabaseStatus = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const referralsSnapshot = await getDocs(collection(db, "referrals"));
    return {
      users: usersSnapshot.size,
      referrals: referralsSnapshot.size,
      initialized: usersSnapshot.size > 0 && referralsSnapshot.size > 0,
    };
  } catch (error) {
    console.error("Error checking database status:", error);
    return {
      users: 0,
      referrals: 0,
      initialized: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const createTestReferralCode = async (
  userId: string,
  code: string = "TEST123"
) => {
  try {
    const referralData = {
      userId,
      referralCode: code,
      totalReferrals: 0,
      totalEarnings: 0,
      pendingReferrals: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await setDoc(doc(db, "referrals", userId), referralData);
    return { success: true, code };
  } catch (error) {
    console.error("Error creating test referral code:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};