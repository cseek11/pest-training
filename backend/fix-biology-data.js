const fs = require('fs');
const path = require('path');

// Function to properly parse CSV with quoted fields
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ''));
    
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    data.push(row);
  }
  
  return data;
}

// Function to convert CSV data to clean flashcard format
function convertToFlashcards(csvData) {
  return csvData.map(row => ({
    id: row.id,
    term: row.front,
    def: row.back,
    category: row.category,
    level: row.difficulty.toLowerCase(),
    source_main: row.source_main,
    source_external: row.source_external,
    jurisdiction_tag: row.jurisdiction_tag,
    program_area_code: row.program_area_code,
    program_area_name: row.program_area_name,
    tips: [
      `Source: ${row.source_main}`,
      `External: ${row.source_external}`,
      `Program Area: ${row.program_area_name}`
    ]
  }));
}

// Function to create better quiz questions
function convertToQuiz(csvData) {
  // Create a pool of incorrect answers from other questions
  const allAnswers = csvData.map(row => row.back);
  
  return csvData.map((row, index) => {
    // Get 3 random incorrect answers from other questions
    const incorrectAnswers = allAnswers
      .filter((answer, i) => i !== index && answer !== row.back)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    // Create choices array with correct answer first
    const choices = [row.back, ...incorrectAnswers];
    
    // Shuffle the choices but remember the correct answer position
    const correctAnswer = choices[0];
    const shuffled = choices.sort(() => Math.random() - 0.5);
    const answerIndex = shuffled.indexOf(correctAnswer);
    
    return {
      q: row.front,
      choices: shuffled,
      answer: answerIndex,
      level: row.difficulty.toLowerCase(),
      category: row.category,
      source: row.source_main
    };
  });
}

// Main conversion function
function fixBiologyData() {
  const csvFiles = [
    'biology_beginner_flashcards.csv',
    'biology_beginner_flashcards_101-200.csv',
    'biology_beginner_flashcards_201-300.csv',
    'biology_beginner_flashcards_301-400.csv',
    'biology_beginner_flashcards_401-500.csv',
    'biology_beginner_flashcards_501-600.csv',
    'biology_beginner_flashcards_601-700.csv',
    'biology_beginner_flashcards_701-800.csv',
    'biology_beginner_flashcards_801-900.csv'
  ];
  
  let allFlashcards = [];
  let allQuizQuestions = [];
  
  csvFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', '..', file);
    if (fs.existsSync(filePath)) {
      console.log(`Processing ${file}...`);
      const csvContent = fs.readFileSync(filePath, 'utf8');
      const csvData = parseCSV(csvContent);
      
      console.log(`  Found ${csvData.length} records`);
      
      const flashcards = convertToFlashcards(csvData);
      const quizQuestions = convertToQuiz(csvData);
      
      allFlashcards = allFlashcards.concat(flashcards);
      allQuizQuestions = allQuizQuestions.concat(quizQuestions);
    } else {
      console.log(`File not found: ${file}`);
    }
  });
  
  // Create a clean training content structure
  const cleanContent = {
    core_exam: [
      // Keep some original questions
      {
        "q": "Which metamorphosis type includes larva and pupa stages?",
        "choices": ["Simple", "Complete", "Ametabolous", "Neotenic"],
        "answer": 1,
        "level": "beginner"
      },
      {
        "q": "Frass refers to what?",
        "choices": ["Molted skins", "Egg cases", "Excrement/chewed material", "A fungal growth"],
        "answer": 2,
        "level": "advanced"
      },
      {
        "q": "What document has the force of law for product use?",
        "choices": ["Company SOP", "EPA PR Notice", "The label", "SDS only"],
        "answer": 2,
        "level": "beginner"
      }
    ],
    categories: {
      biology: allQuizQuestions,
      household_health: [],
      wood_destroying: [],
      fumigation: []
    },
    flashcards: [
      // Keep some original flashcards
      {
        "term": "Metamorphosis",
        "def": "Simple vs. complete development.",
        "tips": ["Larvae/pupae indicate complete metamorphosis."],
        "level": "beginner"
      },
      {
        "term": "Frass",
        "def": "Insect excrement or chewed material used as an ID clue.",
        "tips": ["Pellets = drywood termites; coffee-ground frass = roaches."],
        "level": "beginner"
      }
    ].concat(allFlashcards),
    links: {
      national: [
        {
          "title": "EPA Pesticide Registration",
          "link": "https://www.epa.gov/pesticide-registration",
          "desc": "Official pesticide registration information"
        }
      ],
      pennsylvania: [
        {
          "title": "PA Department of Agriculture",
          "link": "https://www.agriculture.pa.gov/Plants_Land_Water/PlantIndustry/Pages/default.aspx",
          "desc": "Pennsylvania pesticide regulations"
        }
      ]
    }
  };
  
  // Write clean content
  const trainingContentPath = path.join(__dirname, 'training-content.json');
  fs.writeFileSync(trainingContentPath, JSON.stringify(cleanContent, null, 2));
  
  console.log(`\nFix complete!`);
  console.log(`- Added ${allFlashcards.length} biology flashcards`);
  console.log(`- Added ${allQuizQuestions.length} biology quiz questions`);
  console.log(`- Created clean training-content.json`);
  
  // Show a sample of the data
  console.log(`\nSample flashcard:`);
  console.log(JSON.stringify(allFlashcards[0], null, 2));
}

// Run the fix
fixBiologyData();
