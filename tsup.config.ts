import { defineConfig } from "tsup";
import { cp, mkdir } from "node:fs/promises";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    target: "node20",
    outDir: "dist",
    async onSuccess() {
      await mkdir("dist/assets", { recursive: true });
      await cp("src/render/lib/cv.typ", "dist/assets/cv.typ");
      await cp("scripts/annotate_page.py", "dist/assets/annotate_page.py");
      await cp("scripts/crop_region.py", "dist/assets/crop_region.py");
      await cp("assets/global/fonts/google-sans", "dist/assets/fonts/google-sans", { recursive: true });
    },
  },
  {
    entry: ["src/cli.ts"],
    format: ["esm"],
    sourcemap: true,
    target: "node20",
    outDir: "dist",
    banner: { js: "#!/usr/bin/env node" },
  },
]);
