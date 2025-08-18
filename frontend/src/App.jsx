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
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import { supabase } from './lib/supabaseClient';
import { Navigate, useLocation } from 'react-router-dom';

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
          <span className="font-semibold">{item.term || item.title}</span>
          {item.level === 'advanced' && (
            <span className="ml-2 text-xs text-purple-600">Advanced</span>
          )}
        </div>
        {/* Back */}
        <div
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          className="absolute px-2 text-sm text-gray-700"
        >
          <p className="font-medium">{item.def || item.description}</p>
          {item.tips?.length ? (
            <ul className="mt-2 list-disc list-inside text-gray-600">
              {item.tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

// -------------------- Auth Guard --------------------
function ProtectedRoute({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    }
    load();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session);
    });
    return () => {
      mounted = false;
      listener.subscription?.unsubscribe?.();
    };
  }, []);

  if (loading) return <div className="p-6">Checking authentication…</div>;
  if (!session) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

// -------------------- Admin Guard --------------------
function AdminRoute({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!mounted) return;
      const sess = sessionData.session;
      setSession(sess);

      if (!sess) {
        setLoading(false);
        return;
      }
      const user = sess.user;
      const configured = (import.meta.env.VITE_ADMIN_EMAILS || '')
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);
      const defaults = ['admin@veropestsolutions.com'];
      const adminEmails = Array.from(new Set([...configured, ...defaults]));
      const userRole = user?.app_metadata?.role || user?.user_metadata?.role;
      const email = (user?.email || '').toLowerCase();
      const isAdmin = userRole === 'admin' || (email && adminEmails.includes(email));
      setAllowed(!!isAdmin);
      setLoading(false);
    }
    load();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      const user = session?.user;
      if (!user) {
        setAllowed(false);
        return;
      }
      const configured = (import.meta.env.VITE_ADMIN_EMAILS || '')
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);
      const defaults = ['admin@veropestsolutions.com'];
      const adminEmails = Array.from(new Set([...configured, ...defaults]));
      const userRole = user?.app_metadata?.role || user?.user_metadata?.role;
      const email = (user?.email || '').toLowerCase();
      const isAdmin = userRole === 'admin' || (email && adminEmails.includes(email));
      setAllowed(!!isAdmin);
    });
    return () => listener.subscription?.unsubscribe?.();
  }, []);

  if (loading) return <div className="p-6">Checking authentication…</div>;
  if (!session) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (!allowed) return <Navigate to="/admin-login" state={{ from: location.pathname, reason: 'NOT_ADMIN' }} replace />;
  return children;
}

// -------------------- Main App --------------------
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/category/:categorySlug" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
        <Route path="/identify" element={<ProtectedRoute><PestIdentificationPage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}
