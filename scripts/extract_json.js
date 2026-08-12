const fs = require('fs');
const text = fs.readFileSync('C:/Users/iwaku/pro/shortcut2/scripts/user_json_dump.txt', 'utf-8');
const blocks = [];
let braceCount = 0;
let startIndex = -1;
let inString = false;
let escapeNext = false;

for (let i = 0; i < text.length; i++) {
  const char = text[i];
  if (escapeNext) {
    escapeNext = false;
    continue;
  }
  if (char === '\\') {
    escapeNext = true;
    continue;
  }
  if (char === '"') {
    inString = !inString;
    continue;
  }
  if (!inString) {
    if (char === '{') {
      if (braceCount === 0) startIndex = i;
      braceCount++;
    } else if (char === '}') {
      braceCount--;
      if (braceCount === 0 && startIndex !== -1) {
        blocks.push(text.substring(startIndex, i + 1));
        startIndex = -1;
      }
    }
  }
}

const knowledge = { "3kyu": [], "2kyu": [], "1kyu": [] };
const practical = { "practical-3kyu": [], "practical-2kyu": [], "practical-1kyu": [] };

blocks.forEach((block, idx) => {
  try {
    const data = JSON.parse(block);
    if (data.knowledge_pool) {
       data.knowledge_pool.forEach(q => {
          const id = String(q.id);
          if (id.startsWith('30')) knowledge["3kyu"].push(q);
          else if (id.startsWith('20')) knowledge["2kyu"].push(q);
          else if (id.startsWith('10')) knowledge["1kyu"].push(q);
       });
    }
  } catch(e) {}
});

// For practical pool, let's just use block index (0 = 3kyu, 1 = 2kyu, 2 = 1kyu)
// Assuming user pasted 3kyu, then 2kyu, then 1kyu
blocks.forEach((block, idx) => {
  try {
    const data = JSON.parse(block);
    if (data.practical_pool) {
      if (idx === 0) practical["practical-3kyu"].push(...data.practical_pool);
      else if (idx === 1) practical["practical-2kyu"].push(...data.practical_pool);
      else if (idx === 2) practical["practical-1kyu"].push(...data.practical_pool);
    }
  } catch(e) {}
});

console.log('Knowledge:', knowledge["3kyu"].length, knowledge["2kyu"].length, knowledge["1kyu"].length);
console.log('Practical:', practical["practical-3kyu"].length, practical["practical-2kyu"].length, practical["practical-1kyu"].length);

fs.writeFileSync('C:/Users/iwaku/pro/shortcut2/scripts/knowledge_pool.json', JSON.stringify(knowledge, null, 2));
fs.writeFileSync('C:/Users/iwaku/pro/shortcut2/scripts/practical_pool.json', JSON.stringify(practical, null, 2));
