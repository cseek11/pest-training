import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Camera, Info } from 'lucide-react';

export default function PestIdentification({ pests = [], category }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter pests by search term
  const filteredPests = useMemo(() => {
    if (!searchTerm) return pests;
    return pests.filter(pest => 
      pest.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pest.scientificName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pest.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pests, searchTerm]);

  const currentPest = filteredPests[currentIndex];

  const nextPest = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % filteredPests.length);
  };

  const prevPest = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev - 1 + filteredPests.length) % filteredPests.length);
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  if (!currentPest) {
    return (
      <div className="text-center py-8">
        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No Pest Images Available
        </h3>
        <p className="text-gray-500">
          {searchTerm ? 'No pests match your search.' : 'Pest identification images will appear here.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Pest Identification</h3>
          <p className="text-sm text-gray-600">
            {category} • {filteredPests.length} pests available
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {currentIndex + 1} of {filteredPests.length}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search pests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Pest Card */}
      <motion.div
        key={currentPest.id || currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl border shadow-sm overflow-hidden"
      >
        {/* Image Section */}
        <div className="relative aspect-video bg-gray-100">
          {currentPest.imageUrl ? (
            <img
              src={currentPest.imageUrl}
              alt={currentPest.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Camera className="w-16 h-16 text-gray-400" />
            </div>
          )}
          
          {/* Overlay with answer */}
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/70 flex items-center justify-center"
            >
              <div className="text-center text-white p-6">
                <h4 className="text-2xl font-bold mb-2">{currentPest.name}</h4>
                {currentPest.scientificName && (
                  <p className="text-lg italic mb-2">{currentPest.scientificName}</p>
                )}
                <p className="text-sm opacity-90">{currentPest.description}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={toggleAnswer}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={prevPest}
                disabled={filteredPests.length <= 1}
                className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ←
              </button>
              <button
                onClick={nextPest}
                disabled={filteredPests.length <= 1}
                className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>

          {/* Pest Info */}
          {!showAnswer && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="w-4 h-4" />
                <span>Click "Show Answer" to identify this pest</span>
              </div>
              
              {currentPest.hints && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <h5 className="font-medium text-yellow-800 mb-1">Hints:</h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {currentPest.hints.map((hint, index) => (
                      <li key={index}>• {hint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Thumbnail Navigation */}
      {filteredPests.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filteredPests.map((pest, index) => (
            <button
              key={pest.id || index}
              onClick={() => {
                setCurrentIndex(index);
                setShowAnswer(false);
              }}
              className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${
                index === currentIndex 
                  ? 'border-blue-500' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {pest.imageUrl ? (
                <img
                  src={pest.imageUrl}
                  alt={pest.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
