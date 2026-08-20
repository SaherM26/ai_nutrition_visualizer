import React, { useEffect, useState } from 'react';
import type { PageProps, DishData } from './types';
import { useAuth } from '../context/AuthContext';

interface SavedMeal extends DishData {
  _id: string;
  image: string;
  createdAt: string;
}

export default function History({ setCurrentPage }: PageProps) {
  const { user, loading: authLoading } = useAuth();
  const [meals, setMeals] = useState<SavedMeal[]>([]);
  const [status, setStatus] = useState<'loading' | 'results' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setStatus('error');
      setErrorMessage('Log in to see your meal history.');
      return;
    }

    const fetchMeals = async () => {
      setStatus('loading');
      try {
        const res = await fetch('/api/meals');
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || 'Could not load meal history.');
        }
        setMeals(data.meals || []);
        setStatus('results');
      } catch (error) {
        console.error('Failed to load meal history:', error);
        setErrorMessage('Could not load meal history. Please try again.');
        setStatus('error');
      }
    };

    fetchMeals();
  }, [user, authLoading]);

  return (
    <>
      <style>{`
        .history-container {
         min-height: 100vh;
         min-height: 100dvh;
         width: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          padding: 28px 5vw 24px;
          box-sizing: border-box;
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
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }
        .history-back {
          display: block;
          background: transparent;
          border: 0;
          color: #748309;
          font-weight: 800;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
          margin: 0 0 22px;
        }
        .history-title {
          margin: 0 0 24px;
          color: #111a13;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1;
          letter-spacing: -2px;
          font-weight: 600;
          text-align: center;
        }
        .history-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          width: 100%;
          max-width: 60rem;
        }
        @media (min-width: 768px) {
          .history-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .history-card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid #e0e4d5;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 12px 30px rgba(49, 56, 22, 0.07);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .history-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 34px rgba(49, 56, 22, 0.10);
        }
        .history-card img {
          width: 100%;
          height: 190px;
          object-fit: cover;
          display: block;
        }
        .history-card-body {
          padding: 16px 17px 17px;
        }
        .history-dish-name {
          color: #172018;
          font-size: 15px;
          font-weight: 800;
          margin-bottom: 6px;
        }
        .history-calories {
          color: #7d8e09;
          font-weight: 750;
          font-size: 12px;
          margin-bottom: 6px;
        }
        .history-date {
          color: #7b827a;
          font-size: 11px;
        }
        .history-state-message {
          color: #707970;
          font-weight: 500;
          font-size: 14px;
          margin-top: 3rem;
          text-align: center;
        }
        .history-login-button {
          background: #df1738;
          color: #fff;
          font-weight: 800;
          font-size: 12px;
          padding: 11px 22px;
          border: 0;
          border-radius: 10px;
          cursor: pointer;
          margin-top: 12px;
        }

        @media (min-width: 901px) {
          .history-container {
            height: 100vh;
            overflow: hidden;
          }
        }

        @media (max-width: 900px) {
          .history-container {
            min-height: 100vh;
            overflow-y: auto;
          }

          .history-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .history-container {
            padding: 24px 14px;
          }

          .history-title {
            font-size: 36px;
            letter-spacing: -1.5px;
          }

          .history-grid {
            grid-template-columns: 1fr;
          }

          .history-card img {
            height: 200px;
          }
        }
      `}</style>

      <div className="history-container">
        <button className="history-back" onClick={() => setCurrentPage('upload')}>
          ← Back to Upload
        </button>

        <h1 className="history-title">Your Meal History</h1>

        {(status === 'loading' || authLoading) && (
          <p className="history-state-message">Loading your meals...</p>
        )}

        {status === 'error' && (
          <div style={{ textAlign: 'center' }}>
            <p className="history-state-message" style={{ color: '#d61439' }}>{errorMessage}</p>
            {!user && (
              <button className="history-login-button" onClick={() => setCurrentPage('login')}>
                Log In
              </button>
            )}
          </div>
        )}

        {status === 'results' && meals.length === 0 && (
          <p className="history-state-message">No meals analyzed yet. Upload one to get started!</p>
        )}

        {status === 'results' && meals.length > 0 && (
          <div className="history-grid">
            {meals.map((meal) => (
              <div className="history-card" key={meal._id}>
                <img src={meal.image} alt={meal.dishName} />
                <div className="history-card-body">
                  <div className="history-dish-name">{meal.dishName}</div>
                  <div className="history-calories">{meal.calories}</div>
                  <div className="history-date">{new Date(meal.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
