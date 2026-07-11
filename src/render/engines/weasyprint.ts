import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { promisify } from "node:util";
import { statSync } from "node:fs";
import type { CvIR } from "../ir.js";
import type { RenderEngine, RenderOptions, RenderResult } from "./types.js";
import { resolveGoogleSansFonts } from "../fonts.js";
import { pdfOutputPath } from "../output-paths.js";
import { buildFontFaceStyleBlock } from "./html-font-embed.js";
import { buildPandocMarkdown } from "./pandoc.js";

const execFileAsync = promisify(execFile);

/**
 * Rendering via WeasyPrint’s own native CSS engine, not a browser at all, totally distinct from Pandoc’s Chromium pipeline despite sharing the identical Markdown and HTML generation step. It is exactly the point of including both: one HTML document, two entirely different layout engines interpreting it, a real comparison rather than a duplicated one
 */
export const weasyprintEngine: RenderEngine = {
  name: "weasyprint",
  async render(ir: CvIR, options: RenderOptions): Promise<RenderResult> {
    await mkdir(dirname(options.outputPath), { recursive: true });
    const mdPath = options.outputPath.replace(/\.pdf$/, ".md");
    const htmlPath = options.outputPath.replace(/\.pdf$/, ".html");
    await writeFile(mdPath, buildPandocMarkdown(ir), "utf-8");

    await execFileAsync("pandoc", [mdPath, "-o", htmlPath, "--standalone"]);

    const fonts = resolveGoogleSansFonts();
    const html = await readFile(htmlPath, "utf-8");

    const styled = html.replace(
      "</head>",
      `<style>${buildFontFaceStyleBlock(fonts)}</style></head>`,
    );

    await writeFile(htmlPath, styled, "utf-8");

    const finalPdfPath = pdfOutputPath(options.outputPath);
    await mkdir(dirname(finalPdfPath), { recursive: true });

    await execFileAsync("weasyprint", [htmlPath, finalPdfPath]);

    const { size } = statSync(finalPdfPath);
    return { engine: "weasyprint", outputPath: finalPdfPath, bytesWritten: size };
  },
};
