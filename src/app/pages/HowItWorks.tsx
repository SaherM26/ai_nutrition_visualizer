import React from "react";
import type { PageProps } from "./types";

export default function HowItWorks({ setCurrentPage }: PageProps) {
  return (
    <>
      <style>{`
        /* =========================================================
           HOW IT WORKS PAGE
           ========================================================= */

        .how-it-works-page {
          width: 100%;
          height: 100vh;
          min-height: 100vh;
          overflow: hidden;

          background:
            radial-gradient(
              circle at 85% 12%,
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

          box-sizing: border-box;
        }

        .how-it-works-page *,
        .how-it-works-page *::before,
        .how-it-works-page *::after {
          box-sizing: border-box;
        }


        /* =========================================================
           NAVBAR
           Matches Contact Page
           ========================================================= */

        .how-it-works-header {
          width: 100%;
          height: 76px;
          min-height: 76px;

          padding: 0 clamp(32px, 5vw, 84px);

          display: flex;
          align-items: center;
          justify-content: space-between;

          background: rgba(255, 255, 255, 0.97);

          border-bottom: 1px solid #e7e9df;

          flex-shrink: 0;

          position: relative;
          z-index: 10;
        }


        /* LEFT - BACK TO HOME */

        .how-back {
          display: inline-flex;
          align-items: center;

          padding: 8px 0;

          border: 0;
          outline: none;

          background: transparent;

          color: #70800a;

          font-size: 16px;
          font-weight: 800;

          line-height: 1;

          cursor: pointer;

          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .how-back:hover {
          color: #5e6d05;
          transform: translateX(-3px);
        }

        .how-back:focus-visible {
          outline: 2px solid #9daa36;
          outline-offset: 5px;
          border-radius: 4px;
        }


        /* RIGHT - BRAND */

        .how-brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;

          padding: 0;

          border: 0;
          outline: none;

          background: transparent;

          color: #172019;

          font-size: 23px;
          font-weight: 800;

          line-height: 1;

          cursor: pointer;
        }

        .how-brand-text {
          color: #172019;
        }

        .how-brand-highlight {
          color: #7c8d09;
        }

        .how-brand-mark {
          width: 40px;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 12px;

          background: #eef2d4;
          color: #81910b;

          font-size: 20px;
          font-weight: 700;
        }

        .how-brand:focus-visible {
          outline: 2px solid #9daa36;
          outline-offset: 5px;
          border-radius: 6px;
        }


        /* =========================================================
           MAIN CONTENT
           ========================================================= */

        .how-main {
          width: min(1320px, calc(100% - 100px));

          height: calc(100vh - 76px);

          margin: 0 auto;

          padding: 28px 0 20px;

          display: flex;
          flex-direction: column;
          justify-content: center;

          overflow: hidden;
        }


        /* =========================================================
           HEADING
           ========================================================= */

        .how-heading {
          width: 100%;

          text-align: center;

          margin: 0 0 25px;
        }

        .how-eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          margin-bottom: 9px;

          color: #839009;

          font-size: 11px;
          font-weight: 900;

          letter-spacing: 3px;

          line-height: 1.2;
        }

        .how-dot {
          width: 7px;
          height: 7px;

          flex-shrink: 0;

          border-radius: 50%;

          background: #a4b437;
        }

        .how-title {
          margin: 0;

          color: #111a13;

          font-size: clamp(38px, 4vw, 54px);

          line-height: 1.02;

          letter-spacing: -2.2px;

          font-weight: 600;
        }

        .how-title span {
          color: #7d8e09;
        }

        .how-subtitle {
          max-width: 720px;

          margin: 11px auto 0;

          color: #707970;

          font-size: 15px;

          line-height: 1.5;
        }


        /* =========================================================
           STEP CARDS
           ========================================================= */

        .steps-grid {
          width: 100%;

          display: grid;

          grid-template-columns: repeat(4, 1fr);

          gap: 16px;
        }

        .step-card {
          min-width: 0;
          min-height: 245px;

          padding: 24px;

          display: flex;
          flex-direction: column;
          align-items: flex-start;

          border: 1px solid #e2e5d8;

          border-radius: 19px;

          background: rgba(255, 255, 255, 0.92);

          box-shadow:
            0 12px 30px rgba(49, 56, 22, 0.07);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .step-card:nth-child(2) {
          background: #fbfcf3;
          border-color: #dbe3b4;
        }

        .step-card:hover {
          transform: translateY(-4px);

          box-shadow:
            0 17px 35px rgba(49, 56, 22, 0.10);
        }


        /* NUMBER */

        .step-number {
          margin-bottom: 15px;

          color: #9da96c;

          font-size: 12px;
          font-weight: 900;

          letter-spacing: 1px;

          line-height: 1;
        }


        /* ICON */

        .step-icon-wrapper {
          width: 54px;
          height: 54px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-bottom: 17px;

          border-radius: 15px;

          background: #eef2d5;

          color: #7d8e09;
        }

        .step-icon {
          width: 28px;
          height: 28px;
        }


        /* CARD TITLE */

        .step-heading {
          margin: 0 0 8px;

          color: #172018;

          font-size: 19px;

          line-height: 1.2;

          font-weight: 800;
        }


        /* CARD DESCRIPTION */

        .step-description {
          margin: 0;

          color: #788078;

          font-size: 13px;

          line-height: 1.55;
        }


        /* =========================================================
           FOOTER TEXT
           ========================================================= */

        .how-footer {
          display: flex;
          justify-content: center;
          align-items: center;

          margin-top: 20px;

          color: #9a9f97;

          font-size: 11px;

          line-height: 1.3;
        }


        /* =========================================================
           DESKTOP - SHORT HEIGHT / ZOOM
           Prevents overflow at 125% zoom
           ========================================================= */

        @media (min-width: 901px) and (max-height: 850px) {

          .how-it-works-header {
            height: 64px;
            min-height: 64px;

            padding-left: 4%;
            padding-right: 4%;
          }

          .how-main {
            height: calc(100vh - 64px);

            padding: 18px 0 14px;
          }

          .how-heading {
            margin-bottom: 17px;
          }

          .how-eyebrow {
            font-size: 9px;
            letter-spacing: 2.6px;

            margin-bottom: 7px;
          }

          .how-title {
            font-size: 42px;
            letter-spacing: -1.7px;
          }

          .how-subtitle {
            margin-top: 7px;
            font-size: 12px;
          }

          .how-brand {
            font-size: 19px;
          }

          .how-brand-mark {
            width: 34px;
            height: 34px;

            border-radius: 10px;

            font-size: 17px;
          }

          .how-back {
            font-size: 14px;
          }

          .steps-grid {
            gap: 13px;
          }

          .step-card {
            min-height: 205px;

            padding: 17px;
          }

          .step-number {
            margin-bottom: 12px;

            font-size: 10px;
          }

          .step-icon-wrapper {
            width: 44px;
            height: 44px;

            margin-bottom: 12px;

            border-radius: 12px;
          }

          .step-icon {
            width: 23px;
            height: 23px;
          }

          .step-heading {
            font-size: 15px;

            margin-bottom: 6px;
          }

          .step-description {
            font-size: 10px;
          }

          .how-footer {
            margin-top: 12px;
            font-size: 9px;
          }
        }


        /* =========================================================
           TABLET
           ========================================================= */

        @media (max-width: 900px) {

          .how-it-works-page {
            height: auto;
            min-height: 100vh;

            overflow-y: auto;
          }

          .how-it-works-header {
            height: 68px;
            min-height: 68px;

            padding: 0 28px;
          }

          .how-main {
            width: calc(100% - 40px);

            height: auto;
            min-height: calc(100vh - 68px);

            padding: 40px 0;
          }

          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }


        /* =========================================================
           MOBILE
           ========================================================= */

        @media (max-width: 600px) {

          .how-it-works-header {
            height: 60px;
            min-height: 60px;

            padding: 0 18px;
          }

          .how-back {
            font-size: 12px;
          }

          .how-brand {
            gap: 7px;

            font-size: 15px;
          }

          .how-brand-mark {
            width: 29px;
            height: 29px;

            border-radius: 9px;

            font-size: 14px;
          }

          .how-main {
            width: calc(100% - 28px);

            padding: 30px 0;
          }

          .how-heading {
            margin-bottom: 24px;
          }

          .how-eyebrow {
            font-size: 8px;
            letter-spacing: 2px;

            gap: 6px;
          }

          .how-dot {
            width: 6px;
            height: 6px;
          }

          .how-title {
            font-size: 34px;
            letter-spacing: -1.4px;
          }

          .how-subtitle {
            font-size: 12px;
          }

          .steps-grid {
            grid-template-columns: 1fr;

            gap: 12px;
          }

          .step-card {
            min-height: 180px;

            padding: 19px;
          }

          .step-heading {
            font-size: 17px;
          }

          .step-description {
            font-size: 12px;
          }

          .how-footer {
            margin-top: 18px;
            font-size: 10px;
          }
        }
      `}</style>

      <main className="how-it-works-page">

        {/* =====================================================
            NAVBAR
            ===================================================== */}

        <header className="how-it-works-header">

          {/* LEFT — BRAND */}
          <button
            type="button"
            className="how-brand"
            onClick={() => setCurrentPage("landing")}
            aria-label="Go to NutriVisualizer home"
          >
            <span className="how-brand-mark">✦</span>

            <span className="how-brand-text">
              Nutri<span className="how-brand-highlight">
                Visualizer
              </span>
            </span>
          </button>


          {/* RIGHT — BACK TO HOME */}
          <button
            type="button"
            className="how-back"
            onClick={() => setCurrentPage("landing")}
          >
            ← Back to Home
          </button>

        </header>

        {/* =====================================================
            MAIN
            ===================================================== */}

        <section className="how-main">

          {/* HEADING */}

          <div className="how-heading">

            <div className="how-eyebrow">

              <span className="how-dot" />

              SIMPLE • SMART • AI-POWERED

              <span className="how-dot" />

            </div>

            <h1 className="how-title">
              See how <span>NutriVisualizer</span> works.
            </h1>

            <p className="how-subtitle">
              From a single meal photo to clear nutrition insights and
              smarter food choices in just a few simple steps.
            </p>

          </div>


          {/* =================================================
              STEPS
              ================================================= */}

          <div className="steps-grid">

            {/* STEP 01 */}

            <div className="step-card">

              <span className="step-number">
                01
              </span>

              <div className="step-icon-wrapper">

                <svg
                  className="step-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.808-1.212A2 2 0 0110.664 4h2.672a2 2 0 011.664.89l.808 1.212A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

              </div>

              <h3 className="step-heading">
                Upload Your Meal
              </h3>

              <p className="step-description">
                Upload a clear photo of your meal from your device.
              </p>

            </div>


            {/* STEP 02 */}

            <div className="step-card">

              <span className="step-number">
                02
              </span>

              <div className="step-icon-wrapper">

                <svg
                  className="step-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 17v-2.75L12 11.25l2.25 3V17M12 11.25l-2.25 3M12 11.25l2.25 3M9.75 17h4.5M12 21a9 9 0 100-18 9 9 0 000 18z"
                  />
                </svg>

              </div>

              <h3 className="step-heading">
                AI Recognizes Your Food
              </h3>

              <p className="step-description">
                AI identifies visible foods and ingredients in the image.
              </p>

            </div>


            {/* STEP 03 */}

            <div className="step-card">

              <span className="step-number">
                03
              </span>

              <div className="step-icon-wrapper">

                <svg
                  className="step-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 9h8M8 13h8M8 17h5"
                  />
                </svg>

              </div>

              <h3 className="step-heading">
                Get Nutrition Insights
              </h3>

              <p className="step-description">
                View estimated calories, protein, carbs, fats and more.
              </p>

            </div>


            {/* STEP 04 */}

            <div className="step-card">

              <span className="step-number">
                04
              </span>

              <div className="step-icon-wrapper">

                <svg
                  className="step-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v18M3 12h18"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 7l3 3M17 7l-3 3M7 17l3-3M17 17l-3-3"
                  />
                </svg>

              </div>

              <h3 className="step-heading">
                Make Smarter Choices
              </h3>

              <p className="step-description">
                Get practical recommendations and healthier alternatives.
              </p>

            </div>

          </div>


          {/* FOOTER */}

          <div className="how-footer">
            AI-powered estimates • Designed for everyday food decisions
          </div>

        </section>

      </main>
    </>
  );
}