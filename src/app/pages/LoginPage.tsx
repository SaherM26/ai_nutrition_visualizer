import React, { useState } from 'react';

// The main application component for the login page
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would add your authentication logic.
        // For now, we'll just log the values.
        console.log('Logging in with:', { email, password });
    };

    return (
        <>
            <style>{`
            /* Container */
            .login-page-container {
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
            .login-card {
                background: white;
                padding: 2.5rem;
                border-radius: 1.5rem;
                box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.15);
                width: 350px;
                text-align: center;
                animation: fadeIn 0.8s ease-in-out;
            }

            /* Heading */
            .login-card h1 {
                color: #4b4b4b;
                font-size: 2rem;
                margin-bottom: 1.5rem;
                font-weight: bold;
            }

            /* Form */
            .login-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            /* Input fields */
            .login-input {
                padding: 0.8rem;
                border: 1px solid #ccc;
                border-radius: 2rem;
                font-size: 1rem;
                outline: none;
                transition: border 0.3s, box-shadow 0.3s;
            }

            .login-input:focus {
                border: 1px solid #e5903d;
                box-shadow: 0 0 8px rgba(229, 144, 61, 0.3);
            }

            /* Login button */
            .login-button {
                background-color: #e59f61;
                color: white;
                border: none;
                padding: 0.8rem;
                border-radius: 2rem;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                transition: transform 0.2s, background 0.3s;
            }

            .login-button:hover {
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
                opacity: 0.9
                background-color: #6B8E23!important;
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

            <div className="login-page-container">
                <div className="login-card">
                    <h1>LOG IN</h1>
                    <form onSubmit={handleLogin} className="login-form">
                        <input
                            className="login-input"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="login-input"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="login-button">
                            Login
                        </button>
                    </form>
                    <div className="social-buttons">
                        <button className="social-button google-button">
                            Continue with Google
                        </button>
                        <button className="social-button apple-button">
                            Continue with Apple
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
