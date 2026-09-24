import { FormEvent, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Dialog from "../components/Dialog";
import GlassButton from "../components/GlassButton";
import PageIntro from "../components/PageIntro";
import PageShell from "../components/PageShell";
import Toast, { useToast } from "../components/Toast";
import { hideItem, readOverrides, writeOverride } from "../data/itemStorage";
import { getActiveSpaces, getItem, getSpace, isSpaceKey, type Item, type SpaceKey } from "../data/cleaning";

export default function ItemInfo() {
  const [searchParams] = useSearchParams();
  const item = getItem(searchParams.get("item"));
  // Unknown id: don't edit (and save overrides for) some other item — go back to the space list.
  if (!item) return <Navigate to="/spaces" replace />;
  return <ItemInfoForm key={item.id} item={item} />;
}

function ItemInfoForm({ item }: { item: Item }) {
  const override = readOverrides()[item.id];
  const [name, setName] = useState(override?.name ?? item.name);
  // Same source as ItemAdd: only the user's active spaces (plus the item's current one so the select never goes blank).
  const spaceOptions = getActiveSpaces().some((entry) => entry.key === item.space) ? getActiveSpaces() : [...getActiveSpaces(), getSpace(item.space)];
  const [space, setSpace] = useState<SpaceKey>(override && isSpaceKey(override.space) ? override.space : item.space);
  const [intervalDays, setIntervalDays] = useState(String(override?.intervalDays ?? item.intervalDays));
  const [savedName, setSavedName] = useState(override?.name ?? item.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [toast, showToast] = useToast();
  const valid = name.trim().length > 0 && Number(intervalDays) >= 1;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!valid) return;
    writeOverride(item.id, { name: name.trim(), space, intervalDays: Math.round(Number(intervalDays)) });
    setSavedName(name.trim());
    showToast("변경사항을 저장했어요");
  };

  const handleDelete = () => {
    hideItem(item.id);
    setShowDeleteConfirm(false);
    setDeleted(true);
  };

  if (deleted) {
    // Figma 64:4930 항목 삭제 완료 — no bottom nav, no More slot.
    return (
      <PageShell bottomNav={false}>
        <AppHeader title="항목 삭제 완료" back="/spaces" right={null} />
        <main className="flex flex-col gap-3 px-margin-screen pb-5 pt-header-flow">
          <h1 className="text-bb-heading text-sky-ink">항목을 목록에서 숨겼어요</h1>
          <p className="text-bb-body text-sky-muted">이전에 남긴 청소 기록은 히스토리에 보관돼요.</p>
          <GlassButton size={52} to="/history">
            히스토리 보기
          </GlassButton>
          <GlassButton size={52} to="/spaces" variant="secondary">
            내 공간으로
          </GlassButton>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <AppHeader title="항목 설정" back="/spaces" />
      <form className="flex flex-col gap-3 px-margin-screen pb-nav pt-header" onSubmit={handleSubmit}>
        <PageIntro title={savedName} body="이름과 기록 주기를 편하게 바꿔요." />

        <label className="flex min-h-[84px] flex-col gap-1.5 text-bb-label text-sky-ink">
          항목 이름
          <input className="bb-field" maxLength={40} required value={name} onChange={(event) => setName(event.target.value)} />
        </label>

        <label className="flex min-h-[84px] flex-col gap-1.5 text-bb-label text-sky-ink">
          공간
          <select className={`bb-field appearance-none`} value={space} onChange={(event) => isSpaceKey(event.target.value) && setSpace(event.target.value)}>
            {spaceOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-h-[84px] flex-col gap-1.5 text-bb-label text-sky-ink">
          청소 주기
          <span className={`bb-field flex items-center focus-within:border-sky-brand`}>
            <input
              aria-label="청소 주기 (일)"
              className="bg-transparent text-bb-body text-sky-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              inputMode="numeric"
              max={365}
              min={1}
              required
              style={{ width: `${Math.max(intervalDays.length, 1) + 0.6}ch` }}
              type="number"
              value={intervalDays}
              onChange={(event) => setIntervalDays(event.target.value)}
            />
            <span className="text-bb-body text-sky-ink">일에 한 번</span>
          </span>
        </label>

        <GlassButton disabled={!valid} type="submit">
          변경 내용 저장
        </GlassButton>
        <Link className="text-link" to={`/item-history?item=${item.id}`}>
          이 항목의 기록 보기
        </Link>
        <button className="text-link" type="button" onClick={() => setShowDeleteConfirm(true)}>
          항목 삭제
        </button>
      </form>

      <Toast message={toast} visible={Boolean(toast)} pill />
      <Dialog
        body="목록에서 항목을 숨겨요. 이전 청소 기록은 히스토리에 남아 있어요."
        open={showDeleteConfirm}
        primaryLabel="항목 삭제"
        title="청소 항목을 삭제할까요?"
        onClose={() => setShowDeleteConfirm(false)}
        onPrimary={handleDelete}
      />
    </PageShell>
  );
}
