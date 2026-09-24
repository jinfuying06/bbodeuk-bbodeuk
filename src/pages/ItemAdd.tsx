import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import PageShell from "../components/PageShell";
import Pill from "../components/Pill";
import { addItem, getActiveSpaces, getSpace, isSpaceKey, type SpaceKey } from "../data/cleaning";
import { spaceIconClass } from "./QuickRecord";

export const fieldClass =
  "h-[52px] w-full rounded-xl border border-sky-line bg-sky-white pl-4 pr-4 text-bb-body text-sky-ink outline-none transition-colors placeholder:text-sky-muted focus:border-sky-brand";

export default function ItemAdd() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const spaces = useMemo(() => getActiveSpaces(), []);
  const requestedSpace = searchParams.get("space");
  const [name, setName] = useState("");
  const [space, setSpace] = useState<SpaceKey>(isSpaceKey(requestedSpace) ? requestedSpace : spaces[0]?.key ?? "bathroom");
  const [spaceTouchedByUser, setSpaceTouchedByUser] = useState(false);
  const [intervalDays, setIntervalDays] = useState("7");
  const [spaceHint, setSpaceHint] = useState<SpaceKey | null>(null);
  const latestRequestId = useRef(0);
  const valid = name.trim().length > 0 && Number(intervalDays) >= 1;

  // 항목명 입력이 잠잠해지면(500ms) AI에게 공간/청소주기를 물어본다 — 제안일 뿐,
  // 사용자가 이미 고른 공간은 덮어쓰지 않는다.
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
          if (requestId !== latestRequestId.current || !isSpaceKey(result.spaceKey)) return;
          if (spaceTouchedByUser) return setSpaceHint(null);
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
    if (!valid) return;
    addItem(name.trim(), space, Math.round(Number(intervalDays)));
    // Land on /spaces with the new item's space expanded.
    navigate(`/spaces?space=${space}`, { replace: true });
  };

  return (
    <PageShell>
      <AppHeader title="항목 추가" back="/spaces" />
      <form className="flex flex-col gap-3 px-margin-screen pb-nav pt-header" onSubmit={handleSubmit}>
        <section className="flex min-h-[88px] flex-col gap-2">
          <h1 className="text-bb-heading text-sky-ink">돌볼 곳을 추가해요</h1>
          <p className="text-bb-body text-sky-muted">나에게 맞는 이름과 주기를 정해요.</p>
        </section>

        <label className="flex flex-col gap-1.5 text-bb-label text-sky-ink">
          항목 이름
          <input className={fieldClass} maxLength={40} placeholder="예: 욕실 유리거울" required value={name} onChange={(event) => setName(event.target.value)} />
        </label>

        <p className="text-bb-label text-sky-ink">공간 선택</p>
        <div aria-label="공간 선택" className="flex gap-[10px]" role="group">
          {spaces.map((entry) => (
            <Pill
              key={entry.key}
              className="min-w-0 flex-1 !px-[7px]"
              icon={entry.icon}
              iconClassName={spaceIconClass[entry.key]}
              selected={space === entry.key}
              onClick={() => {
                setSpace(entry.key);
                setSpaceTouchedByUser(true);
                setSpaceHint(null);
              }}
            >
              {entry.label}
            </Pill>
          ))}
        </div>
        {spaceHint ? <p className="text-bb-caption text-sky-muted">AI 추천: {getSpace(spaceHint).label} (확실하지 않아 직접 선택해주세요)</p> : null}

        <label className="flex flex-col gap-1.5 text-bb-label text-sky-ink">
          청소 주기
          <span className={`${fieldClass} flex items-center focus-within:border-sky-brand`}>
            <input
              aria-label="청소 주기 (일)"
              className="bg-transparent text-bb-body text-sky-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              style={{ width: `${Math.max(intervalDays.length, 1) + 0.6}ch` }}
              inputMode="numeric"
              max={365}
              min={1}
              required
              type="number"
              value={intervalDays}
              onChange={(event) => setIntervalDays(event.target.value)}
            />
            <span className="text-bb-body text-sky-ink">일에 한 번</span>
          </span>
        </label>

        <section className="flex flex-col gap-2 rounded-3xl bg-sky-tint px-5 pb-4 pt-4">
          <h2 className="text-bb-title text-sky-ink">주기는 가벼운 참고예요</h2>
          <p className="text-bb-body text-sky-muted">
            때가 됐다고 반드시 해야 하는 건 아니에요.
            <br />내 생활에 맞게 언제든 바꿀 수 있어요.
          </p>
        </section>

        <GlassButton disabled={!valid} type="submit">
          항목 저장하기
        </GlassButton>
      </form>
    </PageShell>
  );
}
