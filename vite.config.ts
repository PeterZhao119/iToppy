import { cp } from "node:fs/promises";
import { defineConfig } from "vite";
import { createLivePreviewPlugin } from "./src/platform/vite-live-preview.js";

export default defineConfig({
  build: {
    rollupOptions: {
      input: ["index.html", "native.html", "control-panel.html"],
    },
  },
  plugins: [
    createLivePreviewPlugin(),
    {
      name: "copy-character-packages",
      async closeBundle() {
        for (const characterId of ["deepseek", "claude", "gpt"]) {
          await cp(`asset/avatar/${characterId}/package`, `dist/asset/avatar/${characterId}/package`, {
            recursive: true,
          });
        }
        await cp("asset/brand", "dist/asset/brand", { recursive: true });
      },
    },
  ],
});
