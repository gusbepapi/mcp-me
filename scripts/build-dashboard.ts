import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { loadProfile } from "../src/loader.js";
import { identitySchema } from "../src/schema/identity.js";
import { careerSchema } from "../src/schema/career.js";
import { skillsSchema } from "../src/schema/skills.js";
import { buildCvIR } from "../src/render/ir.js";
import { deriveAffindaPhrases } from "../src/render/affinda-schema.js";
import { bandFor, colourFor, describeEngine, type AtsScore } from "../src/render/ats-score.js";
import {
  extractWords,
  rasterisePages,
  annotatePage,
  cropMatchThumbnail,
  buildComparisonRows,
  computeEmpiricalScore,
  type ExtractedWord,
} from "../src/render/ats-extraction.js";
import { buildDashboardHtml, type DashboardEntry, type PageImageEntry } from "../src/render/dashboard.js";
import type { EngineName } from "../src/render/engines/types.js";

const ASSETS_DIR = "assets/global/images/ats";
const OUTPUT_HTML = "pages/ats-dashboard.html";
const RASTER_DPI = 150;

// `derivePhrases` has been superseded by `deriveAffindaPhrases`, which labels each phrase by its corresponding real Affinda-based schema field, imported from `src/render/affinda-schema.js`

async function main(): Promise<void> {
  const profileDir = process.argv[2];
  const pdfDir = process.argv[3];
  if (!profileDir || !pdfDir) {
    console.error("Usage: tsx scripts/build-dashboard.ts <profileDir> <pdfDir>");
    console.error("  <pdfDir> must contain cv-latex.pdf, cv-typst.pdf, cv-pandoc.pdf");
    process.exit(1);
  }

  const profile = await loadProfile(profileDir);
  const identity = identitySchema.parse(profile.data.identity);
  const career = careerSchema.safeParse(profile.data.career ?? {});
  const skills = skillsSchema.safeParse(profile.data.skills ?? {});

  if (!profile.data.career) {
    console.warn(`Warning: no career.yaml found under ${profileDir}, experience-derived phrases will be absent`);
  }
  if (!profile.data.skills) {
    console.warn(`Warning: no skills.yaml found under ${profileDir}, skill-derived phrases will be absent`);
  }

  const ir = buildCvIR({
    identity,
    career: career.success ? career.data : undefined,
    skills: skills.success ? skills.data : undefined,
  });

  const engines: EngineName[] = ["latex", "typst", "pandoc"];
  const pdfPaths = Object.fromEntries(engines.map((e) => [e, join(pdfDir, "pdf", `cv-${e}.pdf`)]));

  await mkdir(ASSETS_DIR, { recursive: true });

  // Phase one: extracting words and rasterising pages for every engine,
  // without yet deciding what to highlight, since that decision depends
  // on the comparison table computed only once every source is available
  const wordsBySource: Record<string, ExtractedWord[]> = {};
  const imagePathsBySource: Record<string, string[]> = {};
  const sourceOrder: string[] = [];

  const availableEngines: EngineName[] = [];

  for (const engine of engines) {
    const pdfPath = pdfPaths[engine];
    if (!existsSync(pdfPath)) {
      console.warn(`Warning: ${basename(pdfPath)} does not exist, skipping this engine entirely`);
      continue;
    }
    availableEngines.push(engine);

    const fileName = basename(pdfPath);
    sourceOrder.push(fileName);

    const words = await extractWords(pdfPath);
    wordsBySource[fileName] = words;
    console.log(`${fileName}: extracted ${words.length} words`);

    imagePathsBySource[fileName] = await rasterisePages(pdfPath, ASSETS_DIR, RASTER_DPI);
  }

  // Phase two: building the comparison table now that every source's
  // words are available
  const affindaPhraseEntries = deriveAffindaPhrases(ir);
  const phrases = affindaPhraseEntries.map((e) => e.phrase);
  const phraseToAffindaField = new Map(
    affindaPhraseEntries.map((e) => [e.phrase.trim().toLowerCase(), e.affindaField]),
  );
  console.log(`Derived ${phrases.length} comparison phrases from the profile`);
  if (phrases.length === 0) {
    console.warn(
      "Warning: zero comparison phrases were derived; the comparison table will be empty. " +
        "This means identity.nickname, career.experience, and skills are all absent from the " +
        "profile at " + profileDir + ", not a defect in the dashboard itself",
    );
  }
  const comparisonRows = buildComparisonRows(phrases, wordsBySource);

  // Phase three: deriving the score for each source empirically from the
  // comparison table itself, and restricting highlighting to only those
  // words that participate in a matched phrase, whole or fragment,
  // rather than every word on the page indiscriminately
  const scoreEntries: DashboardEntry[] = [];
  const pageImageEntries: PageImageEntry[] = [];
  const previewThumbnailsBySource = new Map<string, string>();
  const previewFullPagesBySource = new Map<string, string>();

  for (const engine of availableEngines) {
    const fileName = basename(pdfPaths[engine]);
    const words = wordsBySource[fileName];
    const imagePaths = imagePathsBySource[fileName];

    const breakdown = computeEmpiricalScore(comparisonRows, fileName);
    const band = bandFor(breakdown.score);
    const description = describeEngine(engine);
    const score: AtsScore = {
      engine,
      score: breakdown.score,
      band,
      colour: colourFor(band),
      pdfWriter: description.pdfWriter,
      layoutMechanism: description.layoutMechanism,
      rationale: [
        `${breakdown.wholeCount}/${breakdown.totalPhrases} phrases matched wholly`,
        `${breakdown.fragmentCount} fragment(s)`,
        `${breakdown.missingCount} missing entirely`,
      ],
    };
    scoreEntries.push({ pdfFileName: fileName, score });

    // Collecting the set of words that participate in any matched phrase
    // for this source, whole or fragment, by object reference, since
    // buildComparisonRows reuses the same ExtractedWord objects rather
    // than copying them
    const highlightedWords = new Set<ExtractedWord>();
    for (const row of comparisonRows) {
      const match = row.matches[fileName];
      if (match && match.kind !== "missing") {
        for (const box of match.boxes) highlightedWords.add(box);
      }
    }

    const wordsByPage = new Map<number, ExtractedWord[]>();
    for (const word of words) {
      if (!highlightedWords.has(word)) continue;
      const list = wordsByPage.get(word.page) ?? [];
      list.push(word);
      wordsByPage.set(word.page, list);
    }

    for (let index = 0; index < imagePaths.length; index += 1) {
      const pageWords = wordsByPage.get(index + 1) ?? [];
      await annotatePage(imagePaths[index], pageWords, RASTER_DPI);
    }

    // Cropping a single whole-page thumbnail for the "Highlighted
    // extraction preview" row, one per engine, rather than one thumbnail
    // per matched cell. Using the first page's own full dimensions as the
    // "crop" region, since the intent here is a scaled-down preview of
    // the entire page, not a crop around any particular phrase
    if (imagePaths.length > 0) {
      const previewThumbnailPath = join(ASSETS_DIR, `${fileName}-preview-thumb.png`);
      await cropMatchThumbnail(
        imagePaths[0],
        [{ xMin: 0, yMin: 0, xMax: 595, yMax: 842 }],
        RASTER_DPI,
        previewThumbnailPath,
        0,
      );
      previewThumbnailsBySource.set(fileName, relative("pages", previewThumbnailPath));
      previewFullPagesBySource.set(fileName, relative("pages", imagePaths[0]));
    }

    pageImageEntries.push({
      pdfFileName: fileName,
      pages: imagePaths.map((imagePath, index) => ({
        imagePath: relative("pages", imagePath),
        pageNumber: index + 1,
      })),
    });
  }

  const html = buildDashboardHtml(
    scoreEntries,
    comparisonRows,
    sourceOrder,
    pageImageEntries,
    phraseToAffindaField,
    previewThumbnailsBySource,
    previewFullPagesBySource,
  );
  await writeFile(OUTPUT_HTML, html, "utf-8");
  console.log(`Written ${OUTPUT_HTML}, with assets in ${ASSETS_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
