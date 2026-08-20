import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_URL =
    "https://openrouter.ai/api/v1/chat/completions";

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        const model = process.env.OPENROUTER_MODEL;

        if (!apiKey) {
            return NextResponse.json(
                {
                    error:
                        "OPENROUTER_API_KEY is not configured.",
                },
                { status: 500 }
            );
        }

        if (!model) {
            return NextResponse.json(
                {
                    error:
                        "OPENROUTER_MODEL is not configured in .env.local.",
                },
                { status: 500 }
            );
        }

        const body = await request.json();

        const image = body?.image;

        if (
            !image ||
            typeof image !== "string"
        ) {
            return NextResponse.json(
                {
                    error:
                        "No image was provided.",
                },
                { status: 400 }
            );
        }

        const systemPrompt = `
You are NutriVisualizer AI.

Analyze the uploaded food image carefully.

Your response MUST be valid JSON.

Do not use markdown.
Do not use code fences.
Do not add explanations outside the JSON.

Return EXACTLY these fields:

{
  "dishName": "",
  "cuisine": "",
  "mealType": "",
  "portionSize": "",
  "calories": "",
  "protein": "",
  "carbs": "",
  "fats": "",
  "fiber": "",
  "sugar": "",
  "healthScore": 0,
  "confidence": 0,
  "ingredients": [],
  "explanation": "",
  "highlights": [],
  "improvements": [],
  "allergens": [],
  "aiRecommendation": "",
  "healthScoreReason": "",
  "portionReasoning": "",
  "confidenceReason": "",
  "mealBalance": {
    "protein": "moderate",
    "carbohydrates": "moderate",
    "vegetables": "moderate",
    "healthyFats": "moderate"
  },
  "nutritionConcerns": [],
  "estimatedPortionGrams": null
}

IMPORTANT:

dishName:
Give the most likely name of the visible meal.

cuisine:
Estimate the cuisine only when there is reasonable visual evidence.
Otherwise use "Unknown".

mealType:
Examples:
Breakfast
Lunch
Dinner
Snack
Dessert
Unknown

portionSize:
Describe the visible portion.

calories:
Return estimated calories such as "550 kcal".

protein:
Return estimated protein such as "45 g".

carbs:
Return estimated carbohydrates such as "62 g".

fats:
Return estimated fat such as "21 g".

fiber:
Return estimated fiber such as "6 g".

sugar:
Return estimated sugar such as "18 g".

healthScore:
Give a number from 0 to 100.

confidence:
Give a number from 0 to 100 describing confidence in the visual analysis.

ingredients:
Only list ingredients that are visible or strongly supported by the image.

explanation:
Give a concise explanation of the meal.

highlights:
Give 2-4 positive nutritional observations.

improvements:
Give 2-3 practical improvements specific to this meal.

allergens:
List possible allergens.
If none are reasonably apparent, return [].

aiRecommendation:
Give ONE practical recommendation specifically for this meal.

healthScoreReason:
Explain why the meal received its health score.

portionReasoning:
Explain how the visible portion affected the nutrition estimate.

confidenceReason:
Explain what is visually clear and what is uncertain.

mealBalance:
Evaluate:
protein
carbohydrates
vegetables
healthyFats

Allowed values ONLY:
low
moderate
good
high

nutritionConcerns:
Only mention genuine concerns visible from the meal.

estimatedPortionGrams:
Give your best approximate estimate in grams.
Use null if it cannot reasonably be estimated.

Never invent hidden ingredients.

All nutrition values are estimates from visual evidence.
Do not provide medical diagnosis.
`;

        const userPrompt = `
Analyze this meal image for NutriVisualizer.

Identify the food and estimate its nutrition.

Then evaluate:

1. Meal composition
2. Portion size
3. Nutrition
4. Health score
5. AI confidence
6. Positive aspects
7. Improvements
8. Allergens
9. Meal balance
10. One practical AI recommendation

Return only the requested JSON object.
`;

        const response = await fetch(
            OPENROUTER_URL,
            {
                method: "POST",

                headers: {
                    Authorization:
                        `Bearer ${apiKey}`,

                    "Content-Type":
                        "application/json",

                    "HTTP-Referer":
                        process.env.NEXT_PUBLIC_APP_URL ||
                        "http://localhost:3000",

                    "X-Title":
                        "NutriVisualizer",
                },

                body: JSON.stringify({
                    model,

                    temperature: 0.1,

                    max_tokens: 2200,

                    messages: [
                        {
                            role: "system",
                            content:
                                systemPrompt,
                        },

                        {
                            role: "user",

                            content: [
                                {
                                    type: "text",
                                    text:
                                        userPrompt,
                                },

                                {
                                    type: "image_url",

                                    image_url: {
                                        url: image,
                                    },
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        if (!response.ok) {
            const errorText =
                await response.text();

            console.error(
                "OpenRouter API error:",
                errorText
            );

            console.error(
                "OpenRouter request failed:",
                errorText
            );

            return NextResponse.json(
                {
                    error:
                        "We couldn't analyze your meal right now. Please try again.",
                },
                {
                    status: response.status,
                }
            );
        }

        const result =
            await response.json();

        let content =
            result?.choices?.[0]?.message
                ?.content;

        if (!content) {
            console.error(
                "Empty OpenRouter response:",
                result
            );

            return NextResponse.json(
                {
                    error:
                        "AI returned an empty response.",
                },
                { status: 502 }
            );
        }

        /*
         * Some providers return content
         * as an array.
         */

        if (Array.isArray(content)) {
            content = content
                .map((item: any) => {
                    if (
                        typeof item ===
                        "string"
                    ) {
                        return item;
                    }

                    return (
                        item?.text || ""
                    );
                })
                .join("");
        }

        content = String(content).trim();

        /*
         * Remove markdown fences if
         * the model accidentally adds them.
         */

        content = content
            .replace(
                /^```json\s*/i,
                ""
            )
            .replace(
                /^```\s*/i,
                ""
            )
            .replace(
                /\s*```$/i,
                ""
            )
            .trim();

        /*
         * If the model puts extra text
         * before/after JSON, extract the
         * JSON object.
         */

        const firstBrace =
            content.indexOf("{");

        const lastBrace =
            content.lastIndexOf("}");

        if (
            firstBrace !== -1 &&
            lastBrace !== -1
        ) {
            content =
                content.substring(
                    firstBrace,
                    lastBrace + 1
                );
        }

        let parsed: any;

        try {
            parsed = JSON.parse(
                content
            );
        } catch (error) {
            console.error(
                "JSON parsing failed:",
                error
            );

            console.error(
                "AI content:",
                content
            );

            return NextResponse.json(
                {
                    error:
                        "AI returned invalid JSON.",
                    raw:
                        content,
                },
                { status: 502 }
            );
        }

        /*
         * =========================================================
         * HELPER FUNCTIONS
         * =========================================================
         */

        const firstValue = (
            ...values: any[]
        ) => {
            for (const value of values) {
                if (
                    value !== undefined &&
                    value !== null &&
                    value !== ""
                ) {
                    return value;
                }
            }

            return undefined;
        };

        const asString = (
            value: any,
            fallback = "N/A"
        ) => {
            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {
                return fallback;
            }

            return String(value);
        };

        const asArray = (
            value: any
        ): string[] => {
            if (!Array.isArray(value)) {
                return [];
            }

            return value
                .filter(
                    (item) =>
                        item !==
                        null &&
                        item !==
                        undefined
                )
                .map((item) =>
                    String(item)
                );
        };

        const asScore = (
            value: any
        ) => {
            const number =
                Number(value);

            if (
                !Number.isFinite(number)
            ) {
                return null;
            }

            return Math.max(
                0,
                Math.min(
                    100,
                    Math.round(
                        number
                    )
                )
            );
        };

        /*
         * =========================================================
         * NORMALIZE COMMON AI FIELD NAMES
         * =========================================================
         */

        const dishName =
            firstValue(
                parsed.dishName,
                parsed.mealName,
                parsed.dish,
                parsed.name,
                parsed.foodName,
                parsed.title
            );

        const calories =
            firstValue(
                parsed.calories,
                parsed.calorie,
                parsed.energy,
                parsed.nutrition
                    ?.calories
            );

        const protein =
            firstValue(
                parsed.protein,
                parsed.proteinGrams,
                parsed.protein_g,
                parsed.nutrition
                    ?.protein
            );

        const carbs =
            firstValue(
                parsed.carbs,
                parsed.carbohydrates,
                parsed.carbohydrate,
                parsed.carbsGrams,
                parsed.nutrition
                    ?.carbs,
                parsed.nutrition
                    ?.carbohydrates
            );

        const fats =
            firstValue(
                parsed.fats,
                parsed.fat,
                parsed.totalFat,
                parsed.fatGrams,
                parsed.nutrition
                    ?.fats,
                parsed.nutrition
                    ?.fat
            );

        const fiber =
            firstValue(
                parsed.fiber,
                parsed.fibre,
                parsed.fiberGrams,
                parsed.nutrition
                    ?.fiber,
                parsed.nutrition
                    ?.fibre
            );

        const sugar =
            firstValue(
                parsed.sugar,
                parsed.sugars,
                parsed.sugarGrams,
                parsed.nutrition
                    ?.sugar
            );

        const healthScore =
            asScore(
                firstValue(
                    parsed.healthScore,
                    parsed.health_score,
                    parsed.score,
                    parsed.health
                        ?.score
                )
            );

        const confidence =
            asScore(
                firstValue(
                    parsed.confidence,
                    parsed.aiConfidence,
                    parsed.ai_confidence,
                    parsed.confidenceScore
                )
            );

        /*
         * =========================================================
         * FINAL NORMALIZED OBJECT
         * =========================================================
         */

        const normalized = {
            dishName:
                asString(
                    dishName,
                    "Unknown meal"
                ),

            cuisine:
                asString(
                    firstValue(
                        parsed.cuisine,
                        parsed.cuisineType
                    ),
                    "Unknown"
                ),

            mealType:
                asString(
                    firstValue(
                        parsed.mealType,
                        parsed.meal_type
                    ),
                    "Unknown"
                ),

            portionSize:
                asString(
                    firstValue(
                        parsed.portionSize,
                        parsed.portion,
                        parsed.servingSize
                    ),
                    "Estimated portion"
                ),

            calories:
                asString(
                    calories
                ),

            protein:
                asString(
                    protein
                ),

            carbs:
                asString(
                    carbs
                ),

            fats:
                asString(
                    fats
                ),

            fiber:
                asString(
                    fiber
                ),

            sugar:
                asString(
                    sugar
                ),

            healthScore,

            confidence,

            ingredients:
                asArray(
                    firstValue(
                        parsed.ingredients,
                        parsed.detectedIngredients,
                        parsed.detected_ingredients
                    )
                ),

            explanation:
                asString(
                    firstValue(
                        parsed.explanation,
                        parsed.analysis,
                        parsed.description,
                        parsed.aiInsight
                    ),
                    ""
                ),

            highlights:
                asArray(
                    firstValue(
                        parsed.highlights,
                        parsed.positivePoints,
                        parsed.whatLooksGood
                    )
                ),

            improvements:
                asArray(
                    firstValue(
                        parsed.improvements,
                        parsed.suggestions,
                        parsed.howToImprove
                    )
                ),

            allergens:
                asArray(
                    firstValue(
                        parsed.allergens,
                        parsed.possibleAllergens
                    )
                ),

            aiRecommendation:
                asString(
                    firstValue(
                        parsed.aiRecommendation,
                        parsed.recommendation,
                        parsed.ai_recommendation
                    ),
                    ""
                ),

            healthScoreReason:
                asString(
                    firstValue(
                        parsed.healthScoreReason,
                        parsed.scoreReason,
                        parsed.healthReason
                    ),
                    ""
                ),

            portionReasoning:
                asString(
                    firstValue(
                        parsed.portionReasoning,
                        parsed.portionReason
                    ),
                    ""
                ),

            confidenceReason:
                asString(
                    firstValue(
                        parsed.confidenceReason,
                        parsed.confidenceExplanation
                    ),
                    ""
                ),

            mealBalance:
                parsed.mealBalance ||
                {
                    protein:
                        "moderate",

                    carbohydrates:
                        "moderate",

                    vegetables:
                        "moderate",

                    healthyFats:
                        "moderate",
                },

            nutritionConcerns:
                asArray(
                    firstValue(
                        parsed.nutritionConcerns,
                        parsed.concerns
                    )
                ),

            estimatedPortionGrams:
                firstValue(
                    parsed.estimatedPortionGrams,
                    parsed.portionGrams,
                    parsed.portion_grams
                ) ?? null,
        };

        console.log(
            "NutriVisualizer AI result:",
            normalized
        );

        return NextResponse.json(
            normalized
        );
    } catch (error) {
        console.error(
            "Analyze API error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Something went wrong while analyzing the meal.",
            },
            { status: 500 }
        );
    }
}