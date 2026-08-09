import type { Dispatch, SetStateAction } from "react";

export type PageType =
    | "landing"
    | "login"
    | "signup"
    | "howitworks"
    | "upload"
    | "contact"
    | "alternatives";

export interface PageProps {
    setCurrentPage: Dispatch<SetStateAction<PageType>>;
}

export interface DishData {
    dishName: string;
    calories: string;
    protein: string;
    fats: string;
    carbs: string;
    fiber: string;
    sugar: string;
}

export interface AnalyzedDish {
    data: DishData;
    image: string;
}