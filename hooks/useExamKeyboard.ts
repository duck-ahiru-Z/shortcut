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
    if (!started || isSubmitting) return;

    // Block F12, Ctrl+U, Ctrl+Shift+I, Ctrl+C
    if (e.key === "F12" || 
       (e.ctrlKey && e.key.toLowerCase() === "u") ||
       (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") ||
       (e.ctrlKey && e.key.toLowerCase() === "c")) {
      e.preventDefault();
      return;
    }

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
