import fs from "node:fs";

const path = "data/archive/questions_dump.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));
const knowledge = JSON.parse(fs.readFileSync("scripts/archive/knowledge_pool.json", "utf8"));
const transform = (value) => value.replaceAll("Ctrl", "Cmd").replaceAll("Alt + Left", "Cmd + [").replaceAll("Alt + Right", "Cmd + ]");
const canConvert = (question) => !question.choices?.some((choice) => choice.includes("Windows +"));
const convertPool = (source, target, idBase, limit) => {
  const existing = new Set((data[target] || []).map((question) => question.id));
  let added = 0;
  for (const question of source) {
    if (added >= limit || !canConvert(question)) continue;
    const id = idBase + added;
    if (existing.has(id)) continue;
    data[target].push({ ...question, id, question: transform(question.question), choices: question.choices?.map(transform), answer: transform(question.answer || ""), explanation: transform(question.explanation || "") });
    added++;
  }
  return added;
};

data["mac-5kyu"] = data["mac-5kyu"] || [];
data["mac-4kyu"] = data["mac-4kyu"] || [];
data["mac-3kyu"] = data["mac-3kyu"] || [];
const added4 = convertPool(data["4kyu"], "mac-4kyu", 1401, 20);
const added3 = convertPool(knowledge["knowledge-3kyu"], "mac-3kyu", 1301, 24);
data["mac-2kyu"] = data["mac-2kyu"] || [];
data["mac-1kyu"] = data["mac-1kyu"] || [];
const added2 = convertPool(knowledge["knowledge-2kyu"], "mac-2kyu", 1201, knowledge["knowledge-2kyu"].length);
const added1 = convertPool(knowledge["knowledge-1kyu"], "mac-1kyu", 1101, knowledge["knowledge-1kyu"].length);
fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`mac-5kyu=${data["mac-5kyu"].length}, mac-4kyu=${data["mac-4kyu"].length} (+${added4}), mac-3kyu=${data["mac-3kyu"].length} (+${added3}), mac-2kyu=${data["mac-2kyu"].length} (+${added2}), mac-1kyu=${data["mac-1kyu"].length} (+${added1})`);
