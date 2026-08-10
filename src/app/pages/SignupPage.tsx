import React, { useState } from 'react';
import type { PageProps } from './types';
import { useAuth } from '../context/AuthContext';

// The main application component for the signup page
const SignUpPage = ({ setCurrentPage }: PageProps) => {
    const { signup } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setSubmitting(true);
        const result = await signup(email, password);
        setSubmitting(false);

        if (!result.success) {
            setError(result.error || 'Signup failed.');
            return;
        }
        setCurrentPage('upload');
    };

    return (
        <>
            <style>{`
            /* Container */
            .signup-page-container {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                width: 100%;
                background-image: linear-gradient(rgba(255, 255, 255, 0.10),
                                rgba(255, 255, 255, 0.6)),
                                url("/images/login_bg.png");
                background-size: cover;
                background-position: center;
                font-family: 'archivo', sans-serif;
            }

            /* Card */
            .signup-card {
                background: white;
                padding: 2.5rem;
                border-radius: 1.5rem;
                box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
                width: 350px;
                text-align: center;
                animation: fadeIn 0.8s ease-in-out;
            }

            /* Heading */
            .signup-card h1 {
                color: #4b4b4b;
                font-size: 2rem;
                margin-bottom: 1.5rem;
                font-weight: bold;
            }

            /* Form */
            .signup-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            /* Input fields */
            .signup-input {
                padding: 0.8rem;
                border: 1px solid #ccc;
                border-radius: 2rem;
                font-size: 1rem;
                outline: none;
                transition: border 0.3s, box-shadow 0.3s;
            }

            .signup-input:focus {
                border: 1px solid #e5903d;
                box-shadow: 0 0 8px rgba(229, 144, 61, 0.3);
            }

            /* Signup button */
            .signup-button {
                background-color: #e5903d;
                color: white;
                border: none;
                padding: 0.8rem;
                border-radius: 2rem;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                transition: transform 0.2s, background 0.3s;
            }

            .signup-button:hover {
                transform: scale(1.05);
                background-color: #d97922;
            }

            /* Social buttons wrapper */
            .social-buttons {
                display: flex;
                flex-direction: column;
                gap: 0.8rem;
                margin-top: 1.5rem;
            }

            /* Social buttons */
            .social-button {
                width: 100%;
                padding: 0.8rem;
                border-radius: 2rem;
                border: none;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s, opacity 0.3s;
                color: white;
            }

            /* social button */
            .google-button , .apple-button {
                background-color: #99a146 !important;
            }

            .google-button:hover, .apple-button:hover {
                transform: scale(1.05);
                opacity: 0.9;
                background-color: #6B8E23!important;
            }

            .back-link {
                background: none;
                border: none;
                color: #6b6b6b;
                font-size: 0.85rem;
                cursor: pointer;
                margin-top: 1.25rem;
                text-decoration: underline;
            }

            .login-link {
                background: none;
                border: none;
                color: #e5903d;
                font-weight: 600;
                cursor: pointer;
                font-size: 0.9rem;
                margin-top: 0.75rem;
            }

            .signup-error {
                color: #d61439;
                font-size: 0.85rem;
                margin-top: -0.25rem;
                margin-bottom: -0.5rem;
            }

            .social-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .social-button:disabled:hover {
                transform: none;
            }

            /* Animation */
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            `}</style>

            <div className="signup-page-container">
                <div className="signup-card">
                    <h1>SIGN UP</h1>
                    <form onSubmit={handleSignup} className="signup-form">
                        <input
                            className="signup-input"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            className="signup-input"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            className="signup-input"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {error && <p className="signup-error">{error}</p>}
                        <button type="submit" className="signup-button" disabled={submitting}>
                            {submitting ? 'Signing up...' : 'Sign Up'}
                        </button>
                    </form>
                    <div className="social-buttons">
                        <button className="social-button google-button" disabled title="Coming soon">
                            Continue with Google
                        </button>
                        <button className="social-button apple-button" disabled title="Coming soon">
                            Continue with Apple
                        </button>
                    </div>
                    <button className="login-link" onClick={() => setCurrentPage('login')}>
                        Already have an account? Log in
                    </button>
                    <br />
                    <button className="back-link" onClick={() => setCurrentPage('landing')}>
                        ← Back to Home
                    </button>
                </div>
            </div>
        </>
    );
};

export default SignUpPage;
