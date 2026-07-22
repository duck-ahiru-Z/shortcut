const fs = require('fs');
const content = fs.readFileSync('ショートカットキー検定５級　問題.txt', 'utf8');
const lines = content.split('\n').filter(l => l.trim() !== '');
let issues = [];
const questionsSet = new Set();
let duplicates = 0;

lines.forEach((line, index) => {
  const lineNum = index + 1;
  // Parse manually
  const qStart = line.indexOf('問題文:');
  const optStart = line.indexOf('選択肢:');
  const ansStart = line.indexOf('回答:');

  if (qStart === -1 || optStart === -1 || ansStart === -1) {
    issues.push("Line " + lineNum + ": Missing keyword. -> " + line);
    return;
  }

  const q = line.substring(qStart + 4, optStart).trim();
  const optsStr = line.substring(optStart + 4, ansStart).trim();
  const ans = line.substring(ansStart + 3).trim();

  // split options by '　' or ' '
  let opts = optsStr.split(/[\s　]+/).filter(o => /^[A-D]\./.test(o) || o.trim()!=='');
  // wait, the options themselves might have spaces inside them (e.g. "Control + C")
  // So a simple split on space will split "Control + C" into ["Control", "+", "C"]
  // Better split by ' A. ', ' B. ', ' C. ', ' D. '
  
  const aIdx = optsStr.indexOf('A.');
  const bIdx = optsStr.indexOf('B.');
  const cIdx = optsStr.indexOf('C.');
  const dIdx = optsStr.indexOf('D.');
  
  if (aIdx === -1 || bIdx === -1 || cIdx === -1 || dIdx === -1) {
    issues.push("Line " + lineNum + ": Missing option A, B, C or D. opts=" + optsStr);
    return;
  }
  
  const a = optsStr.substring(aIdx, bIdx).trim();
  const b = optsStr.substring(bIdx, cIdx).trim();
  const c = optsStr.substring(cIdx, dIdx).trim();
  const d = optsStr.substring(dIdx).trim();

  const options = [a, b, c, d];

  if (!options.includes(ans)) {
    issues.push("Line " + lineNum + ": Answer does not exactly match any option.\n  Options: " + JSON.stringify(options) + "\n  Answer: '" + ans + "'");
  }

  const optTexts = options.map(o => o.replace(/^[A-D]\.\s*/, '').trim());
  if (new Set(optTexts).size !== options.length) {
    issues.push("Line " + lineNum + ": Duplicate options found: " + JSON.stringify(optTexts));
  }

  if (questionsSet.has(q)) {
    duplicates++;
    issues.push("Line " + lineNum + ": Duplicate question found: " + q);
  } else {
    questionsSet.add(q);
  }
});

console.log('Total lines parsed:', lines.length);
console.log('Duplicate questions:', duplicates);
console.log('Total issues found:', issues.length);
if (issues.length > 0) {
  console.log('\n--- ISSUES ---');
  console.log(issues.slice(0, 30).join('\n'));
} else {
  console.log('No issues found!');
}
