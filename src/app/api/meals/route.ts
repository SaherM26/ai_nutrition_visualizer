import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Meal } from "@/models/Meal";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const meals = await Meal.find({ userId: user.userId }).sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ meals });
  } catch (error) {
    console.error("Fetching meal history failed:", error);
    return NextResponse.json({ error: "Could not load meal history." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: {
    dishName?: string;
    calories?: string;
    protein?: string;
    fats?: string;
    carbs?: string;
    fiber?: string;
    sugar?: string;
    image?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const required = ["dishName", "calories", "protein", "fats", "carbs", "fiber", "sugar", "image"] as const;
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }

  try {
    await connectToDatabase();
    const meal = await Meal.create({
      userId: user.userId,
      dishName: body.dishName,
      calories: body.calories,
      protein: body.protein,
      fats: body.fats,
      carbs: body.carbs,
      fiber: body.fiber,
      sugar: body.sugar,
      image: body.image,
    });
    return NextResponse.json({ meal }, { status: 201 });
  } catch (error) {
    console.error("Saving meal failed:", error);
    return NextResponse.json({ error: "Could not save meal." }, { status: 500 });
  }
}
