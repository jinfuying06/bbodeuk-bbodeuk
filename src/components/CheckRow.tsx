import { ReactNode } from "react";
import Icon from "./Icon";

type CheckRowProps = {
  label: ReactNode;
  on: boolean;
  onClick: () => void;
  /** Always-on, not toggleable (tint check). */
  locked?: boolean;
  /** Row background while on (e.g. the space color on 주말 대청소). Default stays Surface. */
  fill?: string;
  trailing?: ReactNode;
  /** List style (2026-10-15): no Surface fill while off, so turning on reads as the row getting painted. */
  list?: boolean;
  /** On-state check circle color (e.g. the space ink) instead of Slate. */
  checkColor?: string;
  /** Absolutely positioned decoration inside the row (e.g. <ShineOverlay>). */
  overlay?: ReactNode;
};

/** Sky / Check row (Figma 25:155): 48px Surface row, 24px check circle (off = sky-line, on = sky-deep). */
export default function CheckRow({ label, on, onClick, locked = false, fill, trailing, list = false, checkColor, overlay }: CheckRowProps) {
  return (
    <button
      aria-disabled={locked || undefined}
      aria-pressed={on}
      className={`press relative flex h-12 items-center gap-3 overflow-hidden rounded-2xl pl-3 pr-4 text-left transition-colors duration-300 ${list ? "" : "bg-sky-surface"}`}
      style={on && fill ? { backgroundColor: fill } : undefined}
      type="button"
      onClick={locked ? undefined : onClick}
    >
      <span
        aria-hidden="true"
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${locked ? "bg-sky-tint text-sky-deep" : on ? "bg-sky-deep text-sky-white" : "bg-sky-line"}`}
        style={on && !locked && checkColor ? { backgroundColor: checkColor } : undefined}
      >
        {on ? <Icon name="check" className="text-[16px]" /> : null}
      </span>
      <span className="flex-1 text-bb-label text-sky-ink">{label}</span>
      {trailing}
      {overlay}
    </button>
  );
}
