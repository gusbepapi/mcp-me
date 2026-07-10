import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { findPackageRoot } from "../utils/package-root.js";

export interface GoogleSansPaths {
  readonly directory: string;
  readonly regular: string;
  readonly bold: string;
  readonly italic: string;
  readonly boldItalic: string;
}

export function resolveGoogleSansFonts(): GoogleSansPaths {
  const packageRoot = findPackageRoot(dirname(fileURLToPath(import.meta.url)));
  const distDir = join(packageRoot, "dist", "assets", "fonts", "google-sans");
  const directory = existsSync(join(distDir, "Google_Sans_Regular.ttf"))
    ? distDir
    : join(packageRoot, "assets", "global", "fonts", "google-sans");

  return {
    directory,
    regular: join(directory, "Google_Sans_Regular.ttf"),
    bold: join(directory, "Google_Sans_Bold.ttf"),
    italic: join(directory, "Google_Sans_Italic.ttf"),
    boldItalic: join(directory, "Google_Sans_Bold_Italic.ttf"),
  };
}
