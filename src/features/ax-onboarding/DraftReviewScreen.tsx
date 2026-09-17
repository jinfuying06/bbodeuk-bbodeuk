import { useState } from "react";
import Icon from "../../components/Icon";
import PageShell from "../../components/PageShell";
import { findItem, spaceLabels, type SpaceKey } from "./itemLibrary";
import { DEFAULT_ITEM_SLOT_LIMIT, type AXSpaceDraft } from "./types";

type DraftReviewScreenProps = {
  initialDrafts: AXSpaceDraft[];
  onConfirm: (finalDrafts: AXSpaceDraft[]) => void;
  onBack?: () => void;
};

/**
 * 인식 결과를 사람이 확인·수정하는 편집 화면. AI 결과는 여기서 절대 자동 확정되지 않는다(PRD 원칙 17) —
 * "확인하고 시작하기"를 눌러야 onConfirm이 호출된다.
 */
export default function DraftReviewScreen({ initialDrafts, onConfirm, onBack }: DraftReviewScreenProps) {
  const [drafts, setDrafts] = useState<AXSpaceDraft[]>(initialDrafts);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [limitWarningIndex, setLimitWarningIndex] = useState<number | null>(null);

  const totalIncluded = drafts.reduce((sum, draft) => sum + draft.items.filter((item) => item.included).length, 0);

  const updateDraftAt = (index: number, updater: (draft: AXSpaceDraft) => AXSpaceDraft) => {
    setDrafts((current) => current.map((draft, i) => (i === index ? updater(draft) : draft)));
  };

  const toggleItem = (index: number, itemId: string) => {
    updateDraftAt(index, (draft) => {
      const includedCount = draft.items.filter((item) => item.included).length;
      const target = draft.items.find((item) => item.itemId === itemId);
      if (!target) return draft;

      if (!target.included && includedCount >= DEFAULT_ITEM_SLOT_LIMIT) {
        setLimitWarningIndex(index);
        window.setTimeout(() => setLimitWarningIndex((current) => (current === index ? null : current)), 1500);
        return draft;
      }

      return {
        ...draft,
        items: draft.items.map((item) => (item.itemId === itemId ? { ...item, included: !item.included } : item)),
      };
    });
  };

  const resolveSpace = (index: number, resolvedKey: SpaceKey) => {
    updateDraftAt(index, (draft) => ({
      ...draft,
      spaceKey: resolvedKey,
      resolved: true,
      ambiguousCandidates: [],
    }));
  };

  return (
    <PageShell bottomNav={false}>
      <main className="flex min-h-[100dvh] flex-col px-margin-screen pb-space-2xl pt-space-md">
        <div className="mb-space-lg flex items-center">
          {onBack ? (
            <button
              className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-low text-on-surface"
              type="button"
              aria-label="이전 화면으로"
              onClick={onBack}
            >
              <Icon name="arrow_back_ios_new" className="text-[22px]" />
            </button>
          ) : null}
        </div>

        <section className="mb-space-lg">
          <h1 className="text-headline-lg">이렇게 구성했어요</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">확인해 주세요. 필요 없는 항목은 지우고, 빠진 항목은 다시 체크할 수 있어요.</p>
        </section>

        <div className="flex flex-col gap-space-sm">
          {drafts.map((draft, index) => {
            const isOpen = openIndex === index;
            const includedCount = draft.items.filter((item) => item.included).length;
            const warning = limitWarningIndex === index;

            return (
              <section key={index} className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
                <button
                  className="flex w-full items-center justify-between p-space-md text-left transition-colors active:bg-surface-container-low"
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <div className="min-w-0">
                    <span className="text-title-sm text-on-surface">{spaceLabels[draft.spaceKey]}</span>
                    <span className="ml-2 text-caption text-on-surface-variant">{includedCount}개 선택됨</span>
                  </div>
                  <Icon
                    name="keyboard_arrow_down"
                    className={`text-[22px] text-on-surface-variant transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <div className={`${isOpen ? "flex" : "hidden"} flex-col gap-space-xs px-space-md pb-space-md`}>
                  {!draft.resolved && draft.ambiguousCandidates.length > 0 ? (
                    <div className="mb-space-xs rounded-lg bg-surface-container-low p-space-sm">
                      <p className="text-body-md text-on-surface">어떤 공간에 가까운가요?</p>
                      <div className="mt-space-xs flex flex-wrap gap-space-xxs">
                        {draft.ambiguousCandidates.map((candidate) => (
                          <button
                            key={candidate}
                            type="button"
                            className="rounded-full border border-outline-variant px-3 py-1.5 text-label-md text-on-surface transition-colors active:bg-surface-container"
                            onClick={() => resolveSpace(index, candidate)}
                          >
                            {spaceLabels[candidate]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {warning ? (
                    <p className="mb-space-xs text-caption text-secondary">한 공간에 최대 {DEFAULT_ITEM_SLOT_LIMIT}개까지 담을 수 있어요.</p>
                  ) : null}

                  {draft.items.length === 0 ? (
                    <p className="py-space-sm text-body-md text-on-surface-variant">인식된 아이템이 없어요. 항목 추가는 다음 화면에서 할 수 있어요.</p>
                  ) : (
                    draft.items.map((item) => {
                      const libraryItem = findItem(item.itemId);
                      if (!libraryItem) return null;
                      return (
                        <button
                          key={item.itemId}
                          type="button"
                          className={`flex items-center justify-between rounded-lg border p-space-sm text-left transition-all active:scale-[0.99] ${
                            item.included ? "border-primary/40 bg-primary-fixed/20" : "border-transparent bg-surface-container-low"
                          }`}
                          onClick={() => toggleItem(index, item.itemId)}
                        >
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate text-body-md text-on-surface">{libraryItem.name}</span>
                            {item.source === "ai" ? <span className="mt-0.5 text-caption text-on-surface-variant">AI 추천</span> : null}
                          </div>
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-sm ${
                              item.included
                                ? "border-primary/40 bg-surface-container-lowest text-primary"
                                : "border-outline-variant/50 bg-surface-container-low text-on-surface-variant"
                            }`}
                          >
                            <Icon name="check" className={`text-[20px] transition-transform duration-200 ${item.included ? "scale-100" : "scale-0"}`} />
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </section>
            );
          })}
        </div>

        <button
          className="mt-space-lg flex h-14 items-center justify-center rounded-full bg-primary-container text-title-sm text-on-primary shadow-md"
          type="button"
          onClick={() => onConfirm(drafts)}
        >
          {totalIncluded > 0 ? `${totalIncluded}개 항목으로 시작하기` : "확인하고 시작하기"}
        </button>
      </main>
    </PageShell>
  );
}
