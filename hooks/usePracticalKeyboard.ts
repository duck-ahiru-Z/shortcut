import { useEffect, useRef } from "react";

type Question = {
  id: number;
  expectedKeyCombo?: string[];
  expectedKeySequence?: { keys: string[] }[];
  expectedKeyComboHash?: string;
  type?: string;
};

type UsePracticalKeyboardProps = {
  q: Question | undefined;
  isSubmitting: boolean;
  onAnswer: (qId: number, answerValue: string) => void;
  onSuccess?: (qId: number) => void;
};

export function usePracticalKeyboard({ q, isSubmitting, onAnswer, onSuccess }: UsePracticalKeyboardProps) {
  const sequenceIndexRef = useRef(0);

  useEffect(() => {
    if (!q || (!q.expectedKeyCombo && !q.expectedKeyComboHash && !q.expectedKeySequence) || isSubmitting) return;

    // For tasks that require typing, we shouldn't prevent default on everything.
    const isTypingTask = q.type === "find_password" || q.type === "copy_paste" || q.type === "select_all";

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (!isTypingTask) {
        // Block all native browser actions for shortcut questions (e.g. prevent Ctrl+S from saving the page)
        e.preventDefault();
      } else {
        // For typing tasks, allow native clipboard (Ctrl+C, Ctrl+V) but block dangerous browser shortcuts
        const k = e.key.toLowerCase();
        const isDangerous = 
          (e.ctrlKey && ['r', 's', 'p'].includes(k)) ||
          (e.metaKey && ['r', 's', 'p'].includes(k)) ||
          e.key === 'F5';
        
        if (isDangerous) {
          e.preventDefault();
        }
      }

      const pressed = new Set<string>();
      if (e.ctrlKey) pressed.add("control");
      if (e.shiftKey) pressed.add("shift");
      if (e.altKey) pressed.add("alt");
      if (e.metaKey) {
        pressed.add("meta");
        pressed.add("windows");
      }

      const keyMap: Record<string, string> = { 
        " ": "space",
        ".": "period",
        ",": "comma",
        "+": "plus",
        "-": "minus",
        "=": "equal",
        ";": "semicolon",
        "'": "apostrophe",
        "/": "slash",
        "`": "grave",
        "pause": "break"
      };
      let mainKey = e.key.toLowerCase();
      if (keyMap[mainKey]) mainKey = keyMap[mainKey];
      
      if (!["control", "shift", "alt", "meta", "os"].includes(mainKey)) {
        pressed.add(mainKey);
      }

      let isMatch = false;

      if (q.expectedKeyComboHash) {
        const sortedPressed = Array.from(pressed).sort().join("+");
        const encoder = new TextEncoder();
        const data = encoder.encode(sortedPressed);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        isMatch = (hashHex === q.expectedKeyComboHash);
      } else if (q.expectedKeySequence) {
        const expectedCombo = q.expectedKeySequence[sequenceIndexRef.current].keys.map(k => k.toLowerCase());
        const isStepMatch = expectedCombo.every(k => pressed.has(k)) && pressed.size === expectedCombo.length;
        if (isStepMatch) {
          if (sequenceIndexRef.current === q.expectedKeySequence.length - 1) {
            isMatch = true;
          } else {
            sequenceIndexRef.current += 1;
            return; // Wait for next key combo
          }
        } else if (!["control", "shift", "alt", "meta", "os"].includes(mainKey)) {
          // If they pressed a final key and it didn't match the expected step, reset sequence.
          // Wait, what if it matches the FIRST step of the sequence (e.g. they started over)?
          const firstStepCombo = q.expectedKeySequence[0].keys.map(k => k.toLowerCase());
          const isFirstStepMatch = firstStepCombo.every(k => pressed.has(k)) && pressed.size === firstStepCombo.length;
          if (isFirstStepMatch) {
            sequenceIndexRef.current = 1;
            return;
          } else {
            sequenceIndexRef.current = 0;
          }
        }
      } else if (q.expectedKeyCombo) {
        const expected = q.expectedKeyCombo.map((k: string) => k.toLowerCase());
        isMatch = expected.every((k: string) => pressed.has(k)) && pressed.size === expected.length;
      }

      if (isMatch && !isTypingTask) {
        sequenceIndexRef.current = 0; // Reset for next time just in case
        if (onSuccess) {
          onSuccess(q.id);
        } else {
          onAnswer(q.id, "CORRECT");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [q, isSubmitting, onAnswer, onSuccess]);
}
