# Firestore Database Collections Structure

## Collection: `users`
```
Document ID: {userId} (Firebase Auth UID)
{
  "uid": "string",
  "email": "string", 
  "displayName": "string",
  "role": "citizen" | "municipal-employee",
  "coins": 0,
  "createdAt": "timestamp",
  "firstName": "string",
  "lastName": "string"
}
```

## Collection: `referrals`
```
Document ID: {userId} (Firebase Auth UID)
{
  "userId": "string",
  "referralCode": "string (6 chars, uppercase)",
  "totalReferrals": 0,
  "totalEarnings": 0,
  "pendingReferrals": 0,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Collection: `referralRecords`
```
Document ID: {auto-generated}
{
  "id": "string",
  "referrerId": "string (userId who referred)",
  "refereeId": "string (userId who was referred)", 
  "referralCode": "string",
  "status": "pending" | "completed",
  "coinsAwarded": 0,
  "createdAt": "timestamp",
  "completedAt": "timestamp (optional)"
}
```

## Example Data Flow:

1. User A opens "Refer & Earn" → Creates document in `referrals` collection
2. User B signs up with User A's code → Creates document in `referralRecords` collection  
3. User B scans first QR code → Updates `referralRecords` status to "completed" and awards coins to both users
4. Both users' coin counts updated in `users` collection