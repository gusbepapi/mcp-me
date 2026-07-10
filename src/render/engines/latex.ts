import { execFile } from "node:child_process";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import type { CvIR } from "../ir.js";
import type { RenderEngine, RenderOptions, RenderResult } from "./types.js";
import { resolveGoogleSansFonts } from "../fonts.js";
import { pdfOutputPath } from "../output-paths.js";

const execFileAsync = promisify(execFile);

/** Escaping characters with special meaning in LaTeX */
function escapeLatex(value: string): string {
  return value
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([{}_$&%#])/g, "\\$1")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

function renderExperienceSection(ir: CvIR): string {
  return ir.experience
    .map((entry) => {
      const end = entry.current ? "Present" : (entry.endDate ?? "");
      const highlights = entry.highlights
        .map((h) => `    \\item ${escapeLatex(h)}`)
        .join("\n");
      return [
        `\\cventry{${escapeLatex(entry.startDate)}--${escapeLatex(end)}}`,
        `  {${escapeLatex(entry.title)}}`,
        `  {${escapeLatex(entry.company)}}`,
        `  {${escapeLatex(entry.location ?? "")}}`,
        `  {}`,
        `  {${entry.description ? escapeLatex(entry.description) : ""}%`,
        highlights ? `\\begin{itemize}\n${highlights}\n\\end{itemize}` : "",
        `  }`,
      ].join("\n");
    })
    .join("\n\n");
}

function renderEducationSection(ir: CvIR): string {
  return ir.education
    .map((entry) => {
      const end = entry.current ? "Present" : (entry.endDate ?? "");
      return `\\cventry{${escapeLatex(entry.startDate)}--${escapeLatex(end)}}{${escapeLatex(
        entry.degree,
      )}}{${escapeLatex(entry.institution)}}{}{}{${entry.field ? escapeLatex(entry.field) : ""}}`;
    })
    .join("\n");
}

function renderSkillsLine(label: string, items: readonly string[]): string {
  if (items.length === 0) return "";
  return `\\cvitem{${label}}{${items.map(escapeLatex).join(", ")}}`;
}

/**
 * Building single-column LaTeX source from the shared `CvIR`. Deliberately avoiding `minipage` or `tabular` for the overall page layout, since the ATS-parseability research at `bduarte10/ats-parsing-research` attribute strong parse scores specifically to its single-column, non-tabular structure.
 */
export function buildLatexSource(ir: CvIR): string {
  const fonts = resolveGoogleSansFonts();
  return `\\documentclass[11pt,a4paper,sans]{moderncv}
\\moderncvstyle{classic}
\\moderncvcolor{black}
\\usepackage[scale=0.85]{geometry}
\\usepackage{fontspec}
% Using \\setsansfont, not \\setmainfont: the [sans] documentclass option
% above makes the sans family moderncv's default rendering family, so
% \\setmainfont, which governs only the serif family, would compile
% without error yet have no visible effect whatsoever, confirmed
% empirically via \`pdffonts\` reporting the embedded font unchanged
\\setsansfont{Google Sans}[
  Path = ${fonts.directory}/,
  UprightFont = Google_Sans_Regular.ttf,
  BoldFont = Google_Sans_Bold.ttf,
  ItalicFont = Google_Sans_Italic.ttf,
  BoldItalicFont = Google_Sans_Bold_Italic.ttf,
]
\\name{${escapeLatex(ir.fullName)}}{}
${ir.headline ? `\\title{${escapeLatex(ir.headline)}}` : ""}
${ir.location ? `\\address{${escapeLatex(ir.location)}}{}{}` : ""}
${ir.contact.email ? `\\email{${escapeLatex(ir.contact.email)}}` : ""}
${ir.contact.website ? `\\homepage{${escapeLatex(ir.contact.website)}}` : ""}

\\begin{document}
\\makecvtitle

${ir.summary ? `\\section{Summary}\n${escapeLatex(ir.summary)}\n` : ""}

\\section{Experience}
${renderExperienceSection(ir)}

\\section{Education}
${renderEducationSection(ir)}

\\section{Skills}
${renderSkillsLine("Technical", ir.skills.technical)}
${renderSkillsLine("Tools", ir.skills.tools)}
${renderSkillsLine("Soft skills", ir.skills.soft)}

\\end{document}
`;
}

export const latexEngine: RenderEngine = {
  name: "latex",
  async render(ir: CvIR, options: RenderOptions): Promise<RenderResult> {
    await mkdir(dirname(options.outputPath), { recursive: true });
    const texPath = options.outputPath.replace(/\.pdf$/, ".tex");
    const source = buildLatexSource(ir);
    await writeFile(texPath, source, "utf-8");

    // Preferring `tectonic` (self-contained, no full TeX Live install required); falling back to `latexmk` if `tectonic` is unavailable, or if `tectonic` crashes, as it is currently known to do on Debian 13 owing to a heap-corruption fault in one of its bundled native libraries when loading FontAwesome’s OpenType glyph tables.
    //
    // `-xelatex` is mandatory, not a preference: `moderncv`’s icon fonts are OpenType (`.otf`), and only XeTeX or LuaTeX can load OpenType glyph tables. Compiling with plain `pdflatex` fails once `fontawesome5.sty` is present, confirmed by testing.
    try {
      await execFileAsync("tectonic", [texPath, "--outdir", dirname(options.outputPath)]);
    } catch {
      await execFileAsync("latexmk", [
        "-xelatex",
        "-interaction=nonstopmode",
        `-output-directory=${dirname(options.outputPath)}`,
        texPath,
      ]);
    }

    const compiledPdfPath = join(dirname(options.outputPath), `${basenameNoExt(texPath)}.pdf`);
    const finalPdfPath = pdfOutputPath(options.outputPath);
    await mkdir(dirname(finalPdfPath), { recursive: true });
    await rename(compiledPdfPath, finalPdfPath);

    const { size } = await stat(finalPdfPath);
    return { engine: "latex", outputPath: finalPdfPath, bytesWritten: size };
  },
};

function basenameNoExt(path: string): string {
  const base = path.split("/").pop() ?? path;
  return base.replace(/\.[^.]+$/, "");
}

/** Reading back a generated `.tex` file, mostly useful for the test suite */
export async function readLatexSource(path: string): Promise<string> {
  return readFile(path, "utf-8");
}
