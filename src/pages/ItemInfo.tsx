import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import Toast from "../components/Toast";
import { hideItem, readOverrides, writeOverride } from "../data/itemStorage";
import { spaceTones, type SpaceToneKey } from "../data/spaceTones";

type SpaceKey = Extract<SpaceToneKey, "bathroom" | "kitchen" | "bedroom" | "living" | "terrace">;

type ItemData = {
  id: string;
  name: string;
  space: SpaceKey;
  spaceLabel: string;
  icon: string;
  intervalDays: number;
};

const spaceIcons: Record<SpaceKey, string> = {
  bathroom: "bathtub",
  kitchen: "countertops",
  bedroom: "bed",
  living: "chair",
  terrace: "balcony",
};

const items: ItemData[] = [
  { id: "basin", name: "세면대 수전 및 볼", space: "bathroom", spaceLabel: "욕실", icon: "wash", intervalDays: 7 },
  { id: "toilet", name: "양변기 안팎", space: "bathroom", spaceLabel: "욕실", icon: "cleaning_services", intervalDays: 7 },
  { id: "mirror", name: "욕실 유리거울", space: "bathroom", spaceLabel: "욕실", icon: "auto_awesome", intervalDays: 10 },
  { id: "drain", name: "바닥 배수구 유가 거름망", space: "bathroom", spaceLabel: "욕실", icon: "water_drop", intervalDays: 7 },
  { id: "sink", name: "싱크대 거름망", space: "kitchen", spaceLabel: "주방", icon: "faucet", intervalDays: 3 },
  { id: "countertop", name: "인덕션 상판 및 조리대", space: "kitchen", spaceLabel: "주방", icon: "countertops", intervalDays: 5 },
  { id: "hood", name: "레인지 후드 필터", space: "kitchen", spaceLabel: "주방", icon: "filter_alt", intervalDays: 21 },
  { id: "bedding", name: "침실 침구", space: "bedroom", spaceLabel: "침실", icon: "bed", intervalDays: 7 },
  { id: "pillow", name: "베개 커버", space: "bedroom", spaceLabel: "침실", icon: "hotel", intervalDays: 7 },
  { id: "living-floor", name: "거실 바닥", space: "living", spaceLabel: "거실", icon: "mop", intervalDays: 7 },
  { id: "air-filter", name: "공기청정기 프리필터", space: "living", spaceLabel: "거실", icon: "air", intervalDays: 30 },
  { id: "door-handle", name: "문 손잡이", space: "living", spaceLabel: "거실", icon: "sensor_door", intervalDays: 14 },
  { id: "terrace-floor", name: "테라스 바닥", space: "terrace", spaceLabel: "테라스", icon: "balcony", intervalDays: 14 },
  { id: "rail", name: "난간", space: "terrace", spaceLabel: "테라스", icon: "fence", intervalDays: 21 },
  { id: "laundry", name: "빨래 공간", space: "terrace", spaceLabel: "테라스", icon: "local_laundry_service", intervalDays: 14 },
];

const spaceOptions: Array<{ key: SpaceKey; label: string }> = [
  { key: "bathroom", label: "욕실" },
  { key: "kitchen", label: "주방" },
  { key: "bedroom", label: "침실" },
  { key: "living", label: "거실" },
  { key: "terrace", label: "테라스" },
];

const isSpaceKey = (value: string): value is SpaceKey =>
  value === "bathroom" || value === "kitchen" || value === "bedroom" || value === "living" || value === "terrace";

type DeleteConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteConfirmDialog({ open, onClose, onConfirm }: DeleteConfirmDialogProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-on-surface/40" role="presentation" onClick={onClose}>
      <section
        aria-labelledby="delete-confirm-title"
        aria-modal="true"
        className="w-full max-w-[430px] rounded-t-2xl bg-sky-white px-margin-screen pb-[calc(24px+env(safe-area-inset-bottom,0px))] pt-space-lg shadow-xl"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-tint text-sky-deep">
          <Icon name="delete_outline" className="text-[22px]" />
        </span>
        <h2 id="delete-confirm-title" className="mt-space-md text-headline-md text-sky-ink">
          청소 항목을 삭제할까요?
        </h2>
        <p className="mt-space-sm text-body-md text-sky-muted">목록에서 항목을 숨겨요. 이전 청소 기록은 히스토리에 남아 있어요.</p>
        <button
          className="mt-space-lg flex h-12 w-full items-center justify-center rounded-full bg-sky-brand text-title-sm text-onbrand transition-transform duration-[120ms] active:scale-[0.98]"
          type="button"
          onClick={onConfirm}
        >
          항목 삭제
        </button>
        <button ref={closeButtonRef} className="mt-space-sm flex h-12 w-full items-center justify-center rounded-full text-title-sm text-sky-muted" type="button" onClick={onClose}>
          취소
        </button>
      </section>
    </div>
  );
}

