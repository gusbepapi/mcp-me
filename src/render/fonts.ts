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

export interface CrimsonProPaths {
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

export function resolveCrimsonProFonts(): CrimsonProPaths {
  const packageRoot = findPackageRoot(dirname(fileURLToPath(import.meta.url)));
  const distDir = join(packageRoot, "dist", "assets", "fonts", "crimson-pro");
  const directory = existsSync(join(distDir, "Crimson_Pro_Regular.ttf"))
    ? distDir
    : join(packageRoot, "assets", "global", "fonts", "crimson-pro");

  return {
    directory,
    regular: join(directory, "Crimson_Pro_Regular.ttf"),
    bold: join(directory, "Crimson_Pro_Bold.ttf"),
    italic: join(directory, "Crimson_Pro_Italic.ttf"),
    boldItalic: join(directory, "Crimson_Pro_Bold_Italic.ttf"),
  };
}
