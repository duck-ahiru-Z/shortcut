import ExamClient from "@/components/ExamClient";

export default async function ExamPage({
  searchParams,
}: {
  searchParams: Promise<{ grade?: string }>;
}) {
  const grade = (await searchParams).grade || "5kyu";

  return (
    <main>
      <ExamClient grade={grade} />
    </main>
  );
}
