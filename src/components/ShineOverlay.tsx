import Icon from "./Icon";

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Figma Glass / light sweep: one left→right pass, 480ms. Stable ref → runs once per mount. */
const playSweep = (el: HTMLElement | null) => {
  if (!el || reducedMotion()) return;
  el.animate([{ transform: "translateX(0) rotate(10deg)", opacity: 1 }, { transform: "translateX(520px) rotate(10deg)", opacity: 1 }], {
    duration: 480,
    easing: "cubic-bezier(.2,.7,.2,1)",
    fill: "forwards",
  });
};

/** Figma Glass / sparkle: fades/scales in during the sweep, gone by ~1.2s. */
const playSparkle = (el: HTMLElement | null) => {
  if (!el || reducedMotion()) return;
  el.animate(
    [
      { opacity: 0, transform: "scale(.6)" },
      { opacity: 1, transform: "scale(1)", offset: 0.35 },
      { opacity: 1, transform: "scale(1)", offset: 0.7 },
      { opacity: 0, transform: "scale(.9)" },
    ],
    { duration: 1200, easing: "ease-out", fill: "forwards" },
  );
};

const sweepGradient = "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(225,243,255,.22) 32%, rgba(255,255,255,.88) 50%, rgba(225,243,255,.22) 68%, rgba(255,255,255,0) 100%)";

/**
 * The record "glass" feedback (sweep + sparkle), shared by 기록 tiles/rows and 대청소 check rows.
 * Change `n` to replay. Parent must be `relative overflow-hidden`.
 */
export default function ShineOverlay({ n, sparkleClass, sweepClass }: { n: number; sparkleClass: string; sweepClass: string }) {
  return (
    <>
      <span key={`sw-${n}`} ref={playSweep} aria-hidden="true" className={`pointer-events-none absolute opacity-0 mix-blend-screen ${sweepClass}`} style={{ background: sweepGradient }} />
      <span key={`sp-${n}`} ref={playSparkle} aria-hidden="true" className={`pointer-events-none absolute opacity-0 text-sky-white ${sparkleClass}`}>
        <Icon name="sparkle" className="drop-shadow-[0_0_2px_rgba(22,88,127,.35)]" />
      </span>
    </>
  );
}
