"use client";

import React, { useState } from "react";
import type { PageProps } from "./types";
import { useAuth } from "../context/AuthContext";

const SignUpPage = ({ setCurrentPage }: PageProps) => {
    const { signup } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setSubmitting(true);

        try {
            const result = await signup(email, password);

            if (!result.success) {
                setError(result.error || "Signup failed.");
                return;
            }

            setCurrentPage("upload");
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-wrapper">

                {/* BRAND */}
                <button
                    type="button"
                    className="auth-brand"
                    onClick={() => setCurrentPage("landing")}
                    aria-label="Go to home"
                >
                    <span className="auth-brand-mark">✦</span>

                    <span className="auth-brand-name">
                        Nutri<span>Visualizer</span>
                    </span>
                </button>

                {/* SIGNUP CARD */}
                <section className="auth-card">

                    <h1>Create your account</h1>

                    <p className="auth-subtitle">
                        Start understanding what's on your plate.
                    </p>

                    <form onSubmit={handleSignup} className="auth-form">

                        <input
                            className="auth-input"
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />

                        <input
                            className="auth-input"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />

                        <input
                            className="auth-input"
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />

                        {error && (
                            <p className="auth-error">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="auth-primary-button"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Creating account..."
                                : "Create Account →"}
                        </button>

                    </form>

                    {/* DIVIDER */}
                    <div className="auth-divider">
                        <span>OR</span>
                    </div>

                    {/* GOOGLE ONLY */}
                    <button
                        type="button"
                        className="auth-google-button"
                        disabled
                        title="Google signup coming soon"
                    >
                        Continue with Google
                    </button>

                    {/* LOGIN */}
                    <p className="auth-switch">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={() => setCurrentPage("login")}
                        >
                            Log in
                        </button>
                    </p>

                    {/* BACK HOME */}
                    <button
                        type="button"
                        className="auth-back"
                        onClick={() => setCurrentPage("landing")}
                    >
                        ← Back to Home
                    </button>

                </section>

                {/* FOOTER */}
                <p className="auth-footer">
                    © 2025 ErrorBite | All Rights Reserved
                </p>

            </div>

            <style jsx>{`

        /* =========================================
           RESET
        ========================================= */

        * {
          box-sizing: border-box;
        }

        /* =========================================
           PAGE
        ========================================= */

        .auth-page {
          width: 100%;
          min-height: 100vh;
          min-height: 100dvh;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 24px;

          /*
            YOUR ACTUAL IMAGE:
            public/images/login_bg.png
          */

          background-image:
            linear-gradient(
              to bottom,
              rgba(248, 249, 242, 0.05) 0%,
              rgba(248, 249, 242, 0.05) 48%,
              rgba(203, 239, 105, 0.58) 100%
            ),
            url("/images/login_bg.png");

          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          overflow: hidden;
        }

        /* =========================================
           WRAPPER
        ========================================= */

        .auth-wrapper {
          width: 100%;
          max-width: 470px;

          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* =========================================
           BRAND
        ========================================= */

        .auth-brand {
          display: flex;
          align-items: center;
          gap: 10px;

          margin-bottom: 14px;

          padding: 0;

          border: none;
          background: transparent;

          cursor: pointer;
        }

        .auth-brand-mark {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background: #eef2d4;
          color: #7c8d09;

          font-size: 21px;
          font-weight: 800;
        }

        .auth-brand-name {
          color: #172019;

          font-size: 27px;
          font-weight: 800;

          letter-spacing: -0.8px;
        }

        .auth-brand-name span {
          color: #7c8d09;
        }

        /* =========================================
           CARD
        ========================================= */

        .auth-card {
          width: 100%;

          padding: 28px 34px;

          background: rgba(255, 255, 255, 0.97);

          border: 1px solid rgba(225, 228, 215, 0.95);

          border-radius: 24px;

          box-shadow:
            0 20px 55px rgba(35, 45, 20, 0.14);

          text-align: center;
        }

        .auth-card h1 {
          margin: 0;

          color: #172019;

          font-size: 30px;
          line-height: 1.15;
          font-weight: 800;

          letter-spacing: -1px;
        }

        .auth-subtitle {
          margin: 8px 0 20px;

          color: #718078;

          font-size: 14px;
          line-height: 1.5;
        }

        /* =========================================
           FORM
        ========================================= */

        .auth-form {
          display: flex;
          flex-direction: column;

          gap: 10px;
        }

        .auth-input {
          width: 100%;
          height: 46px;

          padding: 0 16px;

          border: 1px solid #dfe3d5;
          border-radius: 13px;

          background: #fbfbf7;

          color: #172019;

          outline: none;

          font-family: inherit;
          font-size: 14px;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .auth-input::placeholder {
          color: #9aa39b;
        }

        .auth-input:focus {
          border-color: #aab83c;

          background: #ffffff;

          box-shadow:
            0 0 0 4px rgba(170, 184, 60, 0.13);
        }

        /* =========================================
           ERROR
        ========================================= */

        .auth-error {
          margin: 0;

          color: #d7193f;

          font-size: 13px;
          line-height: 1.4;

          text-align: left;
        }

        /* =========================================
           PRIMARY BUTTON
        ========================================= */

        .auth-primary-button {
          width: 100%;
          height: 46px;

          margin-top: 3px;

          border: none;
          border-radius: 13px;

          background: #e6173b;
          color: #ffffff;

          font-family: inherit;

          font-size: 15px;
          font-weight: 800;

          cursor: pointer;

          transition:
            background 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .auth-primary-button:hover:not(:disabled) {
          background: #cf1234;

          transform: translateY(-1px);

          box-shadow:
            0 8px 20px rgba(230, 23, 59, 0.20);
        }

        .auth-primary-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .auth-primary-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* =========================================
           DIVIDER
        ========================================= */

        .auth-divider {
          display: flex;
          align-items: center;

          gap: 12px;

          margin: 17px 0 12px;

          color: #9aa39b;

          font-size: 12px;
          font-weight: 700;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: "";

          flex: 1;

          height: 1px;

          background: #e3e6dc;
        }

        /* =========================================
           GOOGLE ONLY
        ========================================= */

        .auth-google-button {
          width: 100%;
          height: 42px;

          border: 1px solid #dfe3d5;
          border-radius: 12px;

          background: #ffffff;

          color: #68736b;

          font-family: inherit;

          font-size: 14px;
          font-weight: 700;

          opacity: 0.72;

          cursor: not-allowed;
        }

        /* =========================================
           SWITCH
        ========================================= */

        .auth-switch {
          margin: 15px 0 0;

          color: #718078;

          font-size: 14px;
        }

        .auth-switch button {
          padding: 0;

          border: none;
          background: transparent;

          color: #7c8d09;

          font-family: inherit;

          font-size: inherit;
          font-weight: 800;

          cursor: pointer;
        }

        .auth-switch button:hover {
          text-decoration: underline;
        }

        /* =========================================
           BACK HOME
        ========================================= */

        .auth-back {
          margin-top: 9px;

          padding: 6px 0;

          border: none;
          background: transparent;

          color: #71800a;

          font-family: inherit;

          font-size: 14px;
          font-weight: 800;

          cursor: pointer;
        }

        .auth-back:hover {
          color: #596700;
        }

        /* =========================================
           FOOTER
        ========================================= */

        .auth-footer {
          margin: 9px 0 0;

          color: #7d8880;

          font-size: 11px;
        }

        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 600px) {

          .auth-page {
            min-height: 100vh;

            padding: 22px 15px;

            overflow-y: auto;

            background-position: center;
          }

          .auth-card {
            padding: 26px 22px;

            border-radius: 21px;
          }

          .auth-brand-name {
            font-size: 23px;
          }

          .auth-brand-mark {
            width: 39px;
            height: 39px;
          }

          .auth-card h1 {
            font-size: 27px;
          }

        }

        @media (max-width: 380px) {

          .auth-page {
            padding: 18px 12px;
          }

          .auth-card {
            padding: 24px 18px;
          }

          .auth-card h1 {
            font-size: 26px;
          }

          .auth-subtitle {
            font-size: 13px;
          }

        }

      `}</style>
        </main>
    );
};

export default SignUpPage;