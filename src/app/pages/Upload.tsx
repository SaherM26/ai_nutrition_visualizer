"use client";

import React, {
	ChangeEvent,
	DragEvent,
	useState,
} from "react";

import type {
	DishData,
	PageType,
} from "./types";

import "../css/Upload.css";

import { useAuth } from "../context/AuthContext";

type UploadProps = {
	setCurrentPage: (page: PageType) => void;
	onAnalyzed?: (data: DishData, image: string) => void;
};

const Upload: React.FC<UploadProps> = ({
	setCurrentPage,
	onAnalyzed,
}) => {
	const { user } = useAuth();

	const [selectedImage, setSelectedImage] =
		useState<string | null>(null);

	const [fileName, setFileName] = useState("");

	const [isAnalyzing, setIsAnalyzing] =
		useState(false);

	const [isSaving, setIsSaving] =
		useState(false);

	const [analysis, setAnalysis] =
		useState<DishData | null>(null);

	const [error, setError] =
		useState("");

	const [isDragging, setIsDragging] =
		useState(false);

	/* =========================================================
	   READ IMAGE
	========================================================= */

	const readFile = (file: File) => {
		if (!file.type.startsWith("image/")) {
			setError("Please upload a valid image file.");
			return;
		}

		if (file.size > 8 * 1024 * 1024) {
			setError("Image must be smaller than 8MB.");
			return;
		}

		setError("");
		setFileName(file.name);

		const reader = new FileReader();

		reader.onload = () => {
			const result = reader.result;

			if (typeof result === "string") {
				setSelectedImage(result);
				setAnalysis(null);

				// Automatically analyze after image loads
				analyzeMeal(result);
			}
		};

		reader.onerror = () => {
			setError(
				"Could not read that file. Please try another image."
			);
		};

		reader.readAsDataURL(file);
	};

	/* =========================================================
	   FILE INPUT
	========================================================= */

	const handleFileChange = (
		event: ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];

		if (file) {
			readFile(file);
		}
	};

	/* =========================================================
	   DRAG & DROP
	========================================================= */

	const handleDrop = (
		event: DragEvent<HTMLDivElement>
	) => {
		event.preventDefault();

		setIsDragging(false);

		const file =
			event.dataTransfer.files?.[0];

		if (file) {
			readFile(file);
		}
	};

	/* =========================================================
	   SAVE MEAL TO HISTORY
	========================================================= */

	const saveMealToHistory = async (
		nutrition: DishData,
		image: string
	) => {
		/*
		 * Only authenticated users can save meals.
		 *
		 * Guests can still analyze meals normally.
		 */
		if (!user) {
			return true;
		}

		setIsSaving(true);

		try {
			const response = await fetch(
				"/api/meals",
				{
					method: "POST",

					headers: {
						"Content-Type":
							"application/json",
					},

					body: JSON.stringify({
						dishName:
							nutrition.dishName,

						calories:
							nutrition.calories,

						protein:
							nutrition.protein,

						fats:
							nutrition.fats,

						carbs:
							nutrition.carbs,

						fiber:
							nutrition.fiber,

						sugar:
							nutrition.sugar,

						image,
					}),
				}
			);

			const result =
				await response.json();

			if (!response.ok) {
				console.error(
					"Meal history save failed:",
					result
				);

				setError(
					"Meal analyzed successfully, but it could not be saved to your history."
				);

				return false;
			}

			console.log(
				"Meal successfully saved to history."
			);

			return true;
		} catch (error) {
			console.error(
				"Saving meal to history failed:",
				error
			);

			setError(
				"Meal analyzed successfully, but it could not be saved to your history."
			);

			return false;
		} finally {
			setIsSaving(false);
		}
	};

	/* =========================================================
	   ANALYZE MEAL
	========================================================= */

	const analyzeMeal = async (
		imageOverride?: string
	) => {
		const imageToAnalyze =
			imageOverride ?? selectedImage;

		if (!imageToAnalyze) {
			setError(
				"Please upload a meal image first."
			);

			return;
		}

		setIsAnalyzing(true);
		setError("");
		setAnalysis(null);

		try {
			/* -----------------------------------------
			   AI ANALYSIS
			----------------------------------------- */

			const response = await fetch(
				"/api/analyze",
				{
					method: "POST",

					headers: {
						"Content-Type":
							"application/json",
					},

					body: JSON.stringify({
						image: imageToAnalyze,
					}),
				}
			);

			const result =
				await response.json();

			if (!response.ok) {
				throw new Error(
					result?.error ||
					"Unable to analyze the meal."
				);
			}

			/* -----------------------------------------
			   SHOW RESULTS
			----------------------------------------- */

			setAnalysis(result);

			/* -----------------------------------------
			   UPDATE PARENT
			----------------------------------------- */

			if (onAnalyzed) {
				onAnalyzed(
					result,
					imageToAnalyze
				);
			}

			/* -----------------------------------------
			   SAVE TO HISTORY
			----------------------------------------- */

			await saveMealToHistory(
				result,
				imageToAnalyze
			);

		} catch (err) {
			console.error(
				"Meal analysis error:",
				err
			);

			setError(
				err instanceof Error
					? err.message
					: "Something went wrong while analyzing the meal."
			);
		} finally {
			setIsAnalyzing(false);
		}
	};

	/* =========================================================
	   CLEAR
	========================================================= */

	const clearAnalysis = () => {
		setSelectedImage(null);
		setFileName("");
		setAnalysis(null);
		setError("");
		setIsSaving(false);
	};

	/* =========================================================
	   HEALTH SCORE LABEL
	========================================================= */

	const scoreLabel = (
		score?: number | null
	) => {
		if (
			score === undefined ||
			score === null
		) {
			return "—";
		}

		if (score >= 90) return "Excellent";
		if (score >= 75) return "Good";
		if (score >= 60) return "Moderate";
		if (score >= 40)
			return "Needs Improvement";

		return "Poor";
	};

	/* =========================================================
	   BALANCE WIDTH
	========================================================= */

	const balanceWidth = (
		value?: string
	) => {
		switch (value) {
			case "low":
				return "30%";

			case "moderate":
				return "55%";

			case "good":
				return "78%";

			case "high":
				return "95%";

			default:
				return "50%";
		}
	};

	/* =========================================================
	   PAGE
	========================================================= */

	return (
		<div className="upload-page">

			{/* =================================================
			   TOP BAR
			================================================= */}

			<header className="upload-header">

				<button
					className="back-home-button"
					onClick={() =>
						setCurrentPage("landing")
					}
					type="button"
				>
					← Back to Home
				</button>

				{user ? (
					<button
						className="history-login-button"
						onClick={() =>
							setCurrentPage("history")
						}
						type="button"
					>
						{isSaving
							? "Saving to History..."
							: "View My History"}
					</button>
				) : (
					<button
						className="history-login-button"
						onClick={() =>
							setCurrentPage("login")
						}
						type="button"
					>
						Log In to Save History
					</button>
				)}

			</header>

			{/* =================================================
			   INTRO
			================================================= */}

			<section className="upload-intro">

				<span className="upload-eyebrow">
					AI FOOD INTELLIGENCE
				</span>

				<h1>
					Understand Your Meal
				</h1>

				<p>
					Upload a photo and let AI identify
					your food, estimate nutrition, and
					give you practical insights.
				</p>

			</section>

			{/* =================================================
			   DASHBOARD
			================================================= */}

			<main className="upload-dashboard">

				{/* =================================================
				   LEFT PANEL
				================================================= */}

				<section className="meal-panel">

					<div className="panel-heading">

						<h2>
							Meal Image
						</h2>

						<span className="ai-badge">
							AI VISION
						</span>

					</div>

					{!selectedImage ? (

						<div
							className={`upload-dropzone ${isDragging
									? "upload-dropzone-active"
									: ""
								}`}
							onDragOver={(event) => {
								event.preventDefault();
								setIsDragging(true);
							}}
							onDragLeave={() => {
								setIsDragging(false);
							}}
							onDrop={handleDrop}
						>

							<input
								id="meal-upload"
								type="file"
								accept="image/jpeg,image/png,image/webp,image/heic"
								onChange={
									handleFileChange
								}
							/>

							<label htmlFor="meal-upload">

								<div className="upload-icon">
									📸
								</div>

								<h3>
									Upload your meal
								</h3>

								<p>
									Click to choose a
									food photo
								</p>

								<small>
									JPG · PNG · WEBP · HEIC · Max 8MB
								</small>

							</label>

						</div>

					) : (

						<div className="image-preview-wrapper">

							<img
								src={selectedImage}
								alt="Uploaded meal"
								className="meal-preview"
							/>

							<div className="image-preview-overlay">
								{fileName}
							</div>

						</div>

					)}

					{analysis && (
						<button
							className="analyze-another-button"
							onClick={
								clearAnalysis
							}
							type="button"
						>
							Analyze Another Meal
						</button>
					)}

				</section>

				{/* =================================================
				   RIGHT PANEL
				================================================= */}

				<section className="analysis-panel">

					<div className="analysis-heading">

						<h2>
							AI Analysis
						</h2>

						{analysis && (
							<span className="analysis-complete">
								✓ ANALYSIS COMPLETE
							</span>
						)}

					</div>

					{/* =================================================
					   LOADING
					================================================= */}

					{isAnalyzing ? (

						<div className="analysis-loading">

							<div className="loading-brain">
								🧠
							</div>

							<h3>
								Understanding your meal...
							</h3>

							<p>
								AI is identifying ingredients,
								estimating nutrition and evaluating
								the balance of your meal.
							</p>

							<div className="loading-progress">
								<span />
							</div>

							{isSaving && (
								<small
									style={{
										display: "block",
										marginTop: "12px",
										opacity: 0.7,
									}}
								>
									Saving your meal to history...
								</small>
							)}

						</div>

					) : !analysis ? (

						<div className="analysis-empty">

							<div className="empty-brain">
								🧠
							</div>

							<h3>
								Your AI results
							</h3>

							<p>
								Upload a meal photo and
								your complete nutrition
								analysis will appear here.
							</p>

						</div>

					) : (

						<div className="analysis-content">

							{/* =================================================
							   DISH HEADER
							================================================= */}

							<div className="dish-header">

								<h1>
									{analysis.dishName ||
										"Unknown meal"}
								</h1>

								<div className="dish-tags">

									<span>
										🌎{" "}
										{analysis.cuisine ||
											"Unknown"}
									</span>

									<span>
										🍽️{" "}
										{analysis.mealType ||
											"Meal"}
									</span>

									<span>
										⚖️{" "}
										{analysis.portionSize ||
											"Estimated portion"}
									</span>

								</div>

							</div>

							{/* =================================================
							   NUTRITION
							================================================= */}

							<div className="nutrition-grid">

								<NutritionCard
									icon="🔥"
									label="Calories"
									value={
										analysis.calories
									}
								/>

								<NutritionCard
									icon="💪"
									label="Protein"
									value={
										analysis.protein
									}
								/>

								<NutritionCard
									icon="🍚"
									label="Carbs"
									value={
										analysis.carbs
									}
								/>

								<NutritionCard
									icon="🥑"
									label="Fat"
									value={
										analysis.fats
									}
								/>

								<NutritionCard
									icon="🌾"
									label="Fiber"
									value={
										analysis.fiber
									}
								/>

								<NutritionCard
									icon="🍓"
									label="Sugar"
									value={
										analysis.sugar
									}
								/>

							</div>

							{/* =================================================
							   SCORES
							================================================= */}

							<div className="score-grid">

								<ScoreCard
									title="HEALTH SCORE"
									score={
										analysis.healthScore
									}
									label={scoreLabel(
										analysis.healthScore
									)}
								/>

								<ScoreCard
									title="AI CONFIDENCE"
									score={
										analysis.confidence
									}
									label="Based on visible food evidence"
								/>

							</div>

							{/* =================================================
							   INGREDIENTS
							================================================= */}

							{analysis.ingredients &&
								analysis.ingredients.length >
								0 && (

									<div className="compact-section">

										<h3>
											🥕 Detected Ingredients
										</h3>

										<div className="ingredient-list">

											{analysis.ingredients
												.slice(0, 8)
												.map(
													(
														ingredient,
														index
													) => (
														<span
															key={`${ingredient}-${index}`}
														>
															{ingredient}
														</span>
													)
												)}

										</div>

									</div>
								)}

							{/* =================================================
							   AI INSIGHT
							================================================= */}

							{analysis.explanation && (
								<div className="insight-section">

									<h3>
										🧠 AI Insight
									</h3>

									<p>
										{
											analysis.explanation
										}
									</p>

								</div>
							)}

							{/* =================================================
							   RECOMMENDATION
							================================================= */}

							{analysis.aiRecommendation && (
								<div className="recommendation-section">

									<div className="recommendation-icon">
										✨
									</div>

									<div>

										<h3>
											AI Recommendation
										</h3>

										<p>
											{
												analysis.aiRecommendation
											}
										</p>

									</div>

								</div>
							)}

							{/* =================================================
							   BALANCE
							================================================= */}

							{analysis.mealBalance && (
								<div className="balance-section">

									<div className="section-title-row">

										<h3>
											⚖️ Meal Balance
										</h3>

										<span>
											AI assessment
										</span>

									</div>

									<div className="balance-grid">

										<BalanceItem
											label="Protein"
											value={
												analysis
													.mealBalance
													.protein
											}
											width={
												balanceWidth(
													analysis
														.mealBalance
														.protein
												)
											}
										/>

										<BalanceItem
											label="Carbs"
											value={
												analysis
													.mealBalance
													.carbohydrates
											}
											width={
												balanceWidth(
													analysis
														.mealBalance
														.carbohydrates
												)
											}
										/>

										<BalanceItem
											label="Vegetables"
											value={
												analysis
													.mealBalance
													.vegetables
											}
											width={
												balanceWidth(
													analysis
														.mealBalance
														.vegetables
												)
											}
										/>

										<BalanceItem
											label="Healthy fats"
											value={
												analysis
													.mealBalance
													.healthyFats
											}
											width={
												balanceWidth(
													analysis
														.mealBalance
														.healthyFats
												)
											}
										/>

									</div>

								</div>
							)}

							{/* =================================================
							   ACTIONS
							================================================= */}

							<div className="analysis-actions">

								<button
									className="alternatives-button"
									type="button"
									onClick={() =>
										setCurrentPage(
											"alternatives"
										)
									}
								>
									🥗 View AI-Powered Alternatives
								</button>

								<button
									className="clear-button"
									type="button"
									onClick={
										clearAnalysis
									}
								>
									Clear
								</button>

							</div>

							<p className="analysis-disclaimer">
								Nutrition values, portions,
								health scores and ingredients
								are AI-generated estimates from
								the image and should not be
								treated as laboratory or medical
								advice.
							</p>

						</div>
					)}

					{/* =================================================
					   ERROR
					================================================= */}

					{error && (
						<div className="error-message">

							<strong>
								{analysis
									? "History Save Notice"
									: "Analysis failed"}
							</strong>

							<span>
								{error}
							</span>

						</div>
					)}

				</section>

			</main>

		</div>
	);
};

