import { supabase } from './lib/supabaseClient';
import { CATEGORIES, PA_CERT_CATEGORIES } from './categories';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Debug logging (dev-only)
if (import.meta.env?.DEV) {
  console.log('Environment variables check:');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Not set');
  console.log('VITE_SUPABASE_KEY:', supabaseKey ? 'Set' : 'Not set');
}

// Map slug to friendly name if available
function slugToName(slug) {
  if (!slug) return null;
  const all = [...CATEGORIES, ...PA_CERT_CATEGORIES];
  const found = all.find((c) => c.slug === slug);
  return found?.name || null;
}

// Fetch flashcards with optional filters
export async function fetchFlashcards({ category, level, imageOnly } = {}) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase not configured - missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY environment variables');
    }
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const buildBase = () => {
      let q = supabase.from('flashcards').select('*');
      if (level) q = q.ilike('level', level);
      if (imageOnly) q = q.not('image_url', 'is', null);
      return q;
    };

    let data = [];

    if (category) {
      // Try category_slug first (if column exists)
      try {
        const { data: d1, error: e1 } = await buildBase().eq('category_slug', category);
        if (e1) throw e1;
        data = d1 || [];
      } catch (_) {
        data = [];
      }

      // Fallback A: try slug directly in 'category' column
      if (!data.length) {
        const { data: d2a, error: e2a } = await buildBase().eq('category', category);
        if (e2a) throw e2a;
        data = d2a || [];
      }
      // Fallback B: try friendly name in 'category' column (case-insensitive)
      if (!data.length) {
        const name = slugToName(category);
        if (name) {
          const { data: d2b, error: e2b } = await buildBase().ilike('category', name);
          if (e2b) throw e2b;
          data = d2b || [];
        }
      }
    } else {
      const { data: d0, error: e0 } = await buildBase();
      if (e0) throw e0;
      data = d0 || [];
    }

    return (data || []).map((f) => ({
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

    const buildBase = () => {
      let q = supabase.from('quizzes').select('*');
      if (level) q = q.ilike('level', level);
      return q;
    };

    let data = [];

    if (category) {
      // Try category_slug first
      try {
        const { data: d1, error: e1 } = await buildBase().eq('category_slug', category);
        if (e1) throw e1;
        data = d1 || [];
      } catch (_) {
        data = [];
      }

      // Fallback A: try slug directly in 'category' column
      if (!data.length) {
        const { data: d2a, error: e2a } = await buildBase().eq('category', category);
        if (e2a) throw e2a;
        data = d2a || [];
      }
      // Fallback B: try friendly name (case-insensitive)
      if (!data.length) {
        const name = slugToName(category);
        if (name) {
          const { data: d2b, error: e2b } = await buildBase().ilike('category', name);
          if (e2b) throw e2b;
          data = d2b || [];
        }
      }
    } else {
      const { data: d0, error: e0 } = await buildBase();
      if (e0) throw e0;
      data = d0 || [];
    }

    return (data || []).map((q) => {
      const choices = [q.option_a, q.option_b, q.option_c, q.option_d];
      const answerIdx = choices.findIndex((opt) => opt === q.correct_option);
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