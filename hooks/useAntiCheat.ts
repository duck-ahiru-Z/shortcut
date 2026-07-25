import { useEffect } from "react";

export function useAntiCheat(
  started: boolean,
  isSubmitting: boolean,
  setTabSwitches: React.Dispatch<React.SetStateAction<number>>
) {
  useEffect(() => {
    // コンテキストメニュー（右クリック）を常に禁止
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // 試験中（開始後かつ提出前）のみタブ切り替え回数をカウントするが、
        // 警告は試験前でも出すようにして厳格化する
        if (started && !isSubmitting) {
          setTabSwitches(prev => prev + 1);
        }
        alert("【警告】試験ページでの別ウィンドウの操作・タブ切り替えは禁止されています。（試験中は記録されます）");
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [started, isSubmitting, setTabSwitches]);
}
