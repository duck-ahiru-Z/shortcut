"use client";

import { useState, useEffect } from "react";
import { getRawQuestions, updateQuestions } from "@/actions/admin";

type Props = {
  grade: string;
};

export default function AdminQuestionEditor({ grade }: Props) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadQuestions();
  }, [grade]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const data = await getRawQuestions(grade);
      setQuestions(data);
    } catch (err) {
      console.error(err);
      setMessage("問題の取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!confirm("問題を上書き保存します。よろしいですか？")) return;
    setSaving(true);
    setMessage("");
    try {
      await updateQuestions(grade, questions);
      setMessage("保存しました！");
    } catch (err) {
      console.error(err);
      setMessage("保存に失敗しました。");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (index: number, field: string, value: any) => {
    const newQs = [...questions];
    newQs[index][field] = value;
    setQuestions(newQs);
  };

  const handleChoiceChange = (qIndex: number, cIndex: number, value: string) => {
    const newQs = [...questions];
    newQs[qIndex].choices[cIndex] = value;
    setQuestions(newQs);
  };

  if (loading) return <div>問題データを読み込み中...</div>;

  return (
    <div className="card" style={{ marginTop: "32px", padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 className="section-title" style={{ margin: 0, fontSize: "18px" }}>問題管理エディタ</h2>
        <button 
          className="btn btn-primary" 
          onClick={handleSave} 
          disabled={saving}
          style={{ padding: "8px 24px" }}
        >
          {saving ? "保存中..." : "変更を保存する"}
        </button>
      </div>

      {message && (
        <div style={{ padding: "12px", marginBottom: "24px", backgroundColor: "var(--success-bg)", color: "var(--success)", border: "1px solid var(--success)" }}>
          {message}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {questions.map((q, qIndex) => (
          <div key={q.id || qIndex} style={{ padding: "16px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-tertiary)" }}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontWeight: 700, marginBottom: "8px" }}>ID: {q.id} / 問題文</label>
              <textarea
                value={q.question}
                onChange={(e) => handleChange(qIndex, "question", e.target.value)}
                style={{ width: "100%", padding: "8px", minHeight: "80px", border: "1px solid var(--border-color)", outline: "none" }}
              />
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
              {q.choices.map((choice: string, cIndex: number) => (
                <div key={cIndex} style={{ flex: "1 1 200px" }}>
                  <label style={{ display: "block", fontSize: "12px", marginBottom: "4px" }}>選択肢 {cIndex + 1}</label>
                  <input
                    type="text"
                    value={choice}
                    onChange={(e) => handleChoiceChange(qIndex, cIndex, e.target.value)}
                    style={{ width: "100%", padding: "8px", border: "1px solid var(--border-color)", outline: "none" }}
                  />
                </div>
              ))}
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 700, marginBottom: "8px", color: "var(--danger)" }}>正解 (※選択肢と完全一致させること)</label>
              <input
                type="text"
                value={q.answer}
                onChange={(e) => handleChange(qIndex, "answer", e.target.value)}
                style={{ width: "100%", padding: "8px", border: "1px solid var(--danger)", backgroundColor: "var(--danger-bg)", outline: "none" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
