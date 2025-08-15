const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Pest Training Application Setup...\n');

// Check if we're in the right directory
if (!fs.existsSync('backend') || !fs.existsSync('frontend')) {
  console.log('❌ Please run this script from the pest-training directory');
  process.exit(1);
}

try {
  // Step 1: Install backend dependencies
  console.log('📦 Installing backend dependencies...');
  execSync('npm install', { cwd: 'backend', stdio: 'inherit' });
  
  // Step 2: Install frontend dependencies
  console.log('📦 Installing frontend dependencies...');
  execSync('npm install', { cwd: 'frontend', stdio: 'inherit' });
  
  // Step 3: Convert biology data
  console.log('🔄 Converting biology CSV data...');
  execSync('node fix-biology-data.js', { cwd: 'backend', stdio: 'inherit' });
  
  // Step 4: Test the data
  console.log('🧪 Testing data conversion...');
  execSync('node test-data.js', { cwd: 'backend', stdio: 'inherit' });
  
  console.log('\n✅ Setup complete!');
  console.log('\nTo start the application:');
  console.log('1. Terminal 1: cd backend && npm start');
  console.log('2. Terminal 2: cd frontend && npm run dev');
  console.log('\nThe app will be available at:');
  console.log('- Frontend: http://localhost:5173');
  console.log('- Backend API: http://localhost:4000');
  
} catch (error) {
  console.log('❌ Setup failed:', error.message);
  process.exit(1);
}
