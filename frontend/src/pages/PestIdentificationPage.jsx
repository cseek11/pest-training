import React, { useState, useEffect } from 'react';
import { fetchFlashcards } from '../api';

const LEVELS = ['beginner', 'intermediate', 'advanced'];

export default function PestIdentificationPage() {
  const [level, setLevel] = useState('beginner');
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const fc = await fetchFlashcards({ level, imageOnly: true });
    setFlashcards(fc);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [level]);

  // Pick 3 random flashcards with images
  const displayedFlashcards = React.useMemo(() => {
    const withImages = flashcards.filter(f => f.image_url);
    if (!withImages.length) return [];
    const shuffled = [...withImages].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [flashcards]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Pest Identification</h2>
      <div className="mb-4">
        {LEVELS.map(l => (
          <button key={l} onClick={() => setLevel(l)} className={`px-3 py-1 mr-2 rounded ${level===l?'bg-blue-500 text-white':'bg-gray-200'}`}>{l}</button>
        ))}
      </div>
      <h3 className="text-lg font-semibold mb-2">Flashcards (Images)</h3>
      {loading ? <p>Loading…</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayedFlashcards.map(f => (
            <div key={f.id || f.term} className="border rounded p-4 bg-white shadow">
              <div className="font-bold mb-2">{f.term}</div>
              <div>{f.def}</div>
              {f.image_url && <img src={f.image_url} alt={f.term} className="mt-2 max-h-32" />}
            </div>
          ))}
        </div>
      )}
      <button onClick={loadData} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">Refresh Flashcards</button>
    </div>
  );
}
