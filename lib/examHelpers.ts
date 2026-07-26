/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Formats a key combination array (e.g., ["control", "c"]) into a readable string (e.g., "Ctrl + C").
 */
export const formatKeyCombo = (combo: string[]) => {
  if (!combo || !Array.isArray(combo) || combo.length === 0) return "CORRECT";
  
  const map: Record<string, string> = {
    "control": "Ctrl", "shift": "Shift", "alt": "Alt", "meta": "Win", "escape": "Esc",
    "enter": "Enter", "space": "Space", "arrowup": "↑", "arrowdown": "↓", "arrowleft": "←",
    "arrowright": "→", "period": ".", "comma": ",", "plus": "+", "minus": "-", "equal": "=",
    "semicolon": ";", "apostrophe": "'", "slash": "/", "grave": "`", "backspace": "Backspace",
    "delete": "Delete", "insert": "Insert", "home": "Home", "end": "End", "pageup": "PageUp",
    "pagedown": "PageDown", "printscreen": "PrtScn"
  };

  return combo.map(k => {
    const lower = k.toLowerCase();
    if (map[lower]) return map[lower];
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join(" + ");
};
