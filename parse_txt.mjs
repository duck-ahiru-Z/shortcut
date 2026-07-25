import fs from 'fs';

const text = fs.readFileSync('ショートカットキー検定５級　問題.txt', 'utf-8');
const lines = text.split('\n').map(l => l.trim()).filter(l => l);

const questions = [];
let currentQ = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.match(/^Q\d+/)) {
    if (currentQ) questions.push(currentQ);
    currentQ = { question: line, choices: [], answer: '' };
  } else if (currentQ && (line.startsWith('A.') || line.startsWith('B.') || line.startsWith('C.') || line.startsWith('D.'))) {
    currentQ.choices.push(line);
  } else if (currentQ && line.startsWith('正解:')) {
    currentQ.answer = line.replace('正解:', '').trim();
  }
}
if (currentQ) questions.push(currentQ);

fs.writeFileSync('questions_dump.json', JSON.stringify(questions, null, 2));
console.log(`Parsed ${questions.length} questions`);
