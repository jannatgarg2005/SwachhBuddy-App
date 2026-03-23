// Referral Flow Documentation
// This explains how the referral system works

/*
REFERRAL FLOW:

1. USER A (REFERRER) GETS THEIR REFERRAL CODE:
   - User A opens "Refer & Earn" modal from navbar dropdown
   - generateReferralCode() creates unique code (e.g., "ABC123") 
   - System generates link: "https://yoursite.com/signup?ref=ABC123"

2. USER A SHARES THE LINK:
   - User A copies the referral link
   - User A shares it with friends (User B)

3. USER B (REFEREE) CLICKS THE LINK:
   - User B visits: "https://yoursite.com/signup?ref=ABC123"
   - Signup page detects "ref=ABC123" parameter
   - Shows welcome message: "You've been referred by a friend!"
   - Pre-fills referral code field with "ABC123"

4. USER B SIGNS UP:
   - User B completes signup form
   - processReferralSignup() is called with User B's ID and "ABC123"
   - System creates referral record with status: "pending"
   - Both users are linked in the database

5. COIN REWARD TRIGGER:
   - When User B scans their FIRST QR code
   - completeReferralReward() is called
   - System finds the pending referral record
   - Updates record status to "completed"
   - Awards 10 coins to User A (referrer)
   - Awards 10 coins to User B (referee)
   - Shows success message to User B

DATABASE STRUCTURE:
- Collection: "referrals" 
  - Document ID: userId
  - Fields: {userId, referralCode, totalReferrals, totalEarnings, pendingReferrals}

- Collection: "referralRecords"
  - Fields: {referrerId, refereeId, referralCode, status, coinsAwarded, createdAt}

- Collection: "users"
  - Fields: {uid, email, displayName, role, coins, ...}

TESTING:
1. Login as User A
2. Open "Refer & Earn" modal
3. Copy the referral link
4. Open link in incognito/new browser
5. Sign up as User B
6. Login as User B and scan QR code
7. Verify both users got 10 coins
*/