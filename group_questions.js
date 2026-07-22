const fs = require('fs');

const content = fs.readFileSync('ショートカットキー検定５級　問題.txt', 'utf8');
const lines = content.split('\n').filter(l => l.trim() !== '');

const grouped = {};

lines.forEach((line, index) => {
  const qStart = line.indexOf('問題文:');
  const optStart = line.indexOf('選択肢:');
  const ansStart = line.indexOf('回答:');
  if (qStart === -1 || optStart === -1 || ansStart === -1) return;

  const q = line.substring(qStart + 4, optStart).trim();
  const ans = line.substring(ansStart + 3).trim();
  
  // Try to find the shortcut key mentioned in the answer or question
  const shortcuts = ['Control + C', 'Control + X', 'Control + V', 'Control + Z', 'Control + Y', 'Control + A', 'Control + T', 'Control + W', 'Control + Shift + T', 'Control + R', 'F5', 'Control + N', 'Control + F', 'Control + H', 'Control + S', 'Control + P', 'F2', 'Alt + Tab', 'Windows + Shift + S', 'Windows + PrintScreen'];
  
  let key = 'Unknown';
  for (const s of shortcuts) {
    if (ans.includes(s) || q.includes(s)) {
      key = s;
      break;
    }
  }
  
  // If not found in ans or q, it's a reverse lookup question, the answer is the action itself
  // e.g. Answer is "A. 貼り付け". The options have shortcuts or actions.
  // Actually, many answers don't mention the shortcut explicitly if the options are actions.
  if (key === 'Unknown') {
    key = ans;
  }

  if (!grouped[key]) grouped[key] = [];
  grouped[key].push(`Q${index+1}: ${q} (Ans: ${ans})`);
});

let report = '';
for (const key in grouped) {
  report += `\n=== ${key} (${grouped[key].length} questions) ===\n`;
  grouped[key].forEach(q => report += q + '\n');
}

fs.writeFileSync('analysis_report.txt', report);
console.log('Done!');
