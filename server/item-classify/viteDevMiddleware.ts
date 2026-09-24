import type { Plugin } from "vite";
import { HttpError, handleItemClassify } from "./handler";

const MAX_BODY_BYTES = 64 * 1024; // 64KB
const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

/**
 * `npm run dev`에서만 켜지는 로컬 브릿지. 프로덕션 빌드(GitHub Pages 정적 배포)에는
 * 포함되지 않는다(apply: "serve"). 실제 배포는 vercel.ts 같은 플랫폼 어댑터를 쓴다.
 * 이 파일도 server/item-classify/ 전체 삭제 시 함께 지워지는 대상이다.
 */
export function itemClassifyDevPlugin(): Plugin {
  return {
    name: "item-classify-dev-middleware",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/item-classify", (req, res) => {
        const send = (status: number, payload: unknown) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(payload));
        };

        if (req.method !== "POST") {
          send(405, { error: "POST만 지원합니다" });
          return;
        }
        if (!req.headers["content-type"]?.startsWith("application/json")) {
          send(415, { error: "application/json만 지원합니다" });
          return;
        }
        const origin = req.headers.origin;
        if (origin !== undefined && !LOCAL_ORIGIN.test(origin)) {
          send(403, { error: "허용되지 않은 요청입니다" });
          return;
        }

        const chunks: Buffer[] = [];
        let size = 0;
        let aborted = false;
        req.on("data", (chunk: Buffer) => {
          if (aborted) return;
          size += chunk.length;
          if (size > MAX_BODY_BYTES) {
            aborted = true;
            res.setHeader("Connection", "close");
            send(413, { error: "요청이 너무 커요" });
            return;
          }
          chunks.push(chunk);
        });
        req.on("end", () => {
          if (aborted) return;
          void (async () => {
            try {
              let parsed: unknown;
              try {
                parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
              } catch {
                throw new HttpError(400, "요청 형식이 올바르지 않아요");
              }
              send(200, await handleItemClassify(parsed));
            } catch (error) {
              if (error instanceof HttpError) {
                send(error.status, { error: error.message });
                return;
              }
              console.error(error);
              send(500, { error: "자동 분류 중 문제가 생겼어요" });
            }
          })();
        });
      });
    },
  };
}
