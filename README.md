# Yarrow Stalk Probabilities

**Why no physical simulation of the yarrow stalk oracle can exactly reproduce the idealized probability distribution — and where they come closest.**

---

## Background

Robert Uzgalis, professor of computer science at the University of Auckland, wrote an I Ching probability program in an era when mercury delay lines served as working memory. The program explored the mathematical properties of the yarrow stalk divination method — a process described in the *Great Commentary* (繫辭傳) of the *Yijing*, where 49 stalks are divided, counted, and recombined across three rounds to produce a single line of a hexagram.

This repository presents a finding that emerged from our own attempt to faithfully reproduce that process in code: **the idealized probabilities that textbooks cite for the yarrow stalk method (1/16, 5/16, 7/16, 3/16) cannot be exactly reproduced by any discrete physical simulation** — and the reason is an integer boundary problem that Uzgalis himself would have encountered on any hardware.

---

## The Idealized Model

The standard mathematical analysis of the yarrow stalk method derives four line probabilities:

| Line Value | Name | Probability | Decimal |
|:---:|---|:---:|:---:|
| 6 | Old Yin (changing) | 1/16 | 6.25% |
| 7 | Young Yang (stable) | 5/16 | 31.25% |
| 8 | Young Yin (stable) | 7/16 | 43.75% |
| 9 | Old Yang (changing) | 3/16 | 18.75% |

These differ from the three-coin method (where 6 and 9 each have probability 1/8, and 7 and 8 each have 3/8). The asymmetry is the signature of the yarrow stalk method: changing yin (6) is rarer than changing yang (9), and stable yin (8) is more common than stable yang (7). This creates a subtle bias toward yin — toward the receptive.

### How the derivation works

Each line requires three rounds. In each round, you:

1. Set aside 1 stalk between the fingers (the *Wu* stalk)
2. Divide the remaining stalks into two piles
3. Count each pile by fours, noting the remainder (1-4, where 0 remainder counts as 4)
4. The round value = left remainder + right remainder + 1 (the Wu stalk)

The round value can only be 4, 5, 8, or 9. These map to:
- **4 or 5 → mapped value 3** (a "small" result)
- **8 or 9 → mapped value 2** (a "large" result)

The sum of three mapped values determines the line:
- **6** = 2 + 2 + 2 (three large results)
- **7** = 2 + 2 + 3 (two large, one small — in any order)
- **8** = 2 + 3 + 3 (one large, two small — in any order)
- **9** = 3 + 3 + 3 (three small results)

### The critical assumption

The idealized derivation assumes that when you divide *N* stalks into two piles, **each of the four mod-4 residue classes (≡0, ≡1, ≡2, ≡3) has exactly probability 1/4**. Under this assumption:

- Round 1 (48 stalks): P(mapped=2) = 1/4, P(mapped=3) = 3/4
- Rounds 2-3: P(mapped=2) = P(mapped=3) = 1/2 (for both possible stalk counts)

This gives the familiar 1/16, 5/16, 7/16, 3/16.

**But this assumption cannot hold exactly for any finite number of stalks.**

---

## The Simulation

To model the physical process, we simulate each round explicitly:

```typescript
function simulatedYarrowLine(rng, variationPercent) {
  let stalks = 49;

  for (let round = 0; round < 3; round++) {
    stalks--;  // Remove Wu stalk
    const [left, right] = splitBundle(rng, stalks, variationPercent);
    const r1 = countByFours(left);
    const r2 = countByFours(right);
    const roundValue = r1 + r2 + 1;
    // Map and continue...
  }
}
```

The `splitBundle` function models a hand dividing a pile of stalks. The `variationPercent` parameter constrains how far from the midpoint the split can reach — a person wouldn't grab just 1 stalk or nearly all of them:

```typescript
function splitBundle(rng, totalStalks, variationPercent) {
  const mid = Math.floor(totalStalks / 2);
  const range = Math.floor(totalStalks * (variationPercent / 100));
  const minLeft = Math.max(1, mid - range);
  const maxLeft = Math.min(totalStalks - 1, mid + range);
  return [rng.nextInt(minLeft, maxLeft), totalStalks - leftPile];
}
```

At `variationPercent = 50` or higher, the split covers the full range `[1, N-1]` — equivalent to a perfectly uniform random division.

---

## The Gap

### Why even full-range splits don't reproduce the idealized probabilities

In round 1, there are 48 stalks to divide (49 minus the Wu stalk). The possible left-pile sizes are 1 through 47 — **47 values**.

The mod-4 distribution across `[1, 47]`:

