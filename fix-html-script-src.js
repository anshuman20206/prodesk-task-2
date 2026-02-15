/**
 * Point HTML script tags from CDN (https://img1.wsimg.com/.../gpub/.../script.js)
 * to local relative paths so every page loads our fixed nav scripts.
 */
const fs = require('fs');
const path = require('path');

const prodeskRoot = path.join(__dirname, 'prodesk.in');
const CDN_PREFIX = 'https://img1.wsimg.com/blobby/go/83d5de90-a5eb-47d5-a7bd-5cd38cd4c0e1/gpub/';
// Only replace in script src that loads gpub script.js (nav)
const CDN_SCRIPT_RE = /src="https:\/\/img1\.wsimg\.com\/blobby\/go\/83d5de90-a5eb-47d5-a7bd-5cd38cd4c0e1\/gpub\//g;

function walkDir(dir, fn) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkDir(full, fn);
    else if (e.isFile() && e.name.endsWith('.html')) fn(full);
  }
}

let count = 0;
walkDir(prodeskRoot, (filePath) => {
  const rel = path.relative(prodeskRoot, path.dirname(filePath));
  const prefix = rel === '' ? '..' : path.join('..', '..'); // prodesk.in/ -> ..; prodesk.in/ui/ -> ../..
  const localPrefix = prefix.split(path.sep).join('/') + '/img1.wsimg.com/blobby/go/83d5de90-a5eb-47d5-a7bd-5cd38cd4c0e1/gpub/';

  let content = fs.readFileSync(filePath, 'utf8');
  const newContent = content.replace(CDN_SCRIPT_RE, `src="${localPrefix}`);
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    count++;
    console.log('Fixed:', path.relative(prodeskRoot, filePath));
  }
});
console.log('Done. Updated', count, 'HTML file(s).');
