const fs = require('fs');
const path = require('path');

const ballsFile = path.join(__dirname, '../data/balls.ts');
let content = fs.readFileSync(ballsFile, 'utf8');

// Pattern to match ball object with id
// Adds imageUrl after the element field, or after description if no element
const pattern = /(\{\s*id:\s*'([^']+)',[\s\S]*?)(element:\s*'[^']+',)/g;

content = content.replace(pattern, (match, beforeElement, ballId, elementLine) => {
  return `${beforeElement}${elementLine}\n    imageUrl: getBallImageUrl('${ballId}'),`;
});

// For balls without element field, add imageUrl after description
const patternNoElement = /(\{\s*id:\s*'([^']+)',\s*name:\s*'[^']+',\s*type:\s*BallType\.[^,]+,\s*category:\s*BallCategory\.[^,]+,\s*description:\s*'[^']+',)(\s*recipe)/g;

content = content.replace(patternNoElement, (match, beforeRecipe, ballId, recipeStart) => {
  // Check if imageUrl already exists
  if (!match.includes('imageUrl:')) {
    return `${beforeRecipe}\n    imageUrl: getBallImageUrl('${ballId}'),${recipeStart}`;
  }
  return match;
});

// For balls with only description and stats (no element, no recipe)
const patternSimple = /(\{\s*id:\s*'([^']+)',\s*name:\s*'[^']+',\s*type:\s*BallType\.[^,]+,\s*category:\s*BallCategory\.[^,]+,\s*description:\s*'[^']+',)(\s*\}|\s*stats:)/g;

content = content.replace(patternSimple, (match, beforeStats, ballId, statsOrEnd) => {
  // Check if imageUrl already exists
  if (!match.includes('imageUrl:') && !match.includes('recipe:')) {
    return `${beforeStats}\n    imageUrl: getBallImageUrl('${ballId}'),${statsOrEnd}`;
  }
  return match;
});

fs.writeFileSync(ballsFile, content, 'utf8');
console.log('✓ Added imageUrl to all balls');
