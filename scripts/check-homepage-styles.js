const fs = require('fs');
const path = require('path');

const demoCssPath = path.resolve(__dirname, '../assets/homepage-demo-styles.css');
const themeCssPath = path.resolve(__dirname, '../assets/theme.css');

const demoCss = fs.readFileSync(demoCssPath, 'utf8');
const themeCss = fs.readFileSync(themeCssPath, 'utf8');

const missingSelectors = new Set();
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

demoCss.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('/*') || trimmed.startsWith('@')) {
    return;
  }
  if (!trimmed.endsWith('{')) {
    return;
  }

  const selector = trimmed.slice(0, -1).trim();
  if (!selector) {
    return;
  }

  const pattern = new RegExp(`${escapeRegExp(selector)}\\s*\\{`);
  if (!pattern.test(themeCss)) {
    missingSelectors.add(selector);
  }
});

if (missingSelectors.size) {
  console.error('Homepage style drift detected. Missing selectors:');
  [...missingSelectors].forEach((selector) => console.error(` - ${selector}`));
  process.exit(1);
}
