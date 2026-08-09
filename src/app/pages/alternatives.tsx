import React, { useEffect, useState } from 'react';
import type { PageProps, AnalyzedDish } from './types';

interface Alternative {
    name: string;
    reason: string;
    estimatedCalories: string;
}

interface AlternativesProps extends PageProps {
    dish: AnalyzedDish | null;
}

export default function Alternatives({ setCurrentPage, dish }: AlternativesProps) {
    const [status, setStatus] = useState<'loading' | 'results' | 'error'>('loading');
    const [alternatives, setAlternatives] = useState<Alternative[]>([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!dish) {
            setStatus('error');
            setErrorMessage('No analyzed dish found. Upload a meal photo first.');
            return;
        }

        let cancelled = false;

        const fetchAlternatives = async () => {
            setStatus('loading');
            try {
                const response = await fetch('/api/alternatives', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dishName: dish.data.dishName,
                        calories: dish.data.calories,
                        protein: dish.data.protein,
                        fats: dish.data.fats,
                        carbs: dish.data.carbs,
                    }),
                });
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result?.error || `Request failed with status ${response.status}`);
                }
                if (!cancelled) {
                    setAlternatives(result.alternatives || []);
                    setStatus('results');
                }
            } catch (error) {
                console.error('Failed to fetch alternatives:', error);
                if (!cancelled) {
                    setErrorMessage('Could not load healthier alternatives right now. Please try again.');
                    setStatus('error');
                }
            }
        };

        fetchAlternatives();
        return () => {
            cancelled = true;
        };
    }, [dish]);

    return (
        <>
            <style>{`
        .alternatives-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          width: 100%;
          padding: 2rem;
          background-color: #fff6ed;
          font-family: 'Inter', sans-serif;
          box-sizing: border-box;
        }
        .alternatives-back {
          align-self: flex-start;
          background: none;
          border: none;
          color: #d61439;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          margin-bottom: 1.5rem;
        }
        .alternatives-title {
          font-size: 2rem;
          font-weight: 800;
          color: #d61439;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        .alternatives-subtitle {
          color: #6b6b6b;
          margin-bottom: 2rem;
          text-align: center;
        }
        .alternatives-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          width: 100%;
          max-width: 60rem;
        }
        @media (min-width: 768px) {
          .alternatives-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .alternative-card {
          background: white;
          border-radius: 1.5rem;
          padding: 1.5rem;
          box-shadow: 0 10px 20px rgba(0,0,0,0.06);
        }
        .alternative-name {
          font-weight: 700;
          font-size: 1.1rem;
          color: #4a5568;
          margin-bottom: 0.5rem;
        }
        .alternative-calories {
          color: #99a146;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        .alternative-reason {
          color: #6b6b6b;
          font-size: 0.95rem;
          line-height: 1.4;
        }
        .alternatives-state-message {
          color: #4a5568;
          font-weight: 500;
          margin-top: 3rem;
          text-align: center;
        }
      `}</style>

            <div className="alternatives-container">
                <button className="alternatives-back" onClick={() => setCurrentPage('upload')}>
                    ← Back to Upload
                </button>

                <h1 className="alternatives-title">Healthier Alternatives</h1>
                {dish && (
                    <p className="alternatives-subtitle">
                        Based on your {dish.data.dishName || 'analyzed meal'} ({dish.data.calories})
                    </p>
                )}

                {status === 'loading' && (
                    <p className="alternatives-state-message">Finding healthier swaps for you...</p>
                )}

                {status === 'error' && (
                    <p className="alternatives-state-message" style={{ color: '#d61439' }}>
                        {errorMessage}
                    </p>
                )}

                {status === 'results' && (
                    <div className="alternatives-grid">
                        {alternatives.map((alt, i) => (
                            <div className="alternative-card" key={i}>
                                <div className="alternative-name">{alt.name}</div>
                                <div className="alternative-calories">{alt.estimatedCalories}</div>
                                <div className="alternative-reason">{alt.reason}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}