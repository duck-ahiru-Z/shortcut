"use client";

import { useState } from "react";
import styles from "./VirtualKeyboard.module.css";

type Props = {
  os?: "windows" | "mac";
};

export default function VirtualKeyboard({ os = "windows" }: Props) {
  const [ctrl, setCtrl] = useState(false);
  const [shift, setShift] = useState(false);
  const [alt, setAlt] = useState(false);
  const [meta, setMeta] = useState(false);

  const isMac = os === "mac";

  const handleModifier = (mod: "ctrl" | "shift" | "alt" | "meta") => {
    if (mod === "ctrl") setCtrl(!ctrl);
    if (mod === "shift") setShift(!shift);
    if (mod === "alt") setAlt(!alt);
    if (mod === "meta") setMeta(!meta);
  };

  const handleKeyPress = (key: string) => {
    // Dispatch synthetic keydown event
    const event = new KeyboardEvent("keydown", {
      key: key,
      ctrlKey: ctrl,
      shiftKey: shift,
      altKey: alt,
      metaKey: meta,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);

    // After firing a non-modifier key, auto-reset the modifiers for convenience
    setCtrl(false);
    setShift(false);
    setAlt(false);
    setMeta(false);
  };

  const getModClass = (isActive: boolean) => {
    return `${styles.key} ${styles.modifier} ${isActive ? styles.modifierActive : ""}`;
  };

  return (
    <div className={styles.keyboardContainer}>
      <div className={styles.row}>
        {["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"].map((k) => (
          <button key={k} className={`${styles.key} ${styles.fnKey}`} onTouchStart={(e) => { e.preventDefault(); handleKeyPress(k); }} onMouseDown={(e) => { e.preventDefault(); handleKeyPress(k); }}>{k}</button>
        ))}
      </div>
      <div className={styles.row}>
        {["Escape", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"].map((k) => (
          <button key={k} className={styles.key} onTouchStart={(e) => { e.preventDefault(); handleKeyPress(k); }} onMouseDown={(e) => { e.preventDefault(); handleKeyPress(k); }}>
            {k === "Escape" ? "Esc" : k === "Backspace" ? "BS" : k}
          </button>
        ))}
      </div>
      <div className={styles.row}>
        {["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"].map((k) => (
          <button key={k} className={styles.key} onTouchStart={(e) => { e.preventDefault(); handleKeyPress(k); }} onMouseDown={(e) => { e.preventDefault(); handleKeyPress(k); }}>{k}</button>
        ))}
      </div>
      <div className={styles.row}>
        {["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"].map((k) => (
          <button key={k} className={styles.key} style={k === "Enter" ? { flex: 2 } : {}} onTouchStart={(e) => { e.preventDefault(); handleKeyPress(k); }} onMouseDown={(e) => { e.preventDefault(); handleKeyPress(k); }}>{k}</button>
        ))}
      </div>
      <div className={styles.row}>
        <button className={getModClass(shift)} onTouchStart={(e) => { e.preventDefault(); handleModifier("shift"); }} onMouseDown={(e) => { e.preventDefault(); handleModifier("shift"); }}>Shift</button>
        {["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"].map((k) => (
          <button key={k} className={styles.key} onTouchStart={(e) => { e.preventDefault(); handleKeyPress(k); }} onMouseDown={(e) => { e.preventDefault(); handleKeyPress(k); }}>{k}</button>
        ))}
        <button className={getModClass(shift)} onTouchStart={(e) => { e.preventDefault(); handleModifier("shift"); }} onMouseDown={(e) => { e.preventDefault(); handleModifier("shift"); }}>Shift</button>
      </div>
      <div className={styles.row}>
        <button className={getModClass(ctrl)} onTouchStart={(e) => { e.preventDefault(); handleModifier("ctrl"); }} onMouseDown={(e) => { e.preventDefault(); handleModifier("ctrl"); }}>Ctrl</button>
        <button className={getModClass(meta)} onTouchStart={(e) => { e.preventDefault(); handleModifier("meta"); }} onMouseDown={(e) => { e.preventDefault(); handleModifier("meta"); }}>
          {isMac ? "Cmd" : "Win"}
        </button>
        <button className={getModClass(alt)} onTouchStart={(e) => { e.preventDefault(); handleModifier("alt"); }} onMouseDown={(e) => { e.preventDefault(); handleModifier("alt"); }}>Alt</button>
        <button className={`${styles.key} ${styles.spaceBar}`} onTouchStart={(e) => { e.preventDefault(); handleKeyPress(" "); }} onMouseDown={(e) => { e.preventDefault(); handleKeyPress(" "); }}>Space</button>
        <button className={styles.key} onTouchStart={(e) => { e.preventDefault(); handleKeyPress("ArrowLeft"); }} onMouseDown={(e) => { e.preventDefault(); handleKeyPress("ArrowLeft"); }}>←</button>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
          <button className={styles.key} style={{ height: "20px", fontSize: "10px", minWidth: "100%" }} onTouchStart={(e) => { e.preventDefault(); handleKeyPress("ArrowUp"); }} onMouseDown={(e) => { e.preventDefault(); handleKeyPress("ArrowUp"); }}>↑</button>
          <button className={styles.key} style={{ height: "20px", fontSize: "10px", minWidth: "100%" }} onTouchStart={(e) => { e.preventDefault(); handleKeyPress("ArrowDown"); }} onMouseDown={(e) => { e.preventDefault(); handleKeyPress("ArrowDown"); }}>↓</button>
        </div>
        <button className={styles.key} onTouchStart={(e) => { e.preventDefault(); handleKeyPress("ArrowRight"); }} onMouseDown={(e) => { e.preventDefault(); handleKeyPress("ArrowRight"); }}>→</button>
      </div>
    </div>
  );
}
