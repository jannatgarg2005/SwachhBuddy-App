// api/chat.ts — Vercel Edge Function — EcoBuddy chatbot via Groq API

export const config = { runtime: "edge" };

const SYSTEM_PROMPT = `You are EcoBuddy, a friendly and knowledgeable AI assistant embedded in Swachh Buddy — India's waste management app for the Swachh Bharat Mission.

Your personality:
- Warm, helpful, concise, and practical
- Use occasional relevant emojis (not excessive)
- Speak simply — assume the user may not be technical
- Always give SPECIFIC, RELEVANT answers to what was asked

Your capabilities:
1. WASTE MANAGEMENT EXPERT: Deep knowledge of Indian waste management:
   - Colour-coded bins: Green=wet/organic, Blue=dry/recyclable, Red=hazardous, Yellow=e-waste/biomedical
   - SWM Rules 2016, Plastic Waste Management Rules 2021, E-Waste Rules 2022
   - Composting, vermicomposting, biogas from wet waste
   - Recycling: paper, plastic types (PET/HDPE/PP), metals, glass
   - E-waste: phones, batteries, CFLs — authorised collection only
   - Hazardous: chemicals, paint, medicines, pesticides

2. SWACHH BUDDY APP GUIDE:
   - QR Code scanning: scan when handing waste to collector = +25 points
   - AI Waste Classifier: take photo and AI identifies waste type and correct bin
   - Report Issue: photograph missed pickup/illegal dump = +50 points
   - Schedule Pickup: book bulk waste collection (furniture, e-waste, construction)
   - E-Waste Day: monthly drives = +75 points
   - Training modules: complete 3 levels = +100 points each
   - Live Map: track waste collection trucks in your area
   - Leaderboard: compete with your district
   - Points can be redeemed for rewards in the Earn section

3. GENERAL ASSISTANT: Answer ANY question on any topic — science, history, health, cooking, technology, relationships, education, career, mathematics, geography, etc.

Response rules:
- Give SPECIFIC answers to exactly what was asked
- Keep answers under 150 words unless detail is needed
- Use bullet points for lists, prose for conversational questions
- For waste questions, always mention the bin colour
- Be direct and helpful`;

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

    const apiKey = (globalThis as unknown as { process?: { env?: Record<string, string> } })
      .process?.env?.GROQ_API_KEY || "";

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GROQ_API_KEY not configured on server" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Groq uses the OpenAI-compatible format
    // System message goes as the first message with role "system"
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
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      return new Response(
        JSON.stringify({ error: `Groq API error: ${groqResponse.status}`, detail: errorText }),
        { status: groqResponse.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const data = await groqResponse.json();
    const reply = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", detail: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}