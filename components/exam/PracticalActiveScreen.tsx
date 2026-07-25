"use client";

import { useEffect, useState, useRef } from "react";

type Question = {
  id: number;
  question: string;
  expectedKeyCombo?: string[];
};

type Props = {
  questions: Question[];
  currentIndex: number;
  timeLeft: number;
  isSubmitting: boolean;
  onCorrect: (qId: number) => void;
  onSkip: (qId: number) => void;
};

export default function PracticalActiveScreen({
  questions,
  currentIndex,
  timeLeft,
  isSubmitting,
  onCorrect,
  onSkip,
}: Props) {
  const q = questions[currentIndex];
  const [successAnim, setSuccessAnim] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus the container on mount so it catches keyboard events immediately
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!q || !q.expectedKeyCombo || isSubmitting || successAnim) return;

    // Normalize expected keys
    const expected = q.expectedKeyCombo.map(k => k.toLowerCase());

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for typical browser shortcuts we want to intercept
      // But only if they match our expected keys (to be safe), or just prevent default for everything?
      // Since it's a simulator, let's prevent default for ALL keys while focused, except F12 maybe?
      if (e.key !== "F12" && e.key !== "Escape") {
        e.preventDefault();
      }

      const pressed = new Set<string>();
      if (e.ctrlKey) pressed.add("control");
      if (e.shiftKey) pressed.add("shift");
      if (e.altKey) pressed.add("alt");
      if (e.metaKey) pressed.add("meta"); // Windows key

      // Add the actual key pressed if it's not a modifier
      const keyMap: Record<string, string> = {
        " ": "space",
      };
      
      let mainKey = e.key.toLowerCase();
      if (keyMap[mainKey]) mainKey = keyMap[mainKey];
      
      // Sometimes e.key is "Control", we already added "control" via e.ctrlKey, so this is fine.
      if (!["control", "shift", "alt", "meta", "os"].includes(mainKey)) {
        pressed.add(mainKey);
      }

      // Check if all expected keys are pressed
      const isMatch = expected.every(k => pressed.has(k)) && pressed.size === expected.length;

      if (isMatch) {
        setSuccessAnim(true);
        setTimeout(() => {
          setSuccessAnim(false);
          onCorrect(q.id);
        }, 500); // 500ms delay for animation
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [q, isSubmitting, successAnim, onCorrect]);

  if (!q) return null;

  return (
    <div 
      className="exam-container" 
      ref={containerRef}
      tabIndex={0}
      style={{ outline: 'none', display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}
    >
      <div className="exam-header" style={{ position: 'absolute', top: 0, width: '100%', maxWidth: '800px' }}>
        <div className="exam-progress-bar">
          <div 
            className="exam-progress-fill"
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          />
        </div>
        <div className="exam-header-inner">
          <div className="exam-status">
            問題 {currentIndex + 1} / {questions.length}
          </div>
          <div className={`exam-timer ${timeLeft < 600 ? "timer-warning" : ""}`}>
            残り時間: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '40px', color: 'var(--text-color)' }}>
          {q.question}
        </h2>

        {successAnim ? (
          <div style={{ color: '#4caf50', fontSize: '3rem', fontWeight: 'bold', animation: 'popIn 0.3s ease-out' }}>
            SUCCESS!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
              指示されたショートカットキーを押してください...
            </p>
            <button 
              onClick={() => onSkip(q.id)}
              className="btn btn-secondary"
              style={{ marginTop: '30px' }}
            >
              わからない（スキップ）
            </button>
          </div>
        )}
      </div>

      {/* Basic animation styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}
