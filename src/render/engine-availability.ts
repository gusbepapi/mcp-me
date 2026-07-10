import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { EngineName } from "./engines/types.js";

const execFileAsync = promisify(execFile);

async function commandExists(command: string): Promise<boolean> {
  try {
    await execFileAsync("which", [command]);
    return true;
  } catch {
    return false;
  }
}

async function pythonModuleExists(moduleName: string): Promise<boolean> {
  try {
    await execFileAsync("python3", ["-c", `import ${moduleName}`]);
    return true;
  } catch {
    return false;
  }
}

export interface EngineAvailability {
  readonly available: boolean;
  readonly reason?: string;
}

/**
 * Verifying whether an engine’s required binaries are genuinely present, rather than discovering their absence only once `execFile` throws midway through a render. `latex` accepts either `tectonic` or the `latexmk`/`xelatex` pair, matching the fallback already implemented in `latex.ts`
 */
export async function checkEngineAvailability(engine: EngineName): Promise<EngineAvailability> {
  switch (engine) {
    case "latex": {
      const hasTectonic = await commandExists("tectonic");
      if (hasTectonic) return { available: true };
      const hasLatexmk = await commandExists("latexmk");
      const hasXelatex = await commandExists("xelatex");
      if (hasLatexmk && hasXelatex) return { available: true };
      return {
        available: false,
        reason: "neither `tectonic` nor the `latexmk`/`xelatex` pair is on PATH",
      };
    }
    case "typst": {
      const hasTypst = await commandExists("typst");
      return hasTypst ? { available: true } : { available: false, reason: "`typst` is not on PATH" };
    }
    case "pandoc": {
      const hasPandoc = await commandExists("pandoc");
      if (!hasPandoc) return { available: false, reason: "`pandoc` is not on PATH" };
      try {
        await import("puppeteer");
        return { available: true };
      } catch {
        return { available: false, reason: "the `puppeteer` package is not installed" };
      }
    }
  }
}
