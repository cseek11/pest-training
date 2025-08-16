# Multi-Page Pest Control Training Application

## Overview
This application provides comprehensive training for Private Applicator Certification across 26 different categories, each with:
- Interactive flashcards (3 difficulty levels)
- Timed practice quizzes (15 minutes)
- Comprehensive final tests (30 minutes)
- Pest identification training with images

## Features Implemented

### ✅ Home Page (`/`)
- Grid display of all 26 certification categories
- Search functionality for categories
- Statistics overview
- Feature highlights

### ✅ Category Pages (`/category/:slug`)
- Individual pages for each certification category
- Difficulty level selector (Beginner, Intermediate, Advanced)
- Flashcard display (3 random cards)
- Search functionality within category
- Practice quiz with timer (15 minutes)
- Final test with timer (30 minutes)
- Pest identification section

### ✅ Components Created
- **Timer**: Popup timer with progress bar and warnings
- **PestIdentification**: Image-based pest identification training
- **CategoryPage**: Individual category training page
- **HomePage**: Category selection and overview

### ✅ Data Structure
- **Categories**: 26 certification categories with IDs, names, descriptions
- **Difficulty Levels**: Beginner, Intermediate, Advanced
- **Routing**: React Router with dynamic category routes

## Database Schema Requirements

### Flashcards Table
```sql
CREATE TABLE flashcards (
  id SERIAL PRIMARY KEY,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  category TEXT NOT NULL, -- Should match category name or ID
  image_url TEXT,
  source_main TEXT,
  source_external TEXT,
  jurisdiction_tag TEXT,
  tips TEXT[] -- Array of tips
);
```

### Quizzes Table
```sql
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option TEXT NOT NULL,
  level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  category TEXT NOT NULL -- Should match category name or ID
);
```

### Pests Table (for identification training)
```sql
CREATE TABLE pests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  scientific_name TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL, -- Should match category name or ID
  hints TEXT[], -- Array of identification hints
  level TEXT DEFAULT 'beginner' -- 'beginner', 'intermediate', 'advanced'
);
```

## Sample Data Structure

### Flashcards Example
```json
{
  "term": "German Cockroach",
  "definition": "Small light-brown roach with two dark stripes on pronotum",
  "level": "beginner",
  "category": "Household and Health Related",
  "tips": [
    "Most common indoor roach species",
    "Prefers warm, humid environments"
  ]
}
```

### Quiz Example
```json
{
  "question": "Which insect order do cockroaches belong to?",
  "option_a": "Coleoptera",
  "option_b": "Blattodea",
  "option_c": "Hymenoptera",
  "option_d": "Diptera",
  "correct_option": "Blattodea",
  "level": "beginner",
  "category": "Household and Health Related"
}
```

### Pest Example
```json
{
  "name": "German Cockroach",
  "scientific_name": "Blattella germanica",
  "description": "Small, light brown cockroach with two dark stripes on the pronotum",
  "image_url": "https://example.com/german-cockroach.jpg",
  "category": "Household and Health Related",
  "hints": [
    "Look for two dark stripes on the pronotum",
    "Smaller than American cockroach",
    "Prefers kitchens and bathrooms"
  ],
  "level": "beginner"
}
```

## Environment Setup

### Required Environment Variables
Create a `.env` file in the `frontend` directory:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_KEY=your-anon-key-here
```

### Supabase Setup Steps
1. Create a Supabase project
2. Set up the database tables (flashcards, quizzes, pests)
3. Import your data into the tables
4. Configure environment variables
5. Deploy to Netlify/Vercel

## Usage Instructions

### For Students
1. Visit the home page to see all certification categories
2. Click on a category to access training materials
3. Select difficulty level (Beginner, Intermediate, Advanced)
4. Study flashcards by clicking to flip them
5. Take practice quizzes (15 minutes) or final tests (30 minutes)
6. Practice pest identification with images

### For Administrators
1. Access `/admin` page for content management
2. Upload CSV files for flashcards and quizzes
3. Upload pest images for identification training
4. Monitor student progress and scores

## Timer Features
- **Quiz Timer**: 15 minutes with warning at 10% remaining
- **Test Timer**: 30 minutes with comprehensive assessment
- **Auto-submit**: Automatically submits when time expires
- **Progress Bar**: Visual indication of time remaining
- **Warning System**: Alerts when time is running low

## Pest Identification Features
- **Image Display**: High-quality pest images
- **Answer Reveal**: Click to show/hide pest identification
- **Hints System**: Helpful identification clues
- **Navigation**: Browse through multiple pests
- **Search**: Filter pests by name or description
- **Thumbnail Navigation**: Quick access to all pests

## Deployment
1. Ensure all environment variables are set
2. Build the application: `npm run build`
3. Deploy to Netlify/Vercel with base directory: `frontend`
4. Set environment variables in deployment platform

## Next Steps
1. **Add Content**: Populate database with category-specific flashcards, quizzes, and pest images
2. **User Authentication**: Add user accounts and progress tracking
3. **Score Tracking**: Implement score storage and analytics
4. **Mobile Optimization**: Ensure responsive design for mobile devices
5. **Accessibility**: Add ARIA labels and keyboard navigation
6. **Offline Support**: Add service worker for offline functionality

## Troubleshooting
- **Categories not loading**: Check Supabase connection and environment variables
- **Images not displaying**: Verify image URLs and Supabase storage configuration
- **Timer not working**: Check browser console for JavaScript errors
- **Routing issues**: Ensure React Router is properly configured
