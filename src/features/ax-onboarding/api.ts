import { MAX_RECOGNITION_RETRIES, type AXRecognitionResponse, type AXRecognizeRequest } from "./types";

/**
 * server/ax-recognize/ 백엔드 프록시를 호출하는 클라이언트 함수.
 * 소유자: Agent B. 이 파일은 Agent B만 편집한다 — 다른 작업자는 시그니처만 보고 호출부만 사용한다.
 *
 * MAX_RECOGNITION_RETRIES(2)만큼 재시도하고(총 3회 시도), 그래도 실패하면 에러를 던진다.
 * 호출부(UI)는 이 에러를 받으면 수동 설정 화면으로 폴백해야 한다(무한 재촬영 루프 금지, PRD 19).
 */
const RETRYABLE_STATUSES = [429, 503];

export async function recognizeSpaces(request: AXRecognizeRequest): Promise<AXRecognitionResponse> {
  const apiBase = import.meta.env.VITE_API_BASE ?? "";
  if (import.meta.env.PROD && !import.meta.env.VITE_API_BASE) {
    // GitHub Pages 정적 배포에는 백엔드가 없다 — 요청을 보내지 않고 바로 수동 설정으로 폴백시킨다.
    throw new Error("인식 서버가 설정되지 않았습니다");
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RECOGNITION_RETRIES; attempt++) {
    let response: Response;
    try {
      response = await fetch(`${apiBase}/api/ax/recognize`, {
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
