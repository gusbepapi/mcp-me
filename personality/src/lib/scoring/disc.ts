import type { Answers, Item, ItemBank, ResponseScale, SystemResult, TraitScore } from "./types.js";
import { normalizeScore, reverseValue } from "./types.js";
import discItemBank from "../../../items/disc.json" with { type: "json" };

/**
 * The four trait names this system scores against. "compliance" is used
 * here rather than the equally common synonym "conscientiousness",
 * deliberately, to avoid colliding with `BigFiveTrait`'s own
 * "conscientiousness" — the two measure a related but distinct thing
 * (caution/accuracy/rule-following here, versus organisation/follow-through
 * there), and sharing the string would make that difference invisible to
 * any caller holding several systems' results together
 */
export type DiscTrait = "dominance" | "influence" | "steadiness" | "compliance";

const DISC_TRAITS: readonly DiscTrait[] = ["dominance", "influence", "steadiness", "compliance"];

export const discItems: ItemBank = discItemBank as ItemBank;

function scaleBounds(scale: ResponseScale): { min: number; max: number } {
  const values = scale.options.map((option) => option.value);
  return { min: Math.min(...values), max: Math.max(...values) };
}

/**
 * Scoring one trait: averaging every item belonging to it, reversing
 * whichever items are marked reverseScored before averaging, not after,
 * identically to scoreBigFiveOcean()'s own scoreTrait()
 */
function scoreTrait(trait: DiscTrait, items: readonly Item[], answers: Answers, scale: ResponseScale): TraitScore {
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
 * Scoring a complete set of DISC answers. Every trait present in
 * items/disc.json must have a corresponding answer for every one of its
 * items — a partially-answered submission throws, identically to
 * scoreBigFiveOcean()'s own behaviour
 */
export function scoreDisc(answers: Answers, itemBank: ItemBank = discItems): SystemResult {
  const traits = DISC_TRAITS.map((trait) => scoreTrait(trait, itemBank.items, answers, itemBank.responseScale));

  return {
    system: itemBank.system,
    traits,
  };
}
