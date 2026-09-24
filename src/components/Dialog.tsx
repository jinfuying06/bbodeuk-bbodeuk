import { ReactNode, useEffect, useId, useRef } from "react";
import GlassButton from "./GlassButton";

type DialogProps = {
  open: boolean;
  title: ReactNode;
  body: ReactNode;
  primaryLabel: ReactNode;
  onPrimary: () => void;
  onClose: () => void;
};

/**
 * Sky / Dialog (Figma 31:1908): scrim + white 342 card, title, body, primary GlassButton, 취소 link.
 * Layering: fixed CTA bar z-40 · header/nav z-50 · dialog z-60 · toast z-70 (feedback stays visible).
 */
export default function Dialog({ open, title, body, primaryLabel, onPrimary, onClose }: DialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  // Latest onClose without re-running the effect (callers pass inline arrows).
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-scrim px-margin-screen" role="presentation" onClick={onClose}>
      <section
        aria-describedby={`${id}-body`}
        aria-labelledby={`${id}-title`}
        aria-modal="true"
        className="flex w-full max-w-[342px] flex-col gap-4 rounded-2xl bg-sky-white px-5 pb-5 pt-[22px]"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={`${id}-title`} className="text-bb-title text-sky-ink">
          {title}
        </h2>
        <p id={`${id}-body`} className="text-bb-body text-sky-muted">
          {body}
        </p>
        <GlassButton onClick={onPrimary}>{primaryLabel}</GlassButton>
        <button ref={cancelRef} className="text-link w-full" type="button" onClick={onClose}>
          취소
        </button>
      </section>
    </div>
  );
}
