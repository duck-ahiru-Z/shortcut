import questionDump from "@/data/archive/questions_dump.json";
import knowledgePool from "@/scripts/archive/knowledge_pool.json";
import practicalPool from "@/scripts/archive/practical_pool.json";
import DebugExamClient from "@/components/debug/DebugExamClient";

const pools = { ...questionDump, ...knowledgePool, ...practicalPool };

export default async function DebugExamPage({ searchParams }: { searchParams: Promise<{ grade?: string }> }) {
  const grade = (await searchParams).grade || "5kyu";
  return <main><DebugExamClient grade={grade} pool={(pools as Record<string, unknown[]>)[grade] || []} /></main>;
}
