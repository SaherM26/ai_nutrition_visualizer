NutriVisualizer 🍽️

NutriVisualizer is an AI-powered nutrition visualization web application that turns a meal photo into an easy-to-understand nutrition summary.

Users can upload a food image, let AI identify the meal and estimate its nutrition, review health and meal-balance insights, explore healthier alternatives, and save analyzed meals to their personal history.

✨ Features

🤖 AI Meal Analysis

Upload a meal photo and receive AI-generated estimates for:

Dish name

Cuisine

Meal type

Portion size

Calories

Protein

Carbohydrates

Fats

Fiber

Sugar

Health score

AI confidence

Ingredients

Nutritional highlights

Suggested improvements

Possible allergens

Meal balance

Nutrition concerns

One practical recommendation

The analysis is designed to work from visible evidence and explicitly treats nutrition values as estimates rather than medical advice.

🥗 Healthier Alternatives

After analyzing a meal, NutriVisualizer can generate healthier alternatives with:

Alternative meal name

Reason for the recommendation

Estimated calories

👤 User Accounts

The application includes:

Sign up

Log in

Log out

Password confirmation during signup

Password length validation

Authenticated user state

Google sign-in is displayed as a future feature and is currently disabled.

📚 Meal History

Authenticated users can save analyzed meals and view their previous results from My History.

Each saved meal includes:

Meal image

Dish name

Calories

Nutrition information

Date analyzed

Meal history is associated with the authenticated user, and the API returns the latest saved meals.

🎨 Modern UI

The interface includes:

Responsive landing page

AI-focused hero section

Nutrition preview card

Clean green/cream visual theme

Login and signup screens

Dedicated How It Works page

Dedicated Contact page

Meal History page

Healthier Alternatives page

Responsive layouts for smaller screens

The landing page is intentionally kept as a focused, single-screen experience rather than placing the complete How It Works content on the home page.

🧭 Application Flow

Landing Page
     │
     ├── How It Works
     ├── Contact
     ├── Log In
     └── Sign Up
              │
              ▼
          Upload Meal
              │
              ▼
        AI Meal Analysis
              │
       ┌──────┴──────┐
       ▼             ▼
 Nutrition       Healthier
  Results        Alternatives
       │
       ▼
   Save Meal
       │
       ▼
  My History

🛠️ Tech Stack

Frontend

Next.js 16

React 19

TypeScript

CSS

Recharts

Backend

Next.js API Routes

Server-side OpenRouter integration

MongoDB for user and meal data

AI

OpenRouter-compatible chat completion API

Configurable vision-capable/model endpoint through environment variables

The current project package configuration uses Next.js 16.3.1, React 19.2.8, React DOM 19.2.8, and Recharts 3.10.1.

📁 Main Project Structure

ai_nutrition_visualizer/
│
├── public/
│   └── images/
│       ├── food images
│       └── authentication/background images
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   ├── alternatives/
│   │   │   └── meals/
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── Upload.tsx
│   │   │   ├── History.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── alternatives.tsx
│   │   │
│   │   └── css/
│   │       └── Landing.css
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   └── mongodb.ts
│   │
│   └── models/
│       ├── User.ts
│       └── Meal.ts
│
├── .env.local
├── package.json
└── README.md

File names can vary slightly between project revisions, but the application is organized around these main pages, API routes, authentication utilities, and database models.

🚀 Getting Started

1. Clone the repository

git clone <your-repository-url>
cd ai_nutrition_visualizer

2. Install dependencies

npm install

3. Configure environment variables

Create a .env.local file in the project root.

Example:

OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=your_model_name

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret

NEXT_PUBLIC_APP_URL=http://localhost:3000

Use the exact database/authentication variable names expected by the database and authentication utilities in your local project.

Never commit real API keys, database credentials, or JWT secrets to GitHub.

4. Start the development server

npm run dev

Open:

http://localhost:3000

🧪 Available Scripts

npm run dev

Starts the Next.js development server.

npm run build

Creates a production build.

npm start

Starts the production server after building.

npm run lint

Runs ESLint.

🔌 API Overview

POST /api/analyze

Accepts a meal image and sends it to the configured AI provider for analysis.

Example request:

{
  "image": "data:image/jpeg;base64,..."
}

The API returns structured nutrition information.

POST /api/alternatives

Generates healthier alternatives based on the analyzed meal.

Example input:

{
  "dishName": "Grilled Chicken Rice",
  "calories": "500 kcal",
  "protein": "35 g",
  "fats": "18 g",
  "carbs": "55 g"
}

GET /api/meals

Returns the authenticated user's saved meal history.

The current implementation sorts meals by creation date and limits the response to the latest 50 meals.

POST /api/meals

Saves an analyzed meal for the authenticated user.

The saved information includes the dish name, nutrition values, image, and related meal data.

🖼️ Image Upload Requirements

The upload interface currently accepts:

JPEG
PNG
WEBP
HEIC

Maximum file size:

8 MB

Files are validated before being sent for analysis.

🔐 Security Notes

The OpenRouter API key is accessed server-side.

The browser does not directly receive the AI API key.

Meal history endpoints require authentication.

User meal records are associated with the authenticated user.

Environment files containing secrets should remain private.

Nutrition analysis is an estimate and should not be treated as medical diagnosis or professional medical advice.

🎯 Design Goals

NutriVisualizer is designed around three simple ideas:

1. Simple

Users should be able to go from a meal photo to useful information without manually entering every ingredient.

2. Visual

Nutrition information should be easier to understand through clear cards, scores, summaries, and visual hierarchy.

3. Actionable

The application should not stop at calories. It also provides practical improvements and healthier alternatives.

🔮 Future Improvements

Possible future enhancements include:

Google authentication

More detailed meal analytics

Daily/weekly nutrition dashboards

Search and filtering in meal history

Delete individual history entries

User nutrition goals

Personalized recommendations

Better portion-size estimation

More detailed micronutrient analysis

Improved mobile navigation

Production deployment

Automated testing

⚠️ Disclaimer

NutriVisualizer provides AI-generated nutrition estimates based on visual information.

Food identification, portion sizes, calories, and nutrient values may not be exact. The application is intended for informational and educational purposes and should not be used as a substitute for professional medical or dietary advice.

👩‍💻 Project

NutriVisualizer

AI-powered food recognition and nutrition visualization application built with Next.js, React, TypeScript, MongoDB, and an OpenRouter-compatible AI API.

