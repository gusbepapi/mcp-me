import type { CvIR } from "./ir.js";
import type { EngineName, RenderOptions, RenderResult } from "./engines/types.js";
import { latexEngine } from "./engines/latex.js";
import { typstEngine } from "./engines/typst.js";
import { pandocEngine } from "./engines/pandoc.js";
import { reportlabEngine } from "./engines/reportlab.js";
import { weasyprintEngine } from "./engines/weasyprint.js";
import { checkEngineAvailability } from "./engine-availability.js";

export type { CvIR } from "./ir.js";
export { buildCvIR } from "./ir.js";
export type { EngineName, RenderOptions, RenderResult } from "./engines/types.js";
export { scoreAts, scoreAllEngines } from "./ats-score.js";
export type { AtsScore } from "./ats-score.js";
export { buildDashboardHtml } from "./dashboard.js";
export type { DashboardEntry, PageImageEntry } from "./dashboard.js";
export { extractWords, rasterisePages, matchPhrase, buildComparisonRows, computeEmpiricalScore } from "./ats-extraction.js";
export type { ExtractedWord, PhraseMatch, ComparisonRow, MatchKind, EmpiricalScoreBreakdown } from "./ats-extraction.js";
export { buildAffindaExport, deriveAffindaPhrases } from "./affinda-schema.js";
export type { AffindaResume, AffindaPhraseEntry } from "./affinda-schema.js";
export { checkEngineAvailability } from "./engine-availability.js";
export type { EngineAvailability } from "./engine-availability.js";

const engines: Record<EngineName, { render(ir: CvIR, options: RenderOptions): Promise<RenderResult> }> = {
  latex: latexEngine,
  typst: typstEngine,
  pandoc: pandocEngine,
  reportlab: reportlabEngine,
  weasyprint: weasyprintEngine,
};

/**
 * Rendering a single `CvIR` through one named engine. This is the function the new `generate_cv` MCP tool calls; keeping it separate from the tool definition means the render module has no dependency on the MCP SDK and can be unit-tested in isolation
 */
export async function renderCv(
  engineName: EngineName,
  ir: CvIR,
  options: RenderOptions,
): Promise<RenderResult> {
  const engine = engines[engineName];

  if (!engine) {
    throw new Error(`Unknown render engine: ${engineName}`);
  }

  return engine.render(ir, options);
}

export interface RenderAllEnginesResult {
  readonly results: Partial<Record<EngineName, RenderResult>>;
  readonly skipped: readonly { readonly engine: EngineName; readonly reason: string }[];
  readonly failed: readonly { readonly engine: EngineName; readonly error: string }[];
}

export async function renderCvAllEngines(
  ir: CvIR,
  outputDirectory: string,
  theme?: RenderOptions["theme"],
): Promise<RenderAllEnginesResult> {
  const names: EngineName[] = ["latex", "typst", "pandoc", "reportlab", "weasyprint"];
  const results: Partial<Record<EngineName, RenderResult>> = {};
  const skipped: { engine: EngineName; reason: string }[] = [];
  const failed: { engine: EngineName; error: string }[] = [];

  for (const name of names) {
    const availability = await checkEngineAvailability(name);

    if (!availability.available) {
      skipped.push({ engine: name, reason: availability.reason ?? "unavailable" });
      continue;
    }

    try {
      results[name] = await renderCv(name, ir, {
        outputPath: `${outputDirectory}/cv-${name}.pdf`,
        theme,
      });
    } 
    
    catch (error) {
      failed.push({ engine: name, error: error instanceof Error ? error.message : String(error) });
    }
  }

  return { results, skipped, failed };
}
