export type PageType =
  | "landing"
  | "login"
  | "signup"
  | "howitworks"
  | "upload"
  | "contact"
  | "alternatives"
  | "history";

export interface PageProps {
  setCurrentPage: (page: PageType) => void;
}

export interface DishData {
  dishName: string;

  cuisine?: string;
  mealType?: string;
  portionSize?: string;

  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  fiber: string;
  sugar: string;

  healthScore?: number;
  confidence?: number;

  ingredients?: string[];

  explanation?: string;

  highlights?: string[];

  improvements?: string[];

  allergens?: string[];

  /* =========================
     PHASE 2 AI
  ========================= */

  aiRecommendation?: string;

  healthScoreReason?: string;

  portionReasoning?: string;

  confidenceReason?: string;

  mealBalance?: {
    protein: "low" | "moderate" | "good" | "high";
    carbohydrates:
    | "low"
    | "moderate"
    | "good"
    | "high";
    vegetables:
    | "low"
    | "moderate"
    | "good"
    | "high";
    healthyFats:
    | "low"
    | "moderate"
    | "good"
    | "high";
  };

  nutritionConcerns?: string[];

  estimatedPortionGrams?: number | null;
}

export interface AnalyzedDish {
  data: DishData;
  image: string;
}