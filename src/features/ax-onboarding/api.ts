import { itemsForSpace } from "./itemLibrary";
import { MAX_RECOGNITION_RETRIES, type AXRecognitionResponse, type AXRecognizeRequest } from "./types";

/**
 * 사진 인식 API의 유일한 연결 지점.
 *
 * - `VITE_AX_RECOGNIZE_URL`이 설정되어 있으면 그 주소로 POST한다(계약: types.ts의 AXRecognizeRequest → AXRecognitionResponse).
 *   예) 프로덕션: https://<backend>/api/ax/recognize · 로컬 dev 브릿지(server/ax-recognize): /api/ax/recognize
 * - 설정이 없으면(GitHub Pages 기본값) 같은 모양의 목(mock) 결과를 잠깐의 지연 뒤에 돌려준다 —
 *   사용성 테스트에서도 흐름 전체를 끝까지 써볼 수 있게 하기 위함.
 *
 * API 키는 절대 여기(클라이언트)에 두지 않는다 — 키는 백엔드 프록시(server/ax-recognize)만 가진다.
 *
 * 실패 시 MAX_RECOGNITION_RETRIES(2)만큼 재시도하고(총 3회), 그래도 실패하면 에러를 던진다.
 * 호출부(UI)는 이 에러를 받으면 AI/04 실패 화면 → 수동 설정 폴백을 보여준다(PRD 19).
 */
const RECOGNIZE_URL: string | undefined = import.meta.env.VITE_AX_RECOGNIZE_URL || undefined;
const RETRYABLE_STATUSES = [429, 503];
const MOCK_DELAY_MS = 2400;

export async function recognizeSpaces(request: AXRecognizeRequest): Promise<AXRecognitionResponse> {
  if (!RECOGNIZE_URL) return mockRecognize(request);

  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RECOGNITION_RETRIES; attempt++) {
    let response: Response;
    try {
      response = await fetch(RECOGNIZE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
    } catch (error) {
      // 네트워크 오류만 재시도
      lastError = error;
      continue;
    }

    if (response.ok) {
      return (await response.json()) as AXRecognitionResponse;
    }

    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    lastError = new Error(body?.error ?? `인식 요청이 실패했습니다 (${response.status})`);
    if (!RETRYABLE_STATUSES.includes(response.status)) break;
  }

  throw lastError instanceof Error ? lastError : new Error("인식 요청이 반복적으로 실패했습니다");
}

/**
 * 백엔드 없이 쓰는 목 인식. 사진 내용은 보지 않고, 요청한 공간의 라이브러리 아이템에 그럴듯한 신뢰도를 붙인다:
 * 기본(core) 아이템은 대부분 자동 포함(≥70), 숨은 관리(hidden) 아이템은 일부만 "보이지만 미체크"(35~69)로.
 * 사진을 더 넣을수록 신뢰도가 조금 오른다 — 실제 인식처럼 결과가 조금씩 달라 보이게.
 */
async function mockRecognize(request: AXRecognizeRequest): Promise<AXRecognitionResponse> {
  await new Promise((resolve) => window.setTimeout(resolve, MOCK_DELAY_MS));
  return {
    results: request.spaces.map(({ spaceKey, images }) => ({
      spaceType: spaceKey,
      ambiguousCandidates: [],
      items: itemsForSpace(spaceKey).map((item, index) => ({
        itemId: item.id,
        confidence: Math.min(99, (item.importance === "core" ? 78 : 40 + (index % 3) * 20) + images.length * 3 - index),
      })),
    })),
  };
}
