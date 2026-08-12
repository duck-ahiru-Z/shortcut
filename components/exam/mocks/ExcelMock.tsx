"use client";

import { useState } from "react";
import styles from "./ExcelMock.module.css";

type Props = {
  os?: "windows" | "mac";
  isSuccess?: boolean;
};

export default function ExcelMock({ os = "windows", isSuccess }: Props) {
  const [activeCell, setActiveCell] = useState<{r: number, c: number}>({r: 1, c: 1});

  return (
    <div className={styles.excelContainer}>
      <div className={styles.excelHeader}>
        {os === "mac" ? (
          <div style={{ display: 'flex', gap: '6px', marginRight: '16px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
          </div>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
        )}
        {os === "mac" ? "Numbers / Excel" : "スプレッドシート"}
      </div>
      <div className={styles.excelBody}>
        <div className={styles.excelGrid}>
          {Array.from({ length: 6 }).map((_, r) => (
            <div key={r} className={styles.excelRow}>
              {Array.from({ length: 4 }).map((_, c) => {
                const isActive = activeCell.r === r && activeCell.c === c;
                // If success, jump selection to bottom right artificially for visual effect
                const showActive = isSuccess ? (r === 5 && c === 3) : isActive;
                return (
                  <div 
                    key={c} 
                    className={`${styles.excelCell} ${showActive ? styles.excelCellActive : ""}`}
                    onClick={() => setActiveCell({r, c})}
                  >
                    {r === 0 ? ["A", "B", "C", "D"][c] : `Data ${r}-${c}`}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {isSuccess && (
          <div className={styles.successToast}>
            実行しました！
          </div>
        )}
      </div>
    </div>
  );
}
