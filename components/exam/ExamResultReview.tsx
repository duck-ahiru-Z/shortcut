import React from "react";
import { WrongAnswerInfo } from "@/actions/exam";

type Props = {
  score: number;
  total: number;
  wrongAnswers: WrongAnswerInfo[];
};

export default function ExamResultReview({ score, total, wrongAnswers }: Props) {
  return (
    <div className="mt-10">
      <h3 className="section-title">結果の振り返り</h3>
      <p className="text-sm text-[var(--text-muted)] mb-4">
        不正解だった問題と正しい解答、および詳細な解説を確認できます。
      </p>
      
      {score === total ? (
        <div className="p-6 border border-[var(--success)] bg-[var(--success-bg)] text-[var(--success)] text-center font-bold rounded-md">
          全問正解です！素晴らしい成績です。
        </div>
      ) : wrongAnswers && wrongAnswers.length > 0 ? (
        <div className="flex flex-col gap-4">
          {wrongAnswers.map((wrongObj, i) => (
            <div key={i} className="border border-[var(--border-color)] p-4 bg-[var(--bg-tertiary)] rounded-md">
              <p className="font-bold mb-3 leading-relaxed">
                Q. {wrongObj.question}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex-1 min-w-[200px]">
                  <span className="text-[var(--danger)] font-bold">× あなたの解答:</span>
                  <div className="mt-1 p-2 border border-[var(--danger)] bg-[var(--danger-bg)] rounded-sm">
                    {wrongObj.userAnswer}
                  </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <span className="text-[var(--success)] font-bold">○ 正しい解答:</span>
                  <div className="mt-1 p-2 border border-[var(--success)] bg-[var(--success-bg)] rounded-sm">
                    {wrongObj.correctAnswer}
                  </div>
                </div>
              </div>
              {wrongObj.explanation && (
                <div className="mt-3 pt-3 border-t border-dashed border-[var(--border-light)] text-[13px] text-[var(--text-muted)] whitespace-pre-wrap leading-relaxed">
                  <strong>【解説】</strong><br/>
                  {wrongObj.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 border border-[var(--warning)] bg-[#fff8e1] text-[#b27b00] text-center font-bold rounded-md">
          未解答の問題がありました。（間違えた問題のデータがありません）
        </div>
      )}
    </div>
  );
}
