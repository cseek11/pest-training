import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <MotionConfig>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:categorySlug" element={<CategoryPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </Router>
    </MotionConfig>
  );
}
