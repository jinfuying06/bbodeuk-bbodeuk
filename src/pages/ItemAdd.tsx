import { FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import { spaceToneLabels, spaceTones, type SpaceToneKey } from "../data/spaceTones";

type SpaceKey = Extract<SpaceToneKey, "bathroom" | "kitchen" | "bedroom" | "living">;

const spaceOptions: Array<{ key: SpaceKey; label: string; fill: string; text: string }> = (
  ["bathroom", "kitchen", "bedroom", "living"] as SpaceKey[]
).map((key) => ({ key, label: spaceToneLabels[key], fill: spaceTones[key].fill, text: spaceTones[key].text }));

const isSpaceKey = (value: string | null): value is SpaceKey => value === "bathroom" || value === "kitchen" || value === "bedroom" || value === "living";

export default function ItemAdd() {
  const [searchParams] = useSearchParams();
  const requestedSpace = searchParams.get("space");
  const initialSpace: SpaceKey = isSpaceKey(requestedSpace) ? requestedSpace : "bathroom";
  const [name, setName] = useState("");
  const [space, setSpace] = useState<SpaceKey>(initialSpace);
  const [spaceTouchedByUser, setSpaceTouchedByUser] = useState(false);
  const [intervalDays, setIntervalDays] = useState("");
  const [saved, setSaved] = useState(false);
  const [spaceHint, setSpaceHint] = useState<SpaceKey | null>(null);
  const [suggestedIntervalDays, setSuggestedIntervalDays] = useState<number | null>(null);
  const latestRequestId = useRef(0);
  const savedTimer = useRef<number | undefined>(undefined);
  const currentSpace = spaceOptions.find((option) => option.key === space) ?? spaceOptions[0];

  // 항목명 입력이 잠잠해지면(500ms) AI에게 공간/청소주기를 물어본다 — 어디까지나 제안일 뿐,
  // 사용자가 이미 고른 공간이나 입력한 주기를 덮어쓰지는 않는다.
  useEffect(() => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return;
    // GitHub Pages 정적 배포에는 백엔드가 없으므로 API 주소가 없으면 요청 자체를 보내지 않는다.
    if (import.meta.env.PROD && !import.meta.env.VITE_API_BASE) return;

    const requestId = ++latestRequestId.current;
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE ?? ""}/api/item-classify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemName: trimmed }),
          });
          if (!response.ok) return;
          const result = (await response.json()) as { spaceKey: string; spaceConfidence: number; intervalDays: number };
          if (requestId !== latestRequestId.current) return;
          if (!isSpaceKey(result.spaceKey)) return;

          setSuggestedIntervalDays(result.intervalDays);

          if (spaceTouchedByUser) {
            setSpaceHint(null);
            return;
          }
          if (result.spaceConfidence >= 0.8) {
            setSpace(result.spaceKey);
            setSpaceHint(null);
          } else {
            setSpaceHint(result.spaceKey);
          }
        } catch (error) {
          console.error("항목 자동분류 제안을 가져오지 못했습니다", error);
        }
      })();
    }, 500);

    return () => window.clearTimeout(timer);
  }, [name, spaceTouchedByUser]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !space || !intervalDays.trim()) return;
    setSaved(true);
    window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setSaved(false), 1200);
  };

  useEffect(() => () => window.clearTimeout(savedTimer.current), []);

  return (
    <PageShell>
      <AppHeader title="항목 추가" />
      <form id="item-add-form" className="flex flex-col gap-space-md bg-sky-bg px-margin-screen pb-[156px] pt-header" onSubmit={handleSubmit}>
        <section className="rounded-xl bg-sky-white p-space-lg text-center shadow-sm">
          <span className={`mx-auto mb-space-sm flex h-16 w-16 items-center justify-center rounded-xl ${currentSpace.fill} ${currentSpace.text}`}>
            <Icon name="add" className="text-[32px]" />
          </span>
          <h1 className="text-headline-lg text-sky-ink">새 청소 항목</h1>
          <p className="mt-1 text-body-md text-sky-muted">관리할 항목과 공간, 청소주기를 입력해요.</p>
        </section>

        <section className="rounded-xl bg-sky-white p-space-md shadow-sm">
          <label className="block text-label-md text-sky-muted" htmlFor="add-name">
            명칭
          </label>
          <input id="add-name" required className="mt-space-xs h-12 w-full rounded-xl border border-art-line bg-sky-white px-space-sm text-body-md text-sky-ink outline-none transition-colors focus:border-sky-deep" value={name} maxLength={40} onChange={(event) => setName(event.target.value)} placeholder="예: 욕실 유리거울" />
        </section>

        <section className="rounded-xl bg-sky-white p-space-md shadow-sm">
          <label className="block text-label-md text-sky-muted" htmlFor="add-space">
            공간 분류
          </label>
          <select
            id="add-space"
            required
            className="mt-space-xs h-12 w-full rounded-xl border border-art-line bg-sky-white px-space-sm text-body-md text-sky-ink outline-none transition-colors focus:border-sky-deep"
            value={space}
            onChange={(event) => {
              if (!isSpaceKey(event.target.value)) return;
              setSpace(event.target.value);
              setSpaceTouchedByUser(true);
              setSpaceHint(null);
            }}
          >
            {spaceOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
          {spaceHint && <p className="mt-space-xs text-label-md text-sky-muted">AI 추천: {spaceToneLabels[spaceHint]} (확실하지 않아 직접 선택해주세요)</p>}
        </section>

        <section className="rounded-xl bg-sky-white p-space-md shadow-sm">
          <label className="block text-label-md text-sky-muted" htmlFor="add-interval">
            청소주기
          </label>
          <div className="mt-space-xs flex items-center gap-space-xs">
            <input
              id="add-interval"
              required
              min={1}
              inputMode="numeric"
              type="number"
              className="h-12 min-w-0 flex-1 rounded-xl border border-art-line bg-sky-white px-space-sm text-body-md text-sky-ink outline-none transition-colors focus:border-sky-deep"
              value={intervalDays}
              onChange={(event) => setIntervalDays(event.target.value)}
              placeholder={suggestedIntervalDays !== null ? String(suggestedIntervalDays) : "7"}
            />
            <span className="shrink-0 text-body-md text-sky-muted">일에 한번</span>
          </div>
        </section>
      </form>

      <div className="fixed bottom-16 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 bg-sky-bg/90 px-margin-screen py-space-sm backdrop-blur-xl">
        <button className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-sky-brand text-title-sm font-semibold text-onbrand shadow-md transition-transform duration-[120ms] active:scale-[0.98]" type="submit" form="item-add-form">
          <Icon name="save" className="text-[20px]" />
          {saved ? "저장했어요" : "저장"}
        </button>
      </div>
    </PageShell>
  );
}
