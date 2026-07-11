import { describe, expect, it } from "vitest";
import { buildDashboardHtml, type DashboardEntry, type PageImageEntry } from "../../src/render/dashboard.js";
import { scoreAts } from "../../src/render/ats-score.js";
import { buildComparisonRows } from "../../src/render/ats-extraction.js";

describe("buildDashboardHtml", () => {
  const scoreEntries: DashboardEntry[] = [
    { pdfFileName: "cv-latex.pdf", score: scoreAts("latex") },
    { pdfFileName: "cv-typst.pdf", score: scoreAts("typst") },
  ];

  const comparisonRows = buildComparisonRows(["Full-stack developer"], {
    "cv-latex.pdf": [{ text: "developer", page: 1, xMin: 0, yMin: 0, xMax: 10, yMax: 10 }],
    "cv-typst.pdf": [
      { text: "Full-stack", page: 1, xMin: 0, yMin: 0, xMax: 10, yMax: 10 },
      { text: "developer", page: 1, xMin: 12, yMin: 0, xMax: 22, yMax: 10 },
    ],
  });

  const pageImageEntries: PageImageEntry[] = [
    {
      pdfFileName: "cv-typst.pdf",
      pages: [{ imagePath: "ats-dashboard-assets/cv-typst-1.png", pageNumber: 1 }],
    },
  ];

  const html = buildDashboardHtml(scoreEntries, comparisonRows, ["cv-latex.pdf", "cv-typst.pdf"], pageImageEntries);

  it("containing a PDF-filename column, not merely an engine name", () => {
    expect(html).toContain("cv-latex.pdf");
    expect(html).toContain("cv-typst.pdf");
    expect(html).toContain("<th>PDF file</th>");
  });

  it("wrapping a whole match in guillemets and leaving a fragment unadorned", () => {
    expect(html).toContain("\u00ABFull-stack developer\u00BB");
    expect(html).toContain('class="match-fragment">developer<');
  });

  it("referencing the already-annotated image directly, with no separate overlay markup", () => {
    expect(html).toContain('src="ats-dashboard-assets/cv-typst-1.png"');
    expect(html).not.toContain("word-box");
  });

  it("containing no reference to Bootstrap or Tailwind", () => {
    expect(html.toLowerCase()).not.toContain("tailwind");
    expect(html.toLowerCase()).not.toContain("bootstrap");
  });
});
