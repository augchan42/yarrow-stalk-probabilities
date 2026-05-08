# ADR 002: The Taiji Stalk, the Wu Stalk, and the Origin of the Mod-4 Gap

**Date:** 2026-05-08
**Status:** Accepted

## Context

During paper drafting, we discovered that the code, paper, and README were imprecise about the distinction between two different stalks removed from play during the yarrow stalk process. Clarifying this distinction revealed that the removal of the first stalk is the direct mathematical cause of the mod-4 gap identified in this repository.

## The Two Stalks

### The Taiji Stalk (the 50th)

**Traditional names:** Taiji (太極) stalk, the Observer, the Wu Chi (無極) stalk, the Unity stalk.

**What it is:** One of the 50 stalks is set aside before the process begins. It takes no further part in any calculation. It sits apart for the entire reading — across all six lines, all eighteen rounds.

**Traditional meaning:** The *Great Commentary* (繫辭傳) says: "The number of the great expansion is fifty, of which forty-nine are used." The 50th stalk represents the Taiji — the undifferentiated unity, the unchanging ground from which all change emerges. Wang Bi described it as "the center of the world, the axis of heaven and earth."

**Mathematical function:** Reduces the working pile from 50 to 49. This is the sole cause of the mod-4 imbalance in round 1 (see below).

### The Wu Stalk (removed each round)

**Traditional names:** Wu (巫) stalk, the Heaven stalk, the finger stalk.

**What it is:** At the start of each of the three rounds, one stalk is taken from the working pile and placed between the fingers of the left hand. Unlike the Taiji stalk, the Wu stalk participates in the calculation: it contributes +1 to each round value (round value = left remainder + right remainder + 1).

**Mathematical function:** Reduces the stalks to be divided by 1 each round (49 → 48 in round 1, then further reduced in rounds 2-3). Also couples the two sub-piles via the +1 term.

### The chain

```
50 stalks
  └─ set aside Taiji stalk (once, permanent)
49 working stalks
  └─ remove Wu stalk (each round)
48 stalks to divide (round 1)
  └─ split into two piles, count by fours
```

## The Mathematical Consequence

**The Taiji stalk creates the mod-4 gap.**

If all 50 stalks were used as the working pile:
- Round 1: remove Wu → 49 to divide → range [1, 48] → **48 values**
- 48 / 4 = 12 exactly → each mod-4 class has 12 values → **perfect balance**
- The idealized probabilities would be exactly reproducible by discrete simulation

With the Taiji stalk removed (49 working):
- Round 1: remove Wu → 48 to divide → range [1, 47] → **47 values**
- 47 / 4 = 11 remainder 3 → class ≡0 has 11, others have 12 → **imbalanced**
- The idealized probabilities become unreachable

The cosmological act of separating unity from multiplicity has a precise arithmetic consequence: it makes the physical process diverge from the mathematical ideal.

### What if we kept all 50?

With 50 working stalks, the picture improves but doesn't fully resolve:

| Scenario | Divide N | Range size | Mod-4 balanced? |
|---|---|---|---|
| **50 working, round 1** | 49 | 48 | **Yes** (12, 12, 12, 12) |
| 50 working, R2 after val=4 | 45 | 44 | **Yes** (11, 11, 11, 11) |
| 50 working, R2 after val=5 | 44 | 43 | No (10, 11, 11, 11) |
| 50 working, R2 after val=8 | 41 | 40 | **Yes** (10, 10, 10, 10) |
| 50 working, R2 after val=9 | 40 | 39 | No (9, 10, 10, 10) |
| **49 working, round 1** | 48 | 47 | No (11, 12, 12, 12) |
| 49 working, R2 after val=4 | 44 | 43 | No |
| 49 working, R2 after val=5 | 43 | 42 | No |
| 49 working, R2 after val=8 | 40 | 39 | No |
| 49 working, R2 after val=9 | 39 | 38 | No |

With 50 working stalks, round 1 and the even-valued round-2 paths (values 4 and 8) are perfectly balanced. Only the odd-valued paths (5 and 9) carry a residual bias. With 49 working stalks, **every path through every round is imbalanced**.

The Taiji stalk removal transforms a partially solvable problem into a universally imbalanced one.

### The symmetry tradeoff

The Taiji stalk removal trades one kind of symmetry for another:

| Property | 49 working (Taiji removed) | 50 working (hypothetical) |
|---|---|---|
| Stalks to divide (round 1) | 48 (even) | 49 (odd) |
| Equal piles possible? | **Yes** (24/24) | **No** — one pile is always larger |
| Range of left pile | [1, 47] → 47 values | [1, 48] → 48 values |
| Mod-4 balanced? | **No** (11, 12, 12, 12) | **Yes** (12, 12, 12, 12) |

The system chooses *arithmetic* asymmetry (biased probabilities, yin favored over yang) over *physical* asymmetry (one pile always bigger). The manifest world looks balanced — two piles can be equal — but the hidden mathematics is forever off by one.

### Why the physical constraint matters

The mod-4 imbalance exists because each pile must contain at least 1 stalk — you can't hold an empty hand. This forces the left pile range to `[1, N-1]`, which has `N-1` possible values. Mod-4 balance requires `4 | (N-1)`, i.e., `N ≡ 1 (mod 4)`.

