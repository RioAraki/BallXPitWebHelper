const fs = require('fs');
const path = require('path');

const ballsFile = path.join(__dirname, '../data/balls.ts');
let content = fs.readFileSync(ballsFile, 'utf8');

// Add imageUrl after element field for all balls that don't already have it
// Pattern: element: 'value', followed by newline and NOT imageUrl
content = content.replace(
  /(id: '([^']+)',[\s\S]*?element: '[^']+',)(\s+)(?!imageUrl)/g,
  (match, beforeElement, ballId, whitespace) => {
    // Check if the next line doesn't already have imageUrl
    return `${beforeElement}${whitespace}imageUrl: getBallImageUrl('${ballId}'),${whitespace}`;
  }
);

fs.writeFileSync(ballsFile, content, 'utf8');
console.log('✓ Added imageUrl fields to remaining balls');
