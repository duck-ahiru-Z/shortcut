"use client";

import { useState } from "react";
import styles from "./ExcelMock.module.css";
import WindowControls from "./WindowControls";

type Props = {
  os?: "windows" | "mac";
  isSuccess?: boolean;
  q?: any;
};

export default function ExcelMock({ os = "windows", isSuccess, q }: Props) {
  const question = q?.question || "";
  const isFilterTask = question.includes("フィルター");
  const isReturnToActiveCellTask = question.includes("画面外にあるアクティブセル");
  const isA1Task = question.includes("A1") || question.includes("先頭セル") || question.includes("ホームへ戻");
  const isSheetSwitchTask = question.includes("ワークシート") || question.includes("シートへ切り替");
  const isRangeSelectTask = question.includes("末尾まで") || question.includes("まとめて選択") || question.includes("連続データ");
  // Seed the worksheet with the context described by the task.  Previously every
  // question started on B2, which made filter and off-screen-cell tasks impossible
  // to understand from the simulator alone.
  const [activeCell, setActiveCell] = useState<{r: number, c: number}>(() =>
    isFilterTask ? { r: 0, c: 1 } : isReturnToActiveCellTask ? { r: 11, c: 1 } : isA1Task ? { r: 0, c: 0 } : { r: 1, c: 1 }
  );

  const getCol = (c: number) => {
    const cols = ["A", "B", "C", "D", "E"];
    return cols[c] || "";
  };

  const getCellData = (r: number, c: number) => {
    if (r === 0) return ["ID", "日付", "担当者", "売上", "備考"][c] || "";
    if (c === 0) return `100${r}`;
    if (c === 1) return `2024/08/0${r}`;
    if (c === 2) return ["佐藤", "鈴木", "高橋", "田中", "伊藤"][r-1] || "";
    if (c === 3) return (q?.question || "").includes("フラッシュフィル") && isSuccess ? `=VLOOKUP(C${r+1}, Master!A:B, 2, FALSE)` : `¥${r * 15000}`;
    return "";
  };

  return (
    <div className={styles.excelContainer}>
      <div className={styles.excelHeader}>
        {os === "mac" && <WindowControls os={os} />}
        <div className={styles.excelTitle} style={{ flex: 1, textAlign: os === "mac" ? "center" : "left", marginLeft: os === "mac" ? "0" : "16px" }}>Book1 - Excel</div>
        {os === "windows" && <WindowControls os={os} />}
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
              {isFilterTask && <span style={{ marginLeft: "4px", fontSize: "10px" }}>▼</span>}
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
                if (isRangeSelectTask) {
                  showActive = r >= 1 && r < 6 && c >= 1 && c < 5;
                } else if ((q?.question || "").includes("表全体")) {
                  showActive = r >= 0 && r < 6 && c >= 0 && c < 5;
                } else if ((q?.question || "").includes("行全体") || (q?.question || "").includes("行を選択")) {
                  showActive = r === activeCell.r;
                } else if ((q?.question || "").includes("列全体") || (q?.question || "").includes("列を選択")) {
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
        <div className={!isSheetSwitchTask || !isSuccess ? styles.excelTabActive : styles.excelTab}>Sheet1</div>
        <div className={isSheetSwitchTask && isSuccess ? styles.excelTabActive : styles.excelTab}>Sheet2</div>
        <div className={styles.excelTab}>Sheet3</div>
      </div>

      {isFilterTask && isSuccess && (
        <div style={{ position: "absolute", top: "92px", left: "120px", width: "170px", backgroundColor: "#fff", border: "1px solid #999", boxShadow: "0 4px 10px rgba(0,0,0,.25)", zIndex: 3, fontSize: "12px", color: "#323130" }}>
          <div style={{ padding: "8px", borderBottom: "1px solid #ddd", fontWeight: 600 }}>フィルター</div>
          <div style={{ padding: "7px 8px" }}>すべて選択</div>
          <div style={{ padding: "7px 8px", backgroundColor: "#e8f3ec" }}>☑ 佐藤</div>
          <div style={{ padding: "7px 8px" }}>☐ 鈴木</div>
          <div style={{ padding: "7px 8px" }}>☐ 高橋</div>
        </div>
      )}
      
      {isSuccess && (
        <div className={styles.successToast}>
          実行しました！
        </div>
      )}
    </div>
  );
}