/* =========================================================
   NUTRITION CARD
========================================================= */

type NutritionCardProps = {
	icon: string;
	label: string;
	value?: string;
};

const NutritionCard: React.FC<
	NutritionCardProps
> = ({
	icon,
	label,
	value,
}) => {
		return (
			<div className="nutrition-card">

				<span className="nutrition-icon">
					{icon}
				</span>

				<span className="nutrition-label">
					{label}
				</span>

				<strong>
					{value || "N/A"}
				</strong>

			</div>
		);
	};

/* =========================================================
   SCORE CARD
========================================================= */

type ScoreCardProps = {
	title: string;
	score?: number | null;
	label: string;
};

const ScoreCard: React.FC<
	ScoreCardProps
> = ({
	title,
	score,
	label,
}) => {
		const safeScore =
			typeof score === "number"
				? Math.max(
					0,
					Math.min(100, score)
				)
				: 0;

		return (
			<div className="score-card">

				<div className="score-top">

					<span>
						{title}
					</span>

					<strong>

						{score !== null &&
							score !== undefined
							? score
							: "—"}

						<small>
							/100
						</small>

					</strong>

				</div>

				<div className="score-bar">

					<span
						style={{
							width: `${safeScore}%`,
						}}
					/>

				</div>

				<small>
					{label}
				</small>

			</div>
		);
	};

/* =========================================================
   BALANCE ITEM
========================================================= */

type BalanceItemProps = {
	label: string;
	value?: string;
	width: string;
};

const balanceLabel = (
	value?: string
) => {
	if (!value) {
		return "—";
	}

	return (
		value.charAt(0).toUpperCase() +
		value.slice(1)
	);
};

const BalanceItem: React.FC<
	BalanceItemProps
> = ({
	label,
	value,
	width,
}) => {
		return (
			<div className="balance-item">

				<div className="balance-label">

					<span>
						{label}
					</span>

					<strong>
						{balanceLabel(value)}
					</strong>

				</div>

				<div className="balance-bar">

					<span
						style={{
							width,
						}}
					/>

				</div>

			</div>
		);
	};

export default Upload;