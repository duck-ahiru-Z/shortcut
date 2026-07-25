import { useEffect, useCallback } from "react";
import { ScrubbedQuestion } from "@/actions/exam";

export function useExamKeyboard(
  started: boolean,
  isSubmitting: boolean,
  currentIndex: number,
  questions: ScrubbedQuestion[],
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
  handleSelect: (qId: number, choice: string) => void,
  handleSubmit: () => void
) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // 1. 常時ブロックする操作 (デベロッパーツール対策)
    const isMac = navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
    const isDevTools = 
      e.key === "F12" || 
      (e.ctrlKey && e.key.toLowerCase() === "u") ||
      (isMac && e.metaKey && e.altKey && e.key.toLowerCase() === "i") || // Mac Cmd+Option+I
      (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") ||
      (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j") ||
      (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") ||
      (e.ctrlKey && e.key.toLowerCase() === "c");

    if (isDevTools) {
      e.preventDefault();
      return;
    }

    // 2. 試験中のみ有効な操作 (回答ショートカット)
    if (!started || isSubmitting) return;

    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    
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
  }, [started, isSubmitting, currentIndex, questions, handleSelect, setCurrentIndex, handleSubmit]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
