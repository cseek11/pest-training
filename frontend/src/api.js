import { supabase } from './lib/supabaseClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Debug logging
console.log('Environment variables check:');
console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Not set');
console.log('VITE_SUPABASE_KEY:', supabaseKey ? 'Set' : 'Not set');

// Fetch flashcards with optional filters
export async function fetchFlashcards({ category, level, imageOnly } = {}) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase not configured - missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY environment variables');
    }
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    let query = supabase.from('flashcards').select('*');
    if (category) query = query.eq('category', category);
    if (level) query = query.eq('level', level);
    if (imageOnly) query = query.not('image_url', 'is', null);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(f => ({
      ...f,
      def: f.definition,
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
export async function fetchQuizBank({ category, level } = {}) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase not configured - missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY environment variables');
    }
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    let query = supabase.from('quizzes').select('*');
    if (category) query = query.eq('category', category);
    if (level) query = query.eq('level', level);
    const { data, error } = await query;
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