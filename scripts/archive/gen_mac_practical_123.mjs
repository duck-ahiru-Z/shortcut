import fs from 'fs';

const pool = JSON.parse(fs.readFileSync('scripts/practical_pool.json', 'utf8'));

function convertToMac(q) {
  const mapStr = (str) => {
    return str
      .replace(/Ctrl/g, 'Cmd')
      .replace(/Alt/g, 'Option')
      .replace(/Windows/g, 'Command')
      .replace(/Win/g, 'Cmd')
      .replace(/Windowsキー/g, 'Commandキー')
      .replace(/control/g, 'meta')
      .replace(/alt/g, 'alt');
  };

  const newQ = { ...q, id: q.id + 10000 };
  if (newQ.question) newQ.question = mapStr(newQ.question);
  if (newQ.explanation) newQ.explanation = mapStr(newQ.explanation);
  
  if (newQ.expectedKeyCombo) {
    newQ.expectedKeyCombo = newQ.expectedKeyCombo.map(k => k === 'control' ? 'meta' : k);
  }
  
  if (newQ.expectedKeySequence) {
    newQ.expectedKeySequence = newQ.expectedKeySequence.map(item => {
      let kArr = item.keys || item;
      let newKeys = kArr.map(k => k === 'control' ? 'meta' : k);
      return { keys: newKeys };
    });
  }

  return newQ;
}

pool['practical-mac-3kyu'] = pool['practical-3kyu'].map(convertToMac);
pool['practical-mac-2kyu'] = pool['practical-2kyu'].map(convertToMac);
pool['practical-mac-1kyu'] = pool['practical-1kyu'].map(convertToMac);

fs.writeFileSync('scripts/practical_pool.json', JSON.stringify(pool, null, 2));
console.log('done');
