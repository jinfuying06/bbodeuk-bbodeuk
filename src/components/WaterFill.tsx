import type { CSSProperties } from "react";

type Props = {
  /** "up" fills from the bottom (home cards); "right" fills from the left (rows / bands). */
  direction: "up" | "right";
  /** 0–1. Always rendered so 0 → X animates; at 0 only the parent's base tint shows. */
  level: number;
  /** Fill color (the space color). */
  color: string;
  /** Per-card/row offset so the idle waves don't move in lockstep. */
  phase?: number;
};

// 4 wave periods, amplitude ±1.25 around the 4-unit midline. Tile is 2× the edge, slid back and forth.
const WAVE = {
  up: { line: "M0 4Q.25 1.5 .5 4T1 4T1.5 4T2 4T2.5 4T3 4T3.5 4T4 4", fill: "V8H0Z", viewBox: "0 0 4 8" },
  right: { line: "M4 0Q6.5 .25 4 .5T4 1T4 1.5T4 2T4 2.5T4 3T4 3.5T4 4", fill: "H0V0Z", viewBox: "0 0 8 4" },
};

/** Recency as a "water level" of the space color, with a gently sloshing surface. Parent needs `relative overflow-hidden`. */
export default function WaterFill({ direction, level, color, phase = 0 }: Props) {
  const wave = WAVE[direction];
  const size = direction === "up" ? { height: `${level * 100}%` } : { width: `${level * 100}%` };
  return (
    <span aria-hidden="true" className={`water-fill water-fill-${direction}`} style={{ ...size, backgroundColor: color }}>
      {level > 0 ? (
        <svg className="water-wave" viewBox={wave.viewBox} preserveAspectRatio="none" style={{ "--water-delay": `${-phase * 1.7}s` } as CSSProperties}>
          <path d={wave.line + wave.fill} fill={color} />
        </svg>
      ) : null}
    </span>
  );
}
