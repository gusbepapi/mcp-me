import { describe, expect, it } from "vitest";
import { parseBboxOutput, matchPhrase, buildComparisonRows, computeEmpiricalScore, type ExtractedWord } from "../../src/render/ats-extraction.js";

const SAMPLE_BBOX_XML = `
<html>
<body>
<doc>
<page width="595" height="842">
<word xMin="10.0" yMin="20.0" xMax="60.0" yMax="32.0">Full-stack</word>
<word xMin="62.0" yMin="20.0" xMax="110.0" yMax="32.0">developer</word>
</page>
<page width="595" height="842">
<word xMin="10.0" yMin="20.0" xMax="40.0" yMax="32.0">Gustavo</word>
</page>
</doc>
</body>
</html>
`;

describe("parseBboxOutput", () => {
  it("assigning words to the correct page in reading order", () => {
    const words = parseBboxOutput(SAMPLE_BBOX_XML);
    expect(words).toHaveLength(3);
    expect(words[0]?.page).toBe(1);
    expect(words[1]?.page).toBe(1);
    expect(words[2]?.page).toBe(2);
    expect(words[2]?.text).toBe("Gustavo");
  });
});

function makeWords(...texts: string[]): ExtractedWord[] {
  return texts.map((text, i) => ({
    text,
    page: 1,
    xMin: i * 50,
    yMin: 0,
    xMax: i * 50 + 40,
    yMax: 12,
  }));
}

describe("matchPhrase", () => {
  it("finding a whole, contiguous match and wrapping it in guillemets", () => {
    const words = makeWords("Full-stack", "developer", "and", "genealogist");
    const result = matchPhrase("Full-stack developer", words);
    expect(result.kind).toBe("whole");
    expect(result.displayText).toBe("\u00ABFull-stack developer\u00BB");
  });

  it("reporting a fragment when only part of the phrase is contiguous", () => {
    const words = makeWords("Full-stack", "engineer", "role");
    const result = matchPhrase("Full-stack developer", words);
    expect(result.kind).toBe("fragment");
    expect(result.displayText).toBe("Full-stack");
  });

  it("reporting missing when no token of the phrase is present at all", () => {
    const words = makeWords("Something", "entirely", "unrelated");
    const result = matchPhrase("Full-stack developer", words);
    expect(result.kind).toBe("missing");
  });
});

describe("buildComparisonRows", () => {
  it("keying each row's matches by source filename, not by engine name", () => {
    const rows = buildComparisonRows(["Full-stack developer"], {
      "cv-typst-classic-en.pdf": makeWords("Full-stack", "developer"),
      "cv-pandoc.pdf": makeWords("Full-stack"),
    });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.matches["cv-typst-classic-en.pdf"]?.kind).toBe("whole");
    expect(rows[0]?.matches["cv-pandoc.pdf"]?.kind).toBe("fragment");
  });
});

describe("computeEmpiricalScore", () => {
  it("weighting a fragment at half a whole match, and a miss at nothing", () => {
    const wordsBySource = {
      "engine-a.pdf": [
        ...makeWords("Alpha"),
        ...makeWords("Beta"),
        ...makeWords("Delta"),
      ],
    };
    const comparisonRows = buildComparisonRows(["Alpha", "Beta", "Gamma", "Delta"], wordsBySource);
    const breakdown = computeEmpiricalScore(comparisonRows, "engine-a.pdf");

    expect(breakdown.wholeCount).toBe(3);
    expect(breakdown.missingCount).toBe(1);
    expect(breakdown.totalPhrases).toBe(4);
    expect(breakdown.score).toBe(75); // 3 whole out of 4, no fragments
  });

  it("returning zero for a source absent from every row", () => {
    const comparisonRows = buildComparisonRows(["Alpha"], {
      "engine-a.pdf": makeWords("Alpha"),
    });
    const breakdown = computeEmpiricalScore(comparisonRows, "engine-b.pdf");
    expect(breakdown.score).toBe(0);
    expect(breakdown.missingCount).toBe(1);
  });
});
