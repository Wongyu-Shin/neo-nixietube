# DGM-H Archive & Probabilistic Parent Selection

**Primary citation:** Zhang, J. et al. *HyperAgents.* 2026.
arXiv:2603.19461, §3 "Methods" + Appendix A.2 "Parent selection".
**Primary source:** https://arxiv.org/abs/2603.19461
**Reference code:** https://github.com/facebookresearch/Hyperagents
(see `select_next_parent.py`, `generate_loop.py`)

**Predecessor and related:**
- Zhang et al., *The Darwin Gödel Machine.* 2025b — the archive+branch
  exploration process HyperAgents inherits.
- Lehman & Stanley 2011, Mouret & Clune 2015 — Quality-Diversity /
  MAP-Elites archive dynamics that motivate "keep stepping stones".
- Stanley, Lehman, Soros 2017 — open-ended exploration theory.

## Core mechanism — quoting §3

> "The DGM-H employs the open-ended exploration process in the DGM to
> mitigate premature convergence and avoid getting trapped in local
> optima. This process maintains an archive of generated hyperagents,
> initialized with a single hyperagent and expanded over time by
> continuously accumulating generated variants. The process alternates
> between two phases: metacognitive self-modification and evaluation.
> During the metacognitive self-modification phase, selected parent
> hyperagents from the archive generate modified versions of themselves.
> **Parent selection is probabilistic and proportional to a
> hyperagent's performance, and inversely proportional to the number
> of children that successfully compiled, biasing sampling toward
> hyperagents that perform well and generate strong descendants while
> preserving exploration** (Appendix A.2)."

Key structural points:

1. **Archive = population, not skill store.** Every generated hyperagent
   enters the archive regardless of whether it beats the current best —
   it's a stepping-stone population á la MAP-Elites.
2. **Parent selection is a dual-weighted lottery.** Weight ∝ performance
   (exploit), weight ∝ 1 / #compiled_children (explore). Without the
   second factor, the archive collapses onto the best-so-far; without
   the first, search is random.
3. **Two alternating phases.** The loop explicitly separates proposal
   (metacognitive self-modification) from evaluation. Proposal never
   mixes in evaluation signal except through parent weights.

## Why this matters for this project's axes

The project's `voyager-skill-library` feature catalogues an
append-only, retrieval-by-embedding store. That's categorically
different from a DGM-H archive:

| Dimension | voyager-skill-library | dgm-h-archive |
|---|---|---|
| Entries | verified successful skills | every generated variant, pass or fail |
| Access pattern | embedding retrieval at pre-loop | probabilistic parent sampling mid-loop |
| Selection bias | cosine similarity to query | performance × 1/children_compiled |
| Removal | dedup/prune when close to full | rarely — stepping stones stay forever |

The project's `autoresearch-harness-results.tsv` + git history is
*closer* to a DGM-H archive than to a Voyager library — every iteration
commit is retained, not just the kept ones. What's missing is the
probabilistic parent-selection sampler: the current autoresearch loop
always branches from HEAD, not from a performance-weighted ancestor.

## Harness-relevant decomposition

| Phase | Role |
|---|---|
| pre-loop | Initialise the archive with the baseline commit. |
| in-loop (primary) | At the start of each iteration, sample a parent commit from the archive using the dual weights; branch off that commit instead of HEAD. |
| post-loop | Publish the archive lineage tree — which ancestors produced the most descendants, which ones were sterile. |

## Mapping to this project's axes

- **axis1:** `outer` — the parent sampler is an external python script
  that reads `git log` + `autoresearch-harness-results.tsv` and returns
  a commit SHA. Claude Code's autoresearch SKILL always branches from
  HEAD and has no parent-sampling primitive.
- **axis2:** `in-loop` (primary) with a `pre-loop` archive init.

## Rippable signal

Absorbed when the autoresearch SKILL (or a CC-native equivalent)
grows: (1) an explicit archive abstraction, (2) a probabilistic parent
sampler with configurable weights, (3) branching from non-HEAD commits.
Quantitative probe:

1. Define a fixture Goal with two distinct local optima (e.g., two
   metric-improving strategies that interfere).
2. Run the CC-native autoresearch and this feature's external sampler
   for N=20 iterations each, 5 seeds.
3. Measure: (a) fraction of seeds that discover both optima,
   (b) iterations-to-second-optimum given first-optimum discovered.
4. If CC-native matches external on BOTH within a 15% margin across
   all 5 seeds, rip.

## Minimal viable implementation for neo-nixetube

1. `scripts/harness/select_parent.py` — mirrors HyperAgents'
   `select_next_parent.py`. Reads `autoresearch-harness-results.tsv` to
   recover per-commit scores; `git log` to recover parent/child lineage;
   emits a commit SHA.
2. The autoresearch loop's Phase 2 (Ideate) runs `git checkout
   $(select_parent.py)` before proposing the next change.
3. Weights: `w_i = score_i / (1 + #compiled_children_i)`; normalise to
   probabilities; sample.
4. Archive state is purely derived from git + the TSV — no extra files
   to keep in sync.

## Contrast

- `voyager-skill-library` — different data model, different access pattern.
- `adas-meta-agent-search` — ADAS stores candidate agents but does not
  use evolutionary parent weights; its proposal is straight LLM generation
  conditioned on the whole archive.
- `meta-hyperagents-metacognitive` — assumes *this* feature's archive
  as its substrate. If this feature rips, the metacognitive one loses
  its evolutionary base.
