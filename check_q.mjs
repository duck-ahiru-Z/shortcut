import fs from 'fs';
const data = JSON.parse(fs.readFileSync('mac_pools.json', 'utf8'));
for (const [grade, p] of Object.entries(data)) {
  console.log(grade, p.length, "questions");
  for (const q of p) {
    if (q.question.includes('プロパティ') || q.question.includes('情報')) console.log(q.id, q.question);
  }
}
