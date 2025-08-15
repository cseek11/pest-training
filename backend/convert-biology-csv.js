const fs = require('fs');
const path = require('path');

// Function to read and parse CSV file
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    data.push(row);
  }
  
  return data;
}

// Function to convert CSV data to flashcard format
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

// Function to convert CSV data to quiz format
function convertToQuiz(csvData) {
  return csvData.map(row => ({
    q: row.front,
    choices: [
      row.back,
      `Incorrect option 1 for ${row.id}`,
      `Incorrect option 2 for ${row.id}`,
      `Incorrect option 3 for ${row.id}`
    ],
    answer: 0, // First choice is correct
    level: row.difficulty.toLowerCase(),
    category: row.category,
    source: row.source_main
  }));
}

// Main conversion function
function convertBiologyCSV() {
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
      
      const flashcards = convertToFlashcards(csvData);
      const quizQuestions = convertToQuiz(csvData);
      
      allFlashcards = allFlashcards.concat(flashcards);
      allQuizQuestions = allQuizQuestions.concat(quizQuestions);
    } else {
      console.log(`File not found: ${file}`);
    }
  });
  
  // Read existing training content
  const trainingContentPath = path.join(__dirname, 'training-content.json');
  let existingContent = { core_exam: [], categories: {}, flashcards: [], links: { national: [], pennsylvania: [] } };
  
  if (fs.existsSync(trainingContentPath)) {
    existingContent = JSON.parse(fs.readFileSync(trainingContentPath, 'utf8'));
  }
  
  // Add biology content
  existingContent.flashcards = existingContent.flashcards.concat(allFlashcards);
  
  // Add biology quiz questions to core exam
  existingContent.core_exam = existingContent.core_exam.concat(allQuizQuestions);
  
  // Create biology-specific category
  existingContent.categories.biology = allQuizQuestions;
  
  // Write updated content
  fs.writeFileSync(trainingContentPath, JSON.stringify(existingContent, null, 2));
  
  console.log(`\nConversion complete!`);
  console.log(`- Added ${allFlashcards.length} biology flashcards`);
  console.log(`- Added ${allQuizQuestions.length} biology quiz questions`);
  console.log(`- Updated training-content.json`);
}

// Run the conversion
convertBiologyCSV();
