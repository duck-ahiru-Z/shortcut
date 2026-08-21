"use client";

import { useRouter } from "next/navigation";

type Props = {
  currentGrade: string;
  grades: { id: string; name: string }[];
};

export default function AdminGradeSelector({ currentGrade, grades }: Props) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGrade = e.target.value;
    router.push(`/hq-portal?grade=${newGrade}`);
  };

  const winKnowledge = grades.filter(g => g.name.includes("Win知識"));
  const winPractical = grades.filter(g => g.name.includes("Win実務"));
  const macKnowledge = grades.filter(g => g.name.includes("Mac知識"));
  const macPractical = grades.filter(g => g.name.includes("Mac実務"));

  return (
    <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "12px", background: "var(--bg-tertiary)", padding: "16px", borderRadius: "8px" }}>
      <label style={{ fontWeight: 700 }}>対象データを選択:</label>
      <select 
        value={currentGrade} 
        onChange={handleChange}
        style={{ padding: "8px 16px", fontSize: "16px", borderRadius: "4px", border: "1px solid var(--border-color)", flex: 1, maxWidth: "400px" }}
      >
        <optgroup label="Windows版 - 知識試験">
          {winKnowledge.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </optgroup>
        <optgroup label="Windows版 - 実務試験">
          {winPractical.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </optgroup>
        <optgroup label="Mac版 - 知識試験">
          {macKnowledge.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </optgroup>
        <optgroup label="Mac版 - 実務試験">
          {macPractical.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}
