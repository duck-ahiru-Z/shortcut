import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawData = fs.readFileSync(path.join(__dirname, '../生成ファイル.txt'), 'utf8');
const questions = JSON.parse(rawData);

if (questions.length !== 300) {
  console.error("Expected 300 questions, got", questions.length);
  process.exit(1);
}

const formatQuestions = (startIdx, endIdx, idPrefix) => {
  return questions.slice(startIdx, endIdx).map((q, idx) => {
    return {
      id: idPrefix + idx,
      question: q.q,
      choices: q.c,
      answer: q.a
    };
  });
};

const pool3kyu = formatQuestions(0, 100, 3000);
const pool2kyu = formatQuestions(100, 200, 2000);
const pool1kyu = formatQuestions(200, 300, 1000);

const output = {
  "3kyu": pool3kyu,
  "2kyu": pool2kyu,
  "1kyu": pool1kyu
};

fs.writeFileSync(path.join(__dirname, 'knowledge_pool.json'), JSON.stringify(output, null, 2));
console.log("knowledge_pool.json created successfully.");
