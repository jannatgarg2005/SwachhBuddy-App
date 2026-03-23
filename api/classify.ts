// api/classify.ts — Vercel Edge Function — AI Waste Classifier via Groq Vision API

export const config = { runtime: "edge" };

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

    const apiKey = (globalThis as unknown as { process?: { env?: Record<string, string> } })
      .process?.env?.GROQ_API_KEY || "";

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GROQ_API_KEY not configured on server" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Groq vision uses OpenAI-compatible format with image_url containing a base64 data URL
    const dataUrl = `data:${mimeType};base64,${imageBase64}`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: dataUrl,
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
        max_tokens: 600,
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
    const text = data.choices?.[0]?.message?.content || "";

    // Strip any accidental markdown fences and parse JSON
    const clean = text.replace(/```json|```/g, "").trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return new Response(
        JSON.stringify({ error: "Could not parse JSON from AI response", raw: text }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const result = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(result), {
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