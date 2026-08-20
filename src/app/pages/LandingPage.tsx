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

import type {
    PageType,
    PageProps,
    AnalyzedDish,
} from "./types";

import {
    AuthProvider,
    useAuth,
} from "../context/AuthContext";


export default function LandingPage() {
    return (
        <AuthProvider>
            <LandingPageInner />
        </AuthProvider>
    );
}


/* =========================================================
   PAGE ROUTER
========================================================= */

function LandingPageInner() {

    const [currentPage, setCurrentPage] =
        useState<PageType>("landing");

    const [analyzedDish, setAnalyzedDish] =
        useState<AnalyzedDish | null>(null);


    const renderPage = () => {

        switch (currentPage) {

            case "landing":
                return (
                    <LandingContent
                        setCurrentPage={setCurrentPage}
                    />
                );

            case "login":
                return (
                    <LoginPage
                        setCurrentPage={setCurrentPage}
                    />
                );

            case "signup":
                return (
                    <SignupPage
                        setCurrentPage={setCurrentPage}
                    />
                );

            case "howitworks":
                return (
                    <HowItWorks
                        setCurrentPage={setCurrentPage}
                    />
                );

            case "upload":
                return (
                    <Upload
                        setCurrentPage={setCurrentPage}
                        onAnalyzed={(data, image) => {
                            setAnalyzedDish({
                                data,
                                image,
                            });
                        }}
                    />
                );

            case "contact":
                return (
                    <Contact
                        setCurrentPage={setCurrentPage}
                    />
                );

            case "alternatives":
                return (
                    <Alternatives
                        setCurrentPage={setCurrentPage}
                        dish={analyzedDish}
                    />
                );

            case "history":
                return (
                    <History
                        setCurrentPage={setCurrentPage}
                    />
                );

            default:
                return (
                    <LandingContent
                        setCurrentPage={setCurrentPage}
                    />
                );
        }
    };


    return (
        <div className="landing-page-container">
            {renderPage()}
        </div>
    );
}


/* =========================================================
   LANDING CONTENT
========================================================= */

