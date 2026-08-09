const fs = require('fs');
const path = require('path');

const srcImage = `C:\\Users\\Shaz\\.gemini\\antigravity\\brain\\d30b7214-e701-4b34-8bf3-be547fb0806e\\app_logo_icon_1786258021427.jpg`;
const targetDir = `C:\\Users\\Shaz\\.gemini\\antigravity\\scratch\\snc-workout-app\\icons`;

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy to icon-192.png, icon-512.png, apple-touch-icon.png, and root icon.png
fs.copyFileSync(srcImage, path.join(targetDir, 'icon-192.png'));
fs.copyFileSync(srcImage, path.join(targetDir, 'icon-512.png'));
fs.copyFileSync(srcImage, path.join(targetDir, 'apple-touch-icon.png'));
fs.copyFileSync(srcImage, path.join(targetDir, 'icon.jpg'));

console.log('App icons updated successfully!');
