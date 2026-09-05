import React from "react";
import { ScrubbedQuestion } from "@/actions/exam";
import styles from "./ExamActiveScreen.module.css";

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
    <div id="exam-screen" className={`${styles.screen} ${styles.screenActive}`}>
      <div className={styles.examHeader}>
        <div className={styles.examProgress}>
          <div className={styles.progressText}>第 {currentIndex + 1} 問 / 全 {questions.length} 問</div>
          <div className={styles.progressBarBg}>
            <div className={styles.progressBarFill} style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>
        
        <div className={`${styles.timerContainer} ${timeLeft <= 300 ? styles.timerWarning : ''}`}>
          <span className={styles.timerVal}>{formatTime(timeLeft)}</span>
        </div>
        
        <button className="btn btn-danger" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? '採点中...' : '中断して提出'}
        </button>
      </div>

      <div className={styles.keyboardGuideBar}>
        <span><strong>キーボードショートカット：</strong></span>
        <span>選択：<span className={styles.keyboardBadge}>A</span> <span className={styles.keyboardBadge}>B</span> <span className={styles.keyboardBadge}>C</span> <span className={styles.keyboardBadge}>D</span></span>
        <span>次へ/提出：<span className={styles.keyboardBadge}>Enter</span></span>
        <span>問題移動：<span className={styles.keyboardBadge}>←</span> / <span className={styles.keyboardBadge}>→</span></span>
      </div>

      <div className={`card ${styles.questionCard}`}>
        <div className={styles.questionNum}>QUESTION {String(currentIndex + 1).padStart(2, '0')}</div>
        <div className={styles.questionText}>{currentQ.question}</div>
        
        <div className={styles.choicesContainer}>
          {currentQ.choices.map((choice, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            const isSelected = answers[currentQ.id] === choice;
            // Choice strings retain their original label for server-side grading.
            // Render only the shuffled, keyboard-accessible label to avoid duplication.
            const choiceText = choice.replace(/^[A-D]\.\s*/, '');
            return (
              <button 
                key={idx}
                className={`${styles.choiceBtn} ${isSelected ? styles.choiceBtnSelected : ''}`}
                onClick={() => handleSelect(currentQ.id, choice)}
              >
                <div className={styles.choiceBadge}>{letter}</div>
                <div>{choiceText}</div>
              </button>
            );
          })}
        </div>

        <div className={styles.controlsContainer}>
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

        <div className={styles.navigationSection}>
          <div className={styles.navSectionTitle}>問題ナビゲーション (数字クリックでジャンプ)</div>
          <div className={styles.navGrid}>
            {questions.map((q, idx) => (
              <button 
                key={q.id}
                className={`${styles.navItem} ${currentIndex === idx ? styles.navItemCurrent : ''} ${answers[q.id] ? styles.navItemAnswered : ''}`}
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
