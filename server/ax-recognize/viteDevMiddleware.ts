import type { Plugin } from "vite";
import { handleAXRecognize } from "./handler";

/**
 * `npm run dev`에서만 켜지는 로컬 브릿지. 프로덕션 빌드(GitHub Pages 정적 배포)에는
 * 포함되지 않는다(apply: "serve"). 실제 배포는 vercel.ts 같은 플랫폼 어댑터를 쓴다.
 * 이 파일도 server/ax-recognize/ 전체 삭제 시 함께 지워지는 대상이다.
 */
export function axRecognizeDevPlugin(): Plugin {
  return {
    name: "ax-recognize-dev-middleware",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/ax/recognize", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "POST만 지원합니다" }));
          return;
        }

        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          void (async () => {
            try {
              const result = await handleAXRecognize(JSON.parse(body));
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(result));
            } catch (error) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: error instanceof Error ? error.message : "알 수 없는 오류" }));
            }
          })();
        });
      });
    },
  };
}
