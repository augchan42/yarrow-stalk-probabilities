/**
 * Idealized Yarrow Stalk Model
 *
 * Samples directly from the mathematical probability distribution
 * derived from the yarrow stalk process under the assumption that
 * each mod-4 residue class has exactly probability 1/4.
 *
 * Probabilities:
 *   6 (Old Yin):    1/16  =  6.25%
 *   7 (Young Yang): 5/16  = 31.25%
 *   8 (Young Yin):  7/16  = 43.75%
 *   9 (Old Yang):   3/16  = 18.75%
 */

import type { SeededRandom } from "./prng";

export type LineValue = 6 | 7 | 8 | 9;

export const IDEALIZED_PROBABILITIES: Record<LineValue, number> = {
  6: 1 / 16,
  7: 5 / 16,
  8: 7 / 16,
  9: 3 / 16,
};

export function idealizedYarrowLine(rng: SeededRandom): LineValue {
  const roll = rng.next();

  const p6 = IDEALIZED_PROBABILITIES[6];
  const p7 = IDEALIZED_PROBABILITIES[7];
  const p8 = IDEALIZED_PROBABILITIES[8];

  if (roll < p6) return 6;
  if (roll < p6 + p7) return 7;
  if (roll < p6 + p7 + p8) return 8;
  return 9;
}
