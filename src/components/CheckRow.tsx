import { ReactNode } from "react";
import Icon from "./Icon";

type CheckRowProps = {
  label: ReactNode;
  on: boolean;
  onClick: () => void;
  /** Always-on, not toggleable (tint check). */
  locked?: boolean;
  /** Row background while on (e.g. the space color on 주말 대청소). Default stays white. */
  fill?: string;
  trailing?: ReactNode;
};

/** Sky / Check row (Figma 25:155): 48px white row, 24px check circle (off = sky-line, on = sky-brand). */
export default function CheckRow({ label, on, onClick, locked = false, fill, trailing }: CheckRowProps) {
  return (
    <button
      aria-disabled={locked || undefined}
      aria-pressed={on}
      className="press flex h-12 items-center gap-3 rounded-2xl bg-sky-white pl-3 pr-4 text-left transition-colors duration-300"
      style={on && fill ? { backgroundColor: fill } : undefined}
      type="button"
      onClick={locked ? undefined : onClick}
    >
      <span
        aria-hidden="true"
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${locked ? "bg-sky-tint text-sky-deep" : on ? "bg-sky-brand text-onbrand" : "bg-sky-line"}`}
      >
        {on ? <Icon name="check" className="text-[16px]" /> : null}
      </span>
      <span className="flex-1 text-bb-label text-sky-ink">{label}</span>
      {trailing}
    </button>
  );
}
