import { useEffect } from "react";

export function useAntiCheat(
  started: boolean,
  isSubmitting: boolean,
  setTabSwitches: React.Dispatch<React.SetStateAction<number>>
) {
  useEffect(() => {
    if (!started || isSubmitting) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setTabSwitches(prev => prev + 1);
        alert("【警告】試験中のタブ切り替え・別ウィンドウの操作は禁止されています。この操作は記録されます。");
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
