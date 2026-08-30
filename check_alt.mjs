import fs from 'fs';
const data = JSON.parse(fs.readFileSync('mac_pools.json', 'utf8'));

for (const [grade, pool] of Object.entries(data)) {
  for (const q of pool) {
    const keys = JSON.stringify(q.expectedKeyCombo || q.expectedKeySequence || "");
    if (keys.includes('"alt"') && q.question.includes('Excel')) {
      console.log(`- [${q.id}] (Excel Alt issue) ${q.question}`);
      console.log(`  Expected: ${keys}`);
    }
  }
}
