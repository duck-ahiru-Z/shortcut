import { getExamData, ScrubbedQuestion } from "@/actions/exam";
import ExamClient from "@/components/ExamClient";
import { notFound } from "next/navigation";

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default async function ExamPage({
  searchParams,
}: {
  searchParams: Promise<{ grade?: string }>;
}) {
  const grade = (await searchParams).grade || "5kyu";
  const data = await getExamData(grade);

  if (!data) {
    notFound();
  }

  // Shuffle the pool and select the required number of questions
  const shuffledPool = shuffleArray(data.pool);
  const selectedQuestions = shuffledPool.slice(0, data.questionsCount).map(q => ({
    ...q,
    choices: shuffleArray(q.choices) // Shuffle choices for each question
  }));

  return (
    <main>
      <ExamClient 
        grade={grade} 
        gradeTitle={data.title}
        durationSeconds={data.duration}
        questions={selectedQuestions} 
      />
    </main>
  );
}
