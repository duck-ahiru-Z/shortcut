"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { gradeExam, ScrubbedQuestion } from "@/actions/exam";

type Props = {
  grade: string;
  gradeTitle: string;
  durationSeconds: number;
  questions: ScrubbedQuestion[];
};

export default function ExamClient({ grade, gradeTitle, durationSeconds, questions }: Props) {
  const router = useRouter();
  
  const [started, setStarted] = useState(false);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer logic
  useEffect(() => {
    if (!started || isSubmitting || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [started, isSubmitting, timeLeft]);

  // Keyboard Navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!started || isSubmitting) return;

    const currentQ = questions[currentIndex];
    
    switch (e.key.toLowerCase()) {
      case 'a':
        if (currentQ.choices[0]) handleSelect(currentQ.id, currentQ.choices[0]);
        break;
      case 'b':
        if (currentQ.choices[1]) handleSelect(currentQ.id, currentQ.choices[1]);
        break;
      case 'c':
        if (currentQ.choices[2]) handleSelect(currentQ.id, currentQ.choices[2]);
        break;
      case 'd':
        if (currentQ.choices[3]) handleSelect(currentQ.id, currentQ.choices[3]);
        break;
      case 'enter':
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          handleSubmit();
        }
        break;
      case 'arrowleft':
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
        break;
      case 'arrowright':
        if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
        break;
    }
  }, [started, isSubmitting, currentIndex, questions]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSelect = (qId: number, choice: string) => {
    setAnswers(prev => ({ ...prev, [qId]: choice }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const result = await gradeExam(grade, answers);
      if (result) {
        // Save to session storage for the result page
        sessionStorage.setItem("examResult", JSON.stringify({
          ...result,
          lastName,
          firstName,
          gradeTitle
        }));
        router.push("/exam/result");
      } else {
        alert("採点中にエラーが発生しました。");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      alert("通信エラーが発生しました。");
      setIsSubmitting(false);
    }
  };

  if (!started) {
    return (
      <div className="card" style={{ maxWidth: "500px", margin: "40px auto" }}>
        <h2 className="section-title">受験者情報の入力</h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
          合格証書に記載されるお名前を入力してください。
        </p>
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 700, fontSize: "14px" }}>姓</label>
            <input 
              type="text" 
              value={lastName} 
              onChange={e => setLastName(e.target.value)}
              placeholder="山田"
              style={{ width: "100%", padding: "12px", border: "2px solid var(--border-color)", fontSize: "16px", outline: "none" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 700, fontSize: "14px" }}>名</label>
            <input 
              type="text" 
              value={firstName} 
              onChange={e => setFirstName(e.target.value)}
              placeholder="太郎"
              style={{ width: "100%", padding: "12px", border: "2px solid var(--border-color)", fontSize: "16px", outline: "none" }}
            />
          </div>
        </div>
        <button 
          className={`btn ${lastName && firstName ? 'btn-primary' : 'btn-disabled'}`} 
          onClick={() => setStarted(true)}
          disabled={!lastName || !firstName}
          style={{ width: "100%" }}
        >
          試験を開始する
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div id="exam-screen" className="screen active">
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
        
        <button className="btn btn-danger" onClick={handleSubmit} disabled={isSubmitting}>
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
              onClick={handleSubmit}
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