export default function ItemInfo() {
  const [searchParams] = useSearchParams();
  const item = items.find((entry) => entry.id === searchParams.get("item"));
  // Unknown id: don't edit (and save overrides for) some other item — go back to the space list.
  if (!item) return <Navigate to="/spaces" replace />;
  return <ItemInfoForm key={item.id} item={item} />;
}

function ItemInfoForm({ item }: { item: ItemData }) {
  const navigate = useNavigate();
  const override = readOverrides()[item.id];
  const [name, setName] = useState(override?.name ?? item.name);
  const [space, setSpace] = useState<SpaceKey>(override && isSpaceKey(override.space) ? override.space : item.space);
  const [intervalDays, setIntervalDays] = useState(String(override?.intervalDays ?? item.intervalDays));
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const savedTimerRef = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(savedTimerRef.current), []);
  const tone = spaceTones[space];
  const spaceLabel = spaceOptions.find((option) => option.key === space)?.label ?? item.spaceLabel;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const parsedInterval = Number(intervalDays);
    if (!trimmedName || !intervalDays.trim() || !Number.isFinite(parsedInterval) || parsedInterval < 1) return;
    writeOverride(item.id, { name: trimmedName, space, intervalDays: parsedInterval });
    setSaved(true);
    window.clearTimeout(savedTimerRef.current);
    savedTimerRef.current = window.setTimeout(() => setSaved(false), 1200);
  };

  const handleDelete = () => {
    hideItem(item.id);
    setShowDeleteConfirm(false);
    navigate("/spaces", { replace: true });
  };

  return (
    <PageShell>
      <AppHeader title="아이템 상세 보기" />
      <form id="item-info-form" className="flex flex-col gap-space-md bg-sky-bg px-margin-screen pb-[220px] pt-header" onSubmit={handleSubmit}>
        <section className="rounded-xl bg-sky-white p-space-lg text-center shadow-sm">
          <span className={`mx-auto mb-space-sm flex h-16 w-16 items-center justify-center rounded-xl ${tone.fill} ${tone.text}`}>
            <Icon name={spaceIcons[space]} className="text-[32px]" />
          </span>
          <h1 className="text-headline-lg text-sky-ink">{name || item.name}</h1>
          <p className="mt-1 text-body-md text-sky-muted">
            {spaceLabel} · {intervalDays || item.intervalDays}일에 한번
          </p>
        </section>

        <section className="rounded-xl bg-sky-white p-space-md shadow-sm">
          <label className="block text-label-md text-sky-muted" htmlFor="item-name">
            명칭
          </label>
          <input
            id="item-name"
            required
            className="mt-space-xs h-12 w-full rounded-xl border border-art-line bg-sky-white px-space-sm text-body-md text-sky-ink outline-none transition-colors focus:border-sky-deep"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </section>

        <section className="rounded-xl bg-sky-white p-space-md shadow-sm">
          <label className="block text-label-md text-sky-muted" htmlFor="item-space">
            공간 분류
          </label>
          <select
            id="item-space"
            required
            className="mt-space-xs h-12 w-full rounded-xl border border-art-line bg-sky-white px-space-sm text-body-md text-sky-ink outline-none transition-colors focus:border-sky-deep"
            value={space}
            onChange={(event) => isSpaceKey(event.target.value) && setSpace(event.target.value)}
          >
            {spaceOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </section>

        <section className="rounded-xl bg-sky-white p-space-md shadow-sm">
          <label className="block text-label-md text-sky-muted" htmlFor="item-interval">
            설정된 청소주기
          </label>
          <div className="mt-space-xs flex items-center gap-space-xs">
            <input
              id="item-interval"
              required
              min={1}
              inputMode="numeric"
              type="number"
              className="h-12 min-w-0 flex-1 rounded-xl border border-art-line bg-sky-white px-space-sm text-body-md text-sky-ink outline-none transition-colors focus:border-sky-deep"
              value={intervalDays}
              onChange={(event) => setIntervalDays(event.target.value)}
            />
            <span className="shrink-0 text-body-md text-sky-muted">일에 한번</span>
          </div>
        </section>

        <div className="flex flex-col items-center gap-space-sm pt-space-xs">
          <Link className="text-body-md text-sky-deep" to={`/item-history?item=${encodeURIComponent(item.name)}`}>
            이 항목의 기록 보기
          </Link>
          <button className="text-body-md text-sky-muted" type="button" onClick={() => setShowDeleteConfirm(true)}>
            항목 삭제
          </button>
        </div>
      </form>

      <div className="fixed bottom-16 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 bg-sky-bg/90 px-margin-screen py-space-sm backdrop-blur-xl">
        <button className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-sky-brand text-title-sm font-semibold text-onbrand shadow-md transition-transform duration-[120ms] active:scale-[0.98]" type="submit" form="item-info-form">
          <Icon name="save" className="text-[20px]" />
          {saved ? "저장했어요" : "저장"}
        </button>
      </div>

      <Toast message="변경사항을 저장했어요" visible={saved} pill />
      <DeleteConfirmDialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={handleDelete} />
    </PageShell>
  );
}
