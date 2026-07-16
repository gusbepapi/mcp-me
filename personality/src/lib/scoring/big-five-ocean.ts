import type { Answers, Item, ItemBank, ResponseScale, SystemResult, TraitScore } from "./types.js";
import { normalizeScore, reverseValue } from "./types.js";
import bigFiveOceanItemBank from "../../../items/big-five-ocean.json" with { type: "json" };

/**
 * The five trait names this system scores against, narrowing `Item.trait`'s bare `string` down to exactly what `items/big-five-ocean.json` actually uses. Kept here, in the scoring module, rather than in `types.ts`, since every other system will have its own equally-narrow trait union
 */
export type BigFiveTrait =
  | "openness"
  | "conscientiousness"
  | "extraversion"
  | "agreeableness"
  | "neuroticism";

const BIG_FIVE_TRAITS: readonly BigFiveTrait[] = [
  "openness",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "neuroticism",
];

export const bigFiveOceanItems: ItemBank = bigFiveOceanItemBank as ItemBank;

/**
 * Finding the response scale’s own min or max from its declared options, rather than assuming 1–5, so this function stays correct even if `items/big-five-ocean.json`’s scale is ever widened or narrowed
 */
function scaleBounds(scale: ResponseScale): { min: number; max: number } {
  const values = scale.options.map((option) => option.value);
  return { min: Math.min(...values), max: Math.max(...values) };
}

/**
 * Scoring one trait: averaging every item belonging to it, reversing whichever items are marked `reverseScored` before averaging, not after — reversing an already-averaged score is not equivalent when trait items are unevenly split between straight and reverse-scored
 */
function scoreTrait(trait: BigFiveTrait, items: readonly Item[], answers: Answers, scale: ResponseScale): TraitScore {
  const traitItems = items.filter((item) => item.trait === trait);
  const { min, max } = scaleBounds(scale);

  const values = traitItems.map((item) => {
    const rawValue = answers[item.id];

    if (rawValue === undefined) {
      throw new Error(`Missing answer for item "${item.id}" (trait "${trait}")`);
    }

    return item.reverseScored ? reverseValue(rawValue, min, max) : rawValue;
  });

  const rawScore = values.reduce((sum, value) => sum + value, 0) / values.length;

  return {
    trait,
    rawScore,
    normalizedScore: normalizeScore(rawScore, min, max),
    itemCount: traitItems.length,
  };
}

/**
 * Scoring a complete set of Big Five (OCEAN) answers. Every trait present in `items/big-five-ocean.json` must have a corresponding answer for every one of its items, rather than silently averaging over whatever subset happened to be present, since a partial average is not the same measurement as a complete one
 */
export function scoreBigFiveOcean(answers: Answers, itemBank: ItemBank = bigFiveOceanItems): SystemResult {
  const traits = BIG_FIVE_TRAITS.map((trait) =>
    scoreTrait(trait, itemBank.items, answers, itemBank.responseScale),
  );

  return {
    system: itemBank.system,
    traits,
  };
}
