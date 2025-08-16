import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';
// import { getCategoryBySlug } from '../data/categories';

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const category = getCategoryBySlug(categorySlug);
  const category = { name: 'Test Category', description: 'Test description' };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Error Loading Category
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Category Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The requested category could not be found.
          </p>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {category.name}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {/* <ArrowLeft className="w-5 h-5" /> */}
              ← Back to Categories
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">
                {category.name}
              </h1>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Category Content
          </h2>
          <p className="text-gray-600">
            This is a simplified version of the category page. The full content will be loaded once we resolve any issues.
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Category Details:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>Slug:</strong> {categorySlug}</li>
              <li><strong>Name:</strong> {category.name}</li>
              <li><strong>Description:</strong> {category.description}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

