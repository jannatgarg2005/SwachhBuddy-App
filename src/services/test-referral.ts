// Manual test for referral system
import { completeReferralReward, getUserCoins, generateReferralCode } from "./referral";
import { db } from "@/lib/firebase";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";

export const testReferralReward = async (userId: string) => {
    console.log("=== Testing Referral Reward System ===");
    console.log("Testing for user ID:", userId);

    try {
        // Check current coins
        const currentCoins = await getUserCoins(userId);
        console.log("Current coins before reward:", currentCoins);

        // Try to complete referral reward
        const result = await completeReferralReward(userId);
        console.log("Referral reward result:", result);

        if (result) {
            // Check coins after reward
            const newCoins = await getUserCoins(userId);
            console.log("Coins after reward:", newCoins);
            console.log("Coins gained:", newCoins - currentCoins);
        } else {
            console.log("No referral reward was processed");
        }

        return result;
    } catch (error) {
        console.error("Error testing referral reward:", error);
        return false;
    }
};

// Test function to manually create a referral record for testing
export const createTestReferral = async (referrerId: string, refereeId: string) => {
    console.log("Creating test referral record...");
    console.log("Referrer ID:", referrerId);
    console.log("Referee ID:", refereeId);

    // This would manually create a referral record for testing
    // In a real app, this would be done through the signup process
};

// Function to list all existing referral codes (for debugging)
export const listAllReferralCodes = async () => {
    try {
        console.log("=== Listing All Referral Codes ===");
        const referralsCollection = collection(db, "referrals");
        const snapshot = await getDocs(referralsCollection);

        console.log("Total referral documents found:", snapshot.size);

        snapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Referral Code:", data.referralCode, "User ID:", data.userId);
        });

        return snapshot.size;
    } catch (error) {
        console.error("Error listing referral codes:", error);
        return 0;
    }
};

// Function to manually create a referral code for testing
export const createTestReferralCode = async (userId: string, customCode?: string) => {
    try {
        console.log("=== Creating Test Referral Code ===");
        console.log("User ID:", userId);

        const code = customCode || "TEMPOYNX";

        // Create referral document manually
        const referralData = {
            userId: userId,
            referralCode: code,
            totalReferrals: 0,
            totalEarnings: 0,
            pendingReferrals: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        console.log("Creating referral document:", referralData);
        await setDoc(doc(db, "referrals", userId), referralData);
        console.log("Test referral code created successfully!");

        return code;
    } catch (error) {
        console.error("Error creating test referral code:", error);
        throw error;
    }
};