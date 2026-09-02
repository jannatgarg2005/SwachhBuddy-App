# 🔄 Groq Models — September 2026 Update

**Date**: September 2, 2026  
**Commit**: `5eedac3`

---

## ✅ Current Working Models (FREE)

### Chatbot: `openai/gpt-oss-20b`
- **Speed**: 1000 tokens/second
- **Context**: 131K tokens
- **Cost**: Free tier available
- **Status**: ✅ Currently available (September 2026)
- **Use case**: Text generation, conversations

### Classifier: `qwen/qwen3.6-27b`
- **Speed**: 500 tokens/second
- **Capabilities**: Vision/multimodal
- **Image support**: Up to 20MB images
- **Cost**: Free tier available
- **Status**: ✅ Currently available (September 2026)
- **Use case**: Image classification, waste identification

---

## ❌ Deprecated Models (DO NOT USE)

### Recently Decommissioned (August 2026):
- ❌ `llama-3.3-70b-versatile` → replaced by `openai/gpt-oss-120b` or `qwen/qwen3.6-27b`
- ❌ `llama-3.1-8b-instant` → replaced by `openai/gpt-oss-20b`
- ❌ `llama-3.2-90b-vision-preview` → replaced by `qwen/qwen3.6-27b`

### Deprecated in 2025-2026:
- ❌ `mixtral-8x7b-32768` (the model we used in April 2024)
- ❌ `qwen/qwen3-32b`
- ❌ `meta-llama/llama-4-scout-17b-16e-instruct`

---

## 📊 What Changed

| Date | What Happened |
|------|---------------|
| **April 2024** | Original implementation used `mixtral-8x7b-32768` (chatbot) and `qwen/qwen3.6-27b` (classifier) |
| **2025** | Groq deprecated Mixtral models |
| **August 2024** | User noticed classifier stopped working (qwen model was being phased out) |
| **August 2026** | Groq deprecated `llama-3.3-70b-versatile` and `llama-3.2-90b-vision-preview` |
| **September 2, 2026** | Updated to `openai/gpt-oss-20b` (chatbot) and `qwen/qwen3.6-27b` (classifier) |

---

## 🎯 Current Implementation

### `api/chat.ts`
```typescript
model: "openai/gpt-oss-20b"
```

### `api/classify.ts`
```typescript
model: "qwen/qwen3.6-27b"
```

Both use:
- OpenAI-compatible API format
- `GROQ_API_KEY` from Vercel environment
- Same request/response structure as before

---

## ⚠️ WARNING: Groq Model Stability

**Groq regularly deprecates free models.** This is the THIRD time we've had to update:

1. **April 2024**: Used `mixtral-8x7b` and `qwen/qwen3.6-27b`
2. **August 2024**: Mixtral deprecated, switched to `llama-3.3-70b`
3. **September 2026**: Llama models deprecated, switched to `openai/gpt-oss-20b`

### Pattern:
- Groq adds new models to attract users
- Models work for 3-12 months
- Groq deprecates and replaces with new models
- Apps break unless updated

### Future-Proofing:
- Check Groq deprecations page monthly: https://console.groq.com/docs/deprecations
- Keep model names in config (not hardcoded)
- Consider switching to Gemini or Claude for production stability

---

## 📝 Alternative: Switch to Stable API

If Groq keeps breaking your app, consider:

### Option 1: Google Gemini (Already Implemented)
- ✅ Already coded in commit `d012fda`
- ✅ Just needs `GEMINI_API_KEY` in Vercel
- ✅ 60 requests/minute free
- ✅ Won't be deprecated
- ✅ More reliable for production

### Option 2: Anthropic Claude
- ✅ Most stable option
- ✅ Vision + text both work
- ✅ Never removes models
- ⚠️ Costs ~$3-15/month for your traffic

### Option 3: Keep Using Groq
- ✅ Free
- ⚠️ Must update models every 3-12 months
- ⚠️ Risk of downtime when models are removed

---

## 🔍 How to Check Available Models

Run this command to see current Groq models:

```bash
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer YOUR_GROQ_API_KEY"
```

Or check the official docs: https://console.groq.com/docs/models

---

## ✅ Testing the APIs

### Test Chatbot:
```bash
curl -X POST "https://swachh-buddy-app.vercel.app/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What bin does a plastic bottle go in?"}]}'
```

### Test Classifier:
```bash
curl -X POST "https://swachh-buddy-app.vercel.app/api/classify" \
  -H "Content-Type: application/json" \
  -d '{"imageBase64":"[BASE64_IMAGE_HERE]","mimeType":"image/jpeg"}'
```

---

## 📊 Expected Response Times

| Endpoint | Model | Typical Response Time |
|----------|-------|----------------------|
| Chatbot | `openai/gpt-oss-20b` | 0.5-2 seconds |
| Classifier | `qwen/qwen3.6-27b` | 2-5 seconds (vision is slower) |

---

**Status**: ✅ Updated to September 2026 models  
**Next Check**: October 2026 (check Groq deprecations page)  
**Backup Plan**: Gemini implementation ready in commit `d012fda`

---

**Made with 💚 for Swachh Bharat Mission**  
**Powered by**: Groq (Free Tier) — `openai/gpt-oss-20b` + `qwen/qwen3.6-27b`
