import React from "react";
import { ScrubbedQuestion } from "@/actions/exam";

type Props = {
  questions: ScrubbedQuestion[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  answers: Record<number, string>;
  handleSelect: (qId: number, choice: string) => void;
  timeLeft: number;
  isSubmitting: boolean;
  onSubmit: () => void;
};

export default function ExamActiveScreen({
  questions,
  currentIndex,
  setCurrentIndex,
  answers,
  handleSelect,
  timeLeft,
  isSubmitting,
  onSubmit
}: Props) {
  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div id="exam-screen" className="screen active" style={{ userSelect: "none" }}>
      <div className="exam-header">
        <div className="exam-progress">
          <div className="progress-text">第 {currentIndex + 1} 問 / 全 {questions.length} 問</div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>
        
        <div className={`timer-container ${timeLeft <= 300 ? 'timer-warning' : ''}`}>
          <span className="timer-val">{formatTime(timeLeft)}</span>
        </div>
        
        <button className="btn btn-danger" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? '採点中...' : '中断して提出'}
        </button>
      </div>

      <div className="keyboard-guide-bar">
        <span><strong>キーボードショートカット：</strong></span>
        <span>選択：<span className="keyboard-badge">A</span> <span className="keyboard-badge">B</span> <span className="keyboard-badge">C</span> <span className="keyboard-badge">D</span></span>
        <span>次へ/提出：<span className="keyboard-badge">Enter</span></span>
        <span>問題移動：<span className="keyboard-badge">←</span> / <span className="keyboard-badge">→</span></span>
      </div>

      <div className="card question-card">
        <div className="question-num">QUESTION {String(currentIndex + 1).padStart(2, '0')}</div>
        <div className="question-text">{currentQ.question}</div>
        
        <div className="choices-container">
          {currentQ.choices.map((choice, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            const isSelected = answers[currentQ.id] === choice;
            return (
              <button 
                key={idx}
                className={`choice-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(currentQ.id, choice)}
              >
                <div className="choice-badge">{letter}</div>
                <div>{choice}</div>
              </button>
            );
          })}
        </div>

        <div className="controls-container">
          <button 
            className="btn btn-secondary" 
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
          >
            ◀ 前の問題に戻る
          </button>
          
          {currentIndex < questions.length - 1 ? (
            <button 
              className="btn btn-primary" 
              onClick={() => setCurrentIndex(prev => prev + 1)}
            >
              次の問題に進む [Enter] ▶
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? '採点中...' : '解答を提出する [Enter]'}
            </button>
          )}
        </div>

        <div className="navigation-section">
          <div className="nav-section-title">問題ナビゲーション (数字クリックでジャンプ)</div>
          <div className="nav-grid">
            {questions.map((q, idx) => (
              <button 
                key={q.id}
                className={`nav-item ${currentIndex === idx ? 'current' : ''} ${answers[q.id] ? 'answered' : ''}`}
                onClick={() => setCurrentIndex(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
