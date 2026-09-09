import fs from "node:fs";

const path = "scripts/archive/knowledge_pool.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));
const duplicateIds = new Set([3021, 3022, 3023, 3024, 3025, 3027, 3028, 3029, 3030, 3031, 3032, 3034, 3037, 3038, 3039, 3040]);
data["knowledge-3kyu"] = data["knowledge-3kyu"].filter((question) => !duplicateIds.has(question.id));
fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`knowledge-3kyu=${data["knowledge-3kyu"].length}`);
