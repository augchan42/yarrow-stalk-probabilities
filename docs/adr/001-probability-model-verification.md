# ADR 001: Verification of Yarrow Stalk Probability Claims

**Date:** 2026-05-08
**Status:** Accepted

## Context

The README makes several claims about yarrow stalk divination probabilities, their mathematical derivation, the historical figure Robert Uzgalis, and an original finding about the gap between idealized and simulated models. Before treating these claims as established, we verified them against external sources.

## Findings

### Verified: The 1/16, 5/16, 7/16, 3/16 distribution

Multiple independent sources confirm these probabilities:

- [Wikibooks: The Ancient Yarrow Stalk Method](https://en.wikibooks.org/wiki/I_Ching/The_Ancient_Yarrow_Stalk_Method) — traces all 8 paths through three rounds, arrives at the same values.
- [Yijing Dao: Probabilities with coins and yarrow stalks](https://www.biroco.com/yijing/prob.htm) — states "1 in 16, 5 in 16, 7 in 16, 3 in 16."
- [Russell Cottrell: A Direct Yarrow Stalk Method](https://www.russellcottrell.com/VirtualYarrowStalks/directYarrow.htm) — confirms the mapped values and round structure.

### Verified: Round 1 asymmetry (P=1/4 vs P=1/2 in rounds 2-3)

The Wikibooks derivation confirms: Round 1 operates on 48 stalks (divisible by 4), producing P(large)=1/4 and P(small)=3/4. Rounds 2-3 operate on 40 or 44 stalks (not divisible by 4), producing P(large)=P(small)=1/2. This structural asymmetry is the reason the yarrow stalk distribution differs from coin-tossing (which gives symmetric 1/8, 3/8, 3/8, 1/8).

### Verified: Mapped values and line derivation

Confirmed across all sources: round totals of 4/5 map to 3 ("small"), 8/9 map to 2 ("large"). The sum of three mapped values gives line values 6-9.

### Corrected: Robert Uzgalis affiliation and title

The README states: "Robert Uzgalis, professor of computer science at the University of Auckland."

Per [Uzgalis's own homepage](http://serve.net/buz/) and [Wikipedia](https://en.wikipedia.org/wiki/Robert_Uzgalis):

- Born 1940, Chicago. Died 2012, UCLA Medical Center.
- Primary career: UCLA Computer Science Department (~1964-1988), rising to professor.
- 1989: moved to Japan (Sumitomo Metals, ASTEM Kyoto, Sharp Electronics).
- 1990-1993: lecturer, University of Hong Kong.
- **1993-1996: senior lecturer (not "professor"), University of Auckland.** Taught graphics (07.315), software engineering (07.231), and computing principles (07.105).
- 1997: retired to Los Angeles.
- Notable for: BuzHash (1992), co-author of *Grammars for Programming Languages* (1977), Tigertail Virtual Museum.

**Correction needed:** "professor of computer science at the University of Auckland" should read "senior lecturer in the Computer Science Department of the University of Auckland" (or simply reference his UCLA career, where he held professorial rank).

The README's dedication to "Dr. Bruce Cheung" is corroborated: Bruce Cheung was Uzgalis's PhD student at the University of Hong Kong, working on automatic language recognition.

### Thematic resonance: Uzgalis's research philosophy

From [Uzgalis's research interests page](http://serve.net/buz/):

> "I find most theory in computer studies boring, lifeless, and misleading mostly because the assumptions backing it are seldom close to the real world. Improper assumptions cause most theory to mislead one into believing that something which is relatively simple is difficult or impossible. This property usually comes from the finite nature of real computation as opposed to the infinite domain postulated by most theorists."

This is directly relevant to this repository's core finding. The idealized yarrow stalk probabilities assume each mod-4 residue class has exactly probability 1/4 — an infinite-domain assumption. The simulation reveals that dividing a finite number of discrete stalks cannot satisfy this assumption. The gap between idealized and simulated is precisely the kind of "finite nature of real computation" problem Uzgalis identified as his central research concern.

Uzgalis's work on BuzHash similarly found that theoretical impossibility claims about general hash functions were wrong when grounded in finite, empirical reality — "there is no theory to predict how well this will work... Empirically, however the performance of the hash function is impressive and independent of domain."

### Not independently corroborated: The mod-4 gap and 32% sweet spot

No external source discusses:
- The inherent mod-4 residue class imbalance when dividing finite stalks
- The claim that no discrete simulation can exactly reproduce the idealized probabilities
- The `variationPercent` parameter or the 32% empirical sweet spot

This appears to be **original analysis from this repository**. The underlying math is sound (47 values in [1,47] do give 11 values ≡0 mod 4 vs 12 each for ≡1/≡2/≡3), but the finding has not been published or discussed elsewhere as of this verification date.

## Decision

1. **Correct the Uzgalis reference** in the README: change "professor" to "senior lecturer" at Auckland, or lead with his UCLA affiliation where he held professorial rank.
2. **The probability claims stand** — well-corroborated by multiple independent sources.
3. **The mod-4 gap analysis should be clearly framed as original work**, not as established mathematical knowledge. The README already does this reasonably well ("This is not derivable from first principles. It was found empirically.").

## Sources

- [Wikibooks: I Ching / The Ancient Yarrow Stalk Method](https://en.wikibooks.org/wiki/I_Ching/The_Ancient_Yarrow_Stalk_Method)
- [Yijing Dao: Probabilities with coins and yarrow stalks](https://www.biroco.com/yijing/prob.htm)
- [Russell Cottrell: A Direct Yarrow Stalk Method](https://www.russellcottrell.com/VirtualYarrowStalks/directYarrow.htm)
- [Show HN: I Ching simulator with accurate Yarrow Stalk probabilities](https://news.ycombinator.com/item?id=46261942)
- [Robert Uzgalis Homepage](http://serve.net/buz/)
- [Robert Uzgalis — Wikipedia](https://en.wikipedia.org/wiki/Robert_Uzgalis)
- [Robert Uzgalis Obituary (2012)](https://www.legacy.com/us/obituaries/latimes/name/robert-uzgalis-obituary?id=19702267)
