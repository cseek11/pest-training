# Pest Control Training – Supabase Frontend

This is a **frontend-only** React app (Vite + Tailwind) that uses **Supabase** for:
- Postgres tables (`flashcards`, `quizzes`, `final_tests`)
- Public **Storage** bucket (`insects`) for image hosting
- Optional: Auth (can be added later)

## Setup

1) Create a Supabase project and copy the **Project URL** and **Anon Key**.
2) In Supabase SQL editor, run the schema from the chat message (tables + RLS + `insects` bucket).
3) In `frontend/.env` (or Netlify environment):
```
VITE_SUPABASE_URL=YOUR_URL
VITE_SUPABASE_KEY=YOUR_ANON_KEY
```
4) Install & run:
```
cd frontend
npm install
npm run dev
```

## Deploy
- **Netlify** or **Vercel**: Base dir `frontend`, build `npm run build`, publish `dist`.
- Add env vars in the platform UI.

## CSV Formats

### flashcards.csv
```
term,definition,image_url,level
German Cockroach,Small light-brown roach with two dark stripes,https://.../insects/german.jpg,beginner
```
### quizzes.csv
```
question,option_a,option_b,option_c,option_d,correct_option,level
Which insect spreads malaria?,Cockroach,Mosquito,Ant,Flea,B,beginner
```
### final_tests.csv
```
question,option_a,option_b,option_c,option_d,correct_option
...
```

Use the **Admin** page to upload CSVs and insect images. Then your content appears on the Home page automatically.
