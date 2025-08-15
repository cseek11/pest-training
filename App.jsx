import React, { useEffect, useMemo, useRef, useState } from 'react';
import { fetchContent } from './api';
import { MotionConfig, motion } from 'framer-motion';
import { Search, BookOpen, GraduationCap, Link as LinkIcon, ListChecks, Trophy, Bug, XCircle } from 'lucide-react';

const FALLBACK = { core_exam: [], categories: {}, flashcards: [], links: { national: [], pennsylvania: [] } };
function pickByLevel(items, level) { if (!Array.isArray(items)) return []; return items.filter((i)=> (level==='beginner'? i.level!=='advanced': true)); }
function Tag({children}){ return (<span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">{children}</span>); }
function SectionCard({ icon: Icon, title, children, right }){ return (<div className="rounded-2xl border shadow-sm bg-white"><div className="flex items-center justify-between p-4 border-b"><div className="flex items-center gap-2">{Icon && <Icon className="w-5 h-5" aria-hidden/><h3 className="text-lg font-semibold">{title}</h3></div><div>{right}</div></div><div className="p-4">{children}</div></div>); }
function SearchBox({ value, onChange }){ return (<div className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-white"><Search className="w-5 h-5"/><input value={value} onChange={(e)=>onChange(e.target.value)} placeholder="Search flashcards…" className="w-full outline-none"/></div>); }
function Flashcard({ item }){ const [flip,setFlip]=useState(false); return (<div className="cursor-pointer" onClick={()=>setFlip(!flip)}><motion.div className="rounded-2xl border p-4 bg-white shadow-sm min-h-[120px] flex items-center justify-center text-center relative" initial={false} animate={{rotateY: flip?180:0}} transition={{duration:0.4}} style={{transformStyle:'preserve-3d'}}><div style={{backfaceVisibility:'hidden'}} className="text-base"><span className="font-semibold">{item.term||item.title}</span>{item.level==='advanced' && <span className="ml-2 text-xs text-purple-600">Advanced</span>}</div><div style={{backfaceVisibility:'hidden', transform:'rotateY(180deg)'}} className="absolute px-2 text-sm text-gray-700"><p className="font-medium">{item.def||item.description}</p>{item.tips?.length? <ul className="mt-2 list-disc list-inside text-gray-600">{item.tips.map((t,i)=>(<li key={i}>{t}</li>))}</ul>:null}</div></motion.div></div>); }
function LinkList({ items }){ return (<ul className="space-y-2">{items.map((l,i)=>(<li key={i}><a className="inline-flex items-center gap-2 underline" href={l.link} target="_blank" rel="noreferrer"><LinkIcon className="w-4 h-4"/><span className="font-medium">{l.title}</span></a>{l.desc && <p className="text-sm text-gray-600 ml-6">{l.desc}</p>}</li>))}</ul>); }
function ModuleQuiz({ title, bank, level, timed=false, durationMinutes=0 }) {
  const questions = useMemo(() => pickByLevel(bank || [], level), [bank, level]);
  const [i, setI] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timed && durationMinutes > 0 && !done) {
      setTimeLeft(durationMinutes * 60);
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setDone(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [timed, durationMinutes, done]);

  function choose(idx) {
    if (sel !== null) return;
    setSel(idx);
    if (idx === questions[i].answer) setScore(s => s + 1);
    setTimeout(() => {
      if (i + 1 < questions.length) {
        setI(i + 1);
        setSel(null);
      } else {
        setDone(true);
      }
    }, 700);
  }

  function reset() {
    setI(0);
    setSel(null);
    setScore(0);
    setDone(false);
    if (timed && durationMinutes > 0) {
      setTimeLeft(durationMinutes * 60);
    }
  }

  if (!questions.length) return <p className="text-sm text-gray-600">No questions at this level.</p>;
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
              const btnClasses = [
                "text-left px-3 py-2 rounded-xl border",
                "hover:bg-gray-50",
                correct ? "bg-green-50 border-green-300" : "",
                wrong ? "bg-red-50 border-red-300" : ""
              ].filter(Boolean).join(" ");
              return (
                <button
                  key={idx}
                  onClick={() => choose(idx)}
                  className={btnClasses}
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
            {pass ? <Trophy className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            {pct}%
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Score: {score} / {questions.length} — {pass ? 'Pass' : 'Keep practicing'} (70% threshold)
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

export default function App() {
  const [content, setContent] = useState(FALLBACK);
  const [level, setLevel] = useState('beginner');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await fetchContent();
      if (data) setContent(data);
      setLoading(false);
    })();
  }, []);

  const filteredFlash = useMemo(() => {
    const base = pickByLevel(content.flashcards || [], level);
    if (!q) return base;
    const needle = q.toLowerCase();
    return base.filter((t) =>
      ((t.term || t.title || '') + ' ' + (t.def || t.description || '')).toLowerCase().includes(needle)
    );
  }, [content, level, q]);

  const finalAdv50 = useMemo(() => {
    const pool = (content.core_exam || []).filter(x => x.level === 'advanced');
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 50);
  }, [content]);

  return (
    <MotionConfig>
      <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom,#f8fafc,#ffffff)' }}>
        <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
            <Bug className="w-6 h-6" />
            <h1 className="text-xl font-bold">Pest Control Training — PA & National</h1>
            <div className="ml-auto flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-xl border px-2 py-1 bg-white">
                <label className="text-sm">
                  <input type="radio" name="lvl" checked={level === 'beginner'} onChange={() => setLevel('beginner')} /> Beginner
                </label>
                <label className="text-sm ml-2">
                  <input type="radio" name="lvl" checked={level === 'advanced'} onChange={() => setLevel('advanced')} /> Advanced
                </label>
              </div>
              <div style={{ width: '16rem' }}>
                <SearchBox value={q} onChange={setQ} />
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto p-4 grid gap-6">
          <SectionCard icon={BookOpen} title="Flashcards">
            {loading ? (
              <p className="text-sm text-gray-600">Loading content…</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(filteredFlash || []).map((f, i) => (
                  <Flashcard key={i} item={f} />
                ))}
              </div>
            )}
          </SectionCard>
          <SectionCard icon={GraduationCap} title="Module Quizzes">
            <div className="grid md:grid-cols-2 gap-6">
              <ModuleQuiz title="Core Practice" bank={content.core_exam || []} level={level} />
              <ModuleQuiz title="PA: Household & Health" bank={content.categories?.household_health || []} level={level} />
              <ModuleQuiz title="PA: Wood-destroying" bank={content.categories?.wood_destroying || []} level={level} />
              <ModuleQuiz title="PA: Fumigation" bank={content.categories?.fumigation || []} level={level} />
            </div>
          </SectionCard>
          <SectionCard icon={Trophy} title="Advanced Final — 60-minute timed (50 Q)">
            <p className="text-sm text-gray-600 mb-3">
              Randomized 50-question exam; 60 minutes; auto-submit on timeout.
            </p>
            <ModuleQuiz title="Advanced Final (50)" bank={finalAdv50} level="advanced" timed={true} durationMinutes={60} />
          </SectionCard>
          <SectionCard icon={ListChecks} title="Laws & Regulations — National">
            <LinkList items={content.links?.national || []} />
          </SectionCard>
          <SectionCard icon={ListChecks} title="Laws & Regulations — Pennsylvania">
            <LinkList items={content.links?.pennsylvania || []} />
          </SectionCard>
          <div className="text-center text-xs text-gray-500 py-6">
            <p>© {new Date().getFullYear()} Pest Control Training — PA & National. Educational use only.</p>
          </div>
        </main>
      </div>
    </MotionConfig>
  );
}