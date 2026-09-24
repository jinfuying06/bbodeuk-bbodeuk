import { ReactNode } from "react";
import Icon from "./Icon";

type PillProps = {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  /** Optional 16px space icon (e.g. "space-bath"); keeps its own space color via `iconClassName`. */
  icon?: string;
  iconClassName?: string;
  /** 44 = Sky / Chip (segmented, default), 38 = space/filter pill (radius 19). */
  size?: 44 | 38;
  className?: string;
};

/** Sky / Chip (Figma 25:146) and space pill: white/muted ↔ sky-brand/onbrand. */
export default function Pill({ children, selected = false, onClick, icon, iconClassName = "", size = 44, className = "" }: PillProps) {
  return (
    <button
      aria-pressed={selected}
      className={`flex items-center justify-center gap-[5px] rounded-full text-bb-label transition-colors duration-150 ${size === 44 ? "h-11 px-4" : "h-[38px] px-3"} ${
        selected ? "bg-sky-brand text-onbrand" : "bg-sky-white text-sky-muted"
      } ${className}`}
      type="button"
      onClick={onClick}
    >
      {icon ? <Icon name={icon} className={`text-[16px] ${iconClassName}`} /> : null}
      {children}
    </button>
  );
}
