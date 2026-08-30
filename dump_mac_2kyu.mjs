import fs from 'fs';
const data = JSON.parse(fs.readFileSync('mac_pools.json', 'utf8'));
const p2 = data['practical-mac-2kyu'];
for (const q of p2) {
  console.log(`[${q.id}] ${q.question} -> ${JSON.stringify(q.expectedKeyCombo || q.expectedKeySequence)}`);
}
