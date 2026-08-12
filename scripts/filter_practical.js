const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./scripts/practical_pool.json', 'utf8'));

const dangerousCombos = [
  'control+t', 
  'control+n', 
  'control+w', 
  'control+shift+t', 
  'control+shift+w', 
  'control+shift+n', 
  'alt+f4', 
  'control+tab', 
  'control+shift+tab',
  'control+p' // Print dialog might be intrusive too, though preventDefault often catches it. Let's exclude it to be safe.
];

let removedCount = 0;

for (const key of Object.keys(data)) {
  const originalLen = data[key].length;
  data[key] = data[key].filter(q => {
    if (!q.expectedKeyCombo) return true;
    
    // Some are arrays, some might be hashes.
    const combo = q.expectedKeyCombo.join('+').toLowerCase();
    
    // Also block mac equivalents just in case (meta+t)
    const macCombo = combo.replace('control', 'meta');
    
    if (dangerousCombos.includes(combo) || dangerousCombos.includes(macCombo)) {
      console.log(`Removed: [${key}] ID: ${q.id} Combo: ${combo} Q: ${q.question}`);
      removedCount++;
      return false;
    }
    return true;
  });
  console.log(`${key}: Removed ${originalLen - data[key].length} questions.`);
}

fs.writeFileSync('./scripts/practical_pool.json', JSON.stringify(data, null, 2), 'utf8');
console.log(`Total removed: ${removedCount}`);
