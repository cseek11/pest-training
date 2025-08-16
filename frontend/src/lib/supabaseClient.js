import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Create a single Supabase client instance
let supabase = null;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
  console.error('Error creating Supabase client:', error);
}

export { supabase }
