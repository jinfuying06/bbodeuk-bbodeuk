import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { SpaceKey } from "../data/cleaning";
import Icon from "./Icon";
import SpaceTile from "./SpaceTile";

type ItemRowProps = {
  title: string;
  sub?: string;
  /** Omit for a read-only row (no link, no chevron). */
  to?: string;
  space?: SpaceKey;
  /** Item art (object-*) in the space tile instead of the space icon. */
  icon?: string;
  /** Right-aligned caption (recency, time). */
  meta?: string;
  /** deep = item/nav rows (default); muted = Figma "Recent record" rows. */
  chevron?: "deep" | "muted";
  height?: 64 | 72;
  /**
   * List style (2026-10-15): no Surface fill, flush left, for rows stacked inside a <RowList>
   * that draws hairline dividers. Default stays the standalone Surface row.
   */
  list?: boolean;
};

/** Space row: [space tile] title/sub [meta]. With `to` it is tappable and shows a chevron. */
export default function ItemRow({ title, sub, to, space, icon, meta, chevron = "deep", height = 64, list = false }: ItemRowProps) {
  const shape = list ? "" : "rounded-row bg-sky-surface pl-3";
  const base = `flex items-center gap-3 ${shape} ${height === 72 ? "h-[72px]" : "h-16"}`;
  const body = (
    <>
      {space ? <SpaceTile icon={icon} space={space} /> : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-bb-label text-sky-ink">{title}</span>
        {sub ? <span className="block truncate text-bb-caption text-sky-muted">{sub}</span> : null}
      </span>
      {meta ? <span className="shrink-0 text-right text-bb-caption text-sky-muted">{meta}</span> : null}
    </>
  );
  if (!to) return <div className={`${base} ${list ? "" : "pr-4"}`}>{body}</div>;
  return (
    <Link className={`press ${base}`} to={to}>
      {body}
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center ${list ? "-ml-1 w-5" : "h-11 w-11"} ${chevron === "deep" ? "text-sky-deep" : "text-sky-muted"}`}
      >
        <Icon name="chevron-right" className={list ? "text-[16px]" : "text-[20px]"} />
      </span>
    </Link>
  );
}

/** Stack of list-style ItemRows separated by hairlines. */
export function RowList({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y divide-sky-line">{children}</div>;
}
