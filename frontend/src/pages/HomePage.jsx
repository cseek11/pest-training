import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen, GraduationCap, Camera, Bug } from 'lucide-react';
import { CERTIFICATION_CATEGORIES } from '../data/categories';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = CERTIFICATION_CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bug className="w-8 h-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                Pest Control Training
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive training for Private Applicator Certification across all categories. 
              Study flashcards, take practice quizzes, and master pest identification.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search certification categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border p-6 text-center"
          >
            <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              {CERTIFICATION_CATEGORIES.length}
            </h3>
            <p className="text-gray-600">Certification Categories</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border p-6 text-center"
          >
            <GraduationCap className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-800 mb-1">3</h3>
            <p className="text-gray-600">Difficulty Levels</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border p-6 text-center"
          >
            <Camera className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-800 mb-1">100+</h3>
            <p className="text-gray-600">Pest Images</p>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Certification Categories
          </h2>
          
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No categories found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
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
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            Flashcards
                          </span>
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            Quiz & Test
                          </span>
                          <span className="flex items-center gap-1">
                            <Camera className="w-4 h-4" />
                            ID Training
                          </span>
                        </div>
                        <div className="text-green-500 group-hover:translate-x-1 transition-transform">
                          →
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Training Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Interactive Flashcards</h3>
              <p className="text-sm text-gray-600">
                Study key concepts with flipable flashcards for each category
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Timed Assessments</h3>
              <p className="text-sm text-gray-600">
                Practice quizzes and comprehensive final tests with timers
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Camera className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Pest Identification</h3>
              <p className="text-sm text-gray-600">
                Visual training with pest images and identification guides
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Bug className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Multiple Levels</h3>
              <p className="text-sm text-gray-600">
                Beginner, intermediate, and advanced difficulty levels
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
