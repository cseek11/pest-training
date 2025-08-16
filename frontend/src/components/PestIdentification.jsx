import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, Camera, Info } from 'lucide-react';

// Sample pest data - in a real app, this would come from an API
const SAMPLE_PESTS = [
  {
    id: 1,
    name: 'Aphid',
    image_url: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Aphid',
    description: 'Small, soft-bodied insects that feed on plant sap',
    category: 'Insects',
    level: 'beginner'
  },
  {
    id: 2,
    name: 'Spider Mite',
    image_url: 'https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Spider+Mite',
    description: 'Tiny arachnids that cause stippling damage to leaves',
    category: 'Arachnids',
    level: 'intermediate'
  },
  {
    id: 3,
    name: 'Whitefly',
    image_url: 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Whitefly',
    description: 'Small, white, winged insects that feed on plant undersides',
    category: 'Insects',
    level: 'beginner'
  }
];

export default function PestIdentification({ category = '', level = 'beginner' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter pests by category and level (in a real app, this would be from API)
  const filteredPests = useMemo(() => {
    return SAMPLE_PESTS.filter(pest => {
      const matchesCategory = !category || pest.category.toLowerCase().includes(category.toLowerCase());
      const matchesLevel = !level || pest.level === level;
      const matchesSearch = !searchTerm || 
        pest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pest.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesLevel && matchesSearch;
    });
  }, [category, level, searchTerm]);

  const currentPest = filteredPests[currentIndex] || {};

  const nextPest = () => {
    if (currentIndex < filteredPests.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const prevPest = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  if (filteredPests.length === 0) {
    return (
      <div className="text-center py-8">
        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">
          No pest identification images available for this category and level.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search pests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      {/* Pest Card */}
      <div
        key={currentPest.id || currentIndex}
        className="bg-white rounded-2xl border shadow-sm overflow-hidden"
      >
        {/* Image */}
        <div className="relative">
          <img
            src={currentPest.image_url || 'https://via.placeholder.com/400x300/6B7280/FFFFFF?text=No+Image'}
            alt={currentPest.name || 'Pest'}
            className="w-full h-64 object-cover"
          />
          
          {/* Overlay with answer */}
          {showAnswer && (
            <div
              className="absolute inset-0 bg-black/70 flex items-center justify-center"
            >
              <div className="text-center text-white p-6">
                <h3 className="text-2xl font-bold mb-2">{currentPest.name || 'Unknown Pest'}</h3>
                <p className="text-sm opacity-90">{currentPest.description || 'No description available'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {currentIndex + 1} of {filteredPests.length}
              </span>
            </div>
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="flex items-center gap-2 px-3 py-1 text-sm border rounded-lg hover:bg-gray-50"
            >
              {showAnswer ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Hide Answer
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Show Answer
                </>
              )}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevPest}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={nextPest}
              disabled={currentIndex === filteredPests.length - 1}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {filteredPests.length > 1 && (
        <div className="grid grid-cols-3 gap-2">
          {filteredPests.map((pest, index) => (
            <button
              key={pest.id || index}
              onClick={() => {
                setCurrentIndex(index);
                setShowAnswer(false);
              }}
              className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                index === currentIndex ? 'border-purple-500' : 'border-gray-200'
              }`}
            >
              <img
                src={pest.image_url || 'https://via.placeholder.com/100x75/6B7280/FFFFFF?text=No+Image'}
                alt={pest.name || 'Pest'}
                className="w-full h-20 object-cover"
              />
              {index === currentIndex && (
                <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
