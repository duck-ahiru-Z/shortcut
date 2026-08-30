import { useEffect, useRef } from "react";

type Question = {
  id: number;
  question: string;
  expectedKeyCombo?: string[];
  expectedKeySequence?: { keys: string[] }[];
  expectedKeyComboHash?: string;
  expectedKeySequenceHashes?: string[];
  type?: string;
  answer?: string;
};

type UsePracticalKeyboardProps = {
  q: Question | undefined;
  isSubmitting: boolean;
  onAnswer: (qId: number, answerValue: string) => void;
  onSuccess?: (qId: number) => void;
};

async function calculateComboHash(pressedSet: Set<string>): Promise<string> {
  const sortedPressed = Array.from(pressedSet).sort().join("+");
  const encoder = new TextEncoder();
  const data = encoder.encode(sortedPressed);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function usePracticalKeyboard({ q, isSubmitting, onAnswer, onSuccess }: UsePracticalKeyboardProps) {
  const sequenceIndexRef = useRef(0);

  useEffect(() => {
    if (!q || (!q.expectedKeyCombo && !q.expectedKeyComboHash && !q.expectedKeySequence && !q.expectedKeySequenceHashes) || isSubmitting) return;

    // For tasks that require typing in an input field (like searching or renaming)
    const isTypingTask = /検索|パスワード|コピー|すべて選択|名前を変更|名前の変更|フォルダ/.test(q.question || "");

    const handleKeyDown = async (e: KeyboardEvent) => {
      // Allow specific inputs to type normally, or if typing task let clipboard work
      if (!isTypingTask && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        // Block native actions (like Ctrl+S saving the webpage)
        e.preventDefault();
      } else {
        const k = e.key.toLowerCase();
        const isDangerous = 
          (e.ctrlKey && ['r', 's', 'p'].includes(k)) ||
          (e.metaKey && ['r', 's', 'p'].includes(k)) ||
          e.key === 'F5';
        if (isDangerous) e.preventDefault();
      }

      const pressed = new Set<string>();
      if (e.ctrlKey) pressed.add("control");
      if (e.shiftKey) pressed.add("shift");
      if (e.altKey) pressed.add("alt");
      if (e.metaKey) {
        const isMac = navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
        pressed.add(isMac ? "meta" : "windows");
      }

      const keyMap: Record<string, string> = { 
        " ": "space", ".": "period", ",": "comma", "+": "plus", "-": "minus",
        "=": "equal", ";": "semicolon", "'": "apostrophe", "/": "slash",
        "`": "grave", "pause": "break"
      };
      
      let mainKey = e.key.toLowerCase();
      if (keyMap[mainKey]) mainKey = keyMap[mainKey];
      
      if (!["control", "shift", "alt", "meta", "os", "windows"].includes(mainKey)) {
        pressed.add(mainKey);
      }

      let isMatch = false;

      if (q.expectedKeyComboHash) {
        const hashHex = await calculateComboHash(pressed);
        isMatch = (hashHex === q.expectedKeyComboHash);
      } else if (q.expectedKeySequenceHashes || q.expectedKeySequence) {
        let isStepMatch = false;
        let isFirstStepMatch = false;
        
        if (q.expectedKeySequenceHashes) {
          const hashHex = await calculateComboHash(pressed);
          isStepMatch = (hashHex === q.expectedKeySequenceHashes[sequenceIndexRef.current]);
          isFirstStepMatch = (hashHex === q.expectedKeySequenceHashes[0]);
        } else if (q.expectedKeySequence) {
          const requiresShiftLayouts = ["plus", "equal", "asterisk", "question", "less", "greater", "colon", "quotedbl", "braceleft", "braceright", "bar", "tilde", "underscore", "+", "*", "?", "<", ">", ":", "\"", "{", "}", "|", "~", "_", "="];
          
          let effectivePressed = new Set(pressed);
          if (pressed.has("shift") && requiresShiftLayouts.includes(mainKey)) {
            effectivePressed.delete("shift");
          }
          
          const expectedCombo = q.expectedKeySequence[sequenceIndexRef.current].keys.map(k => k.toLowerCase());
          if (expectedCombo.includes("shift")) effectivePressed.add("shift");
          isStepMatch = expectedCombo.every(k => effectivePressed.has(k)) && effectivePressed.size === expectedCombo.length;
          
          const firstStepCombo = q.expectedKeySequence[0].keys.map(k => k.toLowerCase());
          let firstEffectivePressed = new Set(pressed);
          if (pressed.has("shift") && requiresShiftLayouts.includes(mainKey) && !firstStepCombo.includes("shift")) {
            firstEffectivePressed.delete("shift");
          }
          isFirstStepMatch = firstStepCombo.every(k => firstEffectivePressed.has(k)) && firstEffectivePressed.size === firstStepCombo.length;
        }

        const totalSteps = q.expectedKeySequenceHashes ? q.expectedKeySequenceHashes.length : (q.expectedKeySequence ? q.expectedKeySequence.length : 0);

        if (isStepMatch) {
          if (sequenceIndexRef.current === totalSteps - 1) {
            isMatch = true;
          } else {
            sequenceIndexRef.current += 1;
            return;
          }
        } else if (!["control", "shift", "alt", "meta", "os", "windows"].includes(mainKey)) {
          sequenceIndexRef.current = isFirstStepMatch ? 1 : 0;
          if (isFirstStepMatch) return;
        }
      } else if (q.expectedKeyCombo) {
        const expected = q.expectedKeyCombo.map((k: string) => k.toLowerCase());
        let effectivePressed = new Set(pressed);
        const requiresShiftLayouts = ["plus", "equal", "asterisk", "question", "less", "greater", "colon", "quotedbl", "braceleft", "braceright", "bar", "tilde", "underscore", "+", "*", "?", "<", ">", ":", "\"", "{", "}", "|", "~", "_", "="];
        
        if (!expected.includes("shift") && pressed.has("shift") && requiresShiftLayouts.includes(mainKey)) {
          effectivePressed.delete("shift");
        }
        
        isMatch = expected.every((k: string) => effectivePressed.has(k)) && effectivePressed.size === expected.length;
      }

      if (isMatch) {
        sequenceIndexRef.current = 0;
        
        // If it requires a specific string answer (not just "CORRECT"), we should NOT auto-submit.
        // The user must type/paste the answer into an input box and click submit.
        const requiresManualSubmit = q.answer !== "CORRECT" && q.answer !== undefined;

        if (!isTypingTask) {
          e.preventDefault();
        }
        
        if (!requiresManualSubmit) {
          if (onSuccess) onSuccess(q.id);
          else onAnswer(q.id, "CORRECT");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [q, isSubmitting, onAnswer, onSuccess]);
}
