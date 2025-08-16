import { useMemo, useState } from 'react'

export default function Quiz({ title='Quiz', questions=[] }) {
  const shuffled = useMemo(()=>questions.slice(),[questions])
  const [i,setI] = useState(0)
  const [sel,setSel] = useState(null)
  const [score,setScore] = useState(0)
  const [done,setDone] = useState(false)

  const q = shuffled[i]

  function choose(idx){
    if(sel!==null) return
    setSel(idx)
    if(q.correct_option && q.correct_option.toUpperCase().charCodeAt(0)-65 === idx) setScore(s=>s+1)
    setTimeout(()=>{
      if(i+1<shuffled.length){ setI(i+1); setSel(null) } else { setDone(true) }
    }, 600)
  }

  if(!questions.length) return <p className="text-sm text-gray-600">No questions.</p>

  const pct = Math.round((score / questions.length) * 100)
  const pass = pct >= 70

  return (
    <div className="rounded-2xl border p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-xs text-gray-500">{i+1} / {questions.length}</span>
      </div>
      {!done ? (
        <div>
          <p className="font-medium">{q.question}</p>
          <div className="mt-3 grid gap-2">
            {[q.option_a,q.option_b,q.option_c,q.option_d].map((opt,idx)=>{
              const correct = sel!==null && (q.correct_option?.toUpperCase().charCodeAt(0)-65===idx)
              const wrong = sel!==null && idx===sel && !correct
              return (
                <button key={idx} onClick={()=>choose(idx)} className={"text-left px-3 py-2 rounded-xl border hover:bg-gray-50 " + (correct?'bg-green-50 border-green-300':'') + (wrong?' bg-red-50 border-red-300':'')}>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-3xl font-bold">{pct}%</div>
          <p className="text-sm text-gray-600">Score: {score} / {questions.length} — {pass?'Pass':'Try again'} (70%)</p>
          <button className="mt-3 px-3 py-2 rounded-xl border shadow-sm hover:bg-gray-50" onClick={()=>{setI(0);setSel(null);setScore(0);setDone(false)}}>Retake</button>
        </div>
      )}
    </div>
  )
}
