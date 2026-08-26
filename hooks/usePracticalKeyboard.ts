import { useEffect, useRef } from "react";

type Question = {
  id: number;
  expectedKeyCombo?: string[];
  expectedKeySequence?: { keys: string[] }[];
  expectedKeyComboHash?: string;
  expectedKeySequenceHashes?: string[];
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
    if (!q || (!q.expectedKeyCombo && !q.expectedKeyComboHash && !q.expectedKeySequence && !q.expectedKeySequenceHashes) || isSubmitting) return;

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
        // e.metaKey is the Command key on Mac and the Windows key on Windows.
        // The DB might expect 'meta' or 'windows'.
        // To be safe against both matching logic (hash and size comparison), 
        // we'll just let the later e.key handling add 'meta' or 'windows'.
        // But e.key might not be 'meta' if it's a combo like Cmd+C.
        // Wait, e.key for Cmd+C is 'c'. So we MUST add the modifier here.
        // Let's add the exact modifier the question expects, or both and adjust size checking?
        // Actually, let's just add 'meta' for Mac, and 'windows' for Windows if we know the OS.
        // But we don't have OS here. Let's look at navigator.
        const isMac = navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
        if (isMac) {
          pressed.add("meta");
        } else {
          pressed.add("windows");
        }
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
      } else if (q.expectedKeySequenceHashes || q.expectedKeySequence) {
        let isStepMatch = false;
        let isFirstStepMatch = false;
        
        if (q.expectedKeySequenceHashes) {
          const sortedPressed = Array.from(pressed).sort().join("+");
          const encoder = new TextEncoder();
          const data = encoder.encode(sortedPressed);
          const hashBuffer = await crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          
          isStepMatch = (hashHex === q.expectedKeySequenceHashes[sequenceIndexRef.current]);
          isFirstStepMatch = (hashHex === q.expectedKeySequenceHashes[0]);
                  } else if (q.expectedKeySequence) {
            let effectivePressed = new Set(pressed);
            const requiresShiftLayouts = ["plus", "equal", "asterisk", "question", "less", "greater", "colon", "quotedbl", "braceleft", "braceright", "bar", "tilde", "underscore", "+", "*", "?", "<", ">", ":", "\"", "{", "}", "|", "~", "_", "="];
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
            return; // Wait for next key combo
          }
        } else if (!["control", "shift", "alt", "meta", "os"].includes(mainKey)) {
          // If they pressed a final key and it didn't match the expected step, reset sequence.
          if (isFirstStepMatch) {
            sequenceIndexRef.current = 1;
            return;
          } else {
            sequenceIndexRef.current = 0;
          }
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
