import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { statSync } from "node:fs";
import puppeteer from "puppeteer";
import type { CvIR } from "../ir.js";
import type { RenderEngine, RenderOptions, RenderResult } from "./types.js";
import { resolveGoogleSansFonts } from "../fonts.js";
import { pdfOutputPath } from "../output-paths.js";
import { buildFontFaceStyleBlock } from "./html-font-embed.js";

const execFileAsync = promisify(execFile);

function renderExperienceMd(ir: CvIR): string {
  return ir.experience
    .map((entry) => {
      const end = entry.current ? "Present" : (entry.endDate ?? "");
      const highlights = entry.highlights.map((h) => `- ${h}`).join("\n");
      return `### ${entry.title} — ${entry.company}\n\n*${entry.startDate} – ${end}*${
        entry.location ? ` · ${entry.location}` : ""
      }\n\n${entry.description ?? ""}\n\n${highlights}`;
    })
    .join("\n\n");
}

function renderEducationMd(ir: CvIR): string {
  return ir.education
    .map((entry) => {
      const end = entry.current ? "Present" : (entry.endDate ?? "");
      return `### ${entry.degree} — ${entry.institution}\n\n*${entry.startDate} – ${end}*${
        entry.field ? ` · ${entry.field}` : ""
      }`;
    })
    .join("\n\n");
}

/**
 * Building a plain, single-column Markdown source. Deliberately not emitting Markdown tables for the layout skeleton, since HTML tables downstream tend to fragment ATS parsing, per the Puppeteer findings in `bduarte10/ats-parsing-research`
 */
export function buildPandocMarkdown(ir: CvIR): string {
  return `# ${ir.fullName}

${ir.headline ? `*${ir.headline}*\n` : ""}
${ir.location ? `${ir.location}` : ""}${ir.contact.email ? ` · ${ir.contact.email}` : ""}${
    ir.contact.website ? ` · ${ir.contact.website}` : ""
  }

${ir.summary ? `## Summary\n\n${ir.summary}\n` : ""}

## Experience

${renderExperienceMd(ir)}

## Education

${renderEducationMd(ir)}

## Skills

- **Technical**: ${ir.skills.technical.join(", ")}
- **Tools**: ${ir.skills.tools.join(", ")}
- **Soft skills**: ${ir.skills.soft.join(", ")}
`;
}

/**
 * Converting HTML to PDF via a Puppeteer invocation, rather than shelling out to an external script that may or may not exist in a given checkout. 
 * 
 * This keeps the engine self-contained: its only new dependency is the `puppeteer` package itself, added to this repository’s `package.json`, not borrowed from a separate, unrelated pipeline.
 *
 * Deliberately kept distinct from the `latex` and `typst` engines’ PDF production mechanism: 
 * 
 * This is the one engine in the comparison that exercises a browser-rendering pipeline, which is the property the ATS dashboard is meant to be comparing in the first instance
 */
async function htmlToPdfViaPuppeteer(htmlPath: string, outputPath: string): Promise<void> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--allow-file-access-from-files"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
    await page.pdf({ path: outputPath, format: "a4", printBackground: true });
  } 
  
  finally {
    await browser.close();
  }
}

export const pandocEngine: RenderEngine = {
  name: "pandoc",
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
    await htmlToPdfViaPuppeteer(htmlPath, finalPdfPath);

    const { size } = statSync(finalPdfPath);
    return { engine: "pandoc", outputPath: finalPdfPath, bytesWritten: size };
  },
};