| Residue | Values | Count | Probability |
|:---:|---|:---:|:---:|
| ≡0 | 4, 8, 12, ..., 44 | 11 | 23.40% |
| ≡1 | 1, 5, 9, ..., 45 | 12 | 25.53% |
| ≡2 | 2, 6, 10, ..., 46 | 12 | 25.53% |
| ≡3 | 3, 7, 11, ..., 47 | 12 | 25.53% |

The ≡0 class has **11 values** while the others have **12 each**. The idealized model needs exactly 25.00% for each class. This 23.40% vs 25.00% gap — just 1.6 percentage points — compounds across three rounds to produce a **17.5% relative error** in the final line probabilities.

This is not a bug in the simulation. It is an inherent property of dividing a finite number of discrete objects.

---

## The 32% Sweet Spot

We tested the simulation across a range of `variationPercent` values (500,000 lines each):

```
  vp%     6 (Old Yin)  7 (Young Yang)  8 (Young Yin)  9 (Old Yang)  Max Err
  --------------------------------------------------------------------------
   10%      6.16%        35.95%        36.78%       21.11%    15.94%
   15%      6.11%        28.65%        48.52%       16.72%    10.91%
   20%      5.67%        32.66%        40.92%       20.75%    10.68%
   25%      6.87%        31.78%        45.11%       16.23%    13.42%
   28%      6.55%        29.11%        44.29%       20.06%     6.98%
   30%      6.12%        31.26%        42.06%       20.56%     9.66%
   32%      6.22%        30.77%        43.82%       19.19%     2.36% <--
   34%      6.72%        33.93%        42.45%       16.90%     9.84%
   35%      6.72%        31.70%        44.60%       16.98%     9.43%
   38%      5.56%        29.82%        44.37%       20.25%    11.04%
   40%      5.82%        30.79%        42.93%       20.45%     9.08%
   45%      6.79%        32.55%        43.06%       17.61%     8.57%
   50%      5.14%        28.95%        44.71%       21.20%    17.75%
  100%      5.14%        28.95%        44.71%       21.20%    17.75%

Idealized:  6.25%        31.25%        43.75%       18.75%
```

At `variationPercent = 32%`, the maximum relative error drops to **~2.4%** — far better than any other value, and dramatically better than the full-range split (17.75%).

### Why 32% works

At 32%, the split range for 48 stalks is `[9, 39]` — 31 possible values. The mod-4 distribution:

- ≡0: 7 values (22.6%)
- ≡1: 8 values (25.8%)
- ≡2: 8 values (25.8%)
- ≡3: 8 values (25.8%)

The ≡0 class is *further* from 25% than in the full range (22.6% vs 23.4%). Yet the overall line probabilities are *closer* to the idealized values. This happens because the constrained range introduces a counter-bias in rounds 2 and 3 (which operate on different stalk counts) that partially cancels the round-1 imbalance.

**This is not derivable from first principles.** It was found empirically — by testing. The 32% value is a coincidence of how integer boundary effects interact across three rounds with specific stalk counts (48, then 40 or 44, then varying further). A different total stalk count would have a different sweet spot.

---

## Implications

The idealized probabilities (1/16, 5/16, 7/16, 3/16) are a **mathematical limit** — they describe what the yarrow stalk process would produce if stalks were infinitely divisible, or if mod-4 residue classes were perfectly balanced. They are elegant and correct as a theoretical model.

The simulated probabilities describe what happens when you actually divide 49 discrete objects according to the prescribed ritual. They are also correct — as a physical model.

**Both are faithful to the yarrow stalk method. They answer different questions:**
- The idealized model answers: *what is the mathematical structure of this divination system?*
- The simulation answers: *what happens when a person performs it?*

The gap between them is small in practice (~2-3% at the sweet spot, ~17% at full range). But it is real, it is inherent, and it is — perhaps fittingly — irreducible.

---

## Running the Analysis

```bash
npm install
npm run analyze
```

Or directly:

```bash
npx tsx src/analyze.ts
```

The analysis generates 500,000 lines per variation percentage. It runs in about 60 seconds.

---

## Repository Structure

```
src/
  prng.ts        Mulberry32 seeded PRNG (self-contained)
  idealized.ts   Direct sampling from the mathematical distribution
  simulated.ts   Step-by-step physical stalk simulation
  analyze.ts     Comparative analysis across variation percentages
```

No external dependencies beyond `tsx` (for running TypeScript directly).

---

## Acknowledgments

For Dr. Bruce Cheung, in memory of Robert Uzgalis and the questions that persist across generations of hardware.
