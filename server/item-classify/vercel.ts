import { HttpError, handleItemClassify } from "./handler";

/**
 * Vercel 서버리스 함수 스타일의 얇은 어댑터.
 * 다른 플랫폼(Cloudflare Workers, Netlify Functions 등)으로 옮길 땐
 * handler.ts의 handleItemClassify()는 그대로 두고 이 파일만 새로 작성하면 된다.
 *
 * @vercel/node 타입 의존을 피하려고 최소 구조 타입만 선언한다.
 */
type VercelLikeRequest = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

// ponytail: IP별 rate limit과 벤더(API) 지출 한도는 여기서 구현하지 않았다 — 배포 전에 플랫폼/벤더 콘솔에서 반드시 설정할 것.
const ALLOWED_ORIGINS = ["https://jinfuying06.github.io", "http://localhost:5173", "http://127.0.0.1:5173"];

type VercelLikeResponse = {
  status: (code: number) => VercelLikeResponse;
  json: (body: unknown) => void;
};

export default async function handler(req: VercelLikeRequest, res: VercelLikeResponse): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST만 지원합니다" });
    return;
  }

  const origin = req.headers?.origin;
  if (origin !== undefined && !ALLOWED_ORIGINS.includes(String(origin))) {
    res.status(403).json({ error: "허용되지 않은 요청입니다" });
    return;
  }

  try {
    const result = await handleItemClassify(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "자동 분류 중 문제가 생겼어요" });
  }
}
