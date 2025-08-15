const fs = require('fs');
const path = require('path');

// Test the training content
function testTrainingContent() {
  const trainingContentPath = path.join(__dirname, 'training-content.json');
  
  if (!fs.existsSync(trainingContentPath)) {
    console.log('❌ training-content.json not found');
    return;
  }
  
  try {
    const content = JSON.parse(fs.readFileSync(trainingContentPath, 'utf8'));
    
    console.log('✅ Training content loaded successfully');
    console.log(`📊 Core exam questions: ${content.core_exam?.length || 0}`);
    console.log(`📊 Total flashcards: ${content.flashcards?.length || 0}`);
    console.log(`📊 Biology questions: ${content.categories?.biology?.length || 0}`);
    
    // Check for biology content
    const biologyFlashcards = content.flashcards?.filter(f => f.category === 'Biology') || [];
    console.log(`📊 Biology flashcards: ${biologyFlashcards.length}`);
    
    if (biologyFlashcards.length > 0) {
      console.log('\n📝 Sample biology flashcard:');
      console.log(JSON.stringify(biologyFlashcards[0], null, 2));
    }
    
    if (content.categories?.biology?.length > 0) {
      console.log('\n📝 Sample biology quiz question:');
      console.log(JSON.stringify(content.categories.biology[0], null, 2));
    }
    
    // Check data quality
    const malformedFlashcards = content.flashcards?.filter(f => 
      !f.term || !f.def || f.term.includes('"') || f.def.includes('"')
    ) || [];
    
    if (malformedFlashcards.length > 0) {
      console.log(`⚠️  Found ${malformedFlashcards.length} potentially malformed flashcards`);
    } else {
      console.log('✅ All flashcards appear to be properly formatted');
    }
    
  } catch (error) {
    console.log('❌ Error reading training content:', error.message);
  }
}

// Run the test
testTrainingContent();
