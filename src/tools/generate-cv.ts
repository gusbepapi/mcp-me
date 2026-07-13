import { join } from "node:path";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { identitySchema } from "../schema/identity.js";
import { careerSchema } from "../schema/career.js";
import { skillsSchema } from "../schema/skills.js";
import { projectsSchema } from "../schema/projects.js";
import type { ProfileBundle } from "../loader.js";
import { buildCvIR } from "../render/ir.js";
import { renderCv, renderCvAllEngines } from "../render/index.js";
import type { EngineName } from "../render/engines/types.js";
import { THEME_NAMES, DEFAULT_THEME } from "../render/engines/theme-names.js";

const ENGINE_NAMES: readonly EngineName[] = ["latex", "typst", "pandoc", "reportlab", "weasyprint"];

const generateCvInputSchema = {
  engine: z
    .enum(["latex", "typst", "pandoc", "reportlab", "weasyprint", "all"])
    .default("all")
    .describe(
      "Which render engine to use. Passing 'all' renders through every engine, " +
        "producing four PDFs, useful for the ATS-parseability comparison",
    ),
  theme: z
    .enum(THEME_NAMES)
    .default(DEFAULT_THEME)
    .describe(
      "Which of the five *curriculum vitae* themes to render against. Only “clean” " +
        "presently has populated token CSS/sty/typ files; the remaining four " +
        "(modern, standard, custom-01, custom-02) are accepted but currently " +
        "resolve to empty stub stylesheets pending their design-tokens sources",
    ),
  outputDirectory: z
    .string()
    .optional()
    .describe(
      "Directory to write the generated PDF(s) into. Defaults to a 'cv-output' " +
        "subdirectory of the profile directory",
    ),
};

/**
 * Validating that identity, career, and skills data exist and conform to the schemas already defined for this profile, before attempting to build a `CvIR` from them. Failing here with a clear, specific message is preferable to letting `buildCvIR` fail later against malformed input, or, worse, silently producing a curriculum vitae with missing sections
 */
export function loadValidatedCvSources(profile: ProfileBundle) {
  const identityResult = identitySchema.safeParse(profile.data.identity);

  if (!identityResult.success) {
    throw new Error(
      "generate_cv requires a valid identity.yaml, containing at minimum 'name' " +
        `and 'bio'. Validation errors: ${identityResult.error.message}`,
    );
  }

  // Career, skills, and projects are treated as optional, mirroring the optional status all three carry in the profile schema itself; a *curriculum vitae* with no experience or no side projects listed is unusual, but not something this tool is responsible for forbidding
  const careerResult = careerSchema.safeParse(profile.data.career ?? {});
  const skillsResult = skillsSchema.safeParse(profile.data.skills ?? {});
  const projectsResult = projectsSchema.safeParse(profile.data.projects ?? { projects: [] });

  return {
    identity: identityResult.data,
    career: careerResult.success ? careerResult.data : undefined,
    skills: skillsResult.success ? skillsResult.data : undefined,
    projects: projectsResult.success ? projectsResult.data : undefined,
  };
}

export function registerCvTools(
  server: McpServer,
  profile: ProfileBundle,
  profileDir: string,
): void {
  server.registerTool(
    "generate_cv",
    {
      title: "Generate curriculum vitae",
      description:
        "Generating a curriculum vitae PDF from this person's profile data (identity, " +
        "career, and skills), through one of five rendering engines: LaTeX (moderncv, " +
        "via xelatex), Typst (native compiler), Pandoc (Markdown through a Chromium " +
        "print pipeline), ReportLab (Python Platypus text flow engine), or WeasyPrint " +
        "(the identical Pandoc-generated HTML, through WeasyPrint’s own CSS engine " +
        "rather than a browser). Passing " +
        "'all' renders every engine, which is the input the ATS-parseability " +
        "comparison depends upon",
      inputSchema: generateCvInputSchema,
      annotations: { readOnlyHint: false },
    },
    async ({ engine, theme, outputDirectory }) => {
      const { identity, career, skills, projects } = loadValidatedCvSources(profile);
      const ir = buildCvIR({ identity, career, skills, projects });
      const targetDirectory = outputDirectory ?? join(profileDir, "cv-output");

      if (engine === "all") {
        const { results, skipped, failed } = await renderCvAllEngines(ir, targetDirectory, theme);
        const lines: string[] = [];

        for (const name of ENGINE_NAMES) {
          const result = results[name];

          if (result) {
            lines.push(`- ${name}: ${result.outputPath} (${result.bytesWritten} bytes)`);
          }
        }

        for (const { engine: name, reason } of skipped) {
          lines.push(`- ${name}: skipped, ${reason}`);
        }

        for (const { engine: name, error } of failed) {
          lines.push(`- ${name}: failed, ${error}`);
        }

        const generatedCount = Object.keys(results).length;
        const totalCount = ENGINE_NAMES.length;
        const summary =
          generatedCount === totalCount
            ? `Generated curriculum vitae PDFs through all ${totalCount} engines`
            : `Generated curriculum vitae PDFs through ${generatedCount} of ${totalCount} engines, ` +
              `skipping or failing the remainder rather than aborting the batch`;

        return {
          content: [
            {
              type: "text" as const,
              text: `${summary}:\n${lines.join("\n")}`,
            },
          ],
        };
      }

      const result = await renderCv(engine, ir, {
        outputPath: join(targetDirectory, `cv-${engine}.pdf`),
        theme,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: `Generated curriculum vitae via ${engine}: ${result.outputPath} (${result.bytesWritten} bytes)`,
          },
        ],
      };
    },
  );
}
