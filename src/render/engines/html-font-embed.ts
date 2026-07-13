import type { CrimsonProPaths, GoogleSansPaths } from "../fonts.js";

interface FontFacePaths {
  readonly regular: string;
  readonly bold: string;
  readonly italic: string;
  readonly boldItalic: string;
}

/**
 * Building just the four `@font-face` rules for a given family, by explicit `file://` path — no `body { font-family: … }` override bundled in, since that decision belongs to whichever theme’s own global stylesheet applies the family, not to this embedding step
 */
export function buildFontFaceRules(familyName: string, fonts: FontFacePaths): string {
  return `
    @font-face { font-family: "${familyName}"; src: url("file://${fonts.regular}"); font-weight: normal; font-style: normal; }
    @font-face { font-family: "${familyName}"; src: url("file://${fonts.bold}"); font-weight: bold; font-style: normal; }
    @font-face { font-family: "${familyName}"; src: url("file://${fonts.italic}"); font-weight: normal; font-style: italic; }
    @font-face { font-family: "${familyName}"; src: url("file://${fonts.boldItalic}"); font-weight: bold; font-style: italic; }
  `;
}

/**
 * Building an `@font-face style` block embedding Google Sans by explicit `file://` path, shared between every engine that consumes genuine HTML and CSS, Pandoc (via Puppeteer/Chromium) and WeasyPrint (via its own CSS engine), rather than duplicating this block in each engine file independently
 */
export function buildFontFaceStyleBlock(fonts: GoogleSansPaths): string {
  return `
    ${buildFontFaceRules("Google Sans", fonts)}
    body { font-family: "Google Sans", sans-serif; margin: 2cm; }
  `;
}

/**
 * The `clean` curriculum vitae theme’s equivalent for Crimson Pro. It returns only the `@font-face rules`, deliberately without a `body` override: `005-01-global.css` already declares `font-family: var(--fontFamily-serif)` on `body`, and duplicating that here would mean two rules of equal specificity fighting over source order
 */
export function buildCrimsonProFontFaceRules(fonts: CrimsonProPaths): string {
  return buildFontFaceRules("Crimson Pro", fonts);
}
