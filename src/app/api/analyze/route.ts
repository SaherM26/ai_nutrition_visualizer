import { NextRequest, NextResponse } from "next/server";

// Key lives only on the server. Never prefix this with NEXT_PUBLIC_,
// or Next.js will bundle it into client-side JS.
const API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Any OpenRouter model with vision + structured-output support works here.
// Swap this string to try others, e.g. "google/gemini-2.5-flash" or "anthropic/claude-3.5-sonnet".
// Full catalog: https://openrouter.ai/models?fmt=cards&supported_parameters=response_format
const MODEL_NAME = "openai/gpt-4o-mini";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // ~8MB raw upload cap

const nutritionJsonSchema = {
    name: "nutrition_data",
    strict: true,
    schema: {
        type: "object",
        properties: {
            dishName: { type: "string", description: "The most likely name of the dish or meal shown in the image." },
            calories: { type: "string", description: "Total calories, including 'cal' unit." },
            protein: { type: "string", description: "Protein content, including 'g' unit." },
            fats: { type: "string", description: "Fats content, including 'g' unit." },
            carbs: { type: "string", description: "Carbohydrates content, including 'g' unit." },
            fiber: { type: "string", description: "Fiber content, including 'g' unit." },
            sugar: { type: "string", description: "Sugar content, including 'g' unit." },
        },
        required: ["dishName", "calories", "protein", "fats", "carbs", "fiber", "sugar"],
        additionalProperties: false,
    },
};

const systemPrompt =
    "You are a professional nutritionist AI. Your task is to analyze the food in the image and provide an accurate, single-serving estimate of its full nutritional breakdown.";

const userPrompt =
    "Analyze the food image and estimate the nutritional breakdown (Calories, Protein, Fats, Carbs, Fiber, Sugar) for a single serving of the entire dish. Use the exact specified JSON format and do not add any outside text.";

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
    let lastError: unknown;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                if ([429, 500, 503].includes(response.status) && i < maxRetries - 1) {
                    await new Promise((r) => setTimeout(r, 2 ** i * 1000));
                    continue;
                }
                const errorBody = await response.text().catch(() => "");
                throw new Error(`Upstream API error: ${response.status} ${errorBody}`);
            }
            return await response.json();
        } catch (error) {
            lastError = error;
            if (i < maxRetries - 1) {
                await new Promise((r) => setTimeout(r, 2 ** i * 1000));
            }
        }
    }
    throw lastError;
}

export async function POST(req: NextRequest) {
    if (!API_KEY) {
        console.error("OPENROUTER_API_KEY is not set on the server.");
        return NextResponse.json({ error: "Server is misconfigured." }, { status: 500 });
    }

    let body: { image?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const base64Image = body.image;
    if (!base64Image || typeof base64Image !== "string" || !base64Image.startsWith("data:image/")) {
        return NextResponse.json({ error: "A valid image data URL is required." }, { status: 400 });
    }

    const [, data] = base64Image.split(";base64,");
    if (!data) {
        return NextResponse.json({ error: "Malformed image data." }, { status: 400 });
    }

    // Rough size check on the base64 payload (base64 is ~4/3 the size of raw bytes)
    const approxBytes = data.length * 0.75;
    if (approxBytes > MAX_IMAGE_BYTES) {
        return NextResponse.json({ error: "Image is too large. Please upload something under 8MB." }, { status: 413 });
    }

    const payload = {
        model: MODEL_NAME,
        messages: [
            { role: "system", content: systemPrompt },
            {
                role: "user",
                content: [
                    { type: "text", text: userPrompt },
                    { type: "image_url", image_url: { url: base64Image } },
                ],
            },
        ],
        response_format: {
            type: "json_schema",
            json_schema: nutritionJsonSchema,
        },
    };

    try {
        const result = await fetchWithRetry(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
                // Optional but recommended by OpenRouter for their analytics/leaderboards.
                "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
                "X-Title": "AI Nutrition Visualizer",
            },
            body: JSON.stringify(payload),
        });

        const messageContent = result?.choices?.[0]?.message?.content;
        if (!messageContent) {
            throw new Error("API response structure was invalid or empty.");
        }

        const nutrition = JSON.parse(messageContent);
        return NextResponse.json(nutrition);
    } catch (error) {
        console.error("OpenRouter analysis failed:", error);
        return NextResponse.json({ error: "The AI failed to analyze the image. Please try another image." }, { status: 502 });
    }
}