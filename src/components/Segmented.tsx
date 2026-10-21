/**
 * View switch as an underline tab bar (2026-10-22): equal-width tabs over a 1px sky-line hairline; the selected tab
 * is bold sky-deep with a 2px sky-deep underline overlapping the hairline. No track, pill or shadow.
 * Use for mutually exclusive *views* of the same screen (히스토리 날짜별/공간별, 기록 최근/자주/공간별).
 * Filters and categories (가이드 필터, 공간 칩) use <Pill size={38}> instead.
 */
export default function Segmented<K extends string>({
  options,
  value,
  onChange,
  label,
  tabsId,
}: {
  options: Array<{ key: K; label: string }>;
  value: K;
  onChange: (key: K) => void;
  /** Accessible name of the group. */
  label: string;
  /** Tab semantics instead of a toggle group: tab `${tabsId}-tab-${key}` controls panel `${tabsId}-panel-${key}`. */
  tabsId?: string;
}) {
  return (
    <div aria-label={label} className="flex border-b border-sky-line" role={tabsId ? "tablist" : "group"}>
      {options.map((option) => (
        <button
          key={option.key}
          {...(tabsId
            ? {
                role: "tab",
                id: `${tabsId}-tab-${option.key}`,
                "aria-selected": value === option.key,
                "aria-controls": `${tabsId}-panel-${option.key}`,
              }
            : { "aria-pressed": value === option.key })}
          className={`-mb-px min-h-[44px] flex-1 border-b-2 text-bb-label transition-colors duration-150 motion-reduce:transition-none ${
            value === option.key ? "border-sky-deep font-bold text-sky-deep" : "border-transparent text-sky-muted"
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
