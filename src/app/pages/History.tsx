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
        .history-back {
          align-self: flex-start;
          background: none;
          border: none;
          color: #d61439;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          margin-bottom: 1.5rem;
        }
        .history-title {
          font-size: 2rem;
          font-weight: 800;
          color: #d61439;
          margin-bottom: 2rem;
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
          background: white;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.06);
        }
        .history-card img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          display: block;
        }
        .history-card-body {
          padding: 1rem 1.25rem;
        }
        .history-dish-name {
          font-weight: 700;
          color: #4a5568;
          margin-bottom: 0.25rem;
        }
        .history-calories {
          color: #99a146;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        .history-date {
          color: #6b6b6b;
          font-size: 0.75rem;
        }
        .history-state-message {
          color: #4a5568;
          font-weight: 500;
          margin-top: 3rem;
          text-align: center;
        }
        .history-login-button {
          background-color: #d51439;
          color: white;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          margin-top: 1rem;
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
