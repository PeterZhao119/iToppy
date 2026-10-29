import { cp } from "node:fs/promises";
import { defineConfig } from "vite";
import { createLivePreviewPlugin } from "./src/platform/vite-live-preview.js";

export default defineConfig({
  plugins: [
    createLivePreviewPlugin(),
    {
      name: "copy-character-packages",
      async closeBundle() {
        await cp("asset/avatar/deepseek/package", "dist/asset/avatar/deepseek/package", {
          recursive: true,
        });
      },
    },
  ],
});
