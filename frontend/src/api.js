import { supabase } from './lib/supabaseClient';

// Debug environment variables
console.log('VITE_SUPABASE_URL status:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_KEY status:', !!import.meta.env.VITE_SUPABASE_KEY);

// Fetch all flashcards and map definition to def for frontend compatibility
export async function fetchFlashcards() {
  try {
    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_KEY) {
      console.warn('Supabase not configured - returning empty array');
      return [];
    }

    if (!supabase) {
      console.warn('Supabase client not initialized - returning empty array');
      return [];
    }

    console.log('Attempting to fetch flashcards from Supabase...');
    const { data, error } = await supabase.from('flashcards').select('*');
    if (error) {
      console.error('Supabase error fetching flashcards:', error);
      return [];
    }

    console.log('Flashcards fetched successfully:', data?.length || 0, 'items');
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
    return [];
  }
}

// Fetch quiz questions
export async function fetchQuizBank() {
  try {
    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_KEY) {
      console.warn('Supabase not configured - returning empty array');
      return [];
    }

    if (!supabase) {
      console.warn('Supabase client not initialized - returning empty array');
      return [];
    }

    console.log('Attempting to fetch quiz questions from Supabase...');
    const { data, error } = await supabase.from('quizzes').select('*');
    if (error) {
      console.error('Supabase error fetching quiz questions:', error);
      return [];
    }

    console.log('Quiz questions fetched successfully:', data?.length || 0, 'items');
    return data || [];
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return [];
  }
}