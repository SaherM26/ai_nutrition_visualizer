import React, { useState } from 'react';
import type { PageProps, DishData } from './types';
import { useAuth } from '../context/AuthContext';

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

/**
 * Calls our own server-side API route, which holds the Gemini key.
 * The browser never sees the API key.
 */
const getNutritionFacts = async (base64Image: string): Promise<DishData> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.error || `Request failed with status ${response.status}`);
  }

  return result as DishData;
};

/** Persists an analyzed meal to the logged-in user's history. Silently no-ops on failure. */
const saveMealToHistory = async (data: DishData, image: string) => {
  try {
    await fetch('/api/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, image }),
    });
  } catch (error) {
    // Don't block the UI on history save failures — the user still gets their result.
    console.error('Failed to save meal to history:', error);
  }
};

type Status = 'upload' | 'loading' | 'results' | 'error';

const emptyDishData: DishData = {
  dishName: "", calories: "", protein: "", fats: "",
  carbs: "", fiber: "", sugar: ""
};

interface UploadProps extends PageProps {
  onAnalyzed?: (data: DishData, image: string) => void;
}

// Main component for the Nutrition Visualizer application
export default function App({ setCurrentPage, onAnalyzed }: UploadProps) {
  const { user, logout } = useAuth();
  // State to manage the application flow: 'upload', 'loading', 'results', 'error'
  const [status, setStatus] = useState<Status>('upload');
  // Stores the Base64 image data for preview and API call
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // Stores the fetched nutrition data
  const [dishData, setDishData] = useState<DishData>(emptyDishData);
  // Stores any user-facing error message
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type before we ever touch the network
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMessage('Please upload a JPEG, PNG, WEBP, or HEIC image.');
      setStatus('error');
      return;
    }

    // Validate size before we ever touch the network
    if (file.size > MAX_FILE_BYTES) {
      setErrorMessage('Image is too large. Please upload something under 8MB.');
      setStatus('error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      setImagePreview(base64Image);
      setStatus('loading');
      setErrorMessage(''); // Clear previous errors

      try {
        const nutrition = await getNutritionFacts(base64Image);
        setDishData(nutrition);
        setStatus('results');
        onAnalyzed?.(nutrition, base64Image);
        if (user) {
          saveMealToHistory(nutrition, base64Image);
        }
      } catch (error) {
        console.error("Analysis Error:", error);
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
    reader.onerror = () => {
      setErrorMessage('Could not read that file. Please try another image.');
      setStatus('error');
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    // Reset the state to the initial upload screen
    setImagePreview(null);
    setStatus('upload');
    setErrorMessage('');
    // Clear file input value
    const fileInput = document.getElementById('file-upload') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
    // Reset dish data to empty strings
    setDishData(emptyDishData);
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
			flex-direction: column;
			justify-content: center;
			align-items: center;
			min-height: 100vh;
			font-family: 'Inter', sans-serif;
			padding: 2rem;
			box-sizing: border-box;
		}

		.back-button {
			align-self: flex-start;
			background: none;
			border: none;
			color: #d61439;
			font-weight: 600;
			font-size: 1rem;
			cursor: pointer;
			margin-bottom: 1.5rem;
			max-width: 900px;
			width: 100%;
		}

		.account-bar {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			max-width: 900px;
			margin-bottom: 1rem;
		}

		.account-bar-links {
			display: flex;
			gap: 1rem;
			align-items: center;
		}

		.account-link {
			background: none;
			border: none;
			color: #4a5568;
			font-weight: 600;
			font-size: 0.9rem;
			cursor: pointer;
		}

		.account-link.primary {
			color: #d61439;
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
        <div className="account-bar">
          <button className="back-button" style={{ margin: 0, width: 'auto' }} onClick={() => setCurrentPage('landing')}>
            ← Back to Home
          </button>
          <div className="account-bar-links">
            {user ? (
              <>
                <span className="account-link">{user.email}</span>
                <button className="account-link" onClick={() => setCurrentPage('history')}>
                  My History
                </button>
                <button className="account-link primary" onClick={() => logout()}>
                  Log Out
                </button>
              </>
            ) : (
              <button className="account-link primary" onClick={() => setCurrentPage('login')}>
                Log In to Save History
              </button>
            )}
          </div>
        </div>

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
                <img src={imagePreview ?? undefined}
                  alt={dishData.dishName || 'Analyzed Dish'}
                  className="results-image"
                />

                {dishData.dishName && dishData.dishName !== "N/A" ? (
                  <h3 className="dish-name-result">{dishData.dishName}</h3>
                ) : (
                  <h3 className="dish-name-result">Analysis Result</h3>
                )}

                {renderNutritionFacts()}

                {status === 'results' && (
                  <button
                    className="healthy-alternatives-button"
                    onClick={() => setCurrentPage('alternatives')}
                  >
                    View Healthier Alternatives
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
