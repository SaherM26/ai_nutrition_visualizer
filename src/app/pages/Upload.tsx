import React, { useState } from 'react';

//Configuration for Gemini API 
const API_KEY = "AIzaSyDg-WqIshJxC82dhvbQhpB8ahDd3S4vmxE";
const MODEL_NAME = "gemini-2.5-flash-preview-05-20";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

// JSON Schema for structured output, ensuring we get a predictable format
const nutritionSchema = {
  type: "OBJECT",
  properties: {
    dishName: { type: "STRING", description: "The most likely name of the dish or meal shown in the image." },
    calories: { type: "STRING", description: "Total calories, including 'cal' unit." },
    protein: { type: "STRING", description: "Protein content, including 'g' unit." },
    fats: { type: "STRING", description: "Fats content, including 'g' unit." },
    carbs: { type: "STRING", description: "Carbohydrates content, including 'g' unit." },
    fiber: { type: "STRING", description: "Fiber content, including 'g' unit." },
    sugar: { type: "STRING", description: "Sugar content, including 'g' unit." },
  },
  required: ["dishName", "calories", "protein", "fats", "carbs", "fiber", "sugar"]
};

/* Utility function to handle API calls with exponential backoff for retries. */
const fetchWithRetry = async (url, options, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        // Use exponential backoff delay before the next retry for transient errors
        if (response.status === 503 || response.status === 500 || response.status === 429) {
          const delay = Math.pow(2, i) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        } else {
          // Non-transient errors (like 400, 403) are thrown immediately
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        return await response.json();
      }
    } catch (error) {
      if (i === maxRetries - 1) {
        // Throw the final error after all retries
        throw error;
      }
      const delay = Math.pow(2, i) * 1000;
      // Wait with exponential backoff before the next retry
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Calls the Gemini API to analyze the image and return structured nutrition data.
 */
const getNutritionFacts = async (base64Image) => {
  // Split the Data URL to get MIME type and base64 data
  const [mimeTypePart, data] = base64Image.split(';base64,');
  const mimeType = mimeTypePart.replace('data:', '');

  // System instruction to guide the model's output quality
  const systemPrompt = "You are a professional nutritionist AI. Your task is to analyze the food in the image and provide an accurate, single-serving estimate of its full nutritional breakdown.";

  // The user's specific request
  const userPrompt = "Analyze the food image and estimate the nutritional breakdown (Calories, Protein, Fats, Carbs, Fiber, Sugar) for a single serving of the entire dish. Use the exact specified JSON format and do not add any outside text.";

  const payload = {
    contents: [{
      role: "user",
      parts: [
        { text: userPrompt },
        {
          inlineData: {
            mimeType: mimeType,
            data: data
          }
        }
      ]
    }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: nutritionSchema,
    },
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
  };

  try {
    const result = await fetchWithRetry(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
      const jsonText = result.candidates[0].content.parts[0].text;
      // The model is instructed to return only JSON, so we parse it.
      return JSON.parse(jsonText);
    }
    throw new Error("API response structure was invalid or empty.");

  } catch (error) {
    // Re-throw a user-friendly error message
    throw new Error(`Analysis failed: ${error.message}`);
  }
};


// Main component for the Nutrition Visualizer application
export default function App() {
  // State to manage the application flow: 'upload', 'loading', 'results', 'error'
  const [status, setStatus] = useState('upload');
  // Stores the Base64 image data for preview and API call
  const [imagePreview, setImagePreview] = useState(null);
  // Stores the fetched nutrition data
  const [dishData, setDishData] = useState({
    dishName: "",
    calories: "",
    protein: "",
    fats: "",
    carbs: "",
    fiber: "",
    sugar: ""
  });
  // Stores any user-facing error message
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setImagePreview(base64Image);
        setStatus('loading');
        setErrorMessage(''); // Clear previous errors

        try {
          const nutrition = await getNutritionFacts(base64Image);
          setDishData(nutrition);
          setStatus('results');
        } catch (error) {
          console.error("Analysis Error:", error.message);
          // Display a user-friendly error
          setErrorMessage("The AI failed to analyze the image. Please try another image or check the console for details.");

          // Set default empty data on failure
          setDishData({
            dishName: "N/A", calories: "N/A", protein: "N/A", fats: "N/A",
            carbs: "N/A", fiber: "N/A", sugar: "N/A"
          });
          setStatus('error');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    // Reset the state to the initial upload screen
    setImagePreview(null);
    setStatus('upload');
    setErrorMessage('');
    // Clear file input value
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
    // Reset dish data to empty strings
    setDishData({
      dishName: "", calories: "", protein: "", fats: "",
      carbs: "", fiber: "", sugar: ""
    });
  };

  // Render the content inside the Upload card
  const renderUploadCardContent = () => {
    // Show loading spinner when analyzing
    if (status === 'loading') {
      return (
        <div className="upload-card-content loading-state">
          <div className="spinner"></div>
          <span className="upload-text" style={{ marginTop: '2rem' }}>Analyzing your meal...</span>
        </div>
      );
    }

    // Default upload or error display state
    return (
      <div className="upload-card-content default-upload">
        <label htmlFor="file-upload" className="camera-icon-container">
          {/* Camera Icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="upload-icon"
          >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
          <input id="file-upload" type="file" accept="image/*" className="hidden-file-input" onChange={handleFileUpload} />
        </label>

        {/* Display main text or error message */}
        <span className="upload-text" style={{ color: status === 'error' ? '#d61439' : '#4a5568' }}>
          {status === 'error' ? errorMessage : 'Drag and Drop or Tap to Upload'}
        </span>

        {/* Clear button only visible once an image has been uploaded (status is 'results' or 'error') */}
        {status !== 'upload' && (
          <button className="clear-button" onClick={handleClear}>
            Clear
          </button>
        )}
      </div>
    );
  };

  // Renders the nutrition facts list in the two-column layout
  const renderNutritionFacts = () => (
    <div className="nutrition-container">
      <div className="nutrition-column">
        <div className="nutrition-item"><span>Calories:</span> <span>{dishData.calories}</span></div>
        <div className="nutrition-item"><span>Fats:</span> <span>{dishData.fats}</span></div>
        <div className="nutrition-item"><span>Fiber:</span> <span>{dishData.fiber}</span></div>
      </div>
      <div className="nutrition-column">
        <div className="nutrition-item"><span>Protein:</span> <span>{dishData.protein}</span></div>
        <div className="nutrition-item"><span>Carbs:</span> <span>{dishData.carbs}</span></div>
        <div className="nutrition-item"><span>Sugar:</span> <span>{dishData.sugar}</span></div>
      </div>
    </div>
  );

  const globalStyles = `
		/* GLOBAL STYLING: Apply background color to the body and root container */
		/* The !important flag is essential here to override platform defaults */
		body, #root, html {
			background-color: #f6f9e8 !important; 
			margin: 0;
			padding: 0;
			height: 100%;
		}

		/* Overall page container, centered with the new background color */
		.nutrition-visualizer-container {
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 100vh;
			font-family: 'Inter', sans-serif;
			padding: 2rem;
			box-sizing: border-box;
		}

		/* Wrapper for the main content cards, creating a flexible layout */
		.content-wrapper {
			display: flex;
			flex-direction: column;
			gap: 2.5rem;
			width: 100%;
			max-width: 900px;
		}

		/* Responsive layout for larger screens */
		@media (min-width: 768px) {
			.content-wrapper {
				flex-direction: row;
			}
		}

		/* Common styling for the card components */
		.card {
			background-color: white;
			padding: 2rem;
			border-radius: 1.5rem;
			box-shadow: 0 10px 20px rgba(0, 0, 0, 0.04);
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			min-height: 480px; /* Ensures vertical balance */
		}

		.card-title {
			font-size: 1.5rem;
			font-weight: 700;
			color: #4a5568;
			margin-bottom: 2rem;
		}

		/* --- Upload Card Specific Styles --- */
		.upload-card-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			flex-grow: 1;
			width: 100%;
		}

		.camera-icon-container {
			display: block;
			cursor: pointer;
			margin-bottom: 1rem;
			border: 3px solid transparent; 
			border-radius: 0.5rem;
			transition: border-color 0.2s;
			line-height: 1; 
		}
		
		.camera-icon-container:hover, .camera-icon-container:focus {
				border-color: #99a146; /* Changed hover color to match app's theme */
			}


		.upload-icon {
			height: 80px;
			width: 80px;
			color: black;
			stroke-width: 1;
		}

		.upload-text {
			font-size: 1.25rem;
			font-weight: 500;
			color: #4a5568;
			margin-top: 0.5rem;
			margin-bottom: 2rem;
			text-align: center;
		}
		
		.hidden-file-input {
			display: none;
		}

		.clear-button {
			background-color: #99a146;
			color: white;
			font-weight: 600;
			padding: 0.75rem 2.5rem;
			border: none;
			border-radius: 0.5rem;
			cursor: pointer;
			transition: background-color 0.3s;
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		}

		.clear-button:hover {
			background-color: #7d8438;
		}
		
		/* Loading Spinner Styles */
		.spinner {
			border: 8px solid #f3f3f3; 
			border-top: 8px solid #99a146; 
			border-radius: 50%;
			width: 60px;
			height: 60px;
			animation: spin 1.5s linear infinite;
			margin-bottom: 1rem;
		}

		@keyframes spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}
		/* End Loading Spinner Styles */

		/* --- Results Card Specific Styles --- */
		.results-card-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
			gap: 1.5rem;
			width: 100%;
		}

		.results-image {
			width: 90%;
			max-width: 350px;
			height: auto;
			min-height: 150px; /* Ensure space when image is loading */
			border-radius: 0.75rem;
			object-fit: cover;
			box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		}

		.dish-name-result {
			font-size: 1.25rem;
			font-weight: 700;
			color: #d61439; 
			line-height: 1.4;
		}

		/* Container for the two-column nutrition facts layout */
		.nutrition-container {
				display: flex;
				gap: 2rem;
				justify-content: center;
				width: 100%;
				max-width: 350px;
				margin-bottom: 1rem;
				padding: 0 1rem;
		}
		
		.nutrition-column {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
				flex: 1;
				min-width: 100px;
		}

		.nutrition-item {
			display: flex;
			justify-content: space-between;
			font-size: 1rem;
			color: #4a5568;
			width: 100%;
			border-bottom: 1px dashed #eee;
			padding-bottom: 0.25rem;
		}
		
		.nutrition-item span:first-child {
				font-weight: 400;
				margin-right: 0.5rem;
		}

		.nutrition-item span:last-child {
				font-weight: 700;
				color: #4a5568;
				text-align: right;
		}

		.healthy-alternatives-button {
			background-color: #d51439;
			color: white;
			font-weight: 600;
			padding: 0.75rem 1.5rem;
			border: none;
			border-radius: 0.5rem;
			cursor: pointer;
			transition: background-color 0.3s;
			box-shadow: 0 4px 6px rgba(213, 20, 57, 0.3);
			margin-top: 1rem;
		}

		.healthy-alternatives-button:hover {
			background-color: #b0102d;
		}
	`;

  return (
    <>
      {/* Styles for the entire page. 
				FIX: Switched to dangerouslySetInnerHTML for more reliable CSS injection,
				which is crucial for overriding host styles. 
			*/}
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      <div className="nutrition-visualizer-container">
        <div className="content-wrapper">
          {/* Upload Card */}
          <div className="card upload-card">
            <h2 className="card-title">Upload Image</h2>
            {renderUploadCardContent()}
          </div>

          {/* Results Card */}
          <div className="card results-card">
            <h2 className="card-title">Nutrition Breakdown</h2>
            {(status === 'upload' || status === 'loading') ? (
              <div className="results-card-content" style={{ marginTop: '20%' }}>
                <p style={{ color: '#4a5568', fontWeight: '500' }}>
                  {status === 'loading' ? 'Results will appear here...' : 'Upload a meal image to start analysis.'}
                </p>
              </div>
            ) : (
              <div className="results-card-content">
                {/* Use the uploaded image preview */}
                <img src={imagePreview}
                  alt={dishData.dishName || 'Analyzed Dish'}
                  className="results-image"
                />

                {dishData.dishName && dishData.dishName !== "N/A" ? (
                  <h3 className="dish-name-result">{dishData.dishName}</h3>
                ) : (
                  <h3 className="dish-name-result">Analysis Result</h3>
                )}

                {renderNutritionFacts()}

                <button className="healthy-alternatives-button">
                  View Healthier Alternatives
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
