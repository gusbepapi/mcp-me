/**
 * Single shared source for the five *curriculum vitae* theme names and their corresponding `assets/engines/*` token file suffixes.
 *
 * `scripts/build-tokens.mjs` already owns an identical `clean/modern/standard/custom-01/custom-02 → 01/03/04/05/06` mapping. Duplicating that mapping a second time inside the render engines is exactly the pattern already
 * flagged under «architectural debt» for `ALL_ENGINE_NAMES`, so this module is the one place a theme name is declared for anything consuming a generated token file at render time.
 */

export const THEME_NAMES = ["clean", "modern", "standard", "custom-01", "custom-02"] as const;

export type ThemeName = (typeof THEME_NAMES)[number];

export const DEFAULT_THEME: ThemeName = "clean";

/**
 * Mapping each theme to the two-digit suffix `scripts/build-tokens.mjs` gives its generated `004-NN-tokens-<theme>.{css,sty,typ,py}` file
 */
export const THEME_TOKEN_SUFFIX: Record<ThemeName, string> = {
  clean: "01",
  modern: "03",
  standard: "04",
  "custom-01": "05",
  "custom-02": "06",
};

export function isThemeName(value: string): value is ThemeName {
  return (THEME_NAMES as readonly string[]).includes(value);
}
