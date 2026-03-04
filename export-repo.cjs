const fs = require('fs');
const path = require('path');

const root = __dirname;
const skip = new Set(['.next', 'node_modules', '.git', 'brand-assets', '.vercel', 'public']);
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.mjs']);
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name) || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (exts.has(path.extname(entry.name))) {
      // Skip lock files and this script
      if (entry.name === 'pnpm-lock.yaml' || entry.name === 'export-repo.cjs') continue;
      files.push(full);
    }
  }
}

walk(root);

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<repository name="OpsConductor">\n';
xml += `<structure>\n${files.map(f => path.relative(root, f).replace(/\\/g, '/')).join('\n')}\n</structure>\n`;

for (const f of files) {
  const rel = path.relative(root, f).replace(/\\/g, '/');
  const content = fs.readFileSync(f, 'utf8');
  xml += `<file path="${rel}">\n<![CDATA[\n${content}\n]]>\n</file>\n`;
}

xml += '</repository>\n';
const outPath = path.join(root, 'repo-export.xml');
fs.writeFileSync(outPath, xml, 'utf8');
console.log(`Exported ${files.length} files (${Math.round(xml.length / 1024)} KB) -> repo-export.xml`);
