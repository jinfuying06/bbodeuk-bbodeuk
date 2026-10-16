import { useSearchParams } from "react-router-dom";
import houseCutaway from "../assets/house-cutaway.svg";
import { SPACES } from "../data/cleaning";

export type AuthHeroVariant = "band" | "house";

/** Shipped choice for 로그인·회원가입 상단. `?hero=band|house` overrides it (review comparison, 2026-10-16). */
const DEFAULT_VARIANT: AuthHeroVariant = "band";

/**
 * Brand moment above the auth forms (2026-10-16): the forms stay quiet, color lives only here.
 * band = the five space pastels as one strip; house = the small house illustration from 가입 완료.
 */
export default function AuthHero() {
  const [params, setParams] = useSearchParams();
  const requested = params.get("hero");
  const variant: AuthHeroVariant = requested === "band" || requested === "house" ? requested : DEFAULT_VARIANT;

  return (
    <>
      {variant === "band" ? (
        <div aria-hidden="true" className="flex gap-1 pb-2 pt-1">
          {SPACES.map((space) => (
            <span key={space.key} className="h-2 flex-1 rounded-full" style={{ backgroundColor: space.color }} />
          ))}
        </div>
      ) : (
        <img alt="" aria-hidden="true" className="-mb-1 h-[128px] w-full object-contain" src={houseCutaway} />
      )}

      {/* Review-only switch, compiled in only when VITE_REVIEW=1. */}
      {import.meta.env.VITE_REVIEW === "1" ? (
        <div className="fixed bottom-4 right-4 z-50 flex rounded-full bg-sky-ink/85 p-1 text-[12px] text-sky-white shadow-lg">
          {(["band", "house"] as const).map((key) => (
            <button
              key={key}
              className={`rounded-full px-3 py-1 ${variant === key ? "bg-sky-white text-sky-ink" : ""}`}
              type="button"
              onClick={() => setParams({ hero: key }, { replace: true })}
            >
              {key === "band" ? "A 색 띠" : "B 집 일러스트"}
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}
