import knowledgePool from "@/scripts/archive/knowledge_pool.json";
import practicalPool from "@/scripts/archive/practical_pool.json";
import questionDump from "@/data/archive/questions_dump.json";
import DebugQuestionBrowser from "@/components/debug/DebugQuestionBrowser";

type DebugQuestion = {
  id?: string | number;
  question?: string;
  choices?: string[];
  answer?: string;
  expectedKeyCombo?: string | string[];
  explanation?: string;
};

const pools: Record<string, DebugQuestion[]> = {
  ...questionDump,
  ...knowledgePool,
  ...practicalPool,
};

export default function DebugPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
      <h1>問題デバッグ一覧</h1>
      <p style={{ color: "#555", marginBottom: 24 }}>
        各級の問題を出題順に確認できます。通常の受験出題数・合格判定には影響しません。
      </p>
      <DebugQuestionBrowser pools={pools} />
    </main>
  );
}
