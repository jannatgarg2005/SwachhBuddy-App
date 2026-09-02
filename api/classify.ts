// api/classify.ts — Vercel Edge Function — AI Waste Classifier via Groq Vision API (Llama 3.2 Vision)

export const config = { runtime: "edge" };

// Get API key at module load time for Vercel Edge
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

const SYSTEM_PROMPT = `You are an expert waste classification AI for India's Swachh Bharat Mission.

You will receive an image of a waste item. Analyse it and respond ONLY with a valid JSON object — no preamble, no explanation, no markdown fences. Just the raw JSON.

Format:
{
  "category": "wet" | "dry" | "hazardous" | "e-waste",
  "confidence": <integer 0-100>,
  "itemName": "<specific item name, e.g. Plastic PET Bottle>",
  "description": "<one sentence describing the item and why it belongs to this category>",
  "disposalInstructions": "<2-3 sentences of practical disposal advice for Indian citizens>",
  "binColor": "<Green | Blue | Red | Yellow> Bin",
  "recyclable": <true | false>,
  "tip": "<one short eco-tip about this item>"
}

Classification rules (India SWM Rules 2016):
- wet: food scraps, fruit/vegetable peels, cooked food, garden waste, organic matter → Green Bin
- dry: paper, cardboard, plastic bottles/bags, glass, metals, tetra pak → Blue Bin
- hazardous: batteries (non-lithium), chemicals, paint, pesticides, medicines, CFL bulbs → Red Bin
- e-waste: phones, laptops, cables, chargers, circuit boards, lithium batteries → Yellow Bin

Be precise. Respond with the JSON object only — nothing else.`;

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

    let parsed: { imageBase64?: unknown; mimeType?: unknown };
    try {
      parsed = JSON.parse(bodyText);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { imageBase64, mimeType } = parsed;

    if (
      !imageBase64 || !mimeType ||
      typeof imageBase64 !== "string" ||
      typeof mimeType !== "string"
    ) {
      return new Response(JSON.stringify({ error: "Missing or invalid imageBase64 or mimeType" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Use the API key loaded at module initialization
    if (!GROQ_API_KEY) {
      console.error("❌ GROQ_API_KEY not found in environment variables");
      return new Response(JSON.stringify({ error: "GROQ_API_KEY not configured on server" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("✅ Groq API key found, making request to Groq Vision (qwen/qwen3.6-27b)");

    // Groq Vision uses OpenAI-compatible format with image_url
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "qwen/qwen3.6-27b",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${imageBase64}`,
                },
              },
              {
                type: "text",
                text: SYSTEM_PROMPT,
              },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 1500,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error(`❌ Groq API error ${groqResponse.status}:`, errorText.substring(0, 500));
      return new Response(
        JSON.stringify({ error: `Groq API error: ${groqResponse.status}`, detail: errorText }),
        { status: groqResponse.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const data = await groqResponse.json();
    const text = data.choices?.[0]?.message?.content || "";

    console.log("📥 Raw Groq Vision response (first 300 chars):", text.substring(0, 300));

    // Extract JSON from response (model might include explanation before JSON)
    let clean = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let jsonMatch = clean.match(/\{[\s\S]*\}/);

    // Fallback: look specifically for the classification JSON
    if (!jsonMatch) {
      jsonMatch = text.match(/\{[\s\S]*"category"[\s\S]*\}/);
    }

    if (!jsonMatch) {
      console.error("❌ Could not extract JSON from response:", text.substring(0, 500));
      return new Response(
        JSON.stringify({ error: "Could not parse JSON from AI response", raw: text.substring(0, 500) }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const result = JSON.parse(jsonMatch[0]);
    console.log("✅ Classification successful:", result.category);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (err) {
    console.error("❌ Classifier error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", detail: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}
