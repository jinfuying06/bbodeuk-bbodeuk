/**
 * 아이템별 정적 청소가이드 콘텐츠.
 * PRD SECTION 19/20: 이 콘텐츠는 AI가 매번 실시간 생성하지 않고, 사람이 검수했다고 가정하는
 * 정적 콘텐츠다. 잘못된 청소 방법(세제 혼합 등)은 안전 문제로 이어질 수 있어 AI 즉석 생성 대신
 * 이렇게 고정 콘텐츠를 아이템에 매칭하는 방식을 택했다.
 *
 * itemLibrary.ts의 모든 아이템에 1:1로 대응해야 한다 — guideMatching.ts의
 * getItemsMissingGuide()로 커버리지를 검증한다.
 */
export type GuideContent = {
  itemId: string;
  title: string;
  steps: string[];
  safetyNote?: string;
  relatedItemIds?: string[];
};

export const guideContent: GuideContent[] = [
  // bathroom
  {
    itemId: "basin",
    title: "세면대 수전 및 볼",
    steps: ["물때 부분에 세정제를 뿌리고 2~3분 둔다", "부드러운 스펀지로 볼과 수전 주변을 닦는다", "물로 헹구고 마른 천으로 물기를 닦아낸다"],
    relatedItemIds: ["mirror", "drain"],
  },
  {
    itemId: "toilet",
    title: "양변기 안팎",
    steps: ["변기 세정제를 안쪽 테두리에 골고루 뿌린다", "솔로 안쪽을 구석구석 닦는다", "겉면은 별도 티슈나 천으로 닦고 물을 내린다"],
    safetyNote: "락스 성분 세정제와 산성 세정제를 동시에 사용하지 않는다 — 유독가스가 발생할 수 있다.",
  },
  {
    itemId: "mirror",
    title: "욕실 유리 거울",
    steps: ["유리 전용 세정제를 뿌린다", "마른 천이나 스퀴지로 위에서 아래로 닦아낸다"],
  },
  {
    itemId: "drain",
    title: "바닥 배수구 유가 거름망",
    steps: ["거름망을 들어올려 머리카락과 이물질을 제거한다", "배수구 주변을 솔로 가볍게 문지른다", "물을 흘려 헹군다"],
    relatedItemIds: ["basin"],
  },
  {
    itemId: "shower-curtain",
    title: "샤워부스 유리 또는 커튼",
    steps: ["물때 부분에 세정제를 뿌리고 스펀지로 닦는다", "물로 헹구고 물기를 스퀴지로 제거한다"],
  },
  {
    itemId: "towel-rack",
    title: "수건걸이",
    steps: ["물티슈나 젖은 천으로 표면을 닦는다", "물기를 마른 천으로 제거한다"],
  },
  {
    itemId: "washer-gasket",
    title: "세탁기 고무패킹",
    steps: ["패킹 주름 사이 물기와 이물질을 확인한다", "곰팡이 부분에 전용 세정제를 뿌리고 10분 둔다", "부드러운 솔로 주름 사이를 닦고 마른 천으로 물기를 제거한다"],
    safetyNote: "락스 성분 세정제와 산성 세정제를 동시에 사용하지 않는다 — 유독가스가 발생할 수 있다.",
  },

  // kitchen
  {
    itemId: "sink",
    title: "싱크대 거름망",
    steps: ["거름망의 음식물 찌꺼기를 비운다", "세제를 묻힌 솔로 안팎을 닦는다", "흐르는 물로 헹군다"],
  },
  {
    itemId: "countertop",
    title: "인덕션 상판 및 조리대",
    steps: ["상판이 식은 후 전용 세정제나 중성세제를 뿌린다", "부드러운 스크래퍼나 천으로 눌어붙은 자국을 제거한다", "마른 천으로 마무리한다"],
  },
  {
    itemId: "hood",
    title: "레인지 후드 필터",
    steps: ["필터를 분리한다", "뜨거운 물에 주방세제를 풀어 10~15분 불린다", "솔로 기름때를 닦고 헹군 뒤 완전히 말려 다시 장착한다"],
  },
  {
    itemId: "dish-rack",
    title: "식기건조대",
    steps: ["그릇을 모두 뺀다", "물때·물때 낀 부분을 세제 묻힌 스펀지로 닦는다", "흐르는 물로 헹구고 물기를 턴다"],
  },
  {
    itemId: "fridge-interior",
    title: "냉장고 내부 선반",
    steps: ["유통기한 지난 식품을 먼저 정리한다", "선반을 분리할 수 있으면 분리해서 세척한다", "중성세제를 묻힌 천으로 내부를 닦고 마른 천으로 마무리한다"],
  },
  {
    itemId: "food-trash-bin",
    title: "음식물쓰레기통",
    steps: ["내용물을 비운다", "안쪽을 세제 묻힌 솔로 닦는다", "흐르는 물로 헹구고 완전히 말린다"],
  },

  // bedroom
  {
    itemId: "bedding",
    title: "침실 침구",
    steps: ["이불 커버와 시트를 분리한다", "세탁기로 세탁하고 완전히 건조한다"],
    relatedItemIds: ["pillow"],
  },
  {
    itemId: "pillow",
    title: "베개 커버",
    steps: ["커버를 분리해 세탁한다", "베개 본체는 환기가 잘 되는 곳에서 털어 말린다"],
    relatedItemIds: ["bedding"],
  },
  {
    itemId: "closet",
    title: "옷장 선반 및 행거봉",
    steps: ["옷을 잠시 옮겨둔다", "마른 천이나 물티슈로 먼지를 닦는다", "행거봉은 알코올 티슈로 마무리한다"],
  },
  {
    itemId: "desk",
    title: "책상 및 모니터 주변",
    steps: ["잡동사니를 정리한다", "마른 천으로 먼지를 닦는다", "모니터 화면은 전용 클리너나 마른 극세사 천으로 닦는다"],
  },
  {
    itemId: "curtain-bedroom",
    title: "커튼 또는 블라인드",
    steps: ["커튼은 분리해 세탁 라벨을 확인 후 세탁한다", "블라인드는 마른 천이나 먼지떨이로 날개 하나씩 닦는다"],
  },

  // living
  {
    itemId: "living-floor",
    title: "거실 바닥",
    steps: ["큰 먼지와 머리카락을 청소기로 제거한다", "물걸레로 전체를 닦는다"],
  },
  {
    itemId: "air-filter",
    title: "공기청정기 프리필터",
    steps: ["필터를 분리한다", "청소기나 물로 먼지를 제거한다", "완전히 말린 후 재장착한다"],
  },
  {
    itemId: "door-handle",
    title: "문 손잡이",
    steps: ["소독 티슈나 알코올 묻힌 천으로 닦는다"],
  },
  {
    itemId: "sofa",
    title: "소파 패브릭 또는 가죽",
    steps: ["청소기로 먼지와 부스러기를 제거한다", "패브릭은 전용 세정제, 가죽은 가죽 전용 클리너로 닦는다", "완전히 말린다"],
  },
  {
    itemId: "rug",
    title: "러그 및 러그 밑 바닥",
    steps: ["러그를 들어 청소기로 앞뒤를 청소한다", "러그 밑 바닥도 물걸레로 닦는다"],
    relatedItemIds: ["living-floor"],
  },
  {
    itemId: "window-track",
    title: "창틀 및 방충망",
    steps: ["창틀 먼지를 솔이나 청소기로 제거한다", "젖은 천으로 홈 구석구석을 닦는다", "방충망은 청소기나 물로 헹궈 말린다"],
  },
];
