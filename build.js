const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Output to dist/
fs.mkdirSync('dist', { recursive: true });
fs.copyFileSync('index.html', 'dist/index.html');
copyDir('js', 'dist/js');
copyDir('css', 'dist/css');

// 2. Output to public/
fs.mkdirSync('public', { recursive: true });
fs.copyFileSync('index.html', 'public/index.html');
copyDir('js', 'public/js');
copyDir('css', 'public/css');

console.log('Build complete: static files ready in dist/ and public/');
