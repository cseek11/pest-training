# Supabase Setup Guide

## Issue
The flashcards are not loading because the Supabase environment variables are not configured.

## Solution
You need to set up Supabase to fetch flashcards and quiz data.

### Step 1: Create Supabase Project
1. Go to https://supabase.com and create a new project
2. Wait for the project to be set up (this may take a few minutes)

### Step 2: Get Your Credentials
1. In your Supabase project dashboard, go to Settings → API
2. Copy your **Project URL** (looks like: `https://your-project-id.supabase.co`)
3. Copy your **anon public** key (starts with `eyJ...`)

### Step 3: Configure Environment Variables
1. Create a `.env` file in the `frontend` directory
2. Add the following content:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_KEY=your-anon-key-here
   ```
3. Replace the values with your actual Supabase credentials

### Step 4: Set Up Database Tables
You need to create the following tables in your Supabase database:

#### Flashcards Table
```sql
CREATE TABLE flashcards (
  id SERIAL PRIMARY KEY,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  level TEXT DEFAULT 'beginner',
  category TEXT,
  image_url TEXT,
  source_main TEXT,
  source_external TEXT,
  jurisdiction_tag TEXT
);
```

#### Quizzes Table
```sql
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option TEXT NOT NULL,
  level TEXT DEFAULT 'beginner'
);
```

### Step 5: Import Your Data
You can import your flashcard and quiz data into these tables using:
- Supabase dashboard → Table Editor
- CSV import functionality
- Or programmatically via the API

## Testing
1. Start the development server: `npm run dev`
2. The app should now load flashcards from Supabase
3. If you see "Supabase not configured" error, check your `.env` file

## Troubleshooting
- **"Supabase not configured" error**: Check that your `.env` file exists and has the correct values
- **Empty flashcards**: Make sure you've imported data into the `flashcards` table
- **Network errors**: Check that your Supabase project is active and accessible
