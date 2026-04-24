# Harness Rip-Test Pattern

**Primary source:** neo-nixetube, `scripts/test-harness-rip.sh` (this repo,
commit history under `cad/path-2-room-temp`). The script predates this
catalog; it is the empirical precedent that the axis-1 charter formalises.

**Related references:**
- ADAS (arXiv:2408.08435) — archive-conditioned design suggests that each
  past design should carry its own removal test.
- OpenEvolve-style *ablation harness* patterns: every reported gain is
  paired with a one-line ablation that re-runs verify with the feature
  disabled.
- neo-nixetube user-memory feedback entry on GAN noise handling —
  established the `ratchet MAX` anchor rule; the rip test is how that
  anchor is stress-tested across model upgrades.

## Core idea

Every harness feature carries a *rip test* — an automated comparison
between two arms (`with feature` vs. `without feature`) on a fixture
workload — whose pass/fail answers the question: **does the feature
still improve metrics on the current CC + model combo, or has it been
absorbed upstream?**

`scripts/test-harness-rip.sh` already instantiates this pattern for the
CAD path-2 loop:

| TC | Question it answers |
|---|---|
| `tc01` — Ratchet removal stability | Does removing the ratchet widen the SUM variance above 6 pts across 3 identical runs? If no, ratchet is redundant. |
| `tc05` — Anchor v2 rip | Does the v2 anchor still outperform v1 on the current model? |
| `tc07` — Critic summary rip | Does the critic-summary harness beat baseline? |

Each TC outputs `PASS`/`FAIL` with quantitative evidence, and the script
is bash-only so it runs unattended.

## Why this matters for axis design

Axis-1 is meaningless without this pattern: a catalog entry claiming
"this feature is rippable" needs a concrete, re-runnable test script
whose failure is the *signal to remove the feature*. The existing
project script is the reference implementation — this catalog entry
formalises it and mandates that every future feature ship a rip-test
counterpart.

## Harness-relevant decomposition

| Phase | Role |
|---|---|
| pre-loop | Before starting a new autoresearch Goal, run the rip-test suite; auto-disable any feature whose rip test has flipped. |
| in-loop (primary) | Periodic (e.g., every 20 iterations) rip-test runs in the background; a flip terminates that feature's participation for the current loop. |
| post-loop | Report which features flipped during the loop; queue PRs to remove them from the catalog. |

## Mapping to this project's axes

- **axis1:** `outer` — shell scripts under `scripts/` that spawn multiple
  verify runs with harness pieces enabled/disabled. The pattern could be
  ported inside CC as a skill, but today it's an external bash suite.
- **axis2:** `in-loop` (primary) with pre-loop seed and post-loop
  cleanup — same fractal shape as other features.

## Rippable signal (meta-rip)

This feature's own rip test: if Claude Code ships a native "feature-
ablation runner" that consumes the applicability/rippable fields of
feature frontmatter and executes the comparison automatically, rip.
Probe: run the CC-native ablation on the existing `test-harness-rip.sh`
TCs; if conclusions agree with the bash script across 3 consecutive
Goals (100% agreement on pass/fail for tc01/tc05/tc07), rip.

## Minimal viable implementation for neo-nixetube

Already exists: `scripts/test-harness-rip.sh`. This catalog entry simply
obligates every new feature to provide its own `harness/tests/rip/<name>.sh`
sibling that follows the same interface:

```
Inputs:  feature name (implicit via script name)
Outputs: PASS / FAIL + one line of quantitative evidence
Runtime: <5 minutes on Opus
Parallel-safe: yes (writes only to harness/build/rip/<name>/)
```

A CI matrix can then fan out the suite across CC/model combinations.

## Contrast

`statistical-tc-runner` provides the *infrastructure* for parallel
hypothesis tests. This feature provides the *discipline* that every
feature carries a concrete rip test using that infrastructure.
