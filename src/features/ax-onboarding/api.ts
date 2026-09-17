import { MAX_RECOGNITION_RETRIES, type AXRecognitionResponse, type AXRecognizeRequest } from "./types";

/**
 * server/ax-recognize/ 백엔드 프록시를 호출하는 클라이언트 함수.
 * 소유자: Agent B. 이 파일은 Agent B만 편집한다 — 다른 작업자는 시그니처만 보고 호출부만 사용한다.
 *
 * MAX_RECOGNITION_RETRIES(2)만큼 재시도하고(총 3회 시도), 그래도 실패하면 에러를 던진다.
 * 호출부(UI)는 이 에러를 받으면 수동 설정 화면으로 폴백해야 한다(무한 재촬영 루프 금지, PRD 19).
 */
export async function recognizeSpaces(request: AXRecognizeRequest): Promise<AXRecognitionResponse> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RECOGNITION_RETRIES; attempt++) {
    try {
      const response = await fetch("/api/ax/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? `인식 요청이 실패했습니다 (${response.status})`);
      }

      return (await response.json()) as AXRecognitionResponse;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("인식 요청이 반복적으로 실패했습니다");
}
