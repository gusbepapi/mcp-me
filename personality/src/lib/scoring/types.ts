/*
Shared types for every personality system’s item bank (`items/*.json`) and scoring module (`src/lib/scoring/*.ts`). 

One shape here, consumed by all eighteen systems eventually, rather than each system inventing its own slightly-different item/answer/result shape independently

Every item's `text` is this project’s own original wording, never a proprietary instrument’s published item. The trait names and constructs are not protected by anything; the specific wording of a published questionnaire is
*/

/**
 * A single Likert-scale response option, `value` being what gets summed (after any reverse-scoring), `label` being what the person actually reads on screen
 */
export interface ResponseOption {
  readonly value: number;
  readonly label: string;
}

/**
 * The full scale every item in a system is answered against. Kept per-system, rather than assumed to always be the same five-point scale, since a future system on the ROADMAP list (Holland Code/RIASEC, for
 * example) may need a different shape of response entirely
 */
export interface ResponseScale {
  readonly options: readonly ResponseOption[];
}

/**
 * One statement the person answers. 
 * 
 * The `trait` is the scoring dimension this item feeds into the specific set of valid trait names differs per system, so it is typed as a bare `string` here rather than a union, with each system's own scoring module narrowing it
 */
export interface Item {
  readonly id: string;
  readonly trait: string;
  readonly text: string;
  readonly reverseScored: boolean;
}

/**
 * The on-disk shape of every `items/*.json` file
 */
export interface ItemBank {
  readonly system: string;
  readonly name: string;
  readonly responseScale: ResponseScale;
  readonly items: readonly Item[];
}

/**
 * What the person actually submits: one chosen numeric value per item `id`.
 * 
 * A `Map` is deliberately not used here, since this needs to serialise directly to JSON for `window.storage`/a shareable results link, per the architecture agreed for offline/online parity
 */
export type Answers = Record<string, number>;

/**
 * One trait’s computed result. The `rawScore` is the mean of that trait’s items, on the same scale as `ResponseOption.value` (for example, 1–5).
 * The `normalizedScore` rescales that to 0–100, so the traits measured on differently-sized scales across different systems can still be compared or plotted on one shared axis without the caller needing to know each system’s native scale
 */
export interface TraitScore {
  readonly trait: string;
  readonly rawScore: number;
  readonly normalizedScore: number;
  readonly itemCount: number;
}

/**
 * The shape every system’s `score()` function returns. `system` matches `ItemBank.system`, so a caller holding several `SystemResult`s together (the eighteen-panel container discussed) can tell which is which without relying on array position
 */
export interface SystemResult {
  readonly system: string;
  readonly traits: readonly TraitScore[];
}

/**
 * Rescaling a raw mean (on a `[scaleMin, scaleMax]` range) onto 0–100.
 * Shared here so every system’s scoring module normalises identically, rather than each reimplementing this arithmetic slightly differently
 */
export function normalizeScore(rawScore: number, scaleMin: number, scaleMax: number): number {
  if (scaleMax === scaleMin) {
    throw new Error("normalizeScore requires scaleMax to differ from scaleMin");
  }

  return ((rawScore - scaleMin) / (scaleMax - scaleMin)) * 100;
}

/**
 * Applying reverse-scoring to one raw answer value, for an item whose `reverseScored` is `true`. 
 * The `scaleMin` or `scaleMax` are the response scale’s own bounds (for a 1–5 scale, reversing 5 gives 1, and reversing 1 gives 5), rather than a hard-coded 6-minus-value formula that would silently break if a system’s scale is not five points
 */
export function reverseValue(value: number, scaleMin: number, scaleMax: number): number {
  return scaleMax + scaleMin - value;
}
