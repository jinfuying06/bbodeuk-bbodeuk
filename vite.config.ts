import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { axRecognizeDevPlugin } from "./server/ax-recognize/viteDevMiddleware";
import { itemClassifyDevPlugin } from "./server/item-classify/viteDevMiddleware";

export default defineConfig(({ mode }) => {
  // vite의 loadEnv()는 .env 값을 반환만 하고 process.env에는 넣어주지 않는다.
  // ax-recognize/item-classify 핸들러가 process.env.*_API_KEY를 직접 읽으므로
  // 로컬 dev 서버(npm run dev)에서도 동작하도록 여기서 명시적으로 병합해준다.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    base: "/bbodeuk-bbodeuk/",
    plugins: [react(), axRecognizeDevPlugin(), itemClassifyDevPlugin()],
  };
});