- **50 working → divide 49:** 49 ≡ 1 (mod 4) → `N-1 = 48` values → **balanced**
- **49 working → divide 48:** 48 ≡ 0 (mod 4) → `N-1 = 47` values → **imbalanced**

The Taiji stalk shifts N from a number whose range is divisible by 4 to one that isn't. The "at least one stalk per pile" constraint is what converts that one-stalk difference into a structural arithmetic asymmetry.

### Why removing 1 is forced — and maximally imbalancing

The yarrow stalk process requires round values of {4, 5, 8, 9}. But the possible round values depend entirely on N mod 4, where N is the number of stalks being divided:

| N mod 4 | Round values produced | Valid? |
|---|---|---|
| ≡ 0 | {5, 9} | Yes |
| ≡ 1 | {6} | **No** — 6 is not a valid round value |
| ≡ 2 | {3, 7} | **No** — neither is valid |
| ≡ 3 | {4, 8} | Yes |

With 50 working stalks, round 1 would divide 49 ≡ 1 mod 4, producing only round value 6 — the process would not work at all. **Removing 1 stalk is the minimum removal that makes the process mathematically functional** (49 working → divide 48 ≡ 0 mod 4 → round values {5, 9}).

Furthermore, removing 1 produces the unique situation where **0 out of 16 paths through three rounds are mod-4 balanced** — the worst possible balance. Removing 0 or 4 gives 4/16 balanced paths; removing 3 gives 0/16 balanced but with different structural properties. Removing 1 is simultaneously:

1. The **minimum** removal to make the process work
2. The **maximum** imbalance among working removal counts
3. The removal that introduces the characteristic yarrow stalk asymmetry (yin-favoring bias)

Whether this triple coincidence was understood by the process's designers is unknowable.

## Hypothesis: Why 50 − 1?

No historical source explains why 50 was chosen and why 1 is removed. Several hypotheses, from most to least speculative:

### H1: Cosmological necessity (orthodox reading)

The removal enacts a metaphysical principle: the manifest world (49, the realm of change) emerges from but is not identical to the absolute (50, the complete). The Taiji stalk is not "unused" — it is the ground that makes the process meaningful. You cannot divine from wholeness; differentiation requires that unity step aside.

**Alternate framing:** The Taiji stalk is the *witness* — the part of reality that observes change without participating in it. Every divination requires a questioner who is not themselves the answer.

### H2: Deliberate asymmetry (mathematical reading)

The ancient practitioners may have understood — empirically if not formally — that removing one stalk introduced a bias into the process. In a system where yin and yang are not meant to be symmetric (the yarrow stalk method deliberately makes changing yin rarer than changing yang), this asymmetry may have been the point. The three-coin method, which gives symmetric probabilities, was considered a lesser substitute.

The mod-4 imbalance specifically suppresses the ≡0 class, which maps to "large" results. Fewer large results in round 1 means P(small) > P(large) in the first round — exactly the 3:1 ratio that generates the characteristic yarrow stalk asymmetry. If they had used 50 working stalks, round 1 would be 1:1, and the entire probability structure would change.

### H3: Practical origin, cosmological retrofit

49 is a more practical number than 50 for hand division — it's odd, so the two piles can never be equal, forcing a definite "larger" and "smaller" heap. The cosmological explanation ("the number of the great expansion is fifty") may have been attached after the practice was already established with 49. The *Great Commentary* is later than the divinatory practice itself.

### H4: The number 50 was primary

50 = 1 + 49 = 1 + 7². The number 50 may have been chosen for numerological reasons (the *Great Commentary* derives it as 1+2+3+4+5+6+7+8+9+10 minus 5, though this derivation is debated). The removal of 1 to get 49 = 7² may connect to other symbolic systems. Under this reading, neither the 50 nor the 49 was chosen for its mod-4 properties; the mathematical consequences are incidental to the numerology.

## Alternate Names (for code and paper clarity)

| Traditional | Role | Suggested alternatives |
|---|---|---|
| Taiji stalk | Set aside once; reduces 50 → 49 | The witness stalk, the ground stalk, the symmetry-breaking stalk |
| Wu stalk | Removed each round; contributes +1 | The mediator stalk, the coupling stalk, the round offset |

In the codebase, the Taiji stalk is implicit (the code starts at 49). The Wu stalk is `stalks--` on line 71 of `simulated.ts`.

## Decision

1. Paper and README now distinguish the two stalks explicitly.
2. The paper's Section 2 names the Taiji stalk and explains the 50 → 49 step.
3. The connection between the Taiji stalk removal and the mod-4 gap should be highlighted in the paper's Discussion section — it strengthens the core finding.
4. The code correctly models both removals; no code changes needed.

## Sources

- [Wikibooks: The Ancient Yarrow Stalk Method](https://en.wikibooks.org/wiki/I_Ching/The_Ancient_Yarrow_Stalk_Method)
- [Yarrow Stalk Divination — The Qi Flow](https://theqiflow.com/blogs/i-ching/yarrow-stalks-i-ching-divination)
- [Shantena: Yarrow stalk consultation procedure](http://www.shantena.com/en/iching/bookofyi/yarrow/)
- [I Ching divination — Wikipedia](https://en.wikipedia.org/wiki/I_Ching_divination)
- Wilhelm, R. & Baynes, C.F. (1950). *The I Ching or Book of Changes*. Princeton University Press.
