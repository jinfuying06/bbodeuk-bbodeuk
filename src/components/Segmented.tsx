/**
 * View switch (2026-10-16 chip policy): one Surface track, the selected segment lifts to white with a Slate label.
 * Use for mutually exclusive *views* of the same screen (히스토리 날짜별/공간별, 기록 최근/자주/공간별).
 * Filters and categories (가이드 필터, 공간 칩) use <Pill size={38}> instead.
 */
export default function Segmented<K extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: Array<{ key: K; label: string }>;
  value: K;
  onChange: (key: K) => void;
  /** Accessible name of the group. */
  label: string;
}) {
  return (
    <div aria-label={label} className="flex rounded-full bg-sky-surface p-1" role="group">
      {options.map((option) => (
        <button
          key={option.key}
          aria-pressed={value === option.key}
          className={`h-10 flex-1 rounded-full text-bb-label transition-colors duration-150 ${
            value === option.key ? "bg-sky-bg font-bold text-sky-deep shadow-[0_1px_3px_rgba(35,40,43,0.12)]" : "text-sky-muted"
          }`}
          type="button"
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
