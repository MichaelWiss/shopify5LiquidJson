const fs = require('fs');
const path = require('path');

const demoCssPath = path.resolve(__dirname, '../assets/homepage-demo-styles.css');
const themeCssPath = path.resolve(__dirname, '../assets/theme.css');

const demoCss = fs.readFileSync(demoCssPath, 'utf8');
const themeCss = fs.readFileSync(themeCssPath, 'utf8');

/**
 * Extract CSS selectors from a CSS string.
 * Handles multi-line selectors, grouped selectors (comma-separated),
 * and various CSS syntax patterns.
 */
function extractSelectors(css) {
  const selectors = new Set();
  
  // Remove comments
  const cleanCss = css.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Match rule blocks (selector followed by opening brace)
  // This regex captures content before opening braces, handling newlines
  const rulePattern = /([^{}]+)\{/g;
  let match;
  
  while ((match = rulePattern.exec(cleanCss)) !== null) {
    const selectorBlock = match[1];
    
    // Skip @-rules (media queries, keyframes, etc.)
    if (selectorBlock.trim().startsWith('@')) {
      continue;
    }
    
    // Split by comma to handle grouped selectors
    const individualSelectors = selectorBlock.split(',');
    
    individualSelectors.forEach(selector => {
      const trimmed = selector.trim();
      if (trimmed && !trimmed.startsWith('@')) {
        selectors.add(trimmed);
      }
    });
  }
  
  return selectors;
}

/**
 * Check if a selector (or equivalent) exists in the theme CSS.
 * Normalizes whitespace to handle formatting differences.
 */
function selectorExists(selector, themeCss) {
  // Normalize selector: collapse multiple spaces to single space
  const normalized = selector.replace(/\s+/g, ' ').trim();
  
  // Escape special regex characters
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Allow flexible whitespace in theme CSS
  const flexiblePattern = escaped.replace(/\s/g, '\\s*');
  
  // Match selector followed by opening brace (with optional whitespace)
  const pattern = new RegExp(`${flexiblePattern}\\s*\\{`, 'm');
  
  return pattern.test(themeCss);
}

const demoSelectors = extractSelectors(demoCss);
const missingSelectors = new Set();

demoSelectors.forEach(selector => {
  if (!selectorExists(selector, themeCss)) {
    missingSelectors.add(selector);
  }
});

if (missingSelectors.size) {
  console.error('Homepage style drift detected. Missing selectors:');
  [...missingSelectors].sort().forEach((selector) => console.error(` - ${selector}`));
  console.error(`\nTotal missing: ${missingSelectors.size}`);
  process.exit(1);
} else {
  console.log('✓ All homepage demo selectors are present in theme.css');
}
