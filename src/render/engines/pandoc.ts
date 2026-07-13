import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { statSync } from "node:fs";
import puppeteer from "puppeteer";
import type { CvIR } from "../ir.js";
import type { RenderEngine, RenderOptions, RenderResult } from "./types.js";
import { resolveCrimsonProFonts } from "../fonts.js";
import { pdfOutputPath } from "../output-paths.js";
import { buildCrimsonProFontFaceRules } from "./html-font-embed.js";
import { DEFAULT_THEME, THEME_TOKEN_SUFFIX, type ThemeName } from "./theme-names.js";

const execFileAsync = promisify(execFile);

/**
 * The on-disk token stylesheet for a given theme. The `clean` theme’s file presently holds real content.
 * Tthe remaining four are still empty stubs pending `design-tokens/<theme>.tokens.json` sources.
 * Reading whatever is on disk, rather than special-casing `clean`, means this engine needs no further changes once those sources land
 */
function tokensCssPath(theme: ThemeName): string {
  const suffix = THEME_TOKEN_SUFFIX[theme];

  return new URL(`../../../assets/engines/html/004-${suffix}-tokens-${theme}.css`, import.meta.url)
    .pathname;
}

const BASE_CSS_FILENAMES = [
  "001-01-reset-core.css",
  "001-02-reset-browser.css",
  "002-01-fonts.css",
  "003-01-colours.css",
  "005-01-global.css",
  "100-01-print-chromium-and-puppeteer.css",
] as const;

function baseCssPath(filename: string): string {
  return new URL(`../../../assets/engines/html/${filename}`, import.meta.url).pathname;
}

async function loadBaseCss(): Promise<string> {
  const contents = await Promise.all(
    BASE_CSS_FILENAMES.map((filename) => readFile(baseCssPath(filename), "utf-8").catch(() => "")),
  );

  return contents.join("\n");
}

function renderAchievementsMd(ir: CvIR): string {
  if (ir.achievements.length === 0) return "";
  const items = ir.achievements.map((a) => `- ${a}`).join("\n");
  return `\n## Key expertise and core accomplishments\n\n${items}\n`;
}

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

function renderCertificationsMd(ir: CvIR): string {
  if (ir.certifications.length === 0) return "";

  const items = ir.certifications
    .map((entry) => `### ${entry.name} — ${entry.issuer}\n\n*${entry.date}*`)
    .join("\n\n");
  return `\n## Certifications\n\n${items}\n`;
}

function renderProjectsMd(ir: CvIR): string {
  if (ir.projects.length === 0) return "";

  const items = ir.projects
    .map((entry) => {
      const dateRange = entry.startDate
        ? `*${entry.startDate} – ${entry.endDate ?? "Present"}*\n\n`
        : "";
      const roleAndTech = [
        entry.role,
        entry.technologies.length > 0 ? entry.technologies.join(", ") : undefined,
      ]
        .filter(Boolean)
        .join(" · ");
      const highlights = entry.highlights.map((h) => `- ${h}`).join("\n");
      return `### ${entry.name}\n\n${dateRange}${roleAndTech ? `*${roleAndTech}*\n\n` : ""}${entry.description}\n\n${highlights}`;
    })
    .join("\n\n");
  return `\n## Projects\n\n${items}\n`;
}

function renderSkillsMd(ir: CvIR): string {
  const groups: [string, readonly string[]][] = [
    ["Hard skills", ir.skills.technical],
    ["Soft skills", ir.skills.soft],
    ["Tools", ir.skills.tools],
  ];

  const rendered = groups
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => `### ${label}\n\n${items.join(", ")}`)
    .join("\n\n");

  if (!rendered) return "";

  return `\n## Skills\n\n${rendered}\n`;
}

function renderLanguagesMd(ir: CvIR): string {
  if (ir.languages.length === 0) return "";

  const items = ir.languages.map((l) => `- **${l.language}**: ${l.proficiency}`).join("\n");

  return `\n## Languages\n\n${items}\n`;
}

function renderAssociationsMd(ir: CvIR): string {
  if (ir.associations.length === 0) return "";

  const items = ir.associations.map((a) => `- ${a}`).join("\n");

  return `\n## Extracurricular activities\n\n${items}\n`;
}

function renderAdditionalInformationMd(ir: CvIR): string {
  if (ir.additionalInformation.length === 0) return "";

  const items = ir.additionalInformation.map((a) => `- ${a}`).join("\n");

  return `\n## Additional information\n\n${items}\n`;
}

/**
 * Building a plain, single-column Markdown source. Deliberately not emitting Markdown tables for the layout skeleton, since HTML tables downstream tend to fragment ATS parsing, per the Puppeteer findings in `bduarte10/ats-parsing-research`
 *
 * Every optional section below (achievements, certifications, projects, languages, associations, additional information) is built by its own render…Md()` helper that returns an empty string when the corresponding `CvIR` field is empty, so this function needs no further branching once `config.yml`-driven section toggling exists: a future caller can simply zero out the relevant `CvIR` field before calling `buildPandocMarkdown()`, rather than this function needing to know about configuration at all
 */
export function buildPandocMarkdown(ir: CvIR): string {
  return `# ${ir.fullName}

${ir.headline ? `*${ir.headline}*\n` : ""}
${ir.location ? `${ir.location}` : ""}${ir.contact.email ? ` · ${ir.contact.email}` : ""}${
    ir.contact.website ? ` · ${ir.contact.website}` : ""
  }

${ir.summary ? `## Summary\n\n${ir.summary}\n` : ""}
${renderAchievementsMd(ir)}
## Professional experience

${renderExperienceMd(ir)}

## Education

${renderEducationMd(ir)}
${renderCertificationsMd(ir)}
${renderProjectsMd(ir)}
${renderSkillsMd(ir)}
${renderLanguagesMd(ir)}
${renderAssociationsMd(ir)}
${renderAdditionalInformationMd(ir)}`;
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
    await page.pdf({
      path: outputPath,
      printBackground: true,
      preferCSSPageSize: true,
    });
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

    const theme = options.theme ?? DEFAULT_THEME;
    const tokensCss = await readFile(tokensCssPath(theme), "utf-8").catch(() => "");
    const baseCss = await loadBaseCss();
    const fonts = resolveCrimsonProFonts();
    const html = await readFile(htmlPath, "utf-8");
    const styled = html.replace(
      "</head>",
      `<style>${tokensCss}\n${baseCss}\n${buildCrimsonProFontFaceRules(fonts)}</style></head>`,
    );

    await writeFile(htmlPath, styled, "utf-8");

    const finalPdfPath = pdfOutputPath(options.outputPath);
    await mkdir(dirname(finalPdfPath), { recursive: true });
    await htmlToPdfViaPuppeteer(htmlPath, finalPdfPath);

    const { size } = statSync(finalPdfPath);
    return { engine: "pandoc", outputPath: finalPdfPath, bytesWritten: size };
  },
};
