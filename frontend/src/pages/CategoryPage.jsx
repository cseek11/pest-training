import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  ListChecks, 
  Camera, 
  ArrowLeft,
  Clock,
  Trophy,
  Search,
  Bug
} from 'lucide-react';
import { getCategoryBySlug, DIFFICULTY_LEVELS } from '../data/categories';
import { fetchFlashcards, fetchQuizBank } from '../api';
import Flashcard from '../components/Flashcard';
import Quiz from '../components/Quiz';
import FinalExam from '../components/FinalExam';
import Timer from '../components/Timer';
import PestIdentification from '../components/PestIdentification';

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [quizBank, setQuizBank] = useState([]);
  const [level, setLevel] = useState('beginner');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timerDuration, setTimerDuration] = useState(0);
  const [timerTitle, setTimerTitle] = useState('');

  const category = getCategoryBySlug(categorySlug);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [flashcardData, quizData] = await Promise.all([
          fetchFlashcards(),
          fetchQuizBank()
        ]);
        
        // Filter by category
        const categoryFlashcards = (flashcardData || []).filter(f => 
          f.category === category?.name || f.category === category?.id
        );
        const categoryQuizzes = (quizData || []).filter(q => 
          q.category === category?.name || q.category === category?.id
        );
        
        setFlashcards(categoryFlashcards);
        setQuizBank(categoryQuizzes);
      } catch (error) {
        console.error('Error loading category data:', error);
        setError('Failed to load data. Please check your connection.');
        setFlashcards([]);
        setQuizBank([]);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      loadData();
    }
  }, [category]);

  // Filter flashcards by level and search
  const filteredFlashcards = useMemo(() => {
    try {
      let filtered = (flashcards || []).filter(f => f.level === level);
      
      if (searchTerm) {
        const needle = searchTerm.toLowerCase();
        filtered = filtered.filter(f =>
          ((f.term || f.title || '') + ' ' + (f.def || f.description || ''))
            .toLowerCase()
            .includes(needle)
        );
      }
      
      return filtered;
    } catch (error) {
      console.error('Error filtering flashcards:', error);
      return [];
    }
  }, [flashcards, level, searchTerm]);

  // Get 3 random flashcards for display
  const displayedFlashcards = useMemo(() => {
    try {
      if (filteredFlashcards.length === 0) return [];
      const shuffled = [...filteredFlashcards].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 3);
    } catch (error) {
      console.error('Error getting displayed flashcards:', error);
      return [];
    }
  }, [filteredFlashcards]);

  // Filter quizzes by level
  const levelQuizzes = useMemo(() => {
    try {
      return (quizBank || []).filter(q => q.level === level);
    } catch (error) {
      console.error('Error filtering quizzes:', error);
      return [];
    }
  }, [quizBank, level]);

  const startQuiz = () => {
    setTimerDuration(15 * 60); // 15 minutes
    setTimerTitle('Quiz Timer');
    setShowTimer(true);
    setShowQuiz(true);
  };

  const startTest = () => {
    setTimerDuration(30 * 60); // 30 minutes
    setTimerTitle('Final Test Timer');
    setShowTimer(true);
    setShowTest(true);
  };

  const handleTimeUp = () => {
    setShowTimer(false);
    // Auto-submit quiz/test
    if (showQuiz) {
      // Handle quiz submission
    }
    if (showTest) {
      // Handle test submission
    }
  };

  const closeTimer = () => {
    setShowTimer(false);
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Category Not Found</h1>
          <Link to="/" className="text-blue-500 hover:underline">
            Return to Home
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Data</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/" className="text-blue-500 hover:underline">
            Return to Home
          </Link>
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
              <ArrowLeft className="w-5 h-5" />
              Back to Categories
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
        {/* Level Selector */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-lg font-semibold">Difficulty Level:</h2>
            <div className="flex gap-2">
              {DIFFICULTY_LEVELS.map((difficulty) => (
                <button
                  key={difficulty.id}
                  onClick={() => setLevel(difficulty.id)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    level === difficulty.id
                      ? difficulty.id === 'beginner' 
                        ? 'bg-green-500 text-white border-green-500'
                        : difficulty.id === 'intermediate'
                        ? 'bg-yellow-500 text-white border-yellow-500'
                        : 'bg-red-500 text-white border-red-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {difficulty.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search flashcards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid gap-6">
          {/* Flashcards Section */}
          <div
            className="bg-white rounded-2xl border shadow-sm"
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                  <h3 className="text-xl font-semibold">Flashcards</h3>
                </div>
                <div className="text-sm text-gray-600">
                  {filteredFlashcards.length} available • Showing 3 random
                </div>
              </div>
            </div>
            <div className="p-6">
              {displayedFlashcards.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No flashcards available for {level} level.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayedFlashcards.map((flashcard, index) => (
                    <Flashcard key={flashcard.id || index} item={flashcard} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quiz and Test Section */}
          <div
            className="bg-white rounded-2xl border shadow-sm"
          >
            <div className="p-6 border-b">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-semibold">Practice & Assessment</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Quiz */}
                <div className="border rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ListChecks className="w-5 h-5 text-blue-500" />
                    <h4 className="font-semibold">Practice Quiz</h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Test your knowledge with a timed quiz. 15 minutes, multiple choice questions.
                  </p>
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>15 minutes</span>
                    <span>•</span>
                    <span>{levelQuizzes.length} questions available</span>
                  </div>
                  <button
                    onClick={startQuiz}
                    disabled={levelQuizzes.length === 0}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Start Quiz
                  </button>
                </div>

                {/* Final Test */}
                <div className="border rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <h4 className="font-semibold">Final Test</h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Comprehensive assessment. 30 minutes, pass/fail evaluation.
                  </p>
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>30 minutes</span>
                    <span>•</span>
                    <span>Comprehensive</span>
                  </div>
                  <button
                    onClick={startTest}
                    disabled={levelQuizzes.length === 0}
                    className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Start Test
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pest Identification Section */}
          <div
            className="bg-white rounded-2xl border shadow-sm"
          >
            <div className="p-6 border-b">
              <div className="flex items-center gap-2">
                <Camera className="w-6 h-6 text-purple-500" />
                <h3 className="text-xl font-semibold">Pest Identification</h3>
              </div>
            </div>
            <div className="p-6">
              <PestIdentification 
                pests={[]} // TODO: Add pest data from API
                category={category.name}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timer Modal */}
      <Timer
        duration={timerDuration}
        onTimeUp={handleTimeUp}
        isVisible={showTimer}
        onClose={closeTimer}
        title={timerTitle}
      />

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <Quiz 
              questions={levelQuizzes.slice(0, 10)} // First 10 questions
              onComplete={(score) => {
                setShowQuiz(false);
                // Handle quiz completion
              }}
            />
          </div>
        </div>
      )}

      {/* Test Modal */}
      {showTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <FinalExam 
              questions={levelQuizzes} // All questions for final test
              onComplete={(score) => {
                setShowTest(false);
                // Handle test completion
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
