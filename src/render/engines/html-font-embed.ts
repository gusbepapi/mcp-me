import type { GoogleSansPaths } from "../fonts.js";

/**
 * Building an @font-face style block embedding Google Sans by explicit
 * file:// path, shared between every engine that consumes genuine HTML
 * and CSS, Pandoc (via Puppeteer/Chromium) and WeasyPrint (via its own
 * CSS engine), rather than duplicating this block in each engine file
 * independently
 */
export function buildFontFaceStyleBlock(fonts: GoogleSansPaths): string {
  return `
    @font-face { font-family: "Google Sans"; src: url("file://${fonts.regular}"); font-weight: normal; font-style: normal; }
    @font-face { font-family: "Google Sans"; src: url("file://${fonts.bold}"); font-weight: bold; font-style: normal; }
    @font-face { font-family: "Google Sans"; src: url("file://${fonts.italic}"); font-weight: normal; font-style: italic; }
    @font-face { font-family: "Google Sans"; src: url("file://${fonts.boldItalic}"); font-weight: bold; font-style: italic; }
    body { font-family: "Google Sans", sans-serif; margin: 2cm; }
  `;
}