const LandingContent: React.FC<PageProps> = ({
    setCurrentPage,
}) => {

    const {
        user,
        logout,
    } = useAuth();


    return (
        <main className="landing-home">

            {/* =================================================
               NAVBAR
            ================================================= */}

            <header className="site-header">

                <button
                    className="site-logo"
                    onClick={() =>
                        setCurrentPage("landing")
                    }
                >

                    <span className="logo-mark">
                        ✦
                    </span>

                    <span className="logo-text">
                        Nutri<span>Visualizer</span>
                    </span>

                </button>


                <nav className="site-nav">

                    <button
                        className="nav-link"
                        onClick={() =>
                            setCurrentPage("howitworks")
                        }
                    >
                        How It Works
                    </button>


                    <button
                        className="nav-link"
                        onClick={() =>
                            setCurrentPage("upload")
                        }
                    >
                        Analyze
                    </button>


                    <button
                        className="nav-link"
                        onClick={() =>
                            setCurrentPage("contact")
                        }
                    >
                        Contact
                    </button>

                </nav>


                <div className="site-auth">

                    {user ? (
                        <>
                            <button
                                className="ghost-button"
                                onClick={() =>
                                    setCurrentPage("history")
                                }
                            >
                                My History
                            </button>

                            <button
                                className="solid-button"
                                onClick={() =>
                                    logout()
                                }
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="ghost-button"
                                onClick={() =>
                                    setCurrentPage("login")
                                }
                            >
                                Log In
                            </button>

                            <button
                                className="solid-button"
                                onClick={() =>
                                    setCurrentPage("signup")
                                }
                            >
                                Sign Up
                            </button>
                        </>
                    )}

                </div>

            </header>


            {/* =================================================
               MAIN HERO
            ================================================= */}

            <section className="hero-section">

                {/* LEFT SIDE */}

                <div className="hero-copy">

                    <div className="hero-eyebrow">

                        <span className="eyebrow-dot" />

                        AI-POWERED FOOD INTELLIGENCE

                    </div>


                    <h1>

                        Know what&apos;s
                        <br />

                        <em>on your plate.</em>

                    </h1>


                    <p className="hero-description">

                        Turn a simple meal photo into a clear
                        nutrition story. Identify your food,
                        understand its macros, and discover
                        smarter choices in seconds.

                    </p>


                    <div className="hero-buttons">

                        <button
                            className="primary-button"
                            onClick={() =>
                                setCurrentPage("upload")
                            }
                        >

                            Analyze My Meal

                            <span>→</span>

                        </button>


                        <button
                            className="secondary-button"
                            onClick={() =>
                                setCurrentPage("howitworks")
                            }
                        >
                            See How It Works
                        </button>

                    </div>


                    <div className="trust-row">

                        <span>
                            ✦ AI vision analysis
                        </span>

                        <span>•</span>

                        <span>
                            Nutrition insights
                        </span>

                        <span>•</span>

                        <span>
                            Smarter choices
                        </span>

                    </div>

                </div>


                {/* RIGHT SIDE */}

                <div className="hero-visual">

                    <div className="visual-glow" />


                    {/* FOOD IMAGE */}

                    <div className="food-image-card">

                        <img
                            src="/images/food-platter.jpg"
                            alt="Healthy food platter"
                        />

                        <div className="image-overlay" />

                        <div className="image-status">

                            <span />

                        </div>

                    </div>


                    {/* AI RESULT CARD */}

                    <div className="ai-card">

                        <div className="ai-card-header">

                            <div>

                                <span>
                                    AI ANALYSIS
                                </span>

                                <h3>
                                    Grilled Salmon
                                </h3>

                                <p>
                                    Mediterranean • Dinner
                                </p>

                            </div>


                            <div className="ai-badge">
                                ✓ AI
                            </div>

                        </div>


                        <div className="macro-grid">

                            <div>
                                <strong>450</strong>
                                <small>kcal</small>
                            </div>

                            <div>
                                <strong>35g</strong>
                                <small>protein</small>
                            </div>

                            <div>
                                <strong>20g</strong>
                                <small>carbs</small>
                            </div>

                            <div>
                                <strong>25g</strong>
                                <small>fat</small>
                            </div>

                        </div>


                        <div className="score-section">

                            <div className="score-heading">

                                <span>
                                    HEALTH SCORE
                                </span>

                                <strong>
                                    85
                                    <small>/100</small>
                                </strong>

                            </div>


                            <div className="score-bar">
                                <span />
                            </div>

                        </div>

                    </div>


                    {/* FLOATING LABELS */}

                    <div className="floating-label nutrition-label">

                        <span>✦</span>

                        Full nutrition breakdown

                    </div>


                    <div className="floating-label speed-label">

                        <span>⚡</span>

                        Results in seconds

                    </div>
                </div>
            </section>



            {/* =================================================
               AI CAPABILITIES
            ================================================= */}

            <section className="capabilities">

                <div className="capability-card">

                    <div className="capability-icon">
                        ◉
                    </div>

                    <div>

                        <span>
                            01
                        </span>

                        <h3>
                            AI Food Recognition
                        </h3>

                        <p>
                            Identify the foods and ingredients
                            in your meal automatically.
                        </p>

                    </div>

                </div>


                <div className="capability-card featured">

                    <div className="capability-icon">
                        ✦
                    </div>

                    <div>

                        <span>
                            02
                        </span>

                        <h3>
                            Nutrition Breakdown
                        </h3>

                        <p>
                            Calories, protein, carbs, fats
                            and more in one clear view.
                        </p>

                    </div>

                </div>


                <div className="capability-card">

                    <div className="capability-icon">
                        ↗
                    </div>

                    <div>

                        <span>
                            03
                        </span>

                        <h3>
                            Smarter Choices
                        </h3>

                        <p>
                            Get useful recommendations and
                            healthier alternatives.
                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
               FOOTER
            ================================================= */}

            <footer className="site-footer">

                <div className="footer-brand">

                    <span className="logo-mark">
                        ✦
                    </span>

                    NutriVisualizer

                </div>


                <p>
                    © 2026 NutriVisualizer | All Rights Reserved
                </p>


                <button
                    onClick={() =>
                        setCurrentPage("contact")
                    }
                >
                    Contact
                </button>

            </footer>

        </main>
    );
};