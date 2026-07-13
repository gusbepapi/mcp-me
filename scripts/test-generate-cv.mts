#!/usr/bin/env -S npx tsx
/*
Exercising the exact code path `generate_cv` itself runs
(loadProfile → loadValidatedCvSources → buildCvIR → renderCv), without
going through the MCP protocol or a client. Run directly against `src/`
via `tsx`, per Tutorial 03's own working pattern — `dist/` is a two-file
esbuild bundle (`src/index.ts` and `src/cli.ts` only, per
`tsup.config.ts`), never a per-module mirror of `src/`, so importing deep
`dist/` paths for anything beyond those two entry points does not work
regardless of how many times `npm run build` runs.

`loadValidatedCvSources` is imported from the tool itself, rather than
re-parsing identity/career/skills/projects inline as Tutorial 03's own
ad-hoc `gen-check.mts` did, so this script can never drift out of step
with what `generate_cv` actually validates — most recently, `projects`
being parsed at all, which predates that tutorial

Usage:
  npx tsx scripts/test-generate-cv.mts <profile-directory> [engine] [theme]

Examples:
  npx tsx scripts/test-generate-cv.mts fixtures/sample-profile pandoc clean
  npx tsx scripts/test-generate-cv.mts fixtures/sample-profile pandoc modern
*/

import { resolve, join } from "node:path";
import { loadProfile } from "../src/loader.ts";
import { loadValidatedCvSources } from "../src/tools/generate-cv.ts";
import { buildCvIR } from "../src/render/ir.ts";
import { renderCv } from "../src/render/index.ts";
import type { EngineName } from "../src/render/engines/types.ts";
import type { ThemeName } from "../src/render/engines/theme-names.ts";

const [, , directoryArg, engineArg = "pandoc", themeArg = "clean"] = process.argv;

if (!directoryArg) {
  console.error("Usage: npx tsx scripts/test-generate-cv.mts <profile-directory> [engine] [theme]");
  process.exit(1);
}

const profileDir = resolve(directoryArg);
const profile = await loadProfile(profileDir);
const { identity, career, skills, projects } = loadValidatedCvSources(profile);
const ir = buildCvIR({ identity, career, skills, projects });

const engine = engineArg as EngineName;
const theme = themeArg as ThemeName;
const outputPath = join(profileDir, "cv-output", `cv-${engine}-${theme}.pdf`);
console.log(`Rendering via "${engine}" engine, "${theme}" theme → ${outputPath}`);

const result = await renderCv(engine, ir, { outputPath, theme });
console.log(`Done: ${result.outputPath} (${result.bytesWritten} bytes)`);
console.log(`The intermediate .html (and .md, for pandoc) sit alongside it in the same directory.`);
