"use client";

import { useMemo, useState } from "react";

type DebugQuestion = {
  id?: string | number;
  question?: string;
  choices?: string[];
  answer?: string;
  expectedKeyCombo?: string | string[];
  explanation?: string;
};

type Props = { pools: Record<string, DebugQuestion[]> };

const groups = [
  ["5kyu", "5級 知識 (Windows)"], ["4kyu", "4級 知識 (Windows)"],
  ["knowledge-3kyu", "3級 知識 (Windows)"], ["knowledge-2kyu", "2級 知識 (Windows)"], ["knowledge-1kyu", "1級 知識 (Windows)"],
  ["mac-5kyu", "5級 知識 (Mac)"], ["mac-4kyu", "4級 知識 (Mac)"], ["mac-3kyu", "3級 知識 (Mac)"], ["mac-2kyu", "2級 知識 (Mac)"], ["mac-1kyu", "1級 知識 (Mac)"],
  ["practical-5kyu", "5級 実務 (Windows)"], ["practical-4kyu", "4級 実務 (Windows)"], ["practical-3kyu", "3級 実務 (Windows)"], ["practical-2kyu", "2級 実務 (Windows)"], ["practical-1kyu", "1級 実務 (Windows)"],
  ["practical-mac-5kyu", "5級 実務 (Mac)"], ["practical-mac-4kyu", "4級 実務 (Mac)"], ["practical-mac-3kyu", "3級 実務 (Mac)"], ["practical-mac-2kyu", "2級 実務 (Mac)"], ["practical-mac-1kyu", "1級 実務 (Mac)"],
] as const;

export default function DebugQuestionBrowser({ pools }: Props) {
  const [grade, setGrade] = useState<string>(groups[0][0]);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const questions = useMemo(() => pools[grade] ?? [], [pools, grade]);
  const allRevealed = questions.length > 0 && revealed.size === questions.length;
  const toggle = (index: number) => setRevealed(prev => {
    const next = new Set(prev); next.has(index) ? next.delete(index) : next.add(index); return next;
  });

  return <>
    <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>確認する級</label>
    <select value={grade} onChange={e => { setGrade(e.target.value); setRevealed(new Set()); }} style={{ padding: "10px", minWidth: 280, marginBottom: 20 }}>
      {groups.map(([id, label]) => <option key={id} value={id} disabled={!pools[id]?.length}>{label}（{pools[id]?.length ?? 0}問）</option>)}
    </select>
    {!!questions.length && <button onClick={() => setRevealed(allRevealed ? new Set() : new Set(questions.map((_, index) => index)))} style={{ display: "block", marginBottom: 20, padding: "8px 14px", fontWeight: 700 }}>
      {allRevealed ? "すべての回答・解説を隠す" : "すべての回答・解説を表示"}
    </button>}
    {!questions.length && <p style={{ padding: 16, border: "1px solid #e2a12b", background: "#fff9e8" }}>この級の問題データはまだ登録されていません。</p>}
    <div style={{ display: "grid", gap: 12 }}>
      {questions.map((q, index) => <article key={`${q.id}-${index}`} style={{ border: "1px solid #ccd3dd", borderRadius: 8, padding: 16, background: "#fff" }}>
        <div style={{ color: "#667085", fontSize: 13, marginBottom: 6 }}>問題 {index + 1} / {questions.length}　ID: {q.id}</div>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>{q.question}</div>
        {q.choices?.map((choice, choiceIndex) => <div key={`${choice}-${choiceIndex}`} style={{ padding: "4px 0" }}>{choice}</div>)}
        <button onClick={() => toggle(index)} style={{ marginTop: 10, padding: "7px 12px" }}>{revealed.has(index) ? "回答を隠す" : "回答・解説を表示"}</button>
        {revealed.has(index) && <div style={{ marginTop: 10, padding: 12, background: "#f3f7ff" }}><div><strong>正答:</strong> {q.answer ?? "実務操作の成功判定"}</div>{q.expectedKeyCombo && <div><strong>キー:</strong> {Array.isArray(q.expectedKeyCombo) ? q.expectedKeyCombo.join(" + ") : q.expectedKeyCombo}</div>}<div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{q.explanation ?? "正答のショートカットキーを実際に操作して確認してください。"}</div></div>}
      </article>)}
    </div>
  </>;
}
