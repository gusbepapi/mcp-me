import type { AtsScore } from "./ats-score.js";
import type { ComparisonRow } from "./ats-extraction.js";

export interface DashboardEntry {
  readonly pdfFileName: string;
  readonly score: AtsScore;
}

export interface PageImageEntry {
  readonly pdfFileName: string;
  readonly pages: readonly {
    readonly imagePath: string;
    readonly pageNumber: number;
  }[];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Rendering the score table, one row per generated PDF rather than one row per engine, since a single engine may eventually produce several files across themes, alternatives, and languages once multilingual generation exists
 */
function renderScoreTable(entries: readonly DashboardEntry[]): string {
  const rows = entries
    .map(
      (entry) => `
      <tr style="--band-colour: ${entry.score.colour}">
        <td class="pdf-name">${escapeHtml(entry.pdfFileName)}</td>
        <td>${escapeHtml(entry.score.engine)}</td>
        <td class="score-cell">${entry.score.score}</td>
        <td class="band-cell">${escapeHtml(entry.score.band)}</td>
        <td>${escapeHtml(entry.score.pdfWriter)}</td>
        <td>${escapeHtml(entry.score.layoutMechanism)}</td>
        <td><ul>${entry.score.rationale.map((r) => `<li>${escapeHtml(r)}</li>`).join("")}</ul></td>
      </tr>`,
    )
    .join("\n");

  return `
  <section>
    <h2>Score by generated PDF</h2>
    <table class="score-table">
      <thead>
        <tr>
          <th>PDF file</th>
          <th>Engine</th>
          <th>Score</th>
          <th>Band</th>
          <th>PDF writer</th>
          <th>Layout mechanism</th>
          <th>Rationale</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </section>`;
}

/**
 * Rendering the comparison table, one column per source PDF, one row per phrase drawn from the profile’s own `CvIR`. A whole, contiguous match is wrapped in guillemets; a fragment is shown unadorned; a missing element is shown as an em dash. This mirrors the convention specified directly, rather than an invented notation
 */
function renderComparisonTable(
  rows: readonly ComparisonRow[],
  sourceOrder: readonly string[],
  phraseToAffindaField: ReadonlyMap<string, string>,
  previewThumbnails: ReadonlyMap<string, string>,
  previewFullPages: ReadonlyMap<string, string>,
): string {
  const header = sourceOrder.map((s) => `<th>${escapeHtml(s)}</th>`).join("");
  const body = rows
    .map((row) => {
      const cells = sourceOrder
        .map((source) => {
          const match = row.matches[source];
          const cellClass = match?.kind ?? "missing";
          return `<td class="match-${cellClass}">${escapeHtml(match?.displayText ?? "\u2014")}</td>`;
        })
        .join("");
      const affindaField = phraseToAffindaField.get(row.phrase.trim().toLowerCase()) ?? "";
      return `<tr><th scope="row">${escapeHtml(row.phrase)}<br><code class="affinda-field">${escapeHtml(affindaField)}</code></th>${cells}</tr>`;
    })
    .join("\n");

  const previewCells = sourceOrder
    .map((source) => {
      const thumbnailPath = previewThumbnails.get(source);
      const fullPagePath = previewFullPages.get(source);
      if (!thumbnailPath || !fullPagePath) return `<td>\u2014</td>`;
      return `<td>
        <a href="${escapeHtml(fullPagePath)}" target="_blank" rel="noopener">
          <img class="preview-thumbnail" src="${escapeHtml(thumbnailPath)}" alt="Highlighted extraction preview for ${escapeHtml(source)}">
        </a>
      </td>`;
    })
    .join("");
  const previewRow = `<tr><th scope="row">Highlighted extraction preview</th>${previewCells}</tr>`;

  return `
  <section>
    <h2>Phrase extraction comparison</h2>
    <table class="comparison-table">
      <thead><tr><th scope="col">Phrase (Affinda field)</th>${header}</tr></thead>
      <tbody>${body}\n${previewRow}</tbody>
    </table>
  </section>`;
}

function renderPageImages(entries: readonly PageImageEntry[]): string {
  const sections = entries
    .map((entry) => {
      const pages = entry.pages
        .map(
          (page) => `
          <figure class="page-figure">
            <div class="page-figure__frame">
              <img src="${escapeHtml(page.imagePath)}" alt="Page ${page.pageNumber} of ${escapeHtml(entry.pdfFileName)}, with extracted words highlighted">
            </div>
            <figcaption>Page ${page.pageNumber}</figcaption>
          </figure>`,
        )
        .join("\n");
      return `
      <div class="pdf-pages">
        <h3>${escapeHtml(entry.pdfFileName)}</h3>
        <div class="pdf-pages__grid">${pages}</div>
      </div>`;
    })
    .join("\n");

  return `
  <section>
    <h2>Highlighted extraction, by page</h2>
    ${sections}
  </section>`;
}

/**
 * Composing the complete, self-contained dashboard document. No external stylesheet, no build step, no Bootstrap or Tailwind
 */
export function buildDashboardHtml(
  scoreEntries: readonly DashboardEntry[],
  comparisonRows: readonly ComparisonRow[],
  sourceOrder: readonly string[],
  pageImageEntries: readonly PageImageEntry[],
  phraseToAffindaField: ReadonlyMap<string, string> = new Map(),
  previewThumbnails: ReadonlyMap<string, string> = new Map(),
  previewFullPages: ReadonlyMap<string, string> = new Map(),
): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>ATS-parseability dashboard</title>
<link rel="stylesheet" href="../assets/css/005-01-global.css">
</head>
<body class="ats-dashboard">
  <h1>ATS-parseability comparison</h1>
  ${renderScoreTable(scoreEntries)}
  ${renderComparisonTable(comparisonRows, sourceOrder, phraseToAffindaField, previewThumbnails, previewFullPages)}
  ${renderPageImages(pageImageEntries)}
</body>
</html>
`;
}
