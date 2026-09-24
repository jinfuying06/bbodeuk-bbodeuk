import { getSpace, type SpaceKey } from "../data/cleaning";
import Icon from "./Icon";

/**
 * 40px space icon tile (Figma row leading). Colors always come from `getSpace(key)`.
 * `onFill` = the tile sits on a row already filled with the space color → white tile so it stays visible.
 */
export default function SpaceTile({ space, onFill = false }: { space: SpaceKey; onFill?: boolean }) {
  const { icon, color, iconColor } = getSpace(space);
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-tile transition-colors duration-300 ${onFill ? "bg-sky-white/70" : ""}`}
      style={{ backgroundColor: onFill ? undefined : color, color: iconColor }}
    >
      <Icon name={icon} className="text-[24px]" />
    </span>
  );
}
