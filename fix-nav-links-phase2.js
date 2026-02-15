/**
 * Phase 2: Fix links that 404 on mobile
 * 1. Point missing pages (about-us, solutions, technologies) to existing pages
 * 2. Encode & as %26 in href/routePath so URLs work on all mobile browsers
 */
const fs = require('fs');
const path = require('path');

const gpubDir = path.join(__dirname, 'img1.wsimg.com', 'blobby', 'go', '83d5de90-a5eb-47d5-a7bd-5cd38cd4c0e1', 'gpub');

const MISSING_PAGE_MAP = {
  'about-us.html': 'about-us-1.html',
  'solutions.html': 'software-development.html',
  'technologies.html': 'ai-%26-ml.html'
};

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Fix missing pages: about-us.html, solutions.html, technologies.html
  for (const [missing, existing] of Object.entries(MISSING_PAGE_MAP)) {
    const re1 = new RegExp('\\\\"href\\\\":\\\\"' + missing.replace(/\./g, '\\.') + '\\\\"', 'g');
    if (re1.test(content)) {
      content = content.replace(re1, '\\"href\\":\\"' + existing + '\\"');
      changed = true;
    }
    const re2 = new RegExp('\\\\"routePath\\\\":\\\\"' + missing.replace(/\./g, '\\.') + '\\\\"', 'g');
    if (re2.test(content)) {
      content = content.replace(re2, '\\"routePath\\":\\"' + existing + '\\"');
      changed = true;
    }
  }

  // 2. Encode & as %26 in href values (mobile-safe; server decodes to match file ai-&-ml.html)
  content = content.replace(/\\"href\\":\\"([^"]+)\\"/g, (_, p) => {
    if (p.includes('&')) {
      changed = true;
      return '\\"href\\":\\"' + p.replace(/&/g, '%26') + '\\"';
    }
    return '\\"href\\":\\"' + p + '\\"';
  });

  content = content.replace(/\\"routePath\\":\\"([^"]+)\\"/g, (_, p) => {
    if (p.includes('&')) {
      changed = true;
      return '\\"routePath\\":\\"' + p.replace(/&/g, '%26') + '\\"';
    }
    return '\\"routePath\\":\\"' + p + '\\"';
  });

  if (changed) fs.writeFileSync(filePath, content, 'utf8');
  return changed;
}

if (!fs.existsSync(gpubDir)) {
  console.error('gpub dir not found:', gpubDir);
  process.exit(1);
}

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
