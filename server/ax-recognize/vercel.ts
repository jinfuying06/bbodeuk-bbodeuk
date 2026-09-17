import { handleAXRecognize } from "./handler";
import type { AXRecognizeRequest } from "../../src/features/ax-onboarding/types";

/**
 * Vercel 서버리스 함수 스타일의 얇은 어댑터.
 * 다른 플랫폼(Cloudflare Workers, Netlify Functions 등)으로 옮길 땐
 * handler.ts의 handleAXRecognize()는 그대로 두고 이 파일만 새로 작성하면 된다.
 *
 * @vercel/node 타입 의존을 피하려고 최소 구조 타입만 선언한다.
 */
type VercelLikeRequest = {
  method?: string;
  body?: unknown;
};

type VercelLikeResponse = {
  status: (code: number) => VercelLikeResponse;
  json: (body: unknown) => void;
};

export default async function handler(req: VercelLikeRequest, res: VercelLikeResponse): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST만 지원합니다" });
    return;
  }

  try {
    const body = req.body as AXRecognizeRequest;
    const result = await handleAXRecognize(body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "알 수 없는 오류" });
  }
}
