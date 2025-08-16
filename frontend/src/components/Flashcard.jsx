import { useState } from 'react'

export default function Flashcard({ card, item }) {
  const [flipped, setFlipped] = useState(false)
  
  // Handle both 'card' and 'item' props for compatibility
  const flashcardData = card || item || {}
  
  return (
    <div 
      onClick={() => setFlipped(!flipped)} 
      className="cursor-pointer rounded-2xl border bg-white p-4 shadow-sm min-h-[160px] flex flex-col items-center text-center"
    >
      {flashcardData.image_url && (
        <img 
          src={flashcardData.image_url} 
          alt={flashcardData.term || flashcardData.title} 
          className="h-28 object-contain mb-3" 
        />
      )}
      {!flipped ? (
        <div>
          <div className="font-semibold">
            {flashcardData.term || flashcardData.title}
          </div>
          {flashcardData.level && (
            <div className="text-xs text-gray-500 mt-1 capitalize">
              {flashcardData.level}
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-700 whitespace-pre-wrap">
          {flashcardData.definition || flashcardData.def || flashcardData.description}
        </div>
      )}
    </div>
  )
}
