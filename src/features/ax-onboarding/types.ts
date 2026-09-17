import type { SpaceKey } from "./itemLibrary";

/**
 * PRD_v3.0 SECTION 19 (AX 온보딩) 계약.
 * AI 연동 레이어(구조화 출력 호출)와 Setup UI가 이 타입을 공유한다.
 *
 * 온보딩 흐름(팀 결정):
 * 1. Setup에서 미리 4개 슬롯(거실/주방/욕실/방)을 화면에 구성해두고,
 *    슬롯을 탭하면 카메라 또는 앨범에서 사진을 고를 수 있다(카메라 강제 아님).
 * 2. 공간당 1장은 필수, 2장은 선택(최대 3장) — MAX_PHOTOS_PER_SPACE 참고.
 *    화면 문구는 "사진에 보이는 물건을 기준으로 아이템을 추천해요"처럼
 *    AI가 사진 속 실제 사물을 인식한다는 점을 사용자에게 명시한다.
 * 3. 채운 슬롯을 모아 한 번의 배치 호출(POST /api/ax/recognize)로 인식한다.
 */

/** 온보딩 초안의 아이템 슬롯 한도. 정확한 수치는 P1에서 확정(PRD 19) — 지금은 임시값. */
export const DEFAULT_ITEM_SLOT_LIMIT = 10;

/** 이 횟수만큼 인식에 실패하면 수동 설정으로 폴백한다(PRD 19). */
export const MAX_RECOGNITION_RETRIES = 2;

/** 공간당 필수 사진 수. */
export const REQUIRED_PHOTOS_PER_SPACE = 1;
/** 공간당 추가로 찍을 수 있는 선택 사진 수("더 찍기"). */
export const MAX_OPTIONAL_PHOTOS_PER_SPACE = 2;
/** 공간당 총 사진 수 상한(필수 1 + 선택 2). */
export const MAX_PHOTOS_PER_SPACE = REQUIRED_PHOTOS_PER_SPACE + MAX_OPTIONAL_PHOTOS_PER_SPACE;

/**
 * 아이템별 인식 신뢰도(0~100) 처리 기준.
 * - AUTO_INCLUDE 이상: 초안에 보이고 기본 체크됨
 * - DISPLAY 이상 ~ AUTO_INCLUDE 미만: 초안에 보이지만 기본 미체크(사용자가 직접 추가해야 함)
 * - DISPLAY 미만: 초안에 아예 노출하지 않음(너무 낮은 확신도로 판단해 버림)
 * 실제 인식 결과를 보고 팀장 판단으로 튜닝 가능한 숫자다.
 */
export const ITEM_CONFIDENCE_AUTO_INCLUDE_THRESHOLD = 70;
export const ITEM_CONFIDENCE_DISPLAY_THRESHOLD = 35;

/**
 * Vision 구조화 출력(output_config.format) 응답 스키마.
 * items[].itemId는 반드시 itemLibrary의 기존 id만 담아야 하며(스키마 enum으로 강제),
 * 모델이 목록에 없는 이름을 자유 생성하면 계약 위반으로 간주해 버린다.
 */
export type RecognizedItem = {
  /** itemLibrary id만 허용 */
  itemId: string;
  /** 0~100 */
  confidence: number;
};

export type AXSpaceRecognitionResult = {
  /** 요청에서 지정한 슬롯의 공간 키를 그대로 메아리치거나, 사진이 다른 공간처럼 보이면 null */
  spaceType: SpaceKey | null;
  /** spaceType이 null이거나 복합 공간으로 보일 때 사용자가 고를 후보 목록 */
  ambiguousCandidates: SpaceKey[];
  items: RecognizedItem[];
};

export type AXRecognitionResponse = {
  results: AXSpaceRecognitionResult[];
};

/** 서버에서 base64 시그니처로 추측하지 않고 클라이언트가 그대로 알려주는 이미지 MIME 타입. */
export type AXImageMediaType = "image/png" | "image/jpeg" | "image/webp";

export type AXImageInput = {
  /** base64 인코딩된 이미지 데이터(데이터 URL 접두어 없이) */
  data: string;
  mediaType: AXImageMediaType;
};

/**
 * 엔드포인트 계약(Agent B가 구현): POST /api/ax/recognize
 *
 * Request body:
 *   { spaces: { spaceKey: SpaceKey; images: AXImageInput[] }[] }
 *   - images는 공간당 1~3장(MAX_PHOTOS_PER_SPACE).
 *
 * Response body: AXRecognitionResponse
 *   - results는 요청의 spaces와 같은 순서로 1:1 대응한다.
 *
 * 실패 시: HTTP 4xx/5xx + { error: string }.
 * 클라이언트는 실패를 MAX_RECOGNITION_RETRIES까지 재시도하고,
 * 그래도 실패하면 수동 설정 화면으로 폴백한다(무한 재촬영 루프 금지).
 */
export type AXRecognizeRequest = {
  spaces: { spaceKey: SpaceKey; images: AXImageInput[] }[];
};

/** 사용자가 확인·수정하는 편집 가능한 초안의 아이템 한 줄 */
export type AXDraftItem = {
  itemId: string;
  /** AI가 제안했는지, 사용자가 직접 추가했는지 — 신뢰도/수정률 KPI 집계에 사용 */
  source: "ai" | "manual";
  included: boolean;
};

/** 공간 하나에 대한 편집 가능한 초안 상태. 절대 자동 확정되지 않는다(PRD 원칙 17). */
export type AXSpaceDraft = {
  spaceKey: SpaceKey;
  /** 애매한 공간 판정을 사용자가 아직 고르지 않았으면 false */
  resolved: boolean;
  ambiguousCandidates: SpaceKey[];
  items: AXDraftItem[];
};

/**
 * 인식 응답 하나를 편집 가능한 초안 아이템 목록으로 변환한다.
 * 신뢰도 임계값 처리를 이 한 곳에서만 하도록 묶어서,
 * AI 연동 레이어와 UI가 서로 다른 기준으로 필터링하는 걸 방지한다.
 */
export function toDraftItems(recognized: RecognizedItem[]): AXDraftItem[] {
  return recognized
    .filter((item) => item.confidence >= ITEM_CONFIDENCE_DISPLAY_THRESHOLD)
    .map((item) => ({
      itemId: item.itemId,
      source: "ai",
      included: item.confidence >= ITEM_CONFIDENCE_AUTO_INCLUDE_THRESHOLD,
    }));
}

export function withinSlotLimit(draft: AXSpaceDraft): boolean {
  return draft.items.filter((item) => item.included).length <= DEFAULT_ITEM_SLOT_LIMIT;
}
