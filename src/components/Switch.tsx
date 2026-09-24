type SwitchRowProps = {
  label: string;
  on: boolean;
  onToggle: () => void;
  /** Locked on (tint track, dash-marked thumb) — e.g. required spaces. */
  locked?: boolean;
};

/** Sky / Switch (Figma 25:136) as a full 62px row: the whole row is the switch (touch target). */
export default function SwitchRow({ label, on, onToggle, locked = false }: SwitchRowProps) {
  return (
    <button
      aria-checked={on}
      aria-disabled={locked || undefined}
      aria-label={locked ? `${label} (기본 관리 공간)` : undefined}
      className="flex h-[62px] w-full items-center justify-between gap-3 rounded-row-sm bg-sky-white px-4 text-left"
      role="switch"
      type="button"
      onClick={locked ? undefined : onToggle}
    >
      <span className="truncate text-bb-label text-sky-ink">{label}</span>
      <span className={`flex h-8 w-[52px] shrink-0 items-center rounded-full px-1 transition-colors duration-200 ${locked ? "bg-sky-tint" : on ? "bg-sky-brand" : "bg-sky-line"}`}>
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full bg-sky-white transition-transform duration-200 ease-out ${on ? "translate-x-5" : ""}`}
        >
          {locked ? <span className="h-0.5 w-2.5 rounded-full bg-sky-muted" /> : null}
        </span>
      </span>
    </button>
  );
}
