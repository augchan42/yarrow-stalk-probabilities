/**
 * Mulberry32 — a fast 32-bit PRNG with good statistical properties.
 * Self-contained; no external dependencies.
 */

export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t = (t + Math.imul(t ^ (t >>> 7), t | 61)) >>> 0;
    t = (t ^ (t >>> 14)) >>> 0;
    return t / 0x100000000;
  };
}

export function hashSeed(seed: string): number {
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) + hash + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export interface SeededRandom {
  next(): number;
  nextInt(min: number, max: number): number;
}

export function createSeededRandom(seed: string): SeededRandom {
  const rng = mulberry32(hashSeed(seed));
  return {
    next: () => rng(),
    nextInt(min: number, max: number): number {
      return Math.floor(rng() * (max - min + 1)) + min;
    },
  };
}
