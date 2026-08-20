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
            {/* Header: logo, nav links, auth actions all in one bar */}
            <header className="site-header">
                <div className="site-logo" onClick={() => setCurrentPage("landing")}>
                    🍽️ <span>NutriVisualizer</span>
                </div>

                <nav className="site-nav">
                    <button className="nav-link" onClick={() => setCurrentPage("howitworks")}>How It Works</button>
                    <button className="nav-link" onClick={() => setCurrentPage("upload")}>Upload</button>
                    <button className="nav-link" onClick={() => setCurrentPage("contact")}>Contact</button>
                </nav>

                <div className="site-auth">
                    {user ? (
                        <>
                            <button className="ghost-button" onClick={() => setCurrentPage("history")}>My History</button>
                            <button className="solid-button" onClick={() => logout()}>Log Out</button>
                        </>
                    ) : (
                        <>
                            <button className="ghost-button" onClick={() => setCurrentPage("login")}>Log In</button>
                            <button className="solid-button" onClick={() => setCurrentPage("signup")}>Sign Up</button>
                        </>
                    )}
                </div>
            </header>

            {/* Hero */}
            <section className="hero-section">
                <div className="hero-text">
                    <span className="hero-eyebrow">AI-Powered Nutrition Analysis</span>
                    <h1 className="main-heading">Know What&apos;s<br />On Your Plate</h1>
                    <p className="sub-heading">
                        Snap a photo of any meal and get an instant breakdown of calories,
                        macros, and healthier alternatives — powered by AI.
                    </p>
                    <div className="hero-cta-group">
                        <button className="cta-primary" onClick={() => setCurrentPage("upload")}>
                            Analyze a Meal →
                        </button>
                        <button className="cta-secondary" onClick={() => setCurrentPage("howitworks")}>
                            See How It Works
                        </button>
                    </div>
                </div>

                <div className="image-and-annotations-container">
                    <div className="hero-image-glow" />
                    <img
                        src="/images/food-platter.jpg"
                        alt="A delicious platter of various healthy foods"
                        className="main-image"
                    />

                    <div className="annotation top-right-annotation">
                        <span className="annotation-text">📊 Full Nutrition Breakdown</span>
                    </div>
                    <div className="annotation bottom-left-annotation">
                        <span className="annotation-text">⚡ Results in Seconds</span>
                    </div>

                    <div className="leaf leaf-1">
                        <img src="/images/leaves.png" alt="Decorative leaf" width={80} height={80} />
                    </div>
                    <div className="leaf leaf-2">
                        <img src="/images/leaves.png" alt="Decorative leaf" width={80} height={80} />
                    </div>
                </div>
            </section>

            {/* Feature highlights */}
            <section className="feature-strip">
                <div className="feature-card">
                    <span className="feature-icon">📸</span>
                    <h3>Snap a Photo</h3>
                    <p>Upload or drag in any meal photo — no manual logging required.</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">🧠</span>
                    <h3>AI Analyzes It</h3>
                    <p>Get calories, protein, carbs, fats, fiber, and sugar in seconds.</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">🥗</span>
                    <h3>Eat Smarter</h3>
                    <p>See healthier alternatives and track your history over time.</p>
                </div>
            </section>

            <footer className="site-footer">
                <p className="copyright-text">© 2025 ErrorBite | All Rights Reserved</p>
            </footer>
        </>
    );
};