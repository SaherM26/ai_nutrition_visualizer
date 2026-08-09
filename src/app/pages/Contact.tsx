import React, { useState } from 'react';
import type { PageProps } from './types';

export default function Contact({ setCurrentPage }: PageProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // No backend wired up yet — this is a placeholder submit.
        console.log('Contact form submitted:', { name, email, message });
        setSubmitted(true);
    };

    return (
        <>
            <style>{`
                .contact-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    width: 100%;
                    padding: 2rem;
                    background-color: #fff6ed;
                    font-family: 'Inter', sans-serif;
                    box-sizing: border-box;
                }
                .contact-back {
                    align-self: flex-start;
                    max-width: 30rem;
                    width: 100%;
                    margin: 0 auto 1.5rem auto;
                    background: none;
                    border: none;
                    color: #d61439;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                }
                .contact-card {
                    background: white;
                    padding: 2.5rem;
                    border-radius: 1.5rem;
                    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 30rem;
                }
                .contact-card h1 {
                    color: #d61439;
                    font-size: 2rem;
                    font-weight: 800;
                    margin-bottom: 0.5rem;
                    text-align: center;
                }
                .contact-subtitle {
                    color: #6b6b6b;
                    text-align: center;
                    margin-bottom: 1.5rem;
                }
                .contact-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .contact-input, .contact-textarea {
                    padding: 0.8rem;
                    border: 1px solid #ccc;
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    outline: none;
                    font-family: inherit;
                    transition: border 0.3s, box-shadow 0.3s;
                }
                .contact-input:focus, .contact-textarea:focus {
                    border: 1px solid #e5903d;
                    box-shadow: 0 0 8px rgba(229, 144, 61, 0.3);
                }
                .contact-textarea {
                    resize: vertical;
                    min-height: 120px;
                }
                .contact-submit {
                    background-color: #d61439;
                    color: white;
                    border: none;
                    padding: 0.8rem;
                    border-radius: 2rem;
                    font-size: 1rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.2s, background 0.3s;
                }
                .contact-submit:hover {
                    transform: scale(1.02);
                    background-color: #b0102d;
                }
                .contact-success {
                    text-align: center;
                    color: #4a5568;
                    font-weight: 500;
                }
            `}</style>

            <div className="contact-container">
                <button className="contact-back" onClick={() => setCurrentPage('landing')}>
                    ← Back to Home
                </button>

                <div className="contact-card">
                    <h1>Contact Us</h1>
                    <p className="contact-subtitle">Questions or feedback? Send us a message.</p>

                    {submitted ? (
                        <p className="contact-success">Thanks for reaching out! We&apos;ll get back to you soon.</p>
                    ) : (
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <input
                                className="contact-input"
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <input
                                className="contact-input"
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <textarea
                                className="contact-textarea"
                                placeholder="Your message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                            <button type="submit" className="contact-submit">
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}