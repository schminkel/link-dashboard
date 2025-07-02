// Icon generation and verification script for iOS app icons
const fs = require('fs');
const path = require('path');

const publicDir = './public';

// Required icon files for iOS compatibility
const requiredFiles = [
  'favicon.svg',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'icon-192x192.png',
  'icon-512x512.png',
  'apple-touch-icon.png',
  'apple-touch-icon-180x180.png',
  'apple-touch-icon-152x152.png',
  'apple-touch-icon-120x120.png',
  'app-icon.svg',
  'app-icon-512.svg',
  'apple-splash.svg'
];

// Verify all required files exist
console.log('Checking required icon files...');
let missingFiles = [];

requiredFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (!fs.existsSync(filePath)) {
    missingFiles.push(file);
  } else {
    console.log(`✅ ${file} exists`);
  }
});

if (missingFiles.length > 0) {
  console.log('\n❌ Missing required files:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
  console.log('\nNote: PNG files are essential for iOS app icon compatibility.');
  console.log('SVG files alone are not sufficient for iOS devices.');
} else {
  console.log('\n✅ All required icon files are present!');
  console.log('\nThis ensures proper iOS app icon display when added to home screen.');
}
