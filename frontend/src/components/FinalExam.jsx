import { useEffect, useMemo, useState } from 'react'

export default function FinalExam({ questions = [], minutes = 60 }) {
  // Ensure questions is always an array and has valid structure
  const validQuestions = useMemo(() => {
    if (!Array.isArray(questions)) return [];
    return questions.filter(q => 
      q && 
      typeof q === 'object' && 
      q.question && 
      q.option_a && 
      q.option_b && 
      q.option_c && 
      q.option_d
    );
  }, [questions]);

  // randomize
  const shuffled = useMemo(() => validQuestions.slice().sort(() => Math.random() - 0.5), [validQuestions]);
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const [i, setI] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setTimeLeft(s => {
      if (s <= 1) {
        clearInterval(t);
        setDone(true);
        return 0;
      }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [done]);

  // Safety check for current question
  const q = shuffled[i] || {};

  function choose(idx) {
    if (sel !== null || !q.question) return;
    setSel(idx);
    if (q.correct_option && q.correct_option.toUpperCase().charCodeAt(0) - 65 === idx) {
      setScore(s => s + 1);
    }
  }

  function next() {
    if (i + 1 < shuffled.length) {
      setI(i + 1);
      setSel(null);
    } else {
      setDone(true);
    }
  }

  const pct = Math.round((score / shuffled.length) * 100);
  const pass = pct >= 70;
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');

  if (!validQuestions.length) {
    return (
      <div className="rounded-2xl border p-4 bg-white shadow-sm">
        <div className="text-center py-8">
          <p className="text-sm text-gray-600">No valid final questions available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Advanced Final (Timed)</h3>
        <span className={"font-mono " + (timeLeft < 300 ? 'text-red-600' : '')}>{mm}:{ss}</span>
      </div>
      {!done ? (
        <div>
          <div className="text-sm text-gray-600 mb-1">Question {i + 1} of {shuffled.length}</div>
          <p className="font-medium">{q.question || 'Question not available'}</p>
          <div className="mt-3 grid gap-2">
            {[q.option_a, q.option_b, q.option_c, q.option_d].map((opt, idx) => {
              const correct = sel !== null && (q.correct_option?.toUpperCase().charCodeAt(0) - 65 === idx);
              const wrong = sel !== null && idx === sel && !correct;
              return (
                <button 
                  key={idx} 
                  onClick={() => choose(idx)} 
                  className={"text-left px-3 py-2 rounded-xl border hover:bg-gray-50 " + 
                    (correct ? 'bg-green-50 border-green-300' : '') + 
                    (wrong ? ' bg-red-50 border-red-300' : '')}
                >
                  {opt || `Option ${String.fromCharCode(65 + idx)}`}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex justify-end">
            <button 
              onClick={next} 
              className="px-3 py-2 rounded-xl border shadow-sm hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-3xl font-bold">{pct}%</div>
          <p className="text-sm text-gray-600">
            Score: {score} / {shuffled.length} — {pass ? 'Pass' : 'Try again'} (70%)
          </p>
        </div>
      )}
    </div>
  );
}
