import { execFile } from "node:child_process";
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { pdfOutputPath } from "../output-paths.js";
import type { CvIR } from "../ir.js";
import type { RenderEngine, RenderOptions, RenderResult } from "./types.js";
import { existsSync, statSync } from "node:fs";
import { findPackageRoot } from "../../utils/package-root.js";
import { resolveGoogleSansFonts } from "../fonts.js";

const execFileAsync = promisify(execFile);

function resolveCvLibDirectory(): string {
  const packageRoot = findPackageRoot(dirname(fileURLToPath(import.meta.url)));
  const distAsset = join(packageRoot, "dist", "assets", "cv.typ");
  if (existsSync(distAsset)) {
    return join(packageRoot, "dist", "assets");
  }
  return join(packageRoot, "src", "render", "lib");
}

const RENDER_LIB_DIR = resolveCvLibDirectory();

function escapeTypst(value: string): string {
  return value.replace(/([\\#*_$@\[\]<>`])/g, "\\$1");
}

function renderExperience(ir: CvIR): string {
  return ir.experience
    .map((entry) => {
      const end = entry.current ? "Present" : (entry.endDate ?? "");
      const highlights = entry.highlights.map((h) => `  - ${escapeTypst(h)}`).join("\n");
      return `#cv-entry(
  dates: "${escapeTypst(entry.startDate)}--${escapeTypst(end)}",
  title: "${escapeTypst(entry.title)}",
  org: "${escapeTypst(entry.company)}",
  location: "${escapeTypst(entry.location ?? "")}",
)[
${entry.description ? escapeTypst(entry.description) : ""}
${highlights}
]`;
    })
    .join("\n\n");
}

function renderEducation(ir: CvIR): string {
  return ir.education
    .map((entry) => {
      const end = entry.current ? "Present" : (entry.endDate ?? "");
      return `#cv-entry(
  dates: "${escapeTypst(entry.startDate)}--${escapeTypst(end)}",
  title: "${escapeTypst(entry.degree)}",
  org: "${escapeTypst(entry.institution)}",
  location: "",
)[${entry.field ? escapeTypst(entry.field) : ""}]`;
    })
    .join("\n\n");
}

/**
 * Building a single-column Typst source document. The `cv-entry` helper is
 * expected to live in a companion `lib/cv.typ`, kept separate so that
 * theming (Art Deco, classic, and so forth) is a matter of swapping the
 * imported module, consistent with the multi-themed architecture already
 * established for other Typst documents in this profile
 */
export function buildTypstSource(ir: CvIR): string {
  return `#import "lib/cv.typ": cv-entry, cv-document

#show: cv-document.with(
  name: "${escapeTypst(ir.fullName)}",
  headline: "${ir.headline ? escapeTypst(ir.headline) : ""}",
  location: "${ir.location ? escapeTypst(ir.location) : ""}",
  email: "${ir.contact.email ? escapeTypst(ir.contact.email) : ""}",
  website: "${ir.contact.website ? escapeTypst(ir.contact.website) : ""}",
)

${ir.summary ? `= Summary\n${escapeTypst(ir.summary)}\n` : ""}

= Experience
${renderExperience(ir)}

= Education
${renderEducation(ir)}

= Skills
- *Technical*: ${ir.skills.technical.map(escapeTypst).join(", ")}
- *Tools*: ${ir.skills.tools.map(escapeTypst).join(", ")}
- *Soft skills*: ${ir.skills.soft.map(escapeTypst).join(", ")}
`;
}

export const typstEngine: RenderEngine = {
  name: "typst",
  async render(ir: CvIR, options: RenderOptions): Promise<RenderResult> {
    const outputDir = dirname(options.outputPath);
    await mkdir(join(outputDir, "lib"), { recursive: true });
    await copyFile(join(RENDER_LIB_DIR, "cv.typ"), join(outputDir, "lib", "cv.typ"));

    const typPath = options.outputPath.replace(/\.pdf$/, ".typ");
    await writeFile(typPath, buildTypstSource(ir), "utf-8");

    const finalPdfPath = pdfOutputPath(options.outputPath);
    await mkdir(dirname(finalPdfPath), { recursive: true });

    const fonts = resolveGoogleSansFonts();
    await execFileAsync("typst", [
      "compile",
      "--font-path",
      fonts.directory,
      typPath,
      finalPdfPath,
    ]);

    const { size } = statSync(finalPdfPath);
    return { engine: "typst", outputPath: finalPdfPath, bytesWritten: size };
  },
};
