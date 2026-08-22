const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'actions', 'exam.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update startExam
const startExamBlock = `export async function startExam(grade: string) {
  const data = await getCachedExamData(grade);
  if (!data) throw new Error("Exam not found");

  const dynamicAnswers: Record<number, string> = {};

  const shuffledPool = shuffleArray(data.pool);
  const selectedQuestions = shuffledPool.slice(0, data.questionsCount).map((q: any) => {
    const qData: any = {
      id: q.id,
      question: q.question,
    };
    if (q.choices) {
      qData.choices = shuffleArray<string>(q.choices);
    }
    if (q.type) qData.type = q.type;
    if (q.expectedKeyCombo) {
      const sortedCombo = [...q.expectedKeyCombo].sort().join("+");
      qData.expectedKeyComboHash = crypto.createHash('sha256').update(sortedCombo).digest('hex');
    }
    
    // Generate dynamic passwords
    if (q.type === 'find_password' || q.type === 'copy_paste') {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let pwd = "";
      for (let i = 0; i < 8; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
      dynamicAnswers[q.id] = pwd;
      qData.taskData = { ...q.taskData, password: pwd };
    } else if (q.taskData) {
      qData.taskData = q.taskData;
    }
    
    return qData;
  });

  const token = signPayload({
    grade,
    startTime: Date.now(),
    duration: data.duration,
    dynamicAnswers
  });

  return {
    title: data.title,
    durationSeconds: data.duration,
    questions: selectedQuestions,
    token
  };
}`;

content = content.replace(/export async function startExam\(grade: string\) \{[\s\S]*?return \{\s*title: data\.title,\s*durationSeconds: data\.duration,\s*questions: selectedQuestions,\s*token\s*\};\s*\}/, startExamBlock);

// 2. Update gradeExam
const gradeExamStart = `export async function gradeExam(token: string, userAnswers: Record<number, string>, tracking: TrackingData): Promise<GradeResult | null> {
  const payload = verifyPayload(token);
  if (!payload) {
    console.error("Invalid or tampered token");
    return null;
  }

  const { grade, startTime, duration, dynamicAnswers } = payload;`;

content = content.replace(/export async function gradeExam\(token: string, userAnswers: Record<number, string>, tracking: TrackingData\): Promise<GradeResult \| null> \{\s*const payload = verifyPayload\(token\);\s*if \(\!payload\) \{\s*console\.error\("Invalid or tampered token"\);\s*return null;\s*\}\s*const \{ grade, startTime, duration \} = payload;/, gradeExamStart);

// 3. Update gradeExam grading loop
const gradingLoop = `  for (const q of realQuestions) {
    if (answeredIds.includes(q.id)) {
      const correctAnswer = (dynamicAnswers && dynamicAnswers[q.id]) ? dynamicAnswers[q.id] : q.answer;
      if (correctAnswer === userAnswers[q.id]) {
        score++;
      } else {
        let displayCorrect = correctAnswer;
        if (q.expectedKeyCombo) {
          displayCorrect = formatKeyCombo(q.expectedKeyCombo);
        }`;

content = content.replace(/  for \(const q of realQuestions\) \{\s*if \(answeredIds\.includes\(q\.id\)\) \{\s*if \(q\.answer === userAnswers\[q\.id\]\) \{\s*score\+\+;\s*\} else \{\s*let displayCorrect = q\.answer;\s*if \(q\.expectedKeyCombo\) \{\s*displayCorrect = formatKeyCombo\(q\.expectedKeyCombo\);\s*\}/, gradingLoop);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully updated actions/exam.ts for dynamic passwords.");
