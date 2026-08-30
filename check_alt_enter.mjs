import fs from 'fs';
const data = JSON.parse(fs.readFileSync('mac_pools.json', 'utf8'));
for (const p of Object.values(data)) {
  for (const q of p) {
    const keys = JSON.stringify(q.expectedKeyCombo || q.expectedKeySequence || "");
    if (q.question.includes('プロパティ') || keys.includes('"alt","enter"')) {
      console.log(q.id, q.question, keys);
    }
  }
}
