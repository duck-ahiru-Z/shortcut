import fs from 'fs';
const data = JSON.parse(fs.readFileSync('mac_pools.json', 'utf8'));

for (const [grade, pool] of Object.entries(data)) {
  console.log(`\n=== ${grade} ===`);
  for (const q of pool) {
    if (q.question.includes('エクスプローラー') || q.question.includes('Windows') || q.question.includes('Alt+Enter') || q.question.includes('F2') || q.question.includes('F11')) {
      console.log(`- [${q.id}] ${q.question}`);
      console.log(`  Expected: ${JSON.stringify(q.expectedKeyCombo || q.expectedKeySequence)}`);
    }
    // Also check for specific Mac problems
    const keys = JSON.stringify(q.expectedKeyCombo || q.expectedKeySequence || "");
    if (keys.includes('"f2"') && q.question.includes('Excel')) {
      console.log(`- [${q.id}] (Excel F2 issue) ${q.question}`);
    }
  }
}
