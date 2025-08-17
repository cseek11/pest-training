import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchFlashcards, fetchQuizBank } from '../api';
import Flashcard from '../components/Flashcard';

const LEVELS = ['beginner', 'intermediate', 'advanced'];

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const [level, setLevel] = useState('beginner');
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fallbackMessage, setFallbackMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      setFallbackMessage('');
      const [fc, qz] = await Promise.all([
        fetchFlashcards({ category: categorySlug, level }),
        fetchQuizBank({ category: categorySlug, level })
      ]);

      let cards = fc || [];
      if (!cards.length) {
        // Fallback 1: remove level filter for this category
        const fcNoLevel = await fetchFlashcards({ category: categorySlug });
        if (fcNoLevel?.length) {
          cards = fcNoLevel;
          setFallbackMessage('No flashcards for selected level. Showing all levels in this category.');
        } else {
          // Fallback 2: remove all filters to test connectivity and display samples
          const fcAny = await fetchFlashcards({});
          if (fcAny?.length) {
            cards = fcAny.slice(0, 12);
            setFallbackMessage('No flashcards for selected filters. Showing samples from all categories.');
          }
        }
      }

      setFlashcards(cards);
      setQuiz(qz);
      if (import.meta.env.DEV) {
        console.log('Loaded flashcards:', cards.length, 'quiz:', qz.length, 'filters:', { category: categorySlug, level });
      }
    } catch (e) {
      console.error(e);
      setError(e?.message || 'Failed to load data');
      setFlashcards([]);
      setQuiz([]);
      setFallbackMessage('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categorySlug, level]);

  // Pick 3 random flashcards (Fisher–Yates shuffle)
  const displayedFlashcards = React.useMemo(() => {
    if (!flashcards.length) return [];
    const arr = [...flashcards];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 3);
  }, [flashcards]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Category: {categorySlug}</h2>
      <div className="mb-4">
        {LEVELS.map(l => (
          <button key={l} onClick={() => setLevel(l)} className={`px-3 py-1 mr-2 rounded ${level===l?'bg-blue-500 text-white':'bg-gray-200'}`}>{l}</button>
        ))}
      </div>
      <h3 className="text-lg font-semibold mb-2">Flashcards</h3>
      {loading && <p>Loading…</p>}
      {!loading && error && <p className="text-red-600">Error: {error}</p>}
      {!loading && !error && import.meta.env.DEV && (
        <div className="text-xs text-gray-500 mb-2">
          Debug: category={categorySlug}, level={level}, total={flashcards.length}, displayed={displayedFlashcards.length}
        </div>
      )}
      {!loading && !error && !!fallbackMessage && (
        <div className="mb-2 rounded border border-yellow-300 bg-yellow-50 text-yellow-800 px-3 py-2 text-sm">
          {fallbackMessage}
        </div>
      )}
      {!loading && !error && (
        flashcards.length === 0 ? (
          <p className="text-gray-600">No flashcards found for this category/level. Try another level or click Refresh.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayedFlashcards.map(f => (
              <Flashcard key={f.id || f.term} card={f} />
            ))}
          </div>
        )
      )}
      <button onClick={loadData} className="mt-4 px-4 py-2 bg-green-500 text-white rounded" disabled={loading}>
        {loading ? 'Refreshing…' : 'Refresh Flashcards'}
      </button>
      <h3 className="text-lg font-semibold mt-8 mb-2">Quiz</h3>
      {/* Render quiz questions here, similar logic */}
      {/* ... */}
    </div>
  );
}
