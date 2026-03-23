// Test file to verify referral flow
// This can be used to test the entire referral system

export const testReferralFlow = () => {
    console.log("Testing Referral Flow:");

    // Test 1: Generate a referral link
    const baseUrl = window.location.origin;
    const testReferralCode = "ABC123";
    const referralLink = `${baseUrl}/signup?ref=${testReferralCode}`;

    console.log("1. Generated referral link:", referralLink);

    // Test 2: Simulate clicking the link
    console.log("2. When user clicks the link, they should be taken to:", referralLink);
    console.log("3. The signup page should detect the 'ref' parameter and pre-fill the referral code");

    // Test 3: Verify URL parameter extraction
    const url = new URL(referralLink);
    const refParam = url.searchParams.get('ref');
    console.log("4. Extracted referral code from URL:", refParam);

    // Test 4: Expected flow
    console.log("5. Expected flow:");
    console.log("   a. User visits referral link");
    console.log("   b. Signup page shows welcome message");
    console.log("   c. Referral code is pre-filled");
    console.log("   d. User completes signup");
    console.log("   e. processReferralSignup() is called");
    console.log("   f. Referral record is created with 'pending' status");
    console.log("   g. When new user scans first QR code, both users get 10 coins");

    return {
        referralLink,
        referralCode: testReferralCode,
        expectedParams: { ref: testReferralCode }
    };
};

// Test the URL parameter handling
export const testURLParams = (testUrl: string) => {
    try {
        const url = new URL(testUrl);
        const refParam = url.searchParams.get('ref');
        console.log("URL:", testUrl);
        console.log("Ref parameter:", refParam);
        return refParam;
    } catch (error) {
        console.error("Invalid URL:", error);
        return null;
    }
};

// Example usage:
// testReferralFlow();
// testURLParams('http://localhost:5173/signup?ref=ABC123');