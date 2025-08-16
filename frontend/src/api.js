// Fetch quiz questions from Supabase
export async function fetchQuizBank() {
  const { data, error } = await supabase.from('core_exam').select('*');
  if (error) throw error;
  return data;
}
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Example: fetch all flashcards
export async function fetchFlashcards() {
  const { data, error } = await supabase.from('flashcards').select('*');
  if (error) throw error;
  return data;
}