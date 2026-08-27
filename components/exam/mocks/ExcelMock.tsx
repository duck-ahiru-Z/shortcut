"use client";

import { useState } from "react";
import styles from "./ExcelMock.module.css";

type Props = {
  os?: "windows" | "mac";
  isSuccess?: boolean;
  q?: any;
};

export default function ExcelMock({ os = "windows", isSuccess, q }: Props) {
  const [activeCell, setActiveCell] = useState<{r: number, c: number}>({r: 1, c: 1});

  const getCol = (c: number) => {
    const cols = ["A", "B", "C", "D", "E"];
    return cols[c] || "";
  };

  const getCellData = (r: number, c: number) => {
    if (r === 0) return ["ID", "日付", "担当者", "売上", "備考"][c] || "";
    if (c === 0) return `100${r}`;
    if (c === 1) return `2024/08/0${r}`;
    if (c === 2) return ["佐藤", "鈴木", "高橋", "田中", "伊藤"][r-1] || "";
    if (c === 3) return q?.type?.includes("formulas") && isSuccess ? `=VLOOKUP(C${r+1}, Master!A:B, 2, FALSE)` : `¥${r * 15000}`;
    return "";
  };

  return (
    <div className={styles.excelContainer}>
      <div className={styles.excelHeader}>
        <div className={styles.excelTitle}>Book1 - Excel</div>
      </div>
      <div className={styles.excelToolbar}>
        <div>ファイル</div><div>ホーム</div><div>挿入</div><div>描画</div><div>ページレイアウト</div><div>数式</div><div>データ</div>
      </div>
      <div className={styles.excelFormulaBar}>
        <div className={styles.excelNameBox}>{getCol(activeCell.c)}{activeCell.r + 1}</div>
        <div className={styles.excelFx}>fx</div>
        <div className={styles.excelFormulaInput}>{getCellData(activeCell.r, activeCell.c)}</div>
      </div>
      
      <div className={styles.excelGrid}>
        <div className={styles.excelRow}>
          <div className={styles.excelRowHeader}></div>
          {Array.from({ length: 5 }).map((_, c) => (
            <div key={`col-${c}`} className={styles.excelColHeader}>
              {getCol(c)}
              {q?.type?.includes("filter") && isSuccess && <span style={{ marginLeft: "4px", fontSize: "10px" }}>▼</span>}
            </div>
          ))}
        </div>
        
        {Array.from({ length: 6 }).map((_, r) => (
          <div key={`row-${r}`} className={styles.excelRow}>
            <div className={styles.excelRowHeader}>{r + 1}</div>
            {Array.from({ length: 5 }).map((_, c) => {
              const isActive = activeCell.r === r && activeCell.c === c;
              let showActive = isActive;
              if (isSuccess) {
                if (q?.type?.includes("used_range")) {
                  showActive = r >= 0 && r < 6 && c >= 0 && c < 5;
                } else if (q?.type?.includes("select_row")) {
                  showActive = r === activeCell.r;
                } else if (q?.type?.includes("select_column")) {
                  showActive = c === activeCell.c;
                } else {
                  showActive = (r === 5 && c === 4);
                }
              }
              return (
                <div 
                  key={c} 
                  className={`${styles.excelCell} ${showActive ? styles.excelCellActive : ''}`}
                  onClick={() => !isSuccess && setActiveCell({r, c})}
                >
                  {getCellData(r, c)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className={styles.excelTabs}>
        <div className={styles.excelTabActive}>Sheet1</div>
        <div className={styles.excelTab}>Sheet2</div>
        <div className={styles.excelTab}>Sheet3</div>
      </div>
      
      {isSuccess && (
        <div className={styles.successToast}>
          実行しました！
        </div>
      )}
    </div>
  );
}
