# Pest Training Setup Guide

## Overview
This guide will help you set up the pest training application with biology flashcards integration.

## Prerequisites
- Node.js installed
- CSV files with biology flashcards in the parent directory

## Setup Steps

### 1. Install Dependencies

```bash
# Backend dependencies
cd pest-training/backend
npm install

# Frontend dependencies  
cd ../frontend
npm install
```

### 2. Convert Biology CSV Data

The biology flashcards are stored in CSV format and need to be converted to JSON for the application.

```bash
cd pest-training/backend
node fix-biology-data.js
```

This script will:
- Parse all biology CSV files
- Convert them to the correct JSON format
- Create proper quiz questions with multiple choice options
- Update the training-content.json file

### 3. Test the Data

```bash
cd pest-training/backend
node test-data.js
```

This will verify that:
- The training content loaded successfully
- Biology flashcards are properly formatted
- Quiz questions are created correctly

### 4. Start the Application

```bash
# Terminal 1: Start backend server
cd pest-training/backend
npm start

# Terminal 2: Start frontend development server
cd pest-training/frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

## Features

### Flashcards
- Interactive flip cards for biology concepts
- Search functionality
- Filter by beginner/advanced level
- Source attribution and tips

### Quizzes
- Biology-specific quiz module
- Multiple choice questions
- Timed final exam option
- Score tracking with 70% pass threshold

### Content Structure
- Core exam questions
- Biology category with 900+ questions
- Pennsylvania-specific categories
- National and state regulation links

## Troubleshooting

### Flashcards Not Loading
1. Check that `fix-biology-data.js` ran successfully
2. Verify `training-content.json` exists and is valid JSON
3. Check browser console for API errors
4. Ensure backend server is running

### CSV Parsing Issues
If the CSV files aren't being parsed correctly:
1. Check CSV file format (should have headers)
2. Verify file paths in the conversion script
3. Run `test-data.js` to check for malformed data

### API Connection Issues
1. Verify backend server is running on port 4000
2. Check CORS settings in server.js
3. Ensure VITE_API_URL environment variable is set correctly

## Data Format

### Flashcard Format
```json
{
  "id": "BIO_BEG_001",
  "term": "Question text",
  "def": "Answer text", 
  "category": "Biology",
  "level": "beginner",
  "tips": ["Source info", "Additional context"]
}
```

### Quiz Question Format
```json
{
  "q": "Question text",
  "choices": ["Correct answer", "Wrong answer 1", "Wrong answer 2", "Wrong answer 3"],
  "answer": 0,
  "level": "beginner",
  "category": "Biology"
}
```

## Deployment

### Backend (Railway)
1. Create Railway project
2. Set base directory to `backend`
3. Deploy from GitHub

### Frontend (Netlify)
1. Import from GitHub
2. Set base directory to `frontend`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set environment variable: `VITE_API_URL=https://your-backend-url`

