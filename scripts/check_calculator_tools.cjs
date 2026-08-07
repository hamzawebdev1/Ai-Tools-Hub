const fs = require('fs');
const content = fs.readFileSync('src/data/tools/calculatorTools.ts', 'utf8');
const idMatches = [...content.matchAll(/"id":\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Found calculator tool IDs count:', idMatches.length);
console.log('Sample IDs:', idMatches.slice(0, 15));
