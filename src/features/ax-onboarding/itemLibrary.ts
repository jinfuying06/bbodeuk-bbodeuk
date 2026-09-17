export type SpaceKey = "living" | "kitchen" | "bathroom" | "bedroom";

export const spaceLabels: Record<SpaceKey, string> = {
  living: "거실",
  kitchen: "주방",
  bathroom: "욕실",
  bedroom: "방",
};

export type LibraryItem = {
  id: string;
  name: string;
  spaceKey: SpaceKey;
  defaultIntervalDays: number;
  /** Core = 기본 노출, Hidden = 청소가이드 "놓치기 쉬운 관리"로만 노출 */
  importance: "core" | "hidden";
  hiddenCareFlag: boolean;
};

/**
 * AX 온보딩(SECTION 19)이 AI 인식 결과를 제한하는 기준 목록.
 * AI는 이 목록의 id만 반환할 수 있고, 새 이름을 자유 생성하지 않는다.
 * Spaces.tsx 등 기존 화면의 목업 아이템명과 맞춰뒀지만, 이 파일은 AX 전용 소스이며
 * 기존 화면 목업을 대체하지 않는다(그 통합은 PRD P0.5 범위).
 */
export const itemLibrary: LibraryItem[] = [
  { id: "basin", name: "세면대 수전 및 볼", spaceKey: "bathroom", defaultIntervalDays: 7, importance: "core", hiddenCareFlag: false },
  { id: "toilet", name: "양변기 안팎", spaceKey: "bathroom", defaultIntervalDays: 7, importance: "core", hiddenCareFlag: false },
  { id: "mirror", name: "욕실 유리 거울", spaceKey: "bathroom", defaultIntervalDays: 10, importance: "core", hiddenCareFlag: false },
  { id: "drain", name: "바닥 배수구 유가 거름망", spaceKey: "bathroom", defaultIntervalDays: 7, importance: "hidden", hiddenCareFlag: true },
  { id: "shower-curtain", name: "샤워부스 유리 또는 커튼", spaceKey: "bathroom", defaultIntervalDays: 10, importance: "core", hiddenCareFlag: false },
  { id: "towel-rack", name: "수건걸이", spaceKey: "bathroom", defaultIntervalDays: 14, importance: "hidden", hiddenCareFlag: true },
  { id: "washer-gasket", name: "세탁기 고무패킹", spaceKey: "bathroom", defaultIntervalDays: 30, importance: "hidden", hiddenCareFlag: true },

  { id: "sink", name: "싱크대 거름망", spaceKey: "kitchen", defaultIntervalDays: 3, importance: "core", hiddenCareFlag: false },
  { id: "countertop", name: "인덕션 상판 및 조리대", spaceKey: "kitchen", defaultIntervalDays: 5, importance: "core", hiddenCareFlag: false },
  { id: "hood", name: "레인지 후드 필터", spaceKey: "kitchen", defaultIntervalDays: 21, importance: "hidden", hiddenCareFlag: true },
  { id: "dish-rack", name: "식기건조대", spaceKey: "kitchen", defaultIntervalDays: 5, importance: "core", hiddenCareFlag: false },
  { id: "fridge-interior", name: "냉장고 내부 선반", spaceKey: "kitchen", defaultIntervalDays: 14, importance: "core", hiddenCareFlag: false },
  { id: "food-trash-bin", name: "음식물쓰레기통", spaceKey: "kitchen", defaultIntervalDays: 3, importance: "hidden", hiddenCareFlag: true },

  { id: "bedding", name: "침실 침구", spaceKey: "bedroom", defaultIntervalDays: 7, importance: "core", hiddenCareFlag: false },
  { id: "pillow", name: "베개 커버", spaceKey: "bedroom", defaultIntervalDays: 7, importance: "core", hiddenCareFlag: false },
  { id: "closet", name: "옷장 선반 및 행거봉", spaceKey: "bedroom", defaultIntervalDays: 30, importance: "hidden", hiddenCareFlag: true },
  { id: "desk", name: "책상 및 모니터 주변", spaceKey: "bedroom", defaultIntervalDays: 10, importance: "core", hiddenCareFlag: false },
  { id: "curtain-bedroom", name: "커튼 또는 블라인드", spaceKey: "bedroom", defaultIntervalDays: 30, importance: "hidden", hiddenCareFlag: true },

  { id: "living-floor", name: "거실 바닥", spaceKey: "living", defaultIntervalDays: 7, importance: "core", hiddenCareFlag: false },
  { id: "air-filter", name: "공기청정기 프리필터", spaceKey: "living", defaultIntervalDays: 30, importance: "hidden", hiddenCareFlag: true },
  { id: "door-handle", name: "문 손잡이", spaceKey: "living", defaultIntervalDays: 14, importance: "hidden", hiddenCareFlag: true },
  { id: "sofa", name: "소파 패브릭 또는 가죽", spaceKey: "living", defaultIntervalDays: 14, importance: "core", hiddenCareFlag: false },
  { id: "rug", name: "러그 및 러그 밑 바닥", spaceKey: "living", defaultIntervalDays: 21, importance: "hidden", hiddenCareFlag: true },
  { id: "window-track", name: "창틀 및 방충망", spaceKey: "living", defaultIntervalDays: 21, importance: "hidden", hiddenCareFlag: true },
];

export function itemsForSpace(spaceKey: SpaceKey): LibraryItem[] {
  return itemLibrary.filter((item) => item.spaceKey === spaceKey);
}

export function findItem(id: string): LibraryItem | undefined {
  return itemLibrary.find((item) => item.id === id);
}
