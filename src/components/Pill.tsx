import { ReactNode } from "react";
import Icon from "./Icon";

type PillProps = {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  /** Optional 16px space icon (e.g. "space-bath") in its own space color (`iconColor`). */
  icon?: string;
  iconColor?: string;
  /** Space chips: selected fill = this space color with bold Ink label, no border. Omit → navy. */
  selectedColor?: string;
  /** 44 = Sky / Chip (segmented, default), 38 = space/filter pill (radius 19). */
  size?: 44 | 38;
  className?: string;
};

/** Sky / Chip (Figma 25:146) and space pill: surface/muted ↔ sky-deep/white, or space color/ink for space chips. */
export default function Pill({ children, selected = false, onClick, icon, iconColor, selectedColor, size = 44, className = "" }: PillProps) {
  const spaceSelected = selected && selectedColor;
  return (
    <button
      aria-pressed={selected}
      className={`flex items-center justify-center gap-[5px] rounded-full text-bb-label transition-colors duration-150 ${size === 44 ? "h-11 px-4" : "h-[38px] px-3"} ${
        spaceSelected ? "font-bold text-sky-ink" : selected ? "bg-sky-deep text-sky-white" : "bg-sky-surface text-sky-muted"
      } ${className}`}
      style={spaceSelected ? { backgroundColor: selectedColor } : undefined}
      type="button"
      onClick={onClick}
    >
      {icon ? (
        <span className="flex" style={{ color: iconColor }}>
          <Icon name={icon} className="text-[16px]" />
        </span>
      ) : null}
      {children}
    </button>
  );
}
