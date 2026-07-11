import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { statSync, existsSync } from "node:fs";
import type { CvIR } from "../ir.js";
import type { RenderEngine, RenderOptions, RenderResult } from "./types.js";
import { resolveGoogleSansFonts } from "../fonts.js";
import { pdfOutputPath } from "../output-paths.js";
import { findPackageRoot } from "../../utils/package-root.js";

const execFileAsync = promisify(execFile);

function resolveReportLabScriptPath(): string {
  const packageRoot = findPackageRoot(dirname(fileURLToPath(import.meta.url)));
  const distAsset = join(packageRoot, "dist", "assets", "render_cv_reportlab.py");
  if (existsSync(distAsset)) {
    return distAsset;
  }
  return join(packageRoot, "scripts", "render_cv_reportlab.py");
}

const REPORTLAB_SCRIPT_PATH = resolveReportLabScriptPath();

/**
 * Rendering via ReportLab's Platypus layer (`SimpleDocTemplate`, `Paragraph`, `Frame`), a text flow engine with real word wrapping and pagination
 */

export const reportlabEngine: RenderEngine = {
  name: "reportlab",
  async render(ir: CvIR, options: RenderOptions): Promise<RenderResult> {
    await mkdir(dirname(options.outputPath), { recursive: true });
    const jsonPath = options.outputPath.replace(/\.pdf$/, ".ir.json");
    await writeFile(jsonPath, JSON.stringify(ir, null, 2), "utf-8");

    const finalPdfPath = pdfOutputPath(options.outputPath);
    await mkdir(dirname(finalPdfPath), { recursive: true });

    const fonts = resolveGoogleSansFonts();
    await execFileAsync("python3", [
      REPORTLAB_SCRIPT_PATH,
      "--input",
      jsonPath,
      "--output",
      finalPdfPath,
      "--font-regular",
      fonts.regular,
      "--font-bold",
      fonts.bold,
      "--font-italic",
      fonts.italic,
      "--font-bold-italic",
      fonts.boldItalic,
    ]);

    const { size } = statSync(finalPdfPath);
    return { engine: "reportlab", outputPath: finalPdfPath, bytesWritten: size };
  },
};
