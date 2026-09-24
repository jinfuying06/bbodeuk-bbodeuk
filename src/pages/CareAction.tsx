import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import GlassButton from "../components/GlassButton";
import Icon from "../components/Icon";
import PageShell from "../components/PageShell";
import Toast, { useToast } from "../components/Toast";
import { addRecord, getSpace, removeRecord, type SpaceKey } from "../data/cleaning";

export type Guide = {
  /** Catalog item id this guide records. */
  id: string;
  space: SpaceKey;
  /** Header/heading after "{space} · ". */
  title: string;
  /** Care list row (14 / 청소 가이드). */
  listTitle: string;
  /** Care filter pill. */
  filter: "욕실" | "주방" | "생활 팁";
  intro: string;
  materials: [string, string, string];
  steps: Array<[string, string]>;
};

// Figma 15 / 40 / 41 / 42. 준비물: first 3 (AGENTS.md "준비물 3종").
export const GUIDES: Guide[] = [
  {
    id: "basin",
    space: "bathroom",
    title: "세면대 청소법",
    listTitle: "세면대부터 산뜻하게",
    filter: "욕실",
    intro: "약 3분 · 부드러운 천부터 준비해요.",
    materials: ["마른 천", "중성 세정제", "스퀴지"],
    steps: [
      ["주변 물기를 먼저 닦아요", "수전과 볼 주변의 물기를 천으로 닦아요."],
      ["얼룩을 부드럽게 닦아요", "표면에 맞는 세정제를 소량 사용해요."],
      ["남은 물기를 정리해요", "깨끗이 헹군 뒤 마른 천으로 마무리해요."],
    ],
  },
  {
    id: "mirror",
    space: "bathroom",
    title: "거울 청소법",
    listTitle: "거울 얼룩, 말끔하게",
    filter: "욕실",
    intro: "가벼운 청소 · 약 3분",
    materials: ["마른 천", "유리 세정제", "극세사 천"],
    steps: [
      ["먼지를 먼저 걷어내요", "부드러운 마른 천으로 먼지를 닦아요."],
      ["물자국을 가볍게 닦아요", "살짝 적신 천으로 얼룩을 닦아요."],
      ["마른 천으로 마무리해요", "남은 물기가 없도록 한 번 더 닦아요."],
    ],
  },
  {
    id: "sink",
    space: "kitchen",
    title: "싱크대 청소법",
    listTitle: "싱크대에 남은 물기 닦기",
    filter: "주방",
    intro: "가벼운 청소 · 약 3분",
    materials: ["수세미", "주방 세정제", "고무장갑"],
    steps: [
      ["남은 찌꺼기를 비워요", "거름망에 남은 음식물을 분리해요."],
      ["표면을 부드럽게 닦아요", "소재에 맞는 세정제로 가볍게 닦아요."],
      ["헹군 뒤 물기를 닦아요", "마른 천으로 모서리까지 정리해요."],
    ],
  },
  {
    id: "bedding",
    space: "bedroom",
    title: "침구 정돈하기",
    listTitle: "침구를 가볍게 정돈하기",
    filter: "생활 팁",
    intro: "가벼운 청소 · 약 3분",
    materials: ["돌돌이", "여분 커버", "세탁망"],
    steps: [
      ["침구를 가볍게 털어요", "구김을 펴고 이불을 가지런히 놓아요."],
      ["커버 상태를 살펴봐요", "교체가 필요하면 여분 커버를 준비해요."],
      ["방 안 공기를 환기해요", "창을 열어 잠시 공기를 바꿔주세요."],
    ],
  },
];

// Figma reuses bath object art as placeholder 준비물 tiles (바닥/배수구/거울).
const materialArt = ["object-floor", "object-drain", "object-mirror"];

export default function CareAction() {
  const [searchParams] = useSearchParams();
  const guide = GUIDES.find((entry) => entry.id === searchParams.get("item")) ?? GUIDES[0];
  const space = getSpace(guide.space);
  const title = `${space.label} · ${guide.title}`;
  const [recordId, setRecordId] = useState<string | null>(null);
  const [toast, showToast] = useToast();

  const record = () => {
    // One record per visit; a repeat tap just re-confirms.
    if (!recordId) setRecordId(addRecord(guide.id).id);
    showToast("청소 기록이 저장됐어요");
  };

  const undo = () => {
    if (!recordId) return;
    removeRecord(recordId);
    setRecordId(null);
    showToast("공간 기록이 취소되었어요");
  };

  return (
    <PageShell>
      <AppHeader title={title} back="/care" />
      <main className="flex flex-col gap-3 px-margin-screen pb-nav pt-header">
        <section className="flex min-h-[88px] flex-col gap-2">
          <h1 className="text-bb-heading text-sky-ink">{title}</h1>
          <p className="text-bb-body text-sky-muted">{guide.intro}</p>
        </section>

        {guide.id === "basin" ? (
          <div className="flex h-[116px] items-center justify-center rounded-[22px]" style={{ backgroundColor: space.color }}>
            <Icon name="object-sink" className="text-[70px]" />
          </div>
        ) : null}

        <ul aria-label="준비물" className="flex gap-[10px] pb-3">
          {guide.materials.map((label, index) => (
            <li key={label} className="flex h-[104px] flex-1 flex-col items-center justify-center gap-1.5 rounded-[18px] border bg-sky-white" style={{ borderColor: space.color }}>
              <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[16px]" style={{ backgroundColor: space.color }}>
                <Icon name={materialArt[index]} className="text-[34px]" />
              </span>
              <span className="w-[88px] text-center text-[11px] font-medium leading-[17px] text-sky-ink">{label}</span>
            </li>
          ))}
        </ul>

        <ol className="flex flex-col gap-3">
          {guide.steps.map(([stepTitle, desc], index) => (
            <li key={stepTitle} className="flex min-h-[94px] flex-col gap-2 rounded-3xl bg-sky-white px-5 pb-4 pt-4">
              <h2 className="whitespace-pre text-bb-title text-sky-ink">{`0${index + 1}  ${stepTitle}`}</h2>
              <p className="text-bb-body text-sky-muted">{desc}</p>
            </li>
          ))}
        </ol>

        <GlassButton onClick={record}>청소했어요 · 기록하기</GlassButton>
        <button
          className="flex h-11 items-center justify-center text-[13px] font-medium leading-[19px] text-sky-deep disabled:text-sky-muted disabled:opacity-60"
          disabled={!recordId}
          type="button"
          onClick={undo}
        >
          기록 취소하기
        </button>
        {guide.id === "basin" ? (
          <Link className="flex h-11 items-center justify-center text-bb-label text-sky-deep" to="/care">
            다른 청소법 보기
          </Link>
        ) : null}
      </main>
      <Toast message={toast} visible={Boolean(toast)} />
    </PageShell>
  );
}
