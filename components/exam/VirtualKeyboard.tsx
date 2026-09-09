"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./VirtualKeyboard.module.css";

type Props = {
  os?: "windows" | "mac";
  resetKey?: string | number;
  onClose: () => void;
  onVirtualKey?: (key: string, modifiers: { ctrl: boolean; shift: boolean; alt: boolean; meta: boolean }) => void;
};

const LAYOUTS = {
  "win-us": [
    ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
    ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
    ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
    ["Ctrl", "Win", "Alt", "Space", "Alt", "Ctrl", "ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"]
  ],
  "win-jis": [
    ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
    ["半角/全角", "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "^", "¥", "Backspace"],
    ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "@", "[", "Enter"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", ":", "]"],
    ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "\\", "Shift"],
    ["Ctrl", "Win", "Alt", "無変換", "Space", "変換", "カタカナ/ひらがな", "Alt", "Ctrl", "ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"]
  ],
  "mac-us": [
    ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Delete"],
    ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Return"],
    ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
    ["fn", "Control", "Option", "Command", "Space", "Command", "Option", "ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"]
  ],
  "mac-jis": [
    ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "^", "¥", "Delete"],
    ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "@", "[", "Return"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", ":", "]"],
    ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "_", "Shift"],
    ["fn", "Control", "Option", "Command", "英数", "Space", "かな", "Command", "Option", "ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"]
  ]
};

const KEY_LABELS: Record<string, string> = {
  "Escape": "Esc",
  "Backspace": "BS",
  "Delete": "BS",
  "Return": "Enter",
  "ArrowLeft": "←",
  "ArrowRight": "→",
  "ArrowUp": "↑",
  "ArrowDown": "↓",
  "Space": " ",
  "半角/全角": "半/全",
  "カタカナ/ひらがな": "カナ/かな"
};

type LayoutType = keyof typeof LAYOUTS;

