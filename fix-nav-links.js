/**
 * Fix mobile 404: replace root-relative hrefs and routePaths with relative .html paths
 * so links work when site is deployed under a subpath (e.g. /prodesk.in/)
 */
const fs = require('fs');
const path = require('path');

const gpubDir = path.join(__dirname, 'img1.wsimg.com', 'blobby', 'go', '83d5de90-a5eb-47d5-a7bd-5cd38cd4c0e1', 'gpub');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const toRelative = (p) => {
    try {
      const decoded = decodeURIComponent(p);
      return decoded.endsWith('.html') ? decoded : `${decoded}.html`;
    } catch {
      return p.endsWith('.html') ? p : `${p}.html`;
    }
  };

  // Match escaped JSON in script: \"href\":\"/path\" (decode URI components like %26 -> &)
  content = content.replace(/\\"href\\":\\"\/([^"]+)\\"/g, (_, p) => {
    changed = true;
    return '\\"href\\":\\"' + toRelative(p) + '\\"';
  });

  // Match \"routePath\":\"/path\"
  content = content.replace(/\\"routePath\\":\\"\/([^"]+)\\"/g, (_, p) => {
    changed = true;
    return '\\"routePath\\":\\"' + toRelative(p) + '\\"';
  });

  if (changed) fs.writeFileSync(filePath, content, 'utf8');
  return changed;
}

if (!fs.existsSync(gpubDir)) {
  console.error('gpub dir not found:', gpubDir);
  process.exit(1);
}

// gpub contains subdirs (e.g. 285b17f718a22dca), each with script.js
const subdirs = fs.readdirSync(gpubDir).filter(f => {
  const full = path.join(gpubDir, f);
  return fs.statSync(full).isDirectory();
});
let count = 0;
for (const sub of subdirs) {
  const scriptPath = path.join(gpubDir, sub, 'script.js');
  if (fs.existsSync(scriptPath) && fixFile(scriptPath)) {
    count++;
    console.log('Fixed:', sub, 'script.js');
  }
}
console.log('Done. Fixed', count, 'files.');
