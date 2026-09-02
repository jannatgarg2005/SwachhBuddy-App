# AI Classifier Fix - Debugging & Verification Guide

**Issue**: AI Waste Classifier was not working in production while AI Chatbot was working fine.

**Root Causes Identified & Fixed**:
1. ✅ API URL resolution - Using relative `/api/classify` instead of absolute URL
2. ✅ API key lookup - Improved environment variable detection for Vercel Edge
3. ✅ Error handling - Missing specific error messages for debugging
4. ✅ Logging - No console logs to track failures
5. ✅ JSON parsing - Fragile JSON extraction from AI response

---

## 🔧 Changes Made

### 1. **AIWasteClassifier.tsx** - Frontend Component
**Problem**: Relative API URL `/api/classify` works on localhost but may fail on production.

**Solution**:
```typescript
// BEFORE (problematic)
const response = await fetch("/api/classify", { ... });

// AFTER (production-ready)
const apiUrl = window.location.origin + "/api/classify";
const response = await fetch(apiUrl, { ... });
```

**Improvements**:
- Uses `window.location.origin` to build absolute URL
- Works on any domain: localhost, Vercel, custom domains
- Added detailed console logging with emojis for easy debugging
- Specific error messages for different failure scenarios:
  - API key not configured → "API key not configured on server"
  - Rate limit (429) → "API rate limit reached. Try again in a few seconds"
  - Server error (5xx) → "Server error. The AI service may be temporarily unavailable"

**Console Output** (for debugging):
```
🔍 Calling classifier API: https://yourdomain.com/api/classify
📥 Classifier response status: 200
📥 Classifier response: { "category": "dry", "confidence": 92, ... }
✅ Classification successful: dry
```

### 2. **api/classify.ts** - Edge Function
**Problem**: API key lookup was using only one method, failing on Vercel Edge.

**Solution**:
```typescript
// BEFORE (single method)
const apiKey = (globalThis as unknown as { process?: ... })
  .process?.env?.GROQ_API_KEY || "";

// AFTER (dual method)
let apiKey = "";
if (typeof process !== "undefined" && process.env) {
  apiKey = process.env.GROQ_API_KEY || "";
} else {
  apiKey = (globalThis as unknown as { process?: ... })
    .process?.env?.GROQ_API_KEY || "";
}
```

**Improvements**:
- Checks both `process.env` (Node.js/Vercel) and `globalThis.process.env` (Edge)
- Better error handling: Returns 500 with specific error message if key missing
- Added console logging for:
  - API key found ✅
  - Groq API response status
  - Raw response preview (first 300 chars)
  - JSON parsing errors with response preview
  - Classification success with category

### 3. **api/chat.ts** - Chat API
**Applied Same Improvements**:
- Updated API key lookup to use dual method
- Added console logging
- Consistent error handling with classify.ts

---

## 🧪 Testing & Verification

### Local Testing (Localhost)
1. Open http://localhost:8080/dashboard/enduser
2. Click "AI Waste Classifier" button
3. Upload a waste image (or use camera)
4. Click "Classify with AI"
5. **Expected**: Should show demo result with message "Demo mode — real AI classification available on the live site"
6. **Check Console** (F12): Should see logs:
   ```
   🔍 Calling classifier API: http://localhost:8080/api/classify
   📥 Classifier response status: 200
   ✅ Classification successful: dry
   ```

### Production Testing (Vercel/Live)
1. Deploy to Vercel (or your hosting)
2. Open the live app
3. Navigate to AI Waste Classifier
4. Upload image and click "Classify with AI"
5. **Expected**: Should return real AI classification (not demo)
6. **Check Browser Console** (F12): Should see all logs showing:
   - Correct API URL (your domain)
   - Status 200
   - Successfully parsed response

### Debugging Checklist
- [ ] GROQ_API_KEY is set in Vercel environment variables
- [ ] API key value is correct (starts with `gsk_`)
- [ ] API URL in logs shows your correct domain
- [ ] Response status is 200 (not 401, 403, 429, 500)
- [ ] JSON parsing succeeds (no "Could not parse JSON" error)
- [ ] Result includes: category, confidence, itemName, binColor
- [ ] Points are awarded after confirmation

---

## 🔑 Environment Setup

### For Vercel Deployment

1. **Get Groq API Key**:
   - Go to https://console.groq.com
   - Create API key
   - Copy the key (starts with `gsk_`)

2. **Add to Vercel**:
   - Go to Vercel project settings
   - Environment Variables
   - Add: `GROQ_API_KEY` = `gsk_...your_key...`
   - Redeploy

3. **Verify in Production**:
   ```bash
   # Check logs in Vercel dashboard
   # Go to Deployments → Latest → Function Logs
   # Should see: "✅ API key found, making request to Groq chat API"
   ```

