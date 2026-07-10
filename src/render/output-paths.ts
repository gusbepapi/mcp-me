import { dirname, basename, join } from "node:path";

/**
 * Deriving the destination for a final PDF from the caller’s requested outputPath`, placing it inside a `pdf/` subfolder of that same directory, whilst every intermediate file, `.tex`, `.typ`, `.md`, `.html`, `.ir.json`, continues to derive its own path from the original, unmodified `outputPath`. This keeps `cv-output/` itself holding only source and intermediate artefacts, with `cv-output/pdf/` holding only the finished documents
 */
export function pdfOutputPath(outputPath: string): string {
  return join(dirname(outputPath), "pdf", basename(outputPath));
}
