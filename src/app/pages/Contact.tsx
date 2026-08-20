import React, { useState } from "react";
import type { PageProps } from "./types";

export default function Contact({ setCurrentPage }: PageProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Contact form submitted:", {
            name,
            email,
            message,
        });

        setSubmitted(true);
    };

    return (
        <div className="contact-page">
            <style>{`
                /* =========================================
                   CONTACT PAGE
                   ========================================= */

                * {
                    box-sizing: border-box;
                }

                .contact-page {
                    width: 100%;
                    height: 100vh;
                    min-height: 100vh;

                    overflow: hidden;
                    overflow-x: hidden;

                    background:
                        radial-gradient(
                            circle at 84% 12%,
                            rgba(225, 235, 183, 0.38),
                            transparent 28%
                        ),
                        radial-gradient(
                            circle at 8% 78%,
                            rgba(247, 226, 205, 0.20),
                            transparent 25%
                        ),
                        #f8f8f1;

                    color: #152016;

                    font-family:
                        Inter,
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;

                    display: flex;
                    flex-direction: column;
                }

                /* =========================================
                   HEADER
                   ========================================= */

                .contact-header {
                    width: 100%;
                    height: 68px;
                    min-height: 68px;

                    padding: 0 clamp(28px, 5vw, 84px);

                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    background: rgba(255, 255, 255, 0.96);

                    border-bottom: 1px solid #e7e9df;

                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);

                    flex-shrink: 0;
                }

                .contact-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;

                    padding: 0;

                    border: 0;
                    background: transparent;

                    color: #172019;

                    font-size: 22px;
                    font-weight: 800;

                    cursor: pointer;
                }

                .contact-brand-mark {
                    width: 38px;
                    height: 38px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-radius: 11px;

                    background: #eef2d4;
                    color: #81910b;

                    font-size: 19px;
                }

                .contact-brand span:last-child span {
                    color: #7c8d09;
                }

                .contact-back {
                    padding: 0;

                    border: 0;
                    background: transparent;

                    color: #748309;

                    font-size: 15px;
                    font-weight: 800;

                    cursor: pointer;

                    transition:
                        color 0.2s ease,
                        transform 0.2s ease;
                }

                .contact-back:hover {
                    color: #5f6d06;
                    transform: translateX(-2px);
                }

                /* =========================================
                   MAIN
                   ========================================= */

                .contact-main {
                    width: min(1280px, calc(100% - 100px));

                    flex: 1;
                    min-height: 0;

                    margin: 0 auto;

                    /* Slightly reduced vertical padding */
                    padding: 20px 0;

                    display: grid;

                    grid-template-columns:
                        minmax(0, 0.88fr)
                        minmax(0, 1.12fr);

                    gap: clamp(45px, 5vw, 80px);

                    align-items: center;
                }

                /* =========================================
                   LEFT CONTENT
                   ========================================= */

                .contact-intro {
                    padding-left: 8px;
                }

                .contact-eyebrow {
                    display: flex;
                    align-items: center;

                    gap: 9px;

                    color: #839009;

                    font-size: 11px;
                    font-weight: 900;

                    letter-spacing: 3px;
                    line-height: 1;
                }

                .contact-dot {
                    width: 7px;
                    height: 7px;

                    flex-shrink: 0;

                    border-radius: 50%;

                    background: #a4b437;
                }

                .contact-intro h1 {
                    margin: 16px 0 17px;

                    color: #111a13;

                    font-size: clamp(48px, 5vw, 70px);

                    line-height: 0.98;

                    letter-spacing: -3.5px;

                    font-weight: 600;
                }

                .contact-intro h1 span {
                    color: #7d8e09;
                }

                .contact-intro > p {
                    max-width: 510px;

                    margin: 0;

                    color: #707970;

                    font-size: 16px;

                    line-height: 1.65;
                }

                /* =========================================
                   CONTACT POINTS
                   ========================================= */

                .contact-points {
                    display: flex;
                    flex-direction: column;

                    gap: 13px;

                    margin-top: 27px;
                }

                .contact-point {
                    display: flex;
                    align-items: center;

                    gap: 12px;

                    color: #657066;

                    font-size: 13px;

                    line-height: 1.3;
                }

                .contact-point-icon {
                    width: 38px;
                    height: 38px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    flex-shrink: 0;

                    border-radius: 11px;

                    background: #eef2d5;
                    color: #7d8e09;

                    font-size: 15px;
                    font-weight: 800;
                }

                /* =========================================
                   FORM CARD
                   ========================================= */

                .contact-card {
                    width: 100%;

                    padding: clamp(24px, 2.5vw, 34px);

                    border: 1px solid #e0e4d5;

                    border-radius: 24px;

                    background: rgba(255, 255, 255, 0.95);

                    box-shadow:
                        0 20px 45px rgba(45, 52, 25, 0.08);

                    min-width: 0;
                }

                .contact-card h2 {
                    margin: 0 0 7px;

                    color: #182019;

                    font-size: 27px;

                    line-height: 1.15;

                    font-weight: 800;
                }

                .contact-subtitle {
                    margin: 0 0 22px;

                    color: #7a827a;

                    font-size: 13px;

                    line-height: 1.5;
                }

                /* =========================================
                   FORM
                   ========================================= */

                .contact-form {
                    display: flex;
                    flex-direction: column;

                    gap: 12px;

                    width: 100%;
                }

                .contact-input,
                .contact-textarea {
                    width: 100%;

                    padding: 14px 15px;

                    border: 1px solid #dfe3d5;

                    border-radius: 12px;

                    outline: none;

                    background: #fafbf6;

                    color: #263027;

                    font-family: inherit;

                    font-size: 13px;

                    transition:
                        border-color 0.2s ease,
                        box-shadow 0.2s ease,
                        background 0.2s ease;
                }

                .contact-input {
                    height: 48px;
                }

                .contact-input::placeholder,
                .contact-textarea::placeholder {
                    color: #9aa198;
                }

                .contact-input:focus,
                .contact-textarea:focus {
                    border-color: #a3b13b;

                    background: #ffffff;

                    box-shadow:
                        0 0 0 3px rgba(163, 177, 59, 0.12);
                }

                .contact-textarea {
                    min-height: 112px;

                    resize: none;

                    line-height: 1.5;
                }

                /* =========================================
                   BUTTON
                   ========================================= */

                .contact-submit {
                    width: 100%;
                    height: 48px;

                    margin-top: 2px;

                    border: 0;

                    border-radius: 12px;

                    background: #df1738;

                    color: #ffffff;

                    font-family: inherit;

                    font-size: 13px;

                    font-weight: 850;

                    cursor: pointer;

                    transition:
                        background 0.2s ease,
                        transform 0.2s ease,
                        box-shadow 0.2s ease;
                }

                .contact-submit:hover {
                    background: #ca1030;

                    transform: translateY(-1px);

                    box-shadow:
                        0 8px 18px rgba(223, 23, 56, 0.18);
                }

                .contact-submit:active {
                    transform: translateY(0);
                }

                /* =========================================
                   SUCCESS
                   ========================================= */

                .contact-success {
                    margin: 20px 0 8px;

                    padding: 20px;

                    border-radius: 13px;

                    background: #f1f4dd;

                    color: #667510;

                    font-size: 13px;

                    line-height: 1.55;

                    text-align: center;

                    font-weight: 650;
                }

                /* =========================================
                   FOOTER
                   ========================================= */

                .contact-footer {
                    width: min(1280px, calc(100% - 100px));

                    height: 48px;
                    min-height: 48px;

                    margin: 0 auto;

                    display: flex;

                    align-items: center;

                    justify-content: space-between;

                    color: #999e96;

                    font-size: 10px;

                    flex-shrink: 0;
                }

                .contact-footer button {
                    padding: 0;

                    border: 0;

                    background: transparent;

                    color: #748309;

                    font-size: 11px;

                    font-weight: 800;

                    cursor: pointer;
                }

                /* =========================================
                   COMPACT DESKTOP
                   125% ZOOM / SHORTER LAPTOP
                   ========================================= */

                @media (min-width: 901px) and (max-height: 820px) {

                    .contact-header {
                        height: 58px;
                        min-height: 58px;

                        padding-left: 4%;
                        padding-right: 4%;
                    }

                    .contact-brand {
                        font-size: 19px;
                    }

                    .contact-brand-mark {
                        width: 32px;
                        height: 32px;

                        border-radius: 9px;

                        font-size: 16px;
                    }

                    .contact-back {
                        font-size: 13px;
                    }

                    .contact-main {
                        width: min(1180px, calc(100% - 80px));

                        padding: 14px 0;

                        gap: 45px;
                    }

                    .contact-intro {
                        padding-left: 4px;
                    }

                    .contact-eyebrow {
                        font-size: 9px;

                        letter-spacing: 2.5px;
                    }

                    .contact-dot {
                        width: 6px;
                        height: 6px;
                    }

                    .contact-intro h1 {
                        margin: 10px 0 11px;

                        font-size: 50px;

                        letter-spacing: -2.8px;
                    }

                    .contact-intro > p {
                        max-width: 450px;

                        font-size: 12px;

                        line-height: 1.55;
                    }

                    .contact-points {
                        gap: 9px;

                        margin-top: 16px;
                    }

                    .contact-point {
                        font-size: 11px;
                    }

                    .contact-point-icon {
                        width: 31px;
                        height: 31px;

                        border-radius: 9px;

                        font-size: 13px;
                    }

                    .contact-card {
                        padding: 21px;

                        border-radius: 19px;
                    }

                    .contact-card h2 {
                        margin-bottom: 5px;

                        font-size: 21px;
                    }

                    .contact-subtitle {
                        margin-bottom: 14px;

                        font-size: 10px;
                    }

                    .contact-form {
                        gap: 8px;
                    }

                    .contact-input,
                    .contact-textarea {
                        padding: 9px 11px;

                        border-radius: 10px;

                        font-size: 10px;
                    }

                    .contact-input {
                        height: 38px;
                    }

                    .contact-textarea {
                        min-height: 78px;
                    }

                    .contact-submit {
                        height: 38px;

                        border-radius: 10px;

                        font-size: 10px;
                    }

                    .contact-footer {
                        width: min(1180px, calc(100% - 80px));

                        height: 34px;
                        min-height: 34px;

                        font-size: 8px;
                    }

                    .contact-footer button {
                        font-size: 9px;
                    }
                }

                /* =========================================
                   VERY SHORT DESKTOP
                   ========================================= */

                @media (min-width: 901px) and (max-height: 700px) {

                    .contact-header {
                        height: 52px;
                        min-height: 52px;
                    }

                    .contact-main {
                        padding: 10px 0;

                        gap: 35px;
                    }

                    .contact-intro h1 {
                        font-size: 44px;

                        margin-top: 7px;

                        margin-bottom: 8px;
                    }

                    .contact-intro > p {
                        font-size: 11px;
                    }

                    .contact-points {
                        margin-top: 10px;

                        gap: 7px;
                    }

                    .contact-point {
                        font-size: 10px;
                    }

                    .contact-point-icon {
                        width: 27px;
                        height: 27px;
                    }

                    .contact-card {
                        padding: 17px;
                    }

                    .contact-card h2 {
                        font-size: 18px;
                    }

                    .contact-subtitle {
                        margin-bottom: 9px;

                        font-size: 9px;
                    }

                    .contact-form {
                        gap: 6px;
                    }

                    .contact-input {
                        height: 34px;
                    }

                    .contact-input,
                    .contact-textarea {
                        padding: 7px 9px;

                        font-size: 9px;
                    }

                    .contact-textarea {
                        min-height: 62px;
                    }

                    .contact-submit {
                        height: 34px;

                        font-size: 9px;
                    }

                    .contact-footer {
                        height: 28px;
                        min-height: 28px;
                    }
                }

                /* =========================================
                   TABLET
                   ========================================= */

                @media (max-width: 900px) {

                    .contact-page {
                        height: auto;

                        min-height: 100vh;

                        overflow-x: hidden;
                        overflow-y: auto;
                    }

                    .contact-header {
                        height: 64px;

                        min-height: 64px;

                        padding: 0 24px;
                    }

                    .contact-main {
                        width: calc(100% - 48px);

                        grid-template-columns: 1fr;

                        gap: 30px;

                        padding: 38px 0 30px;
                    }

                    .contact-intro {
                        padding: 0;

                        text-align: center;
                    }

                    .contact-eyebrow {
                        justify-content: center;
                    }

                    .contact-intro > p {
                        margin-left: auto;

                        margin-right: auto;
                    }

                    .contact-points {
                        align-items: center;
                    }

                    .contact-card {
                        max-width: 680px;

                        margin: 0 auto;
                    }

                    .contact-footer {
                        width: calc(100% - 48px);

                        min-height: 50px;

                        height: 50px;
                    }
                }

                /* =========================================
                   MOBILE
                   ========================================= */

                @media (max-width: 600px) {

                    .contact-header {
                        height: 58px;

                        min-height: 58px;

                        padding: 0 15px;
                    }

                    .contact-brand {
                        font-size: 16px;
                    }

                    .contact-brand-mark {
                        width: 29px;
                        height: 29px;

                        border-radius: 9px;

                        font-size: 14px;
                    }

                    .contact-back {
                        font-size: 11px;
                    }

                    .contact-main {
                        width: calc(100% - 28px);

                        gap: 24px;

                        padding: 30px 0;
                    }

                    .contact-eyebrow {
                        font-size: 8px;

                        letter-spacing: 2px;
                    }

                    .contact-intro h1 {
                        margin: 12px 0;

                        font-size: 40px;

                        letter-spacing: -2px;
                    }

                    .contact-intro > p {
                        font-size: 12px;

                        line-height: 1.6;
                    }

                    .contact-points {
                        margin-top: 20px;

                        gap: 10px;
                    }

                    .contact-point {
                        font-size: 11px;
                    }

                    .contact-point-icon {
                        width: 32px;
                        height: 32px;
                    }

                    .contact-card {
                        padding: 19px;

                        border-radius: 18px;
                    }

                    .contact-card h2 {
                        font-size: 20px;
                    }

                    .contact-subtitle {
                        font-size: 11px;
                    }

                    .contact-input,
                    .contact-textarea {
                        font-size: 12px;
                    }

                    .contact-input {
                        height: 45px;
                    }

                    .contact-textarea {
                        min-height: 110px;
                    }

                    .contact-submit {
                        height: 45px;

                        font-size: 12px;
                    }

                    .contact-footer {
                        width: calc(100% - 28px);

                        min-height: 65px;

                        height: 65px;

                        justify-content: center;

                        gap: 15px;

                        flex-wrap: wrap;
                    }
                }
            `}</style>

            {/* HEADER */}

            <header className="contact-header">
                <button
                    className="contact-brand"
                    onClick={() => setCurrentPage("landing")}
                    aria-label="Go to NutriVisualizer home"
                >
                    <span className="contact-brand-mark">
                        ✦
                    </span>

                    <span>
                        Nutri<span>Visualizer</span>
                    </span>
                </button>

                <button
                    className="contact-back"
                    onClick={() => setCurrentPage("landing")}
                >
                    ← Back to Home
                </button>
            </header>

            {/* MAIN */}

            <main className="contact-main">

                {/* LEFT */}

                <section className="contact-intro">

                    <div className="contact-eyebrow">
                        <span className="contact-dot" />
                        WE&apos;D LOVE TO HEAR FROM YOU
                    </div>

                    <h1>
                        Let&apos;s <span>connect.</span>
                    </h1>

                    <p>
                        Have a question, suggestion, or feedback about
                        NutriVisualizer? Send us a message and let us know
                        how we can make your experience better.
                    </p>

                    <div className="contact-points">

                        <div className="contact-point">
                            <span className="contact-point-icon">
                                ?
                            </span>

                            Questions about the app
                        </div>

                        <div className="contact-point">
                            <span className="contact-point-icon">
                                ✦
                            </span>

                            Feedback and suggestions
                        </div>

                        <div className="contact-point">
                            <span className="contact-point-icon">
                                ↗
                            </span>

                            Ideas for future improvements
                        </div>

                    </div>

                </section>

                {/* FORM */}

                <section className="contact-card">

                    <h2>
                        Send us a message
                    </h2>

                    <p className="contact-subtitle">
                        Fill in the details below and share what&apos;s on your mind.
                    </p>

                    {submitted ? (

                        <p className="contact-success">
                            Thanks for reaching out! Your message has been
                            received. We&apos;ll get back to you soon.
                        </p>

                    ) : (

                        <form
                            className="contact-form"
                            onSubmit={handleSubmit}
                        >

                            <input
                                className="contact-input"
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                            <input
                                className="contact-input"
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                            <textarea
                                className="contact-textarea"
                                placeholder="Your message"
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                required
                            />

                            <button
                                type="submit"
                                className="contact-submit"
                            >
                                Send Message →
                            </button>

                        </form>

                    )}

                </section>

            </main>

            {/* FOOTER */}

            <footer className="contact-footer">

                <span>
                    © 2025 ErrorBite | All Rights Reserved
                </span>

                <button
                    onClick={() => setCurrentPage("landing")}
                >
                    NutriVisualizer
                </button>

            </footer>
        </div>
    );
}