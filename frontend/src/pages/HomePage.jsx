import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Pest Control Training
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Welcome to the training application.
          </p>
          
          <div className="bg-white rounded-xl border p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Test Page
            </h2>
            <p className="text-gray-600 mb-4">
              This is a minimal test page to verify the application is working.
            </p>
            <button
              onClick={() => alert('Button works!')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Test Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
