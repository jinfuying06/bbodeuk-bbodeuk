import { getSpace, type SpaceKey } from "../data/cleaning";
import SpaceTile from "./SpaceTile";

type SwitchRowProps = {
  label: string;
  on: boolean;
  onToggle: () => void;
  /** Locked on — e.g. required spaces. */
  locked?: boolean;
  /**
   * Space rows (2026-10-16): row wears the space color like 공간 설정 / home cards —
   * full while on, faint while off; the track uses the space ink; locked shows a "필수" chip instead of a switch.
   */
  space?: SpaceKey;
  /** Tap on a locked row (e.g. a short explanation toast). */
  onLockedTap?: () => void;
};

/** Sky / Switch (Figma 25:136) as a full 62px row: the whole row is the switch (touch target). */
export default function SwitchRow({ label, on, onToggle, locked = false, space, onLockedTap }: SwitchRowProps) {
  const tone = space ? getSpace(space) : null;
  return (
    <button
      aria-checked={on}
      aria-disabled={locked || undefined}
      aria-label={locked ? `${label} (필수 공간)` : label}
      className={`flex w-full items-center gap-3 rounded-row-sm text-left transition-colors duration-300 ${tone ? "h-16 pl-3 pr-4" : "h-[62px] bg-sky-surface px-4"}`}
      role="switch"
      style={tone ? { backgroundColor: on ? tone.color : `color-mix(in srgb, ${tone.color} 22%, white)` } : undefined}
      type="button"
      onClick={locked ? onLockedTap : onToggle}
    >
      {space ? <SpaceTile space={space} onFill /> : null}
      <span className="min-w-0 flex-1 truncate text-bb-label text-sky-ink">{label}</span>
      {locked && tone ? (
        <span className="shrink-0 rounded-full bg-sky-white/80 px-2.5 py-1 text-bb-caption font-bold" style={{ color: tone.iconColor }}>
          필수
        </span>
      ) : (
        <span
          className={`flex h-8 w-[52px] shrink-0 items-center rounded-full px-1 transition-colors duration-200 ${
            tone ? (on ? "" : "bg-sky-white/70") : locked ? "bg-sky-tint" : on ? "bg-sky-deep" : "bg-sky-line"
          }`}
          style={tone && on ? { backgroundColor: tone.iconColor } : undefined}
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full bg-sky-white transition-transform duration-200 ease-out ${on ? "translate-x-5" : ""} ${
              tone && !on ? "shadow-[0_1px_2px_rgba(35,40,43,0.18)]" : ""
            }`}
          >
            {locked ? <span className="h-0.5 w-2.5 rounded-full bg-sky-muted" /> : null}
          </span>
        </span>
      )}
    </button>
  );
}
