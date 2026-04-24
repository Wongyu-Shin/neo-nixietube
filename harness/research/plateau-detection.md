# Plateau Detection for Iterative Optimisation Loops

**Primary source:** Prechelt, L. *Early Stopping — But When?*
In *Neural Networks: Tricks of the Trade*, 2nd ed., Springer 2012.
https://page.mi.fu-berlin.de/prechelt/Biblio/stop_tricks1997.pdf

**Related references:**
- Karpathy, A. *A Recipe for Training Neural Networks*, 2019.
  https://karpathy.github.io/2019/04/25/recipe/ — "patience" and "UP" criteria.
- Snoek, J. et al. *Practical Bayesian Optimization of Machine Learning
  Algorithms.* NeurIPS 2012. arXiv:1206.2944 (https://arxiv.org/abs/1206.2944) — acquisition-function stopping.
- Autoresearch SKILL "When Stuck (>5 consecutive discards)" rule is a
  primitive plateau criterion already baked into the loop protocol.
- neo-nixetube memory entry: "GAN noise handling — LLM-as-judge has ±10
  noise; use ratchet MAX" — the project has already encountered plateau
  detection under a noisy metric.

## Core idea

Detect when the loop is no longer making progress and switch strategies
(or terminate) before budget is wasted. For noisy metrics, naive "N
iterations without improvement" is insufficient because noise floor ≫
marginal gain. Prechelt's "UP" criterion and Karpathy's patience-based
criteria both exist because of this.

Three practical detectors, adapted to an autoresearch loop:

1. **GL_α — Generalization-Loss threshold (Prechelt).** Stop when
   `100 · (E_current / E_best − 1) > α`. For higher-is-better metrics:
   `100 · (1 − current / best) > α`.
2. **Patience on ratchet-MAX.** Keep a ratchet of best-ever; stop when N
   consecutive iterations fail to beat ratchet by more than noise floor σ.
3. **Trend slope test.** Fit a linear regression to the last K iteration
   scores; if slope confidence interval includes 0 (p > 0.2), treat as
   plateau.

For noisy metrics, combine: require BOTH patience AND trend-slope to
signal plateau before declaring the loop stuck.

## Why this matters for axis design

The user's axis-2 charter lists plateau detection as a concrete in-loop
harness concern. Without it the loop either (a) burns budget on a
converged metric or (b) mis-fires on noise and declares plateau
prematurely. Both failure modes are visible in this project's own
`autoresearch-cad-path2-results.tsv` — see `project_cad_loop_state.md`
"41 iters, SUM=35/90" which plateau'd under noise.

## Harness-relevant decomposition

| Phase | Role |
|---|---|
| in-loop (primary) | After every Verify, update ratchet + trend buffer; emit `PLATEAU=1` when criteria trip; the loop reads this and either escalates (radical experiment) or terminates. |
| post-loop | Include plateau signal + iteration at plateau in the report. |

## Mapping to this project's axes

- **axis1:** `outer` — the detector reads `autoresearch-results.tsv` and
  writes `harness/build/plateau-state.json`. Claude Code's "When Stuck >5
  consecutive discards" rule is a *primitive* built-in but it doesn't
  handle noise — an outer detector supersedes it until CC internalises a
  noise-aware variant.
- **axis2:** `in-loop` (primary).

## Rippable signal

Absorbed when the autoresearch SKILL itself (or a CC-shipped equivalent)
implements a noise-aware plateau detector with configurable σ. Probe:
remove this project's detector; run an intentionally-noisy fixture
(metric = score + N(0, σ), σ=10, true slope=0); measure whether the
autoresearch loop terminates within ±5 iterations of the oracle
stopping point (K-L divergence on iteration distribution < 0.1).

## Minimal viable implementation for neo-nixetube

1. `scripts/harness/plateau.py` — reads the TSV, maintains ratchet and a
   ring buffer of the last K metrics, emits `PLATEAU=1|0` and the
   reason (`patience`, `gl_alpha`, `trend_flat`).
2. Called at Phase 7 of every autoresearch iteration (after logging).
3. When `PLATEAU=1`: the loop's Phase-2 Ideation switches to "radical
   experiment" mode for N iterations, or terminates if the meta-budget
   is exhausted.

## Contrast

`When Stuck >5 consecutive discards` (in the CC autoresearch skill)
already handles the trivial case. This feature handles the noise-dominated
case the project's own CAD loop has empirically hit.
