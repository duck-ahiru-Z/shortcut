"use client";

import { useState, useEffect } from "react";
import { getRawQuestions, updateQuestions } from "@/actions/admin";

type Props = {
  grade: string;
};

import styles from "./AdminQuestionEditor.module.css";

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
    <div className={`card ${styles.container}`}>
      <div className={styles.header}>
        <h2 className={`section-title ${styles.title}`}>問題管理エディタ</h2>
        <button 
          className={`btn btn-primary ${styles.saveButton}`} 
          onClick={handleSave} 
          disabled={saving}
        >
          {saving ? "保存中..." : "変更を保存する"}
        </button>
      </div>

      {message && (
        <div className={styles.messageBox}>
          {message}
        </div>
      )}

      <div className={styles.list}>
        {questions.map((q, qIndex) => (
          <div key={q.id || qIndex} className={styles.item}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>ID: {q.id} / 問題文</label>
              <textarea
                value={q.question}
                onChange={(e) => handleChange(qIndex, "question", e.target.value)}
                className={styles.textarea}
              />
            </div>
            
            <div className={styles.choicesGrid}>
              {q.choices.map((choice: string, cIndex: number) => (
                <div key={cIndex} className={styles.choiceItem}>
                  <label className={styles.choiceLabel}>選択肢 {cIndex + 1}</label>
                  <input
                    type="text"
                    value={choice}
                    onChange={(e) => handleChoiceChange(qIndex, cIndex, e.target.value)}
                    className={styles.input}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className={styles.answerLabel}>正解 (※選択肢と完全一致させること)</label>
              <input
                type="text"
                value={q.answer}
                onChange={(e) => handleChange(qIndex, "answer", e.target.value)}
                className={styles.answerInput}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
