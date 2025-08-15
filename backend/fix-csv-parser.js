const fs = require('fs');
const path = require('path');

// Better CSV parser that handles quoted fields with commas
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
    // Don't forget the last value
    values.push(current.trim().replace(/^"|"$/g, ''));
    
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    data.push(row);
  }
  
  return data;
}

// Test the parser with a sample line
function testParser() {
  const testLine = 'BIO_BEG_001,Biology,Beginner,What is the lifecycle stage of a common household cockroach that follows the nymph stage?,"Adult - cockroaches have egg, nymph, and adult stages.","An Expert Report on Modern Pest Management, Section 3.1","US EPA - Integrated Pest Management (IPM) Principles",General Biology,11,Household and Health Related';
  
  const headers = ['id', 'category', 'difficulty', 'front', 'back', 'source_main', 'source_external', 'jurisdiction_tag', 'program_area_code', 'program_area_name'];
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let j = 0; j < testLine.length; j++) {
    const char = testLine[j];
    
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
  
  console.log('Test parsing result:');
  headers.forEach((header, index) => {
    console.log(`${header}: "${values[index]}"`);
  });
}

// Run the test
testParser();
