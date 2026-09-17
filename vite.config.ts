import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { axRecognizeDevPlugin } from "./server/ax-recognize/viteDevMiddleware";

export default defineConfig({
  base: "/bbodeuk-bbodeuk/",
  plugins: [react(), axRecognizeDevPlugin()],
});
