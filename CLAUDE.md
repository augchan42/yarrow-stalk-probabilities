# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

Comparative analysis of yarrow stalk divination probabilities: the idealized mathematical distribution (1/16, 5/16, 7/16, 3/16) vs. a step-by-step physical simulation with hand-grab modeling. The core finding is that no discrete physical simulation can exactly reproduce the idealized probabilities due to mod-4 residue class imbalances when dividing finite stalks, and that a `variationPercent` of 32% empirically minimizes the gap.

This is a companion to the `seeded-iching-engine` repo, which uses idealized-only sampling. This repo contains the simulation and analysis that justify that choice.

## Commands

```bash
npm run analyze    # Run the full comparative analysis (~60s, 500k lines per variation%)
npx tsx src/analyze.ts   # Same thing, direct invocation
```

No test suite, no linter, no build step. The project uses `tsx` to run TypeScript directly. TypeScript is configured for `ES2020`/`CommonJS` with strict mode.

## Architecture

Four files, no external dependencies beyond `tsx`:

- **`prng.ts`** — Mulberry32 PRNG with string seed hashing. Provides `SeededRandom` interface (`next()` for [0,1) floats, `nextInt(min, max)` for inclusive integer range). All randomness flows through this interface for reproducibility.

- **`idealized.ts`** — Direct probability sampling from the theoretical distribution. Exports `IDEALIZED_PROBABILITIES` (the canonical 1/16, 5/16, 7/16, 3/16) and `idealizedYarrowLine()`. Also exports the `LineValue` type (6 | 7 | 8 | 9) used throughout.

- **`simulated.ts`** — Step-by-step stalk simulation. Models the three-round physical process: Wu stalk removal → bundle split → count-by-fours → remainder mapping. `splitBundle()` constrains the random division to a range around the midpoint controlled by `variationPercent` (the key parameter). Returns full `RoundData` per round for inspection.

- **`analyze.ts`** — Orchestrates the comparison. Sweeps across variation percentages, runs both models, computes max relative error, and prints the mod-4 residue analysis explaining the gap. This is the only entry point.

## Key Domain Concepts

- **variationPercent**: Controls how far from the midpoint a hand-grab split can reach. At 50%+, full range [1, N-1]. At 32%, the sweet spot where round-by-round mod-4 biases partially cancel.
- **Mapped values**: Round totals of 4/5 → 3 ("small"), 8/9 → 2 ("large"). Sum of three mapped values gives the line value (6-9).
- **The gap is inherent**: 48 stalks divided into [1,47] gives 11 values ≡0 mod 4 but 12 each for ≡1/≡2/≡3. This ~1.6pp imbalance compounds across three rounds.
