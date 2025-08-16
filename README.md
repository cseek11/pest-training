# Pest Control Training — PA & National

Generated on 2025-08-15T15:59:12.763613Z

## What’s inside
- **frontend/** — Vite React app using Supabase for all data (flashcards, quizzes, etc.).
- No backend required — all data is loaded from Supabase tables.
- Preloaded **PA & national** questions, flashcards, and link hubs in Supabase.

## Local dev
```bash
cd frontend
npm install
npm run dev # http://localhost:5173
```

### Environment variables
Create a `.env` file in the project root with:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-supabase-key
```

## Deploy
### Frontend → Netlify (free) or Vercel
- Import from GitHub
- **Base directory:** `frontend`
- **Build command:** `npm run build` (or `yarn build`)
- **Publish directory:** `dist`
- **Env vars:**
	- `VITE_SUPABASE_URL=your-supabase-url`
	- `VITE_SUPABASE_KEY=your-supabase-key`
