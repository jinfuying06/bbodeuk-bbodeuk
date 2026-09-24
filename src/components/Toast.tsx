import { useCallback, useEffect, useRef, useState } from "react";

type ToastProps = {
  message: string | null;
  visible: boolean;
  /**
   * false (default) → Figma ink toast: 342×52 sky-ink, top, just under the header (record saved / cancelled).
   * true → Figma pill toast: 310×48 sky-deep, bottom over the nav (settings/item saved).
   */
  pill?: boolean;
};

export default function Toast({ message, visible, pill = false }: ToastProps) {
  const position = pill
    ? "bottom-[calc(26px+env(safe-area-inset-bottom,0px))] w-[310px] max-w-[calc(100%-48px)]"
    : "top-[calc(62px+env(safe-area-inset-top,0px))] w-[calc(100%-48px)] max-w-[382px]";
  const hidden = pill ? "translate-y-2" : "-translate-y-2";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed left-1/2 z-[70] -translate-x-1/2 transition-all duration-200 ease-out ${position} ${visible ? "translate-y-0 opacity-100" : `${hidden} opacity-0`}`}
    >
      {visible && message ? (
        pill ? (
          <div className="flex h-12 items-center justify-center gap-2 rounded-3xl bg-sky-deep px-5 text-[13px] font-medium leading-[22px] text-sky-white shadow-[0_4px_12px_rgba(0,0,0,0.16)]">
            <span aria-hidden="true">✓</span>
            <span className="truncate">{message}</span>
          </div>
        ) : (
          <div className="flex h-[52px] items-center justify-center gap-2 rounded-[18px] bg-sky-ink px-4 text-sky-white shadow-[0_8px_24px_rgba(0,0,0,0.16)]">
            <span aria-hidden="true" className="text-[15px] font-bold leading-[21px]">
              ✓
            </span>
            <span className="truncate text-[13px] font-medium leading-[19px]">{message}</span>
          </div>
        )
      ) : null}
    </div>
  );
}

/**
 * Tiny helper for the common "show a toast, hide after N ms" pattern.
 *   const [toast, showToast] = useToast();
 *   showToast("청소 기록이 저장됐어요");
 *   <Toast message={toast} visible={Boolean(toast)} />
 */
export function useToast(duration = 2000) {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timerRef.current), []);
  const show = useCallback(
    (next: string) => {
      setMessage(next);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setMessage(null), duration);
    },
    [duration],
  );
  return [message, show] as const;
}
