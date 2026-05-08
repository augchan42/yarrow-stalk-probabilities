/**
 * Yarrow Stalk Probability Analysis
 *
 * Compares the simulated yarrow stalk method (with hand-grab modeling)
 * against the idealized mathematical probabilities across a range of
 * variationPercent values.
 *
 * Run: npx tsx src/analyze.ts
 */

import { createSeededRandom } from "./prng";
import { IDEALIZED_PROBABILITIES, idealizedYarrowLine } from "./idealized";
import type { LineValue } from "./idealized";
import { simulatedYarrowLine, splitBundle } from "./simulated";

const ITERATIONS = 500_000;
const LINE_VALUES: LineValue[] = [6, 7, 8, 9];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function runSimulation(variationPercent: number) {
  const counts = { 6: 0, 7: 0, 8: 0, 9: 0 };
  const rng = createSeededRandom("yarrow-analysis-fixed-seed");

  for (let i = 0; i < ITERATIONS; i++) {
    const { lineValue } = simulatedYarrowLine(rng, variationPercent);
    counts[lineValue]++;
  }

  return Object.fromEntries(
    LINE_VALUES.map((k) => [k, counts[k] / ITERATIONS])
  ) as Record<LineValue, number>;
}

function runIdealized() {
  const counts = { 6: 0, 7: 0, 8: 0, 9: 0 };
  const rng = createSeededRandom("yarrow-analysis-fixed-seed");

  for (let i = 0; i < ITERATIONS; i++) {
    counts[idealizedYarrowLine(rng)]++;
  }

  return Object.fromEntries(
    LINE_VALUES.map((k) => [k, counts[k] / ITERATIONS])
  ) as Record<LineValue, number>;
}

function maxRelativeError(observed: Record<LineValue, number>): number {
  return Math.max(
    ...LINE_VALUES.map(
      (k) =>
        (Math.abs(observed[k] - IDEALIZED_PROBABILITIES[k]) /
          IDEALIZED_PROBABILITIES[k]) *
        100
    )
  );
}

function pct(n: number): string {
  return (n * 100).toFixed(2) + "%";
}

function mod4Analysis(totalStalks: number, variationPercent: number) {
  const mid = Math.floor(totalStalks / 2);
  const range = Math.floor(totalStalks * (variationPercent / 100));
  const minLeft = Math.max(1, mid - range);
  const maxLeft = Math.min(totalStalks - 1, mid + range);
  const total = maxLeft - minLeft + 1;

  const mod4 = [0, 0, 0, 0];
  for (let i = minLeft; i <= maxLeft; i++) {
    mod4[i % 4]++;
  }

  return { minLeft, maxLeft, total, mod4 };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log("YARROW STALK PROBABILITY ANALYSIS");
console.log("=".repeat(78));
console.log(`${ITERATIONS.toLocaleString()} lines generated per variation percentage\n`);

// --- Idealized baseline ---
console.log("IDEALIZED MODEL (mathematical probabilities)");
console.log("-".repeat(78));
console.log(
  LINE_VALUES.map(
    (k) =>
      `  ${k} (${k === 6 ? "Old Yin   " : k === 7 ? "Young Yang" : k === 8 ? "Young Yin " : "Old Yang  "}): ${IDEALIZED_PROBABILITIES[k]} = ${pct(IDEALIZED_PROBABILITIES[k])}`
  ).join("\n")
);

const idealizedResult = runIdealized();
console.log("\n  Empirical check (should match theoretical):");
console.log(
  "  " + LINE_VALUES.map((k) => `${k}=${pct(idealizedResult[k])}`).join("  ")
);

// --- Simulation sweep ---
console.log("\n\nSIMULATED MODEL (physical stalk process with hand-grab range)");
console.log("-".repeat(78));
console.log(
  "  vp%     6 (Old Yin)  7 (Young Yang)  8 (Young Yin)  9 (Old Yang)  Max Err"
);
console.log("  " + "-".repeat(74));

const testValues = [10, 15, 20, 25, 28, 30, 32, 34, 35, 38, 40, 45, 50, 75, 100];

const results: { vp: number; freqs: Record<LineValue, number>; err: number }[] = [];

for (const vp of testValues) {
  const freqs = runSimulation(vp);
  const err = maxRelativeError(freqs);
  results.push({ vp, freqs, err });

  const marker = err < 5 ? " <--" : "";
  console.log(
    `  ${String(vp).padStart(3)}%` +
      `    ${pct(freqs[6]).padStart(7)}` +
      `       ${pct(freqs[7]).padStart(7)}` +
      `       ${pct(freqs[8]).padStart(7)}` +
      `      ${pct(freqs[9]).padStart(7)}` +
      `   ${err.toFixed(2).padStart(6)}%${marker}`
  );
}

// --- Best fit ---
const best = results.reduce((a, b) => (a.err < b.err ? a : b));
console.log(`\n  Best fit: variationPercent = ${best.vp}% (max relative error: ${best.err.toFixed(2)}%)`);

// --- Mod-4 analysis ---
console.log("\n\nWHY THE GAP EXISTS: MOD-4 RESIDUE DISTRIBUTION");
console.log("-".repeat(78));
console.log("Round 1 divides 48 stalks. The idealized model assumes each");
console.log("mod-4 residue class has probability exactly 1/4 (25.00%).\n");

for (const vp of [32, 50, 100]) {
  const { minLeft, maxLeft, total, mod4 } = mod4Analysis(48, vp);
  console.log(`  vp=${vp}%  split range: [${minLeft}, ${maxLeft}]  (${total} possible values)`);
  console.log(
    "    " +
      mod4
        .map(
          (c, i) =>
            `≡0 mod 4: ${c}/${total} (${((c / total) * 100).toFixed(1)}%)`
              .replace("≡0", `≡${i}`)
        )
        .join("   ")
  );
  console.log(
    `    P(mapped=2) = ${mod4[0]}/${total} = ${((mod4[0] / total) * 100).toFixed(2)}%` +
      `  vs idealized 25.00%` +
      `  (delta: ${(((mod4[0] / total) - 0.25) * 100).toFixed(2)} pp)`
  );
  console.log();
}

console.log("The ≡0 mod 4 class determines P(mapped=2) in round 1.");
console.log("With 47 possible splits [1,47], there are 11 values ≡0 mod 4");
console.log("but 12 each for ≡1, ≡2, ≡3 -- an inherent imbalance of");
console.log("11/47 = 23.40% vs the idealized 25.00%.");
console.log("\nThis ~1.6 percentage-point gap in round 1 compounds across");
console.log("three rounds, producing the 17.5% relative error seen at vp≥50%.");
console.log(`At vp=32%, the constrained range [9,39] shifts the mod-4 balance`);
console.log("in a way that partially cancels this error across rounds.");
