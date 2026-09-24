import { Link } from "react-router-dom";
import type { SpaceKey } from "../data/cleaning";
import Icon from "./Icon";
import SpaceTile from "./SpaceTile";

type ItemRowProps = {
  title: string;
  sub: string;
  to: string;
  space?: SpaceKey;
  /** deep = item/nav rows (default); muted = Figma "Recent record" rows. */
  chevron?: "deep" | "muted";
  height?: 64 | 72;
};

/** Tappable white row: [space tile] title/sub, chevron in a 44px slot at the right edge. */
export default function ItemRow({ title, sub, to, space, chevron = "deep", height = 64 }: ItemRowProps) {
  return (
    <Link className={`press flex items-center gap-3 rounded-row bg-sky-white pl-3 ${height === 72 ? "h-[72px]" : "h-16"}`} to={to}>
      {space ? <SpaceTile space={space} /> : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-bb-label text-sky-ink">{title}</span>
        <span className="block truncate text-bb-caption text-sky-muted">{sub}</span>
      </span>
      <span aria-hidden="true" className={`flex h-11 w-11 shrink-0 items-center justify-center ${chevron === "deep" ? "text-sky-deep" : "text-sky-muted"}`}>
        <Icon name="chevron-right" className="text-[20px]" />
      </span>
    </Link>
  );
}
