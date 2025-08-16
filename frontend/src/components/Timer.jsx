import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, X } from 'lucide-react';

export default function Timer({ 
  duration, 
  onTimeUp, 
  isVisible, 
  onClose, 
  title = "Time Remaining",
  showWarning = true 
}) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    setTimeLeft(duration);
    setIsWarning(false);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        
        // Show warning when 10% of time remains
        if (showWarning && prev <= Math.ceil(duration * 0.1) && !isWarning) {
          setIsWarning(true);
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, duration, onTimeUp, showWarning, isWarning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;
  const isLowTime = timeLeft <= Math.ceil(duration * 0.1);

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${isLowTime ? 'text-red-500' : 'text-blue-500'}`} />
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Timer Display */}
            <div className="text-center mb-4">
              <div className={`text-4xl font-mono font-bold mb-2 ${
                isLowTime ? 'text-red-500' : 'text-gray-800'
              }`}>
                {formatTime(timeLeft)}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    isLowTime ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="text-sm text-gray-600">
                {Math.round(progress)}% complete
              </div>
            </div>

            {/* Warning Message */}
            {isWarning && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 text-sm font-medium">
                  Time is running out! Please complete your answers soon.
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue
              </button>
              <button
                onClick={onTimeUp}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
