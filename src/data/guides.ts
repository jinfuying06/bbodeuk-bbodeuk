import type { SpaceKey } from "./cleaning";

/** 청소 가이드 content (Figma 14/15/40/41/42), shared by the guide list and the guide screen. */
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
  /** Care list subtitle "{space} · 약 N분" (29:742). */
  minutes: number;
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
    minutes: 3,
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
    minutes: 2,
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
    minutes: 3,
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
    minutes: 3,
    materials: ["돌돌이", "여분 커버", "세탁망"],
    steps: [
      ["침구를 가볍게 털어요", "구김을 펴고 이불을 가지런히 놓아요."],
      ["커버 상태를 살펴봐요", "교체가 필요하면 여분 커버를 준비해요."],
      ["방 안 공기를 환기해요", "창을 열어 잠시 공기를 바꿔주세요."],
    ],
  },
];
