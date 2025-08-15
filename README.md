# Pest Control Training — PA & National

Generated on 2025-08-15T15:59:12.763613Z

## What’s inside
- **backend/** — Node/Express API with CORS. Serves `GET /api/content` from `backend/training-content.json` and allows `POST /api/content` to update it.
- **frontend/** — Vite React app. Reads `VITE_API_URL` for API base URL. Falls back to embedded content if backend is unreachable.
- Preloaded **PA & national** questions, flashcards, and link hubs.

## Local dev
```bash
# Backend
cd backend
npm install
npm start   # http://localhost:4000

# Frontend (new terminal)
cd frontend
npm install
npm run dev # http://localhost:5173
# If your backend runs on a different origin, set:
# export VITE_API_URL=http://localhost:4000
```

## Deploy
### Backend → Railway (free)
- Create project → Deploy from GitHub → set **Base directory**: `backend`

### Frontend → Netlify (free)
- Import from GitHub
- **Base directory:** `frontend`
- **Build command:** `yarn build`  (or `npm run build`)
- **Publish directory:** `dist`
- **Env var:** `VITE_API_URL=https://<your-backend-url>`
