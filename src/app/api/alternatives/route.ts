import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_NAME = "openai/gpt-4o-mini";

const alternativesJsonSchema = {
    name: "healthier_alternatives",
    strict: true,
    schema: {
        type: "object",
        properties: {
            alternatives: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "Name of the healthier alternative dish." },
                        reason: { type: "string", description: "One or two sentences on why this is a healthier swap, referencing the original dish's nutrition profile." },
                        estimatedCalories: { type: "string", description: "Estimated calories for this alternative, including 'cal' unit." },
                    },
                    required: ["name", "reason", "estimatedCalories"],
                    additionalProperties: false,
                },
            },
        },
        required: ["alternatives"],
        additionalProperties: false,
    },
};

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

    let body: { dishName?: string; calories?: string; protein?: string; fats?: string; carbs?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    if (!body.dishName) {
        return NextResponse.json({ error: "dishName is required." }, { status: 400 });
    }

    const userPrompt = `The user ate "${body.dishName}" with approximately ${body.calories ?? "unknown"} calories, ${body.protein ?? "unknown"} protein, ${body.fats ?? "unknown"} fats, and ${body.carbs ?? "unknown"} carbs. Suggest 3 healthier alternative dishes that are similar in style or cuisine but lower in calories or better balanced nutritionally. Be specific and practical.`;

    const payload = {
        model: MODEL_NAME,
        messages: [
            { role: "system", content: "You are a professional nutritionist AI suggesting practical, realistic healthier meal swaps." },
            { role: "user", content: userPrompt },
        ],
        response_format: {
            type: "json_schema",
            json_schema: alternativesJsonSchema,
        },
    };

    try {
        const result = await fetchWithRetry(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
                "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
                "X-Title": "AI Nutrition Visualizer",
            },
            body: JSON.stringify(payload),
        });

        const messageContent = result?.choices?.[0]?.message?.content;
        if (!messageContent) {
            throw new Error("API response structure was invalid or empty.");
        }

        const parsed = JSON.parse(messageContent);
        return NextResponse.json(parsed);
    } catch (error) {
        console.error("Alternatives generation failed:", error);
        return NextResponse.json({ error: "Could not generate alternatives right now. Please try again." }, { status: 502 });
    }
}