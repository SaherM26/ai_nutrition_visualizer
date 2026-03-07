import React from 'react';

// Main App component for the "How It Works" page
export default function HowItWorks() {
    return (
        <>
            <style>
                {`
          /* Reset and base styles */
          body {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          /* Base colors and font variables */
          :root {
            --primary-color: #d61439;
            --secondary-color: #f29266;
            --background-color: #fff6ed;
            --text-dark-color: #4a5568;
            --text-light-color: #6b6b6b;
            --inter-font: 'Inter', sans-serif;
          }

          /* Main container for the "How It Works" page, centered on the screen */
          .how-it-works-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh; /* Ensures it fills the entire viewport height */
            width: 100vw; /* Ensures it fills the entire viewport width */
            padding: 2rem;
            background-color: var(--background-color);
            font-family: var(--inter-font);
            overflow: auto; /* Allow scrolling if content overflows */
          }

          /* Main content wrapper to hold the title and cards, centered within the container */
          .main-content-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            max-width: 90rem; /* Increased max-width for better desktop layout */
            margin: auto;
            flex-grow: 1; /* Allows it to take up available vertical space for centering */
            padding: 2rem;
          }

          .main-title {
            font-size: 2.25rem;
            line-height: 100%;
            font-weight: 800;
            color: var(--primary-color);
            margin-bottom: 3rem;
            text-align: center;
          }

          @media (min-width: 640px) {
            .main-title {
              font-size: 3rem;
            }
          }

          @media (min-width: 1024px) {
            .main-title {
              font-size: 3.75rem;
            }
          }

          /* Grid for the four steps */
          .steps-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
            width: 100%;
          }

          @media (min-width: 768px) {
            .steps-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (min-width: 1280px) {
            .steps-grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }

          .step-card {
            background-color: white;
            padding: 2rem;
            border-radius: 1.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
            transition-property: transform;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 300ms;
          }

          .step-card:hover {
            transform: scale(1.05);
          }

          .step-number {
            font-size: 2.25rem;
            font-weight: 800;
            color: var(--primary-color);
          }

          .icon-wrapper {
            width: 4rem;
            height: 4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 9999px;
            background-color: #ffedd5;
          }

          .step-icon {
            height: 2.5rem;
            width: 2.5rem;
            color: var(--secondary-color);
          }

          .step-heading {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--text-dark-color);
          }

          .step-description {
            color: var(--text-light-color);
          }
        `}
            </style>
            <div className="how-it-works-container">
                {/* Main content wrapper */}
                <div className="main-content-wrapper">
                    <h1 className="main-title">
                        See How It Works
                    </h1>

                    {/* Grid for the four steps */}
                    <div className="steps-grid">

                        {/* Step 1: Upload Your Photo */}
                        <div className="step-card">
                            <span className="step-number">01.</span>
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" className="step-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.808-1.212A2 2 0 0110.664 4h2.672a2 2 0 011.664.89l.808 1.212A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="step-heading">Upload Your Photo</h3>
                            <p className="step-description">Snap a picture of your meal or select one from your gallery.</p>
                        </div>

                        {/* Step 2: AI Recognizes & Analyzes */}
                        <div className="step-card">
                            <span className="step-number">02.</span>
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" className="step-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9.75 14.25M9.75 14.25L12 11.25M9.75 14.25L12 11.25M12 11.25L14.25 14.25M12 11.25L14.25 14.25M12 11.25L9.75 14.25M14.25 14.25L14.25 17M14.25 17H9.75M9.75 17L9.75 14.25M14.25 17L14.25 14.25M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                </svg>
                            </div>
                            <h3 className="step-heading">AI Recognizes & Analyzes</h3>
                            <p className="step-description">Our intelligent AI identifies and understands your dish.</p>
                        </div>

                        {/* Step 3: Get Instant Nutrition Data */}
                        <div className="step-card">
                            <span className="step-number">03.</span>
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" className="step-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h4l2-2h4l2 2h4a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="step-heading">Get Instant Nutrition Data</h3>
                            <p className="step-description">Access detailed calories, macros, and micronutrients instantly.</p>
                        </div>

                        {/* Step 4: Discover Healthier Choices */}
                        <div className="step-card">
                            <span className="step-number">04.</span>
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" className="step-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6m-4 0a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v6z" />
                                </svg>
                            </div>
                            <h3 className="step-heading">Discover Healthier Choices</h3>
                            <p className="step-description">Receive personalized, healthier alternative suggestions for your meal.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