export default function VirtualKeyboard({ os = "windows", resetKey, onClose, onVirtualKey }: Props) {
  const [layout, setLayout] = useState<LayoutType>(os === "mac" ? "mac-jis" : "win-jis");
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const [ctrl, setCtrl] = useState(false);
  const [shift, setShift] = useState(false);
  const [alt, setAlt] = useState(false);
  const [meta, setMeta] = useState(false);
  // Keep modifier state synchronously available to key dispatch. React state
  // updates are batched, so reading `ctrl` immediately after clicking Ctrl
  // could otherwise dispatch the following key without the modifier.
  const modifierRef = useRef({ ctrl: false, shift: false, alt: false, meta: false });

  // Initialize position to the center of the viewport
  useEffect(() => {
    // Center the keyboard so all rows are visible on the initial display.
    // Users can still drag it to another position afterward.
    setPos({ x: 0, y: 0 });
  }, []);

  // Keep the keyboard mounted while moving between questions, but clear any
  // sticky modifiers so the next question always starts from a clean state.
  useEffect(() => {
    const next = { ctrl: false, shift: false, alt: false, meta: false };
    modifierRef.current = next;
    setCtrl(false);
    setShift(false);
    setAlt(false);
    setMeta(false);
  }, [resetKey]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, posX: pos.x, posY: pos.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPos({ x: dragStart.current.posX + dx, y: dragStart.current.posY + dy });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleModifier = (mod: "ctrl" | "shift" | "alt" | "meta") => {
    const next = { ...modifierRef.current, [mod]: !modifierRef.current[mod] };
    modifierRef.current = next;
    setCtrl(next.ctrl);
    setShift(next.shift);
    setAlt(next.alt);
    setMeta(next.meta);
  };

  const handleKeyPress = (k: string) => {
    // Map visual keys to Event key codes
    let eventKey = k;
    if (k === "Space") eventKey = " ";
    if (k === "Delete") eventKey = "Backspace";
    if (k === "Return") eventKey = "Enter";
    if (k === "Esc") eventKey = "Escape";

    const isModifier = ["Ctrl", "Control", "Shift", "Alt", "Option", "Win", "Command", "fn"].includes(k);
    
    if (isModifier) {
      if (k === "Ctrl" || k === "Control") handleModifier("ctrl");
      if (k === "Shift") handleModifier("shift");
      if (k === "Alt" || k === "Option") handleModifier("alt");
      if (k === "Win" || k === "Command") handleModifier("meta");
      return;
    }

    const modifiers = modifierRef.current;
    const event = new KeyboardEvent("keydown", {
      key: eventKey,
      ctrlKey: modifiers.ctrl,
      shiftKey: modifiers.shift,
      altKey: modifiers.alt,
      metaKey: modifiers.meta,
      bubbles: true,
      cancelable: true,
    });
    const callbackModifiers = layout.startsWith("mac") && modifiers.meta
      ? { ...modifiers, ctrl: true }
      : modifiers;
    onVirtualKey?.(k, callbackModifiers);
    // Dispatch on document so the capture listener in usePracticalKeyboard
    // receives synthetic shortcuts even when the browser reserves a key
    // combination (for example Shift+Alt+I) at the window level.
    document.dispatchEvent(event);

    // Treat command/control/option as a one-shot chord. Keeping these modifiers
    // latched across questions makes the next shortcut silently lose its
    // modifier when the user clicks the key again (especially after an
    // auto-advance). Shift remains sticky so uppercase text entry still works.
    if (modifiers.ctrl || modifiers.meta || modifiers.alt) {
      const cleared = { ...modifierRef.current, ctrl: false, meta: false, alt: false };
      modifierRef.current = cleared;
      setCtrl(false);
      setMeta(false);
      setAlt(false);
    }
  };

  const renderKey = (k: string, idx: number) => {
    const isMod = ["Ctrl", "Control", "Shift", "Alt", "Option", "Win", "Command"].includes(k);
    let isActive = false;
    if (k === "Ctrl" || k === "Control") isActive = ctrl;
    if (k === "Shift") isActive = shift;
    if (k === "Alt" || k === "Option") isActive = alt;
    if (k === "Win" || k === "Command") isActive = meta;

    let className = styles.key;
    if (isMod) className += ` ${styles.modifier} ${isActive ? styles.modifierActive : ""}`;
    if (k === "Space") className += ` ${styles.spaceBar}`;
    if (k.startsWith("F") && k.length > 1) className += ` ${styles.fnKey}`;

    const label = KEY_LABELS[k] || k;
    
    // Adjust font size for keys with long labels so they don't overflow
    let fontSize = "14px";
    if (["半/全", "カナ/かな", "無変換", "変換", "Enter", "Shift", "Command", "Option", "Control", "Backspace"].includes(label)) {
      fontSize = "12px";
    }
    if (label.length > 5) {
      fontSize = "10px";
    }

    // Keep longer Japanese/modifier labels readable instead of squeezing them
    // into the same width as single-character keys.
    const minWidth = label.length >= 7 ? 64 : label.length >= 5 ? 52 : undefined;

    return (
      <button 
        key={`${k}-${idx}`} 
        className={className} 
        style={{ fontSize, ...(minWidth ? { minWidth } : {}) }}
        onClick={(e) => { e.preventDefault(); handleKeyPress(k); }}
      >
        {label}
      </button>
    );
  };

  return (
    <div 
      className={styles.keyboardContainer}
      style={{
        left: `calc(50% + ${pos.x}px)`,
        top: `calc(50% + ${pos.y}px)`,
        transform: `translate(-50%, -50%) scale(${scale})`
      }}
    >
      <div 
        className={styles.header}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span>⠿ 仮想キーボード</span>
          <select 
            className={styles.selectLayout}
            value={layout} 
            onChange={e => setLayout(e.target.value as LayoutType)}
            onPointerDown={e => e.stopPropagation()} // Prevent drag when clicking select
          >
            <option value="win-jis">Win (JIS)</option>
            <option value="win-us">Win (US)</option>
            <option value="mac-jis">Mac (JIS)</option>
            <option value="mac-us">Mac (US)</option>
          </select>
        </div>
        <div className={styles.headerControls} onPointerDown={e => e.stopPropagation()}>
          <button className={styles.scaleBtn} onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>-</button>
          <span style={{ fontSize: '12px' }}>{Math.round(scale * 100)}%</span>
          <button className={styles.scaleBtn} onClick={() => setScale(s => Math.min(2, s + 0.1))}>+</button>
          <div style={{ width: '8px' }}></div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
      </div>

      <div className={styles.keyboardBody}>
        {LAYOUTS[layout].map((row, rIdx) => (
          <div key={rIdx} className={styles.row}>
            {row.map((k, kIdx) => renderKey(k, kIdx))}
          </div>
        ))}
      </div>
    </div>
  );
}
