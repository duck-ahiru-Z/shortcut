import fs from 'fs';
import path from 'path';

function convertTextToMac(text) {
  if (!text) return text;
  return text
    .replace(/Ctrl/g, 'Cmd')
    .replace(/Alt/g, 'Option')
    .replace(/Enter/g, 'Return')
    .replace(/Backspace/g, 'Delete')
    .replace(/Windows/g, 'Mac')
    .replace(/Winキー/g, 'Cmdキー');
}

function convertQuestion(q) {
  const newQ = { ...q };
  
  // Convert text fields
  if (newQ.question) newQ.question = convertTextToMac(newQ.question);
  if (newQ.explanation) newQ.explanation = convertTextToMac(newQ.explanation);
  
  if (newQ.choices) {
    newQ.choices = newQ.choices.map(c => convertTextToMac(c));
  }
  
  if (newQ.answer) {
    newQ.answer = convertTextToMac(newQ.answer);
  }

  // Convert practical expected combo
  if (newQ.expectedKeyCombo) {
    newQ.expectedKeyCombo = newQ.expectedKeyCombo.map(key => convertTextToMac(key));
  }

  // Task data conversion if needed
  if (newQ.taskData && newQ.taskData.targetText) {
    newQ.taskData.targetText = convertTextToMac(newQ.taskData.targetText);
  }

  return newQ;
}

async function main() {
  const dumpPath = path.join(process.cwd(), 'questions_dump.json');
  const data = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));

  // Generate Mac grades
  data['mac-5kyu'] = (data['5kyu'] || []).map(convertQuestion);
  data['mac-4kyu'] = (data['4kyu'] || []).map(convertQuestion);
  data['practical-mac-5kyu'] = (data['practical-5kyu'] || []).map(convertQuestion);
  data['practical-mac-4kyu'] = (data['practical-4kyu'] || []).map(convertQuestion);

  fs.writeFileSync(dumpPath, JSON.stringify(data, null, 2));
  console.log('Successfully generated Mac questions and updated questions_dump.json.');
  console.log(`Generated: ${data['mac-5kyu'].length} mac-5kyu, ${data['mac-4kyu'].length} mac-4kyu, ${data['practical-mac-5kyu'].length} practical-mac-5kyu, ${data['practical-mac-4kyu'].length} practical-mac-4kyu`);
}

main().catch(console.error);
