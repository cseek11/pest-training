import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, PA_CERT_CATEGORIES } from '../categories';

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Pest Control Training</h1>
      <p className="mb-2 text-gray-700 text-base">Core training categories for general pest control knowledge, safety, and regulations.</p>
      <div className="grid gap-4 mb-8 grid-cols-1 md:grid-cols-3">
        {CATEGORIES.map(cat => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="block px-6 py-4 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-10 mb-4">PA Certification</h2>
      <p className="mb-2 text-gray-700 text-base">Specialized Pennsylvania pesticide applicator categories for certification and exam prep.</p>
      <div className="grid gap-4 mb-8 grid-cols-1 md:grid-cols-3">
        {PA_CERT_CATEGORIES.map(cat => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="block px-6 py-4 rounded bg-purple-500 text-white font-semibold hover:bg-purple-600"
          >
            {cat.name}
          </Link>
        ))}
      </div>
      <p className="mb-2 text-gray-700 text-base">Other tools and admin features.</p>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Link to="/identify" className="block px-6 py-4 rounded bg-green-500 text-white font-semibold hover:bg-green-600">Pest Identification</Link>
        <Link to="/admin" className="block px-6 py-4 rounded bg-gray-500 text-white font-semibold hover:bg-gray-600">Admin</Link>
      </div>
    </div>
  );
}
