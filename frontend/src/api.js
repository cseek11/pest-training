import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch all flashcards and map definition to def for frontend compatibility
export async function fetchFlashcards() {
  try {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase not configured - missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY environment variables');
    }

    const { data, error } = await supabase.from('flashcards').select('*');
    if (error) throw error;
    return (data || []).map(f => ({
      ...f,
      def: f.definition, // map definition to def
      image_url: f.image_url,
      level: f.level,
      term: f.term,
      id: f.id,
      category: f.category,
      source_main: f.source_main,
      source_external: f.source_external,
      jurisdiction_tag: f.jurisdiction_tag,
    }));
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    throw error;
  }
}

// Fetch quiz questions from Supabase (table: quizzes) and transform to frontend format
export async function fetchQuizBank() {
  try {
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase not configured - missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY environment variables');
    }

    const { data, error } = await supabase.from('quizzes').select('*');
    if (error) throw error;
    return (data || []).map(q => {
      const choices = [q.option_a, q.option_b, q.option_c, q.option_d];
      const answerIdx = choices.findIndex(opt => opt === q.correct_option);
      return {
        q: q.question,
        choices,
        answer: answerIdx >= 0 ? answerIdx : 0,
        level: q.level,
        id: q.id,
      };
    });
  } catch (error) {
    console.error('Error fetching quiz bank:', error);
    throw error;
  }
}