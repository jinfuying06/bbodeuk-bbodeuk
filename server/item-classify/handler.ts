/**
 * ItemAdd.tsx(항목 추가 화면)의 "공간 분류" / "청소주기" 필드 자동완성을 위한 백엔드 프록시.
 * TypeSafe System One API(https://api.typesafe.ai/v1/systemone, 모델 jev-latest)에
 * 항목 이름 하나를 보내 공간 분류(choice)와 청소주기 레벨(score)을 추론받는다.
 * TYPESAFE_API_KEY는 반드시 서버 측에서만 사용하고 클라이언트 번들에 노출하지 않는다.
 */

export type ItemClassifyRequest = {
  itemName: string;
};

export type SpaceKey = "bathroom" | "kitchen" | "bedroom" | "living";

export type ItemClassifyResponse = {
  spaceKey: SpaceKey;
  spaceConfidence: number;
  intervalDays: number;
};

const SPACE_CRITERIA = {
  bathroom: "욕실 — 세면대, 변기, 샤워부스, 욕실 배수구 등 물을 많이 쓰는 위생 공간",
  kitchen: "주방 — 싱크대, 조리대, 냉장고, 후드, 식기건조대 등 조리/설거지 관련 공간",
  bedroom: "침실 또는 방 — 침구, 옷장, 책상 등 개인 방 안의 물건",
  living: "거실 — 바닥, 소파, 러그, 창틀, 공기청정기 등 공용 생활 공간의 물건",
};

const INTERVAL_LEVELS = [
  { label: "거의 매일 (1일)", days: 1 },
  { label: "2~3일에 한 번", days: 3 },
  { label: "주 1회 (5~7일)", days: 7 },
  { label: "10일 안팎", days: 10 },
  { label: "2주에 한 번 (14일)", days: 14 },
  { label: "3주에 한 번 (21일)", days: 21 },
  { label: "한 달에 한 번 (30일)", days: 30 },
  { label: "한 달보다 드묾 (30일 초과)", days: 45 },
];

/** 어댑터가 status를 그대로 HTTP 응답 코드로 쓰고, message만 클라이언트에 노출하는 에러. */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

const SPACE_KEYS = Object.keys(SPACE_CRITERIA) as SpaceKey[];
const UPSTREAM_ERROR_MESSAGE = "자동 분류 결과를 가져오지 못했어요";

type SystemOneResponse = {
  answers: {
    space: { choice: SpaceKey; confidence: number };
    intervalLevel: { score: number };
  };
};

export async function handleItemClassify(request: unknown): Promise<ItemClassifyResponse> {
  const rawName = (request as Partial<ItemClassifyRequest> | null)?.itemName;
  const itemName = typeof rawName === "string" ? rawName.trim() : "";
  if (itemName.length < 1 || itemName.length > 40) {
    throw new HttpError(400, "항목 이름은 1~40자여야 해요");
  }

  const apiKey = process.env.TYPESAFE_API_KEY;
  if (!apiKey) {
    // 설정 오류 → 어댑터에서 500
    throw new Error("TYPESAFE_API_KEY가 설정되지 않았습니다");
  }

  let response: Response;
  try {
    response = await fetch("https://api.typesafe.ai/v1/systemone", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        state: { itemName },
        model: "jev-latest",
        questions: {
          space: {
            type: "choice",
            instructions: "이 청소 항목 이름(`itemName`)은 집의 어느 공간에 속하는가?",
            criteria: SPACE_CRITERIA,
          },
          intervalLevel: {
            type: "score",
            instructions: "이 항목(`itemName`)은 일반적으로 얼마나 자주 청소/관리해야 하는가?",
            criteria: INTERVAL_LEVELS.map((l) => l.label),
          },
        },
      }),
    });
  } catch (error) {
    console.error("TypeSafe System One API 호출 실패", error);
    throw new HttpError(502, UPSTREAM_ERROR_MESSAGE);
  }

  if (!response.ok) {
    console.error(`TypeSafe System One API 오류 (${response.status})`, await response.text().catch(() => ""));
    throw new HttpError(502, UPSTREAM_ERROR_MESSAGE);
  }

  const result = (await response.json().catch(() => null)) as SystemOneResponse | null;
  const choice = result?.answers?.space?.choice;
  const confidence = result?.answers?.space?.confidence;
  const score = result?.answers?.intervalLevel?.score;
  if (
    !SPACE_KEYS.includes(choice as SpaceKey) ||
    typeof confidence !== "number" ||
    !Number.isFinite(confidence) ||
    confidence < 0 ||
    confidence > 1 ||
    typeof score !== "number" ||
    !Number.isFinite(score)
  ) {
    console.error("TypeSafe System One API 응답 형식 오류", result);
    throw new HttpError(502, UPSTREAM_ERROR_MESSAGE);
  }

  const rawIndex = Math.round(score);
  const clampedIndex = Math.min(Math.max(rawIndex, 0), INTERVAL_LEVELS.length - 1);

  return {
    spaceKey: choice as SpaceKey,
    spaceConfidence: confidence,
    intervalDays: INTERVAL_LEVELS[clampedIndex].days,
  };
}
