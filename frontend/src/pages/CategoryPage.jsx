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

  // Filter flashcards by level and search term
  const filteredFlashcards = useMemo(() => {
    if (!flashcards || !Array.isArray(flashcards)) return [];
    
    return flashcards.filter(card => {
      const matchesLevel = !level || card.level === level;
      const matchesSearch = !searchTerm || 
        (card.term && card.term.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (card.definition && card.definition.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesLevel && matchesSearch;
    });
  }, [flashcards, level, searchTerm]);

  // Filter quiz questions by level and search term
  const filteredQuizQuestions = useMemo(() => {
    if (!quizBank || !Array.isArray(quizBank)) return [];
    
    return quizBank.filter(question => {
      const matchesLevel = !level || question.level === level;
      const matchesSearch = !searchTerm || 
        (question.question && question.question.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesLevel && matchesSearch;
    });
  }, [quizBank, level, searchTerm]);

  // Filter test questions by search term (all levels)
  const filteredTestQuestions = useMemo(() => {
    if (!quizBank || !Array.isArray(quizBank)) return [];
    
    return quizBank.filter(question => {
      const matchesSearch = !searchTerm || 
        (question.question && question.question.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [quizBank, searchTerm]);

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
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Flashcards
                  </h2>
                </div>
                <div className="text-sm text-gray-500">
                  {filteredFlashcards.length} cards
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading flashcards...</p>
                </div>
              ) : displayedFlashcards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {displayedFlashcards.map((card, index) => (
                    <div key={card.id || index}>
                      <Flashcard card={card} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    No flashcards found for this category and level.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quiz and Test Section */}
          <div
            className="bg-white rounded-2xl border shadow-sm"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-green-500" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Assessments
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quiz */}
                <div className="border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">Practice Quiz</h3>
                    <span className="text-sm text-gray-500">
                      {filteredQuizQuestions.length} questions
                    </span>
                  </div>
                  
                  {filteredQuizQuestions.length > 0 ? (
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setShowQuiz(true);
                          setShowTimer(true);
                          setTimerDuration(300); // 5 minutes
                          setTimerTitle("Quiz Timer");
                        }}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Start Quiz (5 min)
                      </button>
                      <p className="text-xs text-gray-600">
                        Timed quiz with {filteredQuizQuestions.length} questions
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No quiz questions available.</p>
                  )}
                </div>

                {/* Final Test */}
                <div className="border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">Final Test</h3>
                    <span className="text-sm text-gray-500">
                      {filteredTestQuestions.length} questions
                    </span>
                  </div>
                  
                  {filteredTestQuestions.length > 0 ? (
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setShowTest(true);
                          setShowTimer(true);
                          setTimerDuration(1800); // 30 minutes
                          setTimerTitle("Final Test Timer");
                        }}
                        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Start Final Test (30 min)
                      </button>
                      <p className="text-xs text-gray-600">
                        Comprehensive test with {filteredTestQuestions.length} questions
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No test questions available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pest Identification Section */}
          <div
            className="bg-white rounded-2xl border shadow-sm"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Camera className="w-6 h-6 text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Pest Identification Training
                </h2>
              </div>
              
              <PestIdentification 
                category={category.name}
                level={level}
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

