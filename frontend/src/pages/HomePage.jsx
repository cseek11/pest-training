import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  // Simple hardcoded categories for testing
  const testCategories = [
    {
      id: '01',
      name: 'Agronomic Crops',
      description: 'Pest control for field crops, grains, and agricultural commodities',
      slug: 'agronomic-crops'
    },
    {
      id: '02',
      name: 'Fruit and Nuts',
      description: 'Pest management for fruit trees, nut trees, and orchards',
      slug: 'fruit-and-nuts'
    },
    {
      id: '03',
      name: 'Vegetable Crops',
      description: 'Pest control for vegetable gardens and commercial vegetable production',
      slug: 'vegetable-crops'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Pest Control Training
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive training for Private Applicator Certification across all categories.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Categories Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Certification Categories (Test Version)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testCategories.map((category) => (
              <div key={category.id} className="group">
                <Link
                  to={`/category/${category.slug}`}
                  className="block bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {category.id}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Click to view training materials
                      </div>
                      <div className="text-green-500 group-hover:translate-x-1 transition-transform">
                        →
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Test Navigation */}
        <div className="bg-white rounded-xl border p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Test Navigation
          </h3>
          <div className="flex gap-4 justify-center">
            <Link
              to="/admin"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go to Admin
            </Link>
            <Link
              to="/category/agronomic-crops"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Test Category Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
