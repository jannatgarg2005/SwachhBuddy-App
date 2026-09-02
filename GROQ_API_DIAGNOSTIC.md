# 🔴 Groq API "Temporarily Unavailable" - Diagnostic & Solutions

**Issue**: Both chatbot and classifier showing "AI service temporarily unavailable"  
**Time**: Sep 2, 2026 11:34 UTC  
**Status**: Investigating

---

## 🔍 Step 1: Check Groq API Status

**First, verify if Groq itself is down:**

1. **Visit Groq Status Page**:
   - Go to: https://status.groq.com
   - Check if there are any incidents
   - Look for API outages

2. **Test Your API Key Manually**:
   ```bash
   # Open terminal and run:
   curl https://api.groq.com/openai/v1/models \
     -H "Authorization: Bearer YOUR_GROQ_API_KEY"
   ```
   
   **Expected**: Should return list of models
   **If fails**: API key is invalid or Groq is down

---

## 🔧 Quick Fixes to Try

### Fix 1: Verify API Key is Correct

**Problem**: API key might be wrong or expired

**Check**:
1. Go to https://console.groq.com
2. Navigate to API Keys
3. Verify your key exists
4. Check if it's active (not revoked)

**If key is missing or revoked**:
1. Generate a NEW API key
2. Copy it (starts with `gsk_`)
3. Update in Vercel:
   - Dashboard → Settings → Environment Variables
   - Edit `GROQ_API_KEY`
   - Paste new value
   - Save
4. Redeploy

### Fix 2: Check Rate Limits

**Problem**: You might have hit Groq's API limits

**Groq Free Tier Limits**:
- Requests per minute: ~30 RPM
- Requests per day: ~14,400 RPD
- Tokens per minute: ~6,000 TPM

**Check if you're hitting limits**:
1. Vercel Dashboard → Deployments → Latest
2. Functions tab → Look for logs
3. Search for errors with "429" or "rate limit"

**Solution if rate limited**:
- Wait 1 minute and try again
- Upgrade to Groq paid tier
- OR implement fallback solution (see below)

### Fix 3: Model Availability

**Problem**: The specific model might be unavailable

**Current models used**:
- Chatbot: `llama-3.3-70b-versatile`
- Classifier: `qwen/qwen3.6-27b` (vision model)

**Check model availability**:
```bash
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer YOUR_KEY" \
  | grep -i "llama\|qwen"
```

**If models are unavailable**, update to backup models:
- Chatbot backup: `llama-3.1-70b-versatile`
- Classifier backup: Try different vision model or use OpenAI

---

## 🆘 Immediate Workaround - Add Fallback

Let me create a fallback mechanism that shows a helpful message instead of breaking:

### Option A: User-Friendly Error Message

Update the error handling to be more helpful:

```typescript
// In AIWasteClassifier.tsx
catch (err) {
  const errorMessage = err instanceof Error ? err.message : "Unknown error";
  
  // Check if it's a Groq API issue
  if (errorMessage.includes("temporarily unavailable") || 
      errorMessage.includes("503") || 
      errorMessage.includes("429")) {
    toast({
      title: "⏳ AI Service Busy",
      description: "Groq API is experiencing high traffic. Please try again in 1-2 minutes.",
      variant: "default",
    });
  }
  
  // Show demo result as fallback
  setResult(DEMO_RESULT);
  setIsDemoMode(true);
}
```

### Option B: Retry Logic

Add automatic retry with exponential backoff:

```typescript
const fetchWithRetry = async (url: string, options: any, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status === 429) {
        // Rate limited - wait and retry
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
        continue;
      }
      throw new Error(`API error ${response.status}`);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
};
```

---

## 🔄 Alternative Solution: Switch to OpenAI (Recommended)

If Groq continues to be unreliable, switch to OpenAI which is more stable:

### Cost Comparison:
- **Groq**: Free tier limited, $0.05-0.27 per 1M tokens (paid)
- **OpenAI**: $0.60-3.00 per 1M tokens, but more reliable

### Quick Switch to OpenAI:

1. **Get OpenAI API Key**:
   - Go to: https://platform.openai.com/api-keys
   - Create new key
   - Copy it (starts with `sk-`)

2. **Update Vercel Environment**:
   - Add: `OPENAI_API_KEY=sk_...`
   - Keep: `GROQ_API_KEY=gsk_...` (as fallback)

3. **Update API files** - I can create a version that tries Groq first, falls back to OpenAI

---

## 📊 Diagnostic Commands

Run these in your terminal to diagnose:

### 1. Test Groq API Health
```bash
curl -I https://api.groq.com/openai/v1/models
# Should return: HTTP/2 200
```

### 2. Test Your API Key
```bash
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer gsk_YOUR_KEY_HERE"
# Should return JSON with model list
```

### 3. Test a Simple Chat Request
```bash
curl https://api.groq.com/openai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer gsk_YOUR_KEY_HERE" \
  -d '{
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 50
  }'
# Should return a response with "choices" array
```

### 4. Check if Vision Model Works
```bash
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer gsk_YOUR_KEY_HERE" \
  | grep "qwen"
# Should show qwen models if available
```

---

## 🎯 Action Plan

**Immediate (Right Now)**:
1. Run diagnostic commands above
2. Check Groq status page
3. Verify API key is valid
4. Check if you're rate limited

**Short Term (Next 5 min)**:
1. If API key invalid → Generate new one
2. If rate limited → Wait or upgrade tier
3. If Groq is down → Wait for recovery
4. If model unavailable → Switch model

**Long Term (Next 30 min)**:
1. Implement retry logic
2. Add OpenAI as fallback
3. Add better error messages
4. Consider caching responses

---

## 🚨 What to Tell Users

**If Groq is temporarily down:**
```
"🌱 Our AI assistant is taking a quick break! 
The classifier will show example results until service resumes.
This doesn't affect your points or other features."
```

**If rate limited:**
```
"⏳ High traffic detected! 
Please wait 1-2 minutes and try again.
Your progress is saved."
```

---

## 📞 Next Steps

**Tell me which scenario applies**:

1. ❓ "My API key shows as invalid" → I'll help you fix the key
2. ❓ "Getting 429 rate limit errors" → I'll add retry logic
3. ❓ "Groq status page shows outage" → I'll add OpenAI fallback
4. ❓ "Model not found error" → I'll switch to backup model
5. ❓ "Other error message" → Share the exact error

**Meanwhile, run these diagnostics**:
```bash
# Test 1: Check API health
curl -I https://api.groq.com/openai/v1/models

# Test 2: Test your key (replace with your actual key)
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer gsk_YOUR_ACTUAL_KEY"
```

Share the output and I'll tell you exactly what's wrong and how to fix it!

---

**Status**: Waiting for diagnostic results  
**Time**: Sep 2, 2026 11:34 UTC  
**Priority**: HIGH - User-facing feature broken
