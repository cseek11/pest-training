import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Create a single Supabase client instance
let supabase = null;

// Only create client if both URL and key are available
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Error creating Supabase client:', error);
  }
} else {
  console.warn('Supabase environment variables not found. Client not initialized.');
}

export { supabase }
