const fs = require('fs');
const path = require('path');
const http = require('http');

// Simple PNG generator using solid raw PNG chunks or copy icon
const iconsDir = path.join(__dirname, 'icons');

// Create minimal valid PNG binary for icon-192 and icon-512 if sharp is not installed
// 1x1 solid dark PNG scaled in header or standard PNG
const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const pngBuffer = Buffer.from(base64Png, 'base64');

// We can also create a nice HTML page icon or standard PWA fallback png
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), pngBuffer);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), pngBuffer);

console.log('PNG Icons generated successfully!');
