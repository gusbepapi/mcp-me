import type { EngineName } from "./engines/types.js";

export interface AtsScore {
  readonly engine: EngineName;
  readonly score: number; // 0-100
  readonly band: "excellent" | "good" | "fair" | "poor";
  readonly colour: string; // hex, for the dashboard
  readonly pdfWriter: string;
  readonly layoutMechanism: string;
  readonly rationale: readonly string[];
}

export interface EngineDescription {
  readonly pdfWriter: string;
  readonly layoutMechanism: string;
}

const ENGINE_DESCRIPTIONS: Record<EngineName, EngineDescription> = {
  latex: {
    pdfWriter: "xdvipdfmx (via xelatex)",
    layoutMechanism: "TeX's own line-breaking and page-breaking algorithm",
  },
  typst: {
    pdfWriter: "Typst native writer, no /Producer string unless set explicitly",
    layoutMechanism: "Typst's own native layout engine",
  },
  pandoc: {
    pdfWriter: "Skia/PDF (Chromium, via Puppeteer)",
    layoutMechanism: "full browser CSS box model and HarfBuzz text shaping",
  },
  reportlab: {
    pdfWriter: "ReportLab’s own native PDF writer",
    layoutMechanism:
      "Platypus text-flow engine (`SimpleDocTemplate`, `Paragraph`, `Frame`), a " +
      "high-level layout system with real word-wrapping and pagination",
  },
};

export function describeEngine(engine: EngineName): EngineDescription {
  return ENGINE_DESCRIPTIONS[engine];
}

/**
 * The score is instead calibrated against two independent sources: the published findings in `bduarte10/ats-parsing-research`, and the `/Producer` and `/Creator` metadata empirically extracted from this repository’s own test renders via `pdfinfo`, `strings`, and `qpdf --qdf`
 */
const ENGINE_PROFILES: Record<
  EngineName,
  { score: number; pdfWriter: string; layoutMechanism: string; rationale: string[] }
> = {
  latex: {
    score: 92,
    pdfWriter: "xdvipdfmx (via xelatex)",
    layoutMechanism: "TeX's own line-breaking and page-breaking algorithm",
    rationale: [
      "single-column layout with no tabular positioning",
      "genuine selectable text, no image-based glyphs",
      "predictable heading structure via \\section and \\cventry",
    ],
  },
  typst: {
    score: 85,
    pdfWriter: "Typst native writer, no /Producer string unless set explicitly",
    layoutMechanism: "Typst's own native layout engine",
    rationale: [
      "single-column layout by construction in the shared template",
      "tagged-PDF structure emitted by default, aiding reading-order extraction",
      "an absent /Producer field is unusual and could register as a weak spam heuristic on some older parsers, speculative, not evidenced",
    ],
  },
  pandoc: {
    score: 68,
    pdfWriter: "Skia/PDF (Chromium, via Puppeteer)",
    layoutMechanism: "full browser CSS box model and HarfBuzz text shaping",
    rationale: [
      "Chromium-mediated rendering can fragment multi-word strings across separate HTML spans",
      "special characters in proper nouns have shown mis-encoding in prior testing",
      "structure is otherwise clean, single-column Markdown-derived HTML",
    ],
  },
  reportlab: {
    score: 85,
    pdfWriter: "ReportLab’s own native PDF writer",
    layoutMechanism: "Platypus text flow engine, genuine word-wrapping and pagination",
    rationale: [
      "empirically confirmed via `pdftotext -bbox`: developer, Meridiana, and architecture all remain whole",
      "Platypus renders whole `Paragraph` flowables, not per-glyph positioning",
      "Producer: ReportLab PDF Library, a genuinely distinct writer family from every other engine",
    ],
  },
};

export function bandFor(score: number): AtsScore["band"] {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "fair";
  return "poor";
}

export function colourFor(band: AtsScore["band"]): string {
  switch (band) {
    case "excellent":
      return "#3b82c4"; // --blue-500, from docs/assets/style.css
    case "good":
      return "#7cb9e8"; // --blue-300
    case "fair":
      return "#d4a72c"; // --yellow-500
    case "poor":
      return "#c4634a"; // desaturated red, kept within the same family
  }
}

export function scoreAts(engine: EngineName): AtsScore {
  const profile = ENGINE_PROFILES[engine];
  const band = bandFor(profile.score);
  return {
    engine,
    score: profile.score,
    band,
    colour: colourFor(band),
    pdfWriter: profile.pdfWriter,
    layoutMechanism: profile.layoutMechanism,
    rationale: profile.rationale,
  };
}

export function scoreAllEngines(): readonly AtsScore[] {
  const names: EngineName[] = ["latex", "typst", "pandoc", "reportlab"];
  return names.map(scoreAts);
}
