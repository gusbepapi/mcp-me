import { describe, expect, it } from "vitest";
import { buildCvIR } from "../../src/render/ir.js";
import { scoreAllEngines } from "../../src/render/ats-score.js";
import { buildLatexSource } from "../../src/render/engines/latex.js";
import { buildTypstSource } from "../../src/render/engines/typst.js";
import { buildPandocMarkdown } from "../../src/render/engines/pandoc.js";

const identity = {
  name: "Gustavo Papi",
  bio: "Full-stack developer and genealogist.",
  contact: { email: "gustavo@example.com" },
};

describe("buildCvIR", () => {
  it("maps identity, career, and skills into a single structure", () => {
    const ir = buildCvIR({
      identity,
      career: {
        experience: [
          {
            title: "Developer",
            company: "Euromoov",
            start_date: "2023-01",
            current: true,
            highlights: ["Shipped genealogy tooling"],
          },
        ],
      },
      skills: { technical: [{ name: "TypeScript" }] },
    });

    expect(ir.fullName).toBe("Gustavo Papi");
    expect(ir.experience).toHaveLength(1);
    expect(ir.experience[0]?.current).toBe(true);
    expect(ir.skills.technical).toContain("TypeScript");
  });
});

describe("engine source builders", () => {
  const ir = buildCvIR({ identity });

  it("produces LaTeX source containing the escaped full name", () => {
    expect(buildLatexSource(ir)).toContain("Gustavo Papi");
  });

  it("produces Typst source importing the shared cv library", () => {
    expect(buildTypstSource(ir)).toContain('#import "lib/cv.typ"');
  });

  it("produces Pandoc Markdown with a top-level heading", () => {
    expect(buildPandocMarkdown(ir)).toContain("# Gustavo Papi");
  });
});

describe("scoreAllEngines", () => {
  it("ranks LaTeX above Pandoc, per the ATS-parsing-research findings", () => {
    const scores = scoreAllEngines();
    const latex = scores.find((s) => s.engine === "latex")!;
    const pandoc = scores.find((s) => s.engine === "pandoc")!;
    expect(latex.score).toBeGreaterThan(pandoc.score);
  });

  it("includes `reportlab`, confirmed via `pdftotext` against a real render, not merely word-fragmentation-free by assumption", () => {
    const scores = scoreAllEngines();
    const reportlab = scores.find((s) => s.engine === "reportlab")!;
    expect(reportlab).toBeDefined();
    expect(reportlab.rationale.some((r) => r.includes("empirically confirmed"))).toBe(true);
  });
});
