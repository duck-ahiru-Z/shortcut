import React from "react";
import { WrongAnswerInfo } from "@/actions/exam";

type Props = {
  score: number;
  total: number;
  wrongAnswers: WrongAnswerInfo[];
};

export default function ExamResultReview({ score, total, wrongAnswers }: Props) {
  return (
    <div style={{ marginTop: "40px" }}>
      <h3 className="section-title">結果の振り返り</h3>
      <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px" }}>
        不正解だった問題と正しい解答、および詳細な解説を確認できます。
      </p>
      
      {score === total ? (
        <div style={{ padding: "24px", border: "1px solid var(--success)", backgroundColor: "var(--success-bg)", color: "var(--success)", textAlign: "center", fontWeight: 700 }}>
          全問正解です！素晴らしい成績です。
        </div>
      ) : wrongAnswers && wrongAnswers.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {wrongAnswers.map((wrongObj, i) => (
            <div key={i} style={{ border: "1px solid var(--border-color)", padding: "16px", backgroundColor: "var(--bg-tertiary)" }}>
              <p style={{ fontWeight: 700, marginBottom: "12px", lineHeight: "1.5" }}>
                Q. {wrongObj.question}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "14px" }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <span style={{ color: "var(--danger)", fontWeight: 700 }}>× あなたの解答:</span>
                  <div style={{ marginTop: "4px", padding: "8px", border: "1px solid var(--danger)", backgroundColor: "var(--danger-bg)" }}>
                    {wrongObj.userAnswer}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <span style={{ color: "var(--success)", fontWeight: 700 }}>○ 正しい解答:</span>
                  <div style={{ marginTop: "4px", padding: "8px", border: "1px solid var(--success)", backgroundColor: "var(--success-bg)" }}>
                    {wrongObj.correctAnswer}
                  </div>
                </div>
              </div>
              {wrongObj.explanation && (
                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed var(--border-light)", fontSize: "13px", color: "var(--text-muted)", whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                  <strong>【解説】</strong><br/>
                  {wrongObj.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "24px", border: "1px solid var(--warning)", backgroundColor: "var(--warning-bg, #fff8e1)", color: "#b27b00", textAlign: "center", fontWeight: 700 }}>
          未解答の問題がありました。（間違えた問題のデータがありません）
        </div>
      )}
    </div>
  );
}
