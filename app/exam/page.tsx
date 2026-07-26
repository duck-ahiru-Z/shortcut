import ExamClient from "@/components/ExamClient";
import PracticalExamClient from "@/components/PracticalExamClient";

export default async function ExamPage({
  searchParams,
}: {
  searchParams: Promise<{ grade?: string }>;
}) {
  const grade = (await searchParams).grade || "5kyu";

  return (
    <main>
      {grade.startsWith("practical-") ? (
        <PracticalExamClient grade={grade} />
      ) : (
        <ExamClient grade={grade} />
      )}
    </main>
  );
}
