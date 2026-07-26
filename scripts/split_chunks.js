const fs = require('fs');

const data = JSON.parse(fs.readFileSync('questions_dump.json', 'utf8'));

// Flatten all questions with their source grade info
const allQuestions = [];
for (const grade of Object.keys(data)) {
  for (const q of data[grade]) {
    allQuestions.push({ grade, ...q });
  }
}

const TOTAL_CHUNKS = 15;
const chunkSize = Math.ceil(allQuestions.length / TOTAL_CHUNKS);

for (let i = 0; i < TOTAL_CHUNKS; i++) {
  const chunk = allQuestions.slice(i * chunkSize, (i + 1) * chunkSize);
  fs.writeFileSync(`chunk_${i + 1}.json`, JSON.stringify(chunk, null, 2));
  console.log(`chunk_${i + 1}.json created with ${chunk.length} questions.`);
}
