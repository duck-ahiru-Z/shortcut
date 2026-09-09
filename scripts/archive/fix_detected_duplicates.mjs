import fs from "node:fs";

const questionPath = "data/archive/questions_dump.json";
const questions = JSON.parse(fs.readFileSync(questionPath, "utf8"));
const remove = (pool, ids) => { questions[pool] = (questions[pool] || []).filter((question) => !ids.has(question.id)); };
remove("mac-4kyu", new Set([1401, 1402, 1403, 1404, 1405, 409]));
remove("mac-2kyu", new Set([1254]));
remove("knowledge-2kyu", new Set());
const macAddress = questions["mac-4kyu"]?.find((question) => question.id === 1406);
if (macAddress) {
  macAddress.choices = ["A. Cmd + L", "B. Cmd + K", "C. Option + D", "D. Cmd + L と Option + D の両方"];
  macAddress.answer = "D. Cmd + L と Option + D の両方";
}
fs.writeFileSync(questionPath, `${JSON.stringify(questions, null, 2)}\n`);

const knowledgePath = "scripts/archive/knowledge_pool.json";
const knowledge = JSON.parse(fs.readFileSync(knowledgePath, "utf8"));
knowledge["knowledge-2kyu"] = knowledge["knowledge-2kyu"].filter((question) => question.id !== 2064);
fs.writeFileSync(knowledgePath, `${JSON.stringify(knowledge, null, 2)}\n`);
console.log(`mac-4kyu=${questions["mac-4kyu"].length}, mac-2kyu=${questions["mac-2kyu"].length}, knowledge-2kyu=${knowledge["knowledge-2kyu"].length}`);
