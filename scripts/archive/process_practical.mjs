import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawData = fs.readFileSync(path.join(__dirname, '../生成２ファイル.txt'), 'utf8');
const questions = JSON.parse(rawData);

if (questions.length !== 300) {
  console.error("Expected 300 questions, got", questions.length);
  process.exit(1);
}

const formatQuestions = (startIdx, endIdx, idPrefix) => {
  return questions.slice(startIdx, endIdx).map((q, idx) => {
    return {
      id: idPrefix + idx,
      type: q.type || "generic_combo",
      question: q.question || q.q,
      expectedKeyCombo: q.expectedKeyCombo,
      answer: q.answer || "CORRECT"
    };
  });
};

const pool3kyu = formatQuestions(0, 100, 3500); // Practical ids e.g. 3500
const pool2kyu = formatQuestions(100, 200, 2500);
const pool1kyu = formatQuestions(200, 300, 1500);

const output = {
  "practical-3kyu": pool3kyu,
  "practical-2kyu": pool2kyu,
  "practical-1kyu": pool1kyu
};

fs.writeFileSync(path.join(__dirname, 'practical_pool.json'), JSON.stringify(output, null, 2));
console.log("practical_pool.json created successfully.");
