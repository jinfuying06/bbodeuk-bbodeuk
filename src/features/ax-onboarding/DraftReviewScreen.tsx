import { useState } from "react";
import CheckRow from "../../components/CheckRow";
import GlassButton from "../../components/GlassButton";
import Icon from "../../components/Icon";
import PageShell from "../../components/PageShell";
import Pill from "../../components/Pill";
import SpaceTile from "../../components/SpaceTile";
import { getSpace } from "../../data/cleaning";
import FlowHeader from "./FlowHeader";
import { findItem, spaceLabels, type SpaceKey } from "./itemLibrary";
import { DEFAULT_ITEM_SLOT_LIMIT, type AXSpaceDraft } from "./types";

type DraftReviewScreenProps = {
  initialDrafts: AXSpaceDraft[];
  onConfirm: (finalDrafts: AXSpaceDraft[]) => void;
  onBack: () => void;
};

/**
 * AI/05 추천 초안 확인 (260:3512).
 * 인식 결과를 사람이 확인·수정하는 편집 화면. AI 결과는 여기서 절대 자동 확정되지 않는다(PRD 원칙 17) —
 * 시작 버튼을 눌러야 onConfirm이 호출된다.
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
      <FlowHeader title="추천 항목 확인" onBack={onBack} />
      <main className="flex flex-col gap-3 px-margin-screen pb-7 pt-header">
        <section className="flex flex-col gap-2">
          <h1 className="text-[25px] font-bold leading-[39px] text-sky-ink">이렇게 구성했어요</h1>
          <p className="text-bb-body text-sky-muted">필요 없는 항목은 빼고, 빠진 항목은 다시 체크해 주세요.</p>
        </section>

        {drafts.map((draft, index) => {
          const isOpen = openIndex === index;
          const includedCount = draft.items.filter((item) => item.included).length;
          const space = getSpace(draft.spaceKey);

          return (
            // List-style accordion like 공간 / 대청소 (2026-10-16): hairline under each space, no grey card.
            <section key={index} className="flex flex-col border-b border-sky-line">
              <button
                aria-expanded={isOpen}
                className="press flex h-[72px] w-full items-center gap-3 text-left"
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <SpaceTile space={draft.spaceKey} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-bb-label text-sky-ink">{spaceLabels[draft.spaceKey]}</span>
                  <span className="text-bb-caption text-sky-muted">{includedCount}개 선택됨</span>
                </span>
                <Icon name="chevron-down" className={`mr-1 shrink-0 text-[18px] text-sky-deep transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen ? (
                <div className="flex flex-col gap-1 pb-4 pl-[52px]">
                  {!draft.resolved && draft.ambiguousCandidates.length > 0 ? (
                    <div className="mb-2 flex flex-col gap-2">
                      <p className="text-bb-label-sm text-sky-ink">어떤 공간에 가까운가요?</p>
                      <div className="flex flex-wrap gap-2">
                        {draft.ambiguousCandidates.map((candidate) => (
                          <Pill key={candidate} size={38} onClick={() => resolveSpace(index, candidate)}>
                            {spaceLabels[candidate]}
                          </Pill>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {limitWarningIndex === index ? (
                    <p role="status" className="pb-1 text-bb-caption text-sky-deep">
                      한 공간에 최대 {DEFAULT_ITEM_SLOT_LIMIT}개까지 담을 수 있어요.
                    </p>
                  ) : null}

                  {draft.items.length === 0 ? (
                    <p className="py-2 text-bb-body text-sky-muted">인식된 아이템이 없어요. 항목 추가는 시작한 뒤에도 할 수 있어요.</p>
                  ) : (
                    draft.items.map((item) => {
                      const libraryItem = findItem(item.itemId);
                      if (!libraryItem) return null;
                      return (
                        <CheckRow
                          key={item.itemId}
                          fill={space.color}
                          list
                          label={libraryItem.name}
                          on={item.included}
                          onClick={() => toggleItem(index, item.itemId)}
                          trailing={<span className="shrink-0 text-bb-caption text-sky-muted">{item.source === "ai" ? "AI 추천" : "직접 추가"}</span>}
                        />
                      );
                    })
                  )}
                </div>
              ) : null}
            </section>
          );
        })}

        <p className="text-center text-[11px] leading-[17px] text-sky-muted">공간당 최대 {DEFAULT_ITEM_SLOT_LIMIT}개까지 선택할 수 있어요.</p>

        <GlassButton onClick={() => onConfirm(drafts)}>
          {totalIncluded > 0 ? `${totalIncluded}개 항목으로 시작하기` : "확인하고 시작하기"}
        </GlassButton>
      </main>
    </PageShell>
  );
}
