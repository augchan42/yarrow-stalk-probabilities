/**
 * Simulated Yarrow Stalk Method
 *
 * Models the physical yarrow stalk process step by step:
 *   1. Start with 49 stalks (50 minus 1 set permanently aside)
 *   2. Three rounds of division:
 *      a. Remove 1 stalk between the fingers (Wu)
 *      b. Divide remaining stalks into two piles
 *      c. Count each pile by fours, note remainders
 *      d. Set aside remainder + Wu stalk, carry rest forward
 *   3. Sum of mapped values across three rounds = line value
 *
 * The bundle split is constrained to a range around the midpoint
 * (variationPercent), modeling how a hand would realistically
 * divide a pile of stalks — you wouldn't grab just 1 or nearly all.
 */

import type { SeededRandom } from "./prng";
import type { LineValue } from "./idealized";

export interface RoundData {
  initialSticks: number;
  bundle1: number;
  bundle2: number;
  remainder1: number;
  remainder2: number;
  roundValue: number;
  mappedValue: number;
  finalSticks: number;
}

export interface SimulatedLineData {
  rounds: RoundData[];
  lineValue: LineValue;
}

function countByFours(pile: number): number {
  return pile % 4 === 0 ? 4 : pile % 4;
}

/**
 * Split a bundle into two piles within a hand-grab range.
 *
 * variationPercent controls how far from the midpoint the split
 * can reach. At 50%+, the full range [1, N-1] is available.
 * At 32%, the range is approximately [0.18N, 0.82N].
 */
export function splitBundle(
  rng: SeededRandom,
  totalStalks: number,
  variationPercent: number
): [number, number] {
  const mid = Math.floor(totalStalks / 2);
  const range = Math.floor(totalStalks * (variationPercent / 100));
  const minLeft = Math.max(1, mid - range);
  const maxLeft = Math.min(totalStalks - 1, mid + range);

  const leftPile = rng.nextInt(minLeft, maxLeft);
  return [leftPile, totalStalks - leftPile];
}

export function simulatedYarrowLine(
  rng: SeededRandom,
  variationPercent: number
): SimulatedLineData {
  let stalks = 49;
  const rounds: RoundData[] = [];

  for (let round = 0; round < 3; round++) {
    const initialSticks = stalks;
    stalks--; // Remove 1 for Wu

    const [bundle1, bundle2] = splitBundle(rng, stalks, variationPercent);

    const remainder1 = countByFours(bundle1);
    const remainder2 = countByFours(bundle2);
    const roundValue = remainder1 + remainder2 + 1; // +1 for Wu

    let mappedValue: number;
    if (roundValue === 9 || roundValue === 8) {
      mappedValue = 2;
    } else if (roundValue === 5 || roundValue === 4) {
      mappedValue = 3;
    } else {
      throw new Error(`Invalid round value: ${roundValue}`);
    }

    stalks -= roundValue - 1;

    rounds.push({
      initialSticks,
      bundle1,
      bundle2,
      remainder1,
      remainder2,
      roundValue,
      mappedValue,
      finalSticks: stalks,
    });
  }

  const lineValue = rounds.reduce<number>((sum, r) => sum + r.mappedValue, 0) as LineValue;
  return { rounds, lineValue };
}
