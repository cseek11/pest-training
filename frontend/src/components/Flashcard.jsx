import { useState } from 'react'

export default function flashcards({ card }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div onClick={()=>setFlipped(!flipped)} className="cursor-pointer rounded-2xl border bg-white p-4 shadow-sm min-h-[160px] flex flex-col items-center text-center">
      {card.image_url && <img src={card.image_url} alt={card.term} className="h-28 object-contain mb-3" />}
      {!flipped ? (
        <div>
          <div className="font-semibold">{card.term}</div>
          {card.level && <div className="text-xs text-gray-500 mt-1 capitalize">{card.level}</div>}
        </div>
      ) : (
        <div className="text-sm text-gray-700 whitespace-pre-wrap">{card.definition}</div>
      )}
    </div>
  )
}
