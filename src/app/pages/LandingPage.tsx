"use client";

import React, { useState } from "react";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import HowItWorks from "./HowItWorks";
import Upload from "./Upload";
import Contact from "./Contact";
import Alternatives from "./alternatives";
import History from "./History";
import "../css/Landing.css";
import type { PageType, PageProps, AnalyzedDish } from "./types";
import { AuthProvider, useAuth } from "../context/AuthContext";

export default function LandingPage() {
    return (
        <AuthProvider>
            <LandingPageInner />
        </AuthProvider>
    );
}

function LandingPageInner() {
    const [currentPage, setCurrentPage] = useState<PageType>("landing");
    // Holds the most recently analyzed dish so the Alternatives page
    // can reference it without a re-upload.
    const [analyzedDish, setAnalyzedDish] = useState<AnalyzedDish | null>(null);

    const renderPage = () => {
        switch (currentPage) {
            case "landing":
                return <LandingContent setCurrentPage={setCurrentPage} />;
            case "login":
                return <LoginPage setCurrentPage={setCurrentPage} />;
            case "signup":
                return <SignupPage setCurrentPage={setCurrentPage} />;
            case "howitworks":
                return <HowItWorks setCurrentPage={setCurrentPage} />;
            case "upload":
                return (
                    <Upload
                        setCurrentPage={setCurrentPage}
                        onAnalyzed={(data, image) => setAnalyzedDish({ data, image })}
                    />
                );
            case "contact":
                return <Contact setCurrentPage={setCurrentPage} />;
            case "alternatives":
                return <Alternatives setCurrentPage={setCurrentPage} dish={analyzedDish} />;
            case "history":
                return <History setCurrentPage={setCurrentPage} />;
            default:
                return <LandingContent setCurrentPage={setCurrentPage} />;
        }
    };

    return <div className="landing-page-container">{renderPage()}</div>;
}

// A component for the landing page
const LandingContent: React.FC<PageProps> = ({ setCurrentPage }) => {
    const { user, logout } = useAuth();

    return (
        <>
            {/* Top Left Buttons */}
            <div className="button-container top-left">
                {user ? (
                    <>
                        <button className="login-button" onClick={() => setCurrentPage("history")}>
                            MY HISTORY
                        </button>
                        <button className="signup-button" onClick={() => logout()}>
                            LOG OUT
                        </button>
                    </>
                ) : (
                    <>
                        <button className="login-button" onClick={() => setCurrentPage("login")}>
                            LOG IN
                        </button>
                        <button className="signup-button" onClick={() => setCurrentPage("signup")}>
                            SIGN UP
                        </button>
                    </>
                )}
            </div>

            {/* Main Content */}
            <div className="main-content-wrapper">
                <div className="text-content">
                    <h1 className="main-heading">AI Nutrition Visualizer</h1>
                    <p className="sub-heading">
                        Upload Your Food — Get Instant <br /> Nutrition Insights.
                    </p>
                </div>

                <div className="image-and-annotations-container">
                    <img
                        src="/images/food-platter.jpg"
                        alt="A delicious platter of various healthy foods"
                        className="main-image"
                    />

                    {/* Annotations
                    <div className="annotation top-right-annotation">
                        <span className="annotation-text">Detailed Nutrition Facts & Calories</span>
                        <div className="annotation-line line-1" />
                    </div>
                    <div className="annotation bottom-left-annotation">
                        <span className="annotation-text">
                            Smart Calorie Tracking
                            <br />
                            In Real-Time
                        </span>
                        <div className="annotation-line line-2" />
                    </div> */}

                    {/* Leaves */}
                    <div className="leaf leaf-1">
                        <img src="/images/leaves.png" alt="Decorative leaf" width={80} height={80} />
                    </div>
                    <div className="leaf leaf-2">
                        <img src="/images/leaves.png" alt="Decorative leaf" width={80} height={80} />
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="bottom-navigation-container">
                <div className="navigation-buttons-wrapper">
                    <div className="navigation-group">
                        <button className="nav-button">Home</button>
                        <button className="nav-button">Features</button>
                        <button className="nav-button" onClick={() => setCurrentPage("howitworks")}>How It Works </button>
                        <button className="nav-button" onClick={() => setCurrentPage("upload")}>Upload</button>
                        <button className="nav-button" onClick={() => setCurrentPage("contact")}>Contact</button>
                    </div>
                </div>
                <p className="copyright-text">© 2025 ErrorBite | All Rights Reserved</p>
            </div>
        </>
    );
};