---

## 🐛 Common Issues & Solutions

### Issue 1: "API key not configured on server"
**Cause**: GROQ_API_KEY not set in Vercel environment
**Fix**:
1. Go to Vercel project settings
2. Add environment variable: `GROQ_API_KEY=gsk_...`
3. Click "Save"
4. Redeploy project

### Issue 2: "Could not reach the AI classifier"
**Cause**: API URL not resolving correctly
**Fix**:
1. Check browser console (F12)
2. Look for "🔍 Calling classifier API:" log
3. Verify URL matches your domain
4. Check CORS headers in response

### Issue 3: Response shows "Demo mode"
**Cause**: Still on localhost environment
**Fix**:
1. Only shows on localhost
2. Deploy to production for real AI
3. Or configure real API key locally

### Issue 4: "API rate limit reached"
**Cause**: Too many requests to Groq API (429 response)
**Fix**:
1. Wait 30 seconds
2. Try again
3. Contact Groq support if persistent

### Issue 5: "Invalid response from AI service"
**Cause**: JSON parsing failed from Groq response
**Fix**:
1. Check Vercel function logs
2. Look for "❌ Could not extract JSON from response"
3. Verify Qwen model is still available: `qwen/qwen3.6-27b`
4. Check if response format changed

---

## 📊 API Response Examples

### Successful Classification
```json
{
  "category": "dry",
  "confidence": 92,
  "itemName": "Plastic PET Bottle",
  "description": "A used PET plastic water bottle — dry, recyclable waste.",
  "disposalInstructions": "Rinse the bottle to remove residue. Remove the cap (different plastic type). Flatten it to save space, then place in the Blue (Dry Waste) bin.",
  "binColor": "Blue Bin",
  "recyclable": true,
  "tip": "PET bottles (code ♳) are India's most recycled plastic. Clean bottles fetch ₹10–15/kg at kabadiwallas!"
}
```

### Error Response (Example)
```json
{
  "error": "GROQ_API_KEY not configured on server",
  "detail": "Environmental variable not found"
}
```

---

## 🚀 Deployment Steps

### Step 1: Commit & Push
```bash
cd Swachh-Buddy
git add .
git commit -m "fix(classifier): production fixes"
git push origin main
```

### Step 2: GitHub → Vercel (Auto-Deploy)
- Vercel automatically detects push
- CI/CD pipeline runs
- Builds and deploys to production

### Step 3: Test Live
1. Open https://your-domain.com
2. Navigate to AI Waste Classifier
3. Test with image
4. Verify in browser console

### Step 4: Monitor
- Watch Vercel function logs
- Check for errors in dashboard
- Monitor API key usage

---

## 📝 Logs to Monitor

### Success Pattern
```
✅ API key found, making request to Groq vision API
📥 Raw Groq response (first 300 chars): {"choices":[...
✅ Classification successful: dry
```

### Failure Pattern
```
❌ GROQ_API_KEY not found in environment variables
❌ Groq API error 401: Invalid API key
❌ Could not extract JSON from response: {...
```

---

## 🔍 Browser DevTools Debugging

### F12 → Console Tab
Look for logs with emoji prefixes:
- 🔍 = API call info
- 📥 = Response received
- ✅ = Success
- ❌ = Error
- 🎯 = Important step

### F12 → Network Tab
1. Upload image and click "Classify"
2. Look for request to `/api/classify`
3. Check:
   - Method: POST ✅
   - Status: 200 ✅
   - Response body: valid JSON ✅
   - Headers: Authorization present ✅

---

## ✅ Verification Checklist Before Going Live

- [ ] Build successful: `npm run build` (0 errors)
- [ ] Classifier works on localhost (shows demo)
- [ ] GROQ_API_KEY added to Vercel environment
- [ ] Deployed to Vercel successfully
- [ ] AI Classifier works on live domain
- [ ] Correct classification returned
- [ ] Points awarded after confirmation
- [ ] Console logs showing ✅ success
- [ ] No error toasts appearing
- [ ] Multiple images tested
- [ ] Different waste types tested (wet, dry, hazardous, e-waste)

---

## 📞 Support Resources

- **Groq API Docs**: https://console.groq.com/docs/
- **Vercel Deployment**: https://vercel.com/docs
- **GitHub Actions**: https://github.com/jannatgarg2005/SwachhBuddy-App/actions
- **Vercel Logs**: https://vercel.com/dashboard (Deployments → Functions)

---

**Status**: ✅ Fixed & Deployed  
**Commit**: `81b9386` (fix(classifier): improve error handling...)  
**Date**: September 2, 2026

For questions or issues, check the console logs with emoji markers for quick debugging.
