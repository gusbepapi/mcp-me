import { execFile } from "node:child_process";
import { mkdir, readdir, writeFile, unlink } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { existsSync } from "node:fs";
import { findPackageRoot } from "../utils/package-root.js";

const execFileAsync = promisify(execFile);

function resolveAnnotateScriptPath(): string {
  const packageRoot = findPackageRoot(dirname(fileURLToPath(import.meta.url)));
  const distAsset = join(packageRoot, "dist", "assets", "annotate_page.py");
  if (existsSync(distAsset)) {
    return distAsset;
  }
  return join(packageRoot, "scripts", "annotate_page.py");
}

const ANNOTATE_SCRIPT_PATH = resolveAnnotateScriptPath();

export interface ExtractedWord {
  readonly text: string;
  readonly page: number;
  readonly xMin: number;
  readonly yMin: number;
  readonly xMax: number;
  readonly yMax: number;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

/**
 * Parsing the output of `pdftotext -bbox`, which emits one `<page>` element per page and one `<word xMin=... yMin=... xMax=... yMax=...>text</word>` element per extracted word, in reading order. 
 * 
 * A regular expression is used deliberately rather than a full XML parser, since the format is a narrow, stable subset of HTML that poppler itself generates, and adding an XML dependency for this alone would be disproportionate
 */
export function parseBboxOutput(xml: string): ExtractedWord[] {
  const words: ExtractedWord[] = [];
  let page = 0;
  const tokenPattern = /<page[^>]*>|<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)<\/word>/g;
  let match: RegExpExecArray | null;
  while ((match = tokenPattern.exec(xml)) !== null) {
    if (match[0].startsWith("<page")) {
      page += 1;
      continue;
    }
    const [, xMin, yMin, xMax, yMax, text] = match;
    words.push({
      text: decodeHtmlEntities(text),
      page,
      xMin: Number.parseFloat(xMin),
      yMin: Number.parseFloat(yMin),
      xMax: Number.parseFloat(xMax),
      yMax: Number.parseFloat(yMax),
    });
  }
  return words;
}

/**
 * Extracting word-level bounding boxes from a generated PDF via `pdftotext -bbox`. Requiring `poppler-utils` on the operator’s machine, the same package already required for `pdfinfo` earlier in this collaboration
 */
export async function extractWords(pdfPath: string): Promise<ExtractedWord[]> {
  const { stdout } = await execFileAsync("pdftotext", ["-bbox", pdfPath, "-"]);
  return parseBboxOutput(stdout);
}

/**
 * Rasterising every page of a PDF to PNG via `pdftoppm`, returning the resulting file paths in page order. `dpi` must match whatever value the caller later uses to scale `ExtractedWord` coordinates, since `pdftotext -bbox` reports points, not pixels
 */
export async function rasterisePages(
  pdfPath: string,
  outputDirectory: string,
  dpi = 150,
): Promise<string[]> {
  await mkdir(outputDirectory, { recursive: true });
  const prefix = basename(pdfPath).replace(/\.pdf$/, "");
  await execFileAsync("pdftoppm", [
    "-png",
    "-r",
    String(dpi),
    pdfPath,
    join(outputDirectory, prefix),
  ]);
  const files = await readdir(outputDirectory);
  return files
    .filter((f) => f.startsWith(prefix) && f.endsWith(".png"))
    .sort()
    .map((f) => join(outputDirectory, f));
}

export interface PageBox {
  readonly xMin: number;
  readonly yMin: number;
  readonly xMax: number;
  readonly yMax: number;
}

/**
 * Baking bounding boxes directly into a rasterised page image via the Pillow-based annotation script, overwriting the plain screenshot with an annotated one. This produces a portable artefact, rather than an HTML overlay that only renders correctly inside the dashboard itself
 */
export async function annotatePage(
  imagePath: string,
  boxes: readonly PageBox[],
  dpi: number,
): Promise<void> {
  const boxesJsonPath = `${imagePath}.boxes.json`;
  await writeFile(boxesJsonPath, JSON.stringify(boxes), "utf-8");
  await execFileAsync("python3", [
    ANNOTATE_SCRIPT_PATH,
    "--image",
    imagePath,
    "--boxes",
    boxesJsonPath,
    "--dpi",
    String(dpi),
    "--output",
    imagePath,
  ]);
}

const CROP_SCRIPT_PATH = ANNOTATE_SCRIPT_PATH.replace("annotate_page.py", "crop_region.py");

/**
 * Cropping a small thumbnail around one matched element’s bounding box, from an already-rasterised (and possibly already-annotated) page image. Used to embed the highlighted region directly inside the comparison table, rather than only linking out to the full page
 */
