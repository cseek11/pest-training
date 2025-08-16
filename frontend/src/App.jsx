import React, { useEffect, useState, useMemo, useRef } from 'react';
import { fetchFlashcards, fetchQuizBank } from './api';
import { MotionConfig, motion } from 'framer-motion';
import {
  Search,
  BookOpen,
  GraduationCap,
  Link as LinkIcon,
  ListChecks,
  Trophy,
  Bug,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import PestIdentificationPage from './pages/PestIdentificationPage';

// -------------------- Constants & Utils --------------------
const FALLBACK_FLASHCARDS = [];
const FALLBACK_QUIZ = [];

function pickByLevel(items, level) {
  if (!Array.isArray(items)) return [];
  return level === 'beginner'
    ? items.filter(i => i.level !== 'advanced')
    : items.filter(i => i.level === 'advanced');
}

// -------------------- UI Components --------------------
function Tag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">
      {children}
    </span>
  );
}

function SectionCard({ icon: Icon, title, children, right }) {
  return (
    <div className="rounded-2xl border shadow-sm bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5" aria-hidden />}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {right && <div>{right}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function SearchBox({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-white">
      <Search className="w-5 h-5" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search flashcards…"
        className="w-full outline-none"
      />
    </div>
  );
}

function Flashcard({ item }) {
  const [flip, setFlip] = useState(false);

  return (
    <div
      className="cursor-pointer"
      onClick={() => setFlip(f => !f)}
      aria-pressed={flip}
    >
      <motion.div
        className="rounded-2xl border p-4 bg-white shadow-sm min-h-[120px] flex items-center justify-center text-center relative"
        initial={false}
        animate={{ rotateY: flip ? 180 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div style={{ backfaceVisibility: 'hidden' }} className="text-base">
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categorySlug" element={<CategoryPage />} />
        <Route path="/identify" element={<PestIdentificationPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
    return <p className="text-sm text-gray-600">No questions at this level.</p>;
  }

  const q = questions[i];
  const pct = Math.round((score / questions.length) * 100);
  const pass = pct >= 70;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="rounded-2xl border p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">{title}</h4>
        <Tag>{level === 'beginner' ? 'Beginner' : 'Advanced'}</Tag>
      </div>

      {timed && (
        <div className="text-sm text-gray-600">
          Time left: {minutes}:{String(seconds).padStart(2, '0')}
        </div>
      )}

      {!done ? (
        <div>
          <div className="text-sm text-gray-600">
            Question {i + 1} of {questions.length}
          </div>
          <p className="mt-2 font-medium">{q.q}</p>
          <div className="mt-3 grid gap-2">
            {q.choices.map((c, idx) => {
              const correct = sel !== null && idx === q.answer;
              const wrong = sel !== null && idx === sel && idx !== q.answer;
              return (
                <button
                  key={idx}
                  onClick={() => choose(idx)}
                  className={`text-left px-3 py-2 rounded-xl border hover:bg-gray-50 ${
                    correct ? 'bg-green-50 border-green-300' : ''
                  } ${wrong ? 'bg-red-50 border-red-300' : ''}`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-3xl font-bold flex items-center justify-center gap-2">
            {pass ? (
              <Trophy className="w-8 h-8" />
            ) : (
              <XCircle className="w-8 h-8" />
            )}
            {pct}%
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Score: {score} / {questions.length} —{' '}
            {pass ? 'Pass' : 'Keep practicing'} (70% threshold)
          </p>
          <div className="mt-3">
            <button onClick={reset} className="px-3 py-2 rounded-xl border">
              Retake
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------- Main App --------------------
export default function App() {
  const [flashcards, setFlashcards] = useState(FALLBACK_FLASHCARDS);
  const [quizBank, setQuizBank] = useState(FALLBACK_QUIZ);
  const [level, setLevel] = useState('beginner');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);

  // Fetch flashcards and quiz bank from Supabase
  const fetchAndSetContent = async () => {
    try {
      setLoading(true);
      const [flashcardData, quizData] = await Promise.all([
        fetchFlashcards(),
        fetchQuizBank()
      ]);
      setFlashcards(Array.isArray(flashcardData) ? flashcardData : FALLBACK_FLASHCARDS);
      setQuizBank(Array.isArray(quizData) ? quizData : FALLBACK_QUIZ);
      setSupabaseConfigured(true);
    } catch (error) {
      console.error('Error fetching content:', error);
      setFlashcards(FALLBACK_FLASHCARDS);
      setQuizBank(FALLBACK_QUIZ);
      setSupabaseConfigured(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetContent();
  }, []);

  const filteredFlash = useMemo(() => {
    try {
      const base = pickByLevel(flashcards, level);
      if (!q) return base;
      const needle = q.toLowerCase();
      return base.filter(t =>
        ((t.term || t.title || '') + ' ' + (t.def || t.description || ''))
          .toLowerCase()
          .includes(needle)
      );
    } catch (error) {
      console.error('Error filtering flashcards:', error);
      return [];
    }
  }, [flashcards, level, q]);

  // Get 3 random flashcards
  const displayedFlashcards = useMemo(() => {
    if (filteredFlash.length === 0) return [];
    const shuffled = [...filteredFlash].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [filteredFlash]);

  return (
    <MotionConfig>
      <div
        className="min-h-screen"
        style={{ background: 'linear-gradient(to bottom,#f8fafc,#ffffff)' }}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
            <Bug className="w-6 h-6" />
            <h1 className="text-xl font-bold">
              Pest Control Training — PA & National
            </h1>
            <div className="ml-auto flex items-center gap-2">
              {/* Level toggle */}
              <div className="inline-flex items-center gap-2 rounded-xl border px-2 py-1 bg-white">
                <label className="text-sm">
                  <input
                    type="radio"
                    name="lvl"
                    checked={level === 'beginner'}
                    onChange={() => setLevel('beginner')}
                  />{' '}
                  Beginner
                </label>
                <label className="text-sm ml-2">
                  <input
                    type="radio"
                    name="lvl"
                    checked={level === 'advanced'}
                    onChange={() => setLevel('advanced')}
                  />{' '}
                  Advanced
                </label>
              </div>
              {/* Search */}
              <div style={{ width: '16rem' }}>
                <SearchBox value={q} onChange={setQ} />
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-6xl mx-auto p-4 grid gap-6">
          {/* Flashcards */}
          <SectionCard icon={BookOpen} title="Flashcards">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                Showing 3 random cards • {filteredFlash.length} total available
              </div>
              <button
                className="px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                onClick={fetchAndSetContent}
                disabled={loading}
                aria-label="Reload content"
              >
                {loading ? 'Loading…' : 'Reload'}
              </button>
            </div>
            {loading ? (
              <p className="text-sm text-gray-600">Loading flashcards…</p>
            ) : supabaseConfigured ? (
              filteredFlash.length === 0 ? (
                <p className="text-sm text-gray-600">No flashcards available for this level and search.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayedFlashcards.map(f => (
                    <Flashcard key={f.id || f.term || f.title} item={f} />
                  ))}
                </div>
              )
            ) : (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                Supabase not configured. Please check your environment variables.
              </div>
            )}
          </SectionCard>

          {/* Core Exam Quiz */}
          <SectionCard icon={GraduationCap} title="Core Exam Quiz">
            <ModuleQuiz
              title="Core Exam"
              bank={quizBank}
              level={level}
              timed={true}
              durationMinutes={10}
            />
          </SectionCard>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 py-6">
            <p>
              © {new Date().getFullYear()} Pest Control Training — PA & National. Educational use only.
            </p>
          </div>

        </main>
      </div>
    </MotionConfig>
  );
}
