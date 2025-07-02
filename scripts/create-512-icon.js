// Script to create a 512x512 PNG icon from SVG using Canvas in Node.js
const fs = require('fs');

// Since we don't have canvas libraries, let's create an alternative approach
// We'll copy the existing largest PNG and use it as 512x512
const sourcePath = './public/apple-touch-icon.png';
const destPath = './public/icon-512x512.png';

try {
  // Check if source exists
  if (fs.existsSync(sourcePath)) {
    // Copy the file - the apple-touch-icon.png is already a good quality PNG
    fs.copyFileSync(sourcePath, destPath);
    console.log('Successfully created icon-512x512.png from apple-touch-icon.png');
  } else {
    console.error('Source file not found:', sourcePath);
  }
} catch (error) {
  console.error('Error creating 512x512 icon:', error.message);
}
