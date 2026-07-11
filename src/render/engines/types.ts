import type { CvIR } from "../ir.js";

export interface RenderOptions {
  readonly theme?: string;
  readonly outputPath: string;
}

export interface RenderResult {
  readonly engine: EngineName;
  readonly outputPath: string;
  readonly bytesWritten: number;
}

export type EngineName = "latex" | "typst" | "pandoc" | "reportlab";

/**
 * Contract every rendering engine must satisfy. Each engine receives the same `CvIR`, so parity across formats is a property of the shared assembly step, not of four independently maintained templates
 */
export interface RenderEngine {
  readonly name: EngineName;
  render(ir: CvIR, options: RenderOptions): Promise<RenderResult>;
}
