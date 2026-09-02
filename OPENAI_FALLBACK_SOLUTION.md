# 🚀 OpenAI Fallback Solution - Implement Now

If Groq continues showing "temporarily unavailable", here's how to add OpenAI as automatic fallback.

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Get OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Click: "Create new secret key"
3. Copy the key (starts with `sk-proj-`)
4. Add to Vercel:
   - Dashboard → Settings → Environment Variables
   - Name: `OPENAI_API_KEY`
   - Value: `sk-proj-...`
   - Save

### Step 2: Update Chat API

Replace `api/chat.ts` with this version that tries Groq first, falls back to OpenAI:

```typescript
// api/chat.ts — With Groq + OpenAI Fallback

export const config = { runtime: "edge" };

// Get API keys
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

const SYSTEM_PROMPT = `You are EcoBuddy...`; // [keep existing prompt]

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const bodyText = await req.text();

    if (!bodyText) {
      return new Response(JSON.stringify({ error: "Empty request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let parsed: { messages?: Array<{ role: string; content: string }> };
    try {
      parsed = JSON.parse(bodyText);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { messages } = parsed;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Missing or empty messages array" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Try Groq first, fall back to OpenAI
    let reply = "";
    let usedProvider = "";

    // Attempt 1: Groq
    if (GROQ_API_KEY) {
      try {
        console.log("📡 Trying Groq API...");
        const groqMessages = [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
        ];

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: groqMessages,
            temperature: 0.7,
            max_tokens: 400,
          }),
        });

        if (groqResponse.ok) {
          const data = await groqResponse.json();
          reply = data.choices?.[0]?.message?.content || "";
          usedProvider = "groq";
          console.log("✅ Groq responded successfully");

          return new Response(JSON.stringify({ reply }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        } else {
          const errorText = await groqResponse.text();
          console.log(`⚠️ Groq failed with ${groqResponse.status}: ${errorText.substring(0, 100)}`);
        }
      } catch (groqErr) {
        console.log("⚠️ Groq error:", String(groqErr).substring(0, 100));
      }
    }

    // Fallback to OpenAI
    if (OPENAI_API_KEY) {
      try {
        console.log("📡 Falling back to OpenAI API...");
        const openaiMessages = [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ];

        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: openaiMessages,
            temperature: 0.7,
            max_tokens: 400,
          }),
        });

        if (openaiResponse.ok) {
          const data = await openaiResponse.json();
          reply = data.choices?.[0]?.message?.content || "";
          usedProvider = "openai";
          console.log("✅ OpenAI responded successfully");

          return new Response(JSON.stringify({ reply }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        } else {
          const errorText = await openaiResponse.text();
          console.log(`❌ OpenAI failed with ${openaiResponse.status}`);
          throw new Error(`OpenAI error: ${openaiResponse.status}`);
        }
      } catch (openaiErr) {
        console.log("❌ OpenAI error:", String(openaiErr).substring(0, 100));
      }
    }

    // Both failed
    return new Response(
      JSON.stringify({ 
        error: "All AI providers unavailable. Please try again later.",
        detail: "Both Groq and OpenAI APIs are currently unavailable"
      }),
      { 
        status: 503, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", detail: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}
```

### Step 3: Update Classifier API

Do the same for `api/classify.ts` - add OpenAI vision as fallback:

```typescript
// Similar approach: try Groq first, fall back to OpenAI vision
// If you want, I can provide the full code
```

---

## 💰 Cost Comparison

| Provider | Chatbot Cost | Classifier Cost | Notes |
|----------|--------------|-----------------|-------|
| **Groq** | Free (limited) | Free (limited) | Currently unavailable |
| **OpenAI** | ~$0.0005/request | ~$0.001/request | Reliable, stable |
| **Both** | Use Groq first, OpenAI backup | Best reliability | Recommended |

For typical usage (100 requests/day):
- **Groq**: $0/month
- **OpenAI**: ~$3-5/month
- **Both (recommended)**: ~$3-5/month (uses Groq when available)

---

## 🎯 Implementation Options

### Option A: Quick Fix (Recommended)
- Keep Groq as primary (free)
- Add OpenAI as fallback (small cost)
- Update: `api/chat.ts`
- Result: Always works, minimal cost

### Option B: Switch to OpenAI Only
- Remove Groq entirely
- Use only OpenAI
- Result: Always works, slightly more cost

### Option C: Wait for Groq Recovery
- Do nothing for now
- Groq should recover soon
- Result: Free but currently broken

### Option D: Use Different Free Provider
- Switch to Replicate or Together AI
- Result: Free but may have similar issues

---

## ✅ Recommended: Option A (Quick Fix)

**Step-by-step implementation:**

1. Get OpenAI key (5 min)
2. Add to Vercel environment (2 min)
3. Update `api/chat.ts` with fallback code (3 min)
4. Update `api/classify.ts` with fallback code (3 min)
5. Commit and push (1 min)
6. Wait for deployment (2 min)
7. Test both APIs (2 min)

**Total time: ~15 minutes**

**Benefit: Always works, users never see errors**

---

## 📋 Quick Checklist

- [ ] Get OpenAI API key from https://platform.openai.com/api-keys
- [ ] Add `OPENAI_API_KEY` to Vercel environment variables
- [ ] Update `api/chat.ts` with fallback code
- [ ] Update `api/classify.ts` with fallback code
- [ ] Test locally: `npm run dev`
- [ ] Commit: `git add api/chat.ts api/classify.ts`
- [ ] Commit: `git commit -m "feat: add OpenAI fallback for Groq API"`
- [ ] Push: `git push origin main`
- [ ] Wait for Vercel deployment (2-3 min)
- [ ] Test chatbot ✅
- [ ] Test classifier ✅

---

## 🆘 If You Need Help

**Tell me which option you want:**

1. ❓ "Implement OpenAI fallback" → I'll write the full code
2. ❓ "Check Groq status first" → I'll help diagnose
3. ❓ "Switch to OpenAI only" → I'll update both APIs
4. ❓ "Try fixing Groq" → I'll check API key/limits

---

**My Recommendation**: Go with **Option A** (OpenAI fallback).  
It's the most reliable and gives you the best user experience.

Ready to implement? Just say "yes" and I'll provide the complete code! 🚀
