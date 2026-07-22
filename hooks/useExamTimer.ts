import { useState, useEffect } from "react";

export function useExamTimer(
  started: boolean,
  isSubmitting: boolean,
  clientStartTime: number,
  duration: number,
  onExpire: () => void
) {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Set initial time left when starting or resuming
  useEffect(() => {
    if (started && clientStartTime > 0) {
      const elapsed = Math.floor((Date.now() - clientStartTime) / 1000);
      setTimeLeft(Math.max(0, duration - elapsed));
    }
  }, [started, clientStartTime, duration]);

  useEffect(() => {
    if (!started || isSubmitting || timeLeft <= 0 || clientStartTime === 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const elapsed = Math.floor((Date.now() - clientStartTime) / 1000);
        const remaining = duration - elapsed;
        
        if (remaining <= 0) {
          clearInterval(timer);
          onExpire();
          return 0;
        }
        return remaining;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, isSubmitting, timeLeft, clientStartTime, duration]);

  return { timeLeft, setTimeLeft };
}