export async function cropMatchThumbnail(
  pageImagePath: string,
  boxes: readonly PageBox[],
  dpi: number,
  outputPath: string,
  paddingPx = 6,
): Promise<void> {
  const boxesJsonPath = `${outputPath}.boxes.json`;
  await writeFile(boxesJsonPath, JSON.stringify(boxes), "utf-8");
  await execFileAsync("python3", [
    CROP_SCRIPT_PATH,
    "--image",
    pageImagePath,
    "--boxes",
    boxesJsonPath,
    "--dpi",
    String(dpi),
    "--padding",
    String(paddingPx),
    "--output",
    outputPath,
  ]);
}

export type MatchKind = "whole" | "fragment" | "missing";

export interface PhraseMatch {
  readonly kind: MatchKind;
  readonly displayText: string;
  readonly boxes: readonly ExtractedWord[];
}

function normaliseToken(token: string): string {
  return token.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

/**
 * Searching a single engine’s extracted words for a contiguous run matching every token of `phrase`, in order. The words are already in reading order as emitted by `pdftotext`, so no independent sort by position is required here
 *
 * A whole match requires every phrase token to appear as consecutive words. Failing that, the longest contiguous run of matching tokens found anywhere is reported as a fragment, which is precisely the behaviour your own example shows for `pandoc` and `latex` against «Full-stack developer»
 */
export function matchPhrase(phrase: string, words: readonly ExtractedWord[]): PhraseMatch {
  const phraseTokens = phrase.split(/\s+/).map(normaliseToken).filter(Boolean);
  if (phraseTokens.length === 0) {
    return { kind: "missing", displayText: "—", boxes: [] };
  }

  let bestRun: ExtractedWord[] = [];

  // Trying every combination of word-start and phrase-token-start, since a fragment may correspond to any contiguous sub-run of the phrase, not only one beginning at the phrase’s first token; this is what allows a PDF containing only "developer" from "Full-stack
  // developer" to be reported as a fragment rather than missing
  for (let wordStart = 0; wordStart < words.length; wordStart += 1) {
    for (let tokenStart = 0; tokenStart < phraseTokens.length; tokenStart += 1) {
      const run: ExtractedWord[] = [];
      let w = wordStart;
      let t = tokenStart;
      while (w < words.length && t < phraseTokens.length) {
        const wordTokens = words[w].text.split(/\s+/).map(normaliseToken).filter(Boolean);
        if (!wordTokens.some((token) => token === phraseTokens[t])) break;
        run.push(words[w]);
        w += 1;
        t += 1;
      }
      if (run.length > bestRun.length) {
        bestRun = run;
      }
      if (bestRun.length === phraseTokens.length) break;
    }
    if (bestRun.length === phraseTokens.length) break;
  }

  if (bestRun.length === 0) {
    return { kind: "missing", displayText: "—", boxes: [] };
  }

  const joined = bestRun.map((w) => w.text).join(" ");
  if (bestRun.length >= phraseTokens.length) {
    return { kind: "whole", displayText: `\u00AB${joined}\u00BB`, boxes: bestRun };
  }
  return { kind: "fragment", displayText: joined, boxes: bestRun };
}

export interface EmpiricalScoreBreakdown {
  readonly wholeCount: number;
  readonly fragmentCount: number;
  readonly missingCount: number;
  readonly totalPhrases: number;
  readonly score: number;
}

/**
 * Deriving a score directly from the comparison table’s own findings for one source file. A whole match counts fully; a fragment counts at half weight, since some but not all of the phrase survived intact; a missing phrase counts for nothing
 */
export function computeEmpiricalScore(
  rows: readonly ComparisonRow[],
  source: string,
): EmpiricalScoreBreakdown {
  let wholeCount = 0;
  let fragmentCount = 0;
  let missingCount = 0;

  for (const row of rows) {
    const kind = row.matches[source]?.kind ?? "missing";
    if (kind === "whole") wholeCount += 1;
    else if (kind === "fragment") fragmentCount += 1;
    else missingCount += 1;
  }

  const totalPhrases = rows.length;
  const score =
    totalPhrases > 0
      ? Math.round(((wholeCount + fragmentCount * 0.5) / totalPhrases) * 100)
      : 0;

  return { wholeCount, fragmentCount, missingCount, totalPhrases, score };
}

export interface ComparisonRow {
  readonly phrase: string;
  readonly matches: Readonly<Record<string, PhraseMatch>>;
}

/**
 * Building one comparison row per phrase, with one match per named source
 */
export function buildComparisonRows(
  phrases: readonly string[],
  wordsBySource: Readonly<Record<string, readonly ExtractedWord[]>>,
): ComparisonRow[] {
  return phrases.map((phrase) => ({
    phrase,
    matches: Object.fromEntries(
      Object.entries(wordsBySource).map(([source, words]) => [source, matchPhrase(phrase, words)]),
    ),
  }));
}
