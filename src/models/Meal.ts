import mongoose, { Schema, model, models } from "mongoose";

export interface IMeal {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  dishName: string;
  calories: string;
  protein: string;
  fats: string;
  carbs: string;
  fiber: string;
  sugar: string;
  // Storing the image directly in Mongo keeps this simple for a portfolio
  // project. For anything beyond that, swap this for a URL to S3/Cloudinary
  // instead of embedding base64 in the document.
  image: string;
  createdAt: Date;
}

const MealSchema = new Schema<IMeal>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  dishName: { type: String, required: true },
  calories: { type: String, required: true },
  protein: { type: String, required: true },
  fats: { type: String, required: true },
  carbs: { type: String, required: true },
  fiber: { type: String, required: true },
  sugar: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Meal = models.Meal || model<IMeal>("Meal", MealSchema);
