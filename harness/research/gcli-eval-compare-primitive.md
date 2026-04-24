# Eval Compare Primitive — google/agents-cli

**Primary source:** Google, *google/agents-cli.* Apache-2.0.
https://github.com/google/agents-cli
(commands `eval run` and `eval compare`; skill
`google-agents-cli-eval`)

**Related references:**
- ADK evaluation framework — *evalsets*, *metrics*, *LLM-as-judge* as
  named primitives. Cited from the agents-cli README as the skill the
  `eval` domain teaches.
- Welch, B.L. 1947. https://doi.org/10.1093/biomet/34.1-2.28 — the
  statistical foundation shared with `statistical-tc-runner`.
- NeurIPS 2021 ML Reproducibility Checklist — the community standard
  that mandates paired A/B comparisons, not just raw scores.

## Core idea

google/agents-cli exposes evaluation as **two** distinct commands:

- `eval run` — runs an evalset against the current agent, emits scores.
- `eval compare` — runs an evalset against *two* agents (or two
  commits / two models / two prompts), emits a **paired** report:
  per-example delta, aggregate effect size, statistical significance.

The `eval compare` primitive is materially different from a ratchet
or a stat-runner — it is a **first-class A/B comparison interface**
that the user invokes directly, not a background filter on iteration
decisions. Typical usage:

```
agents eval compare --baseline <ref_a> --candidate <ref_b> --evalset <path>
# → prints per-example diff, aggregate lift, bootstrap CI, p-value
```

## Why this matters for this project's axes

The existing catalog has:

- `statistical-tc-runner` — N-sample parallel execution of a *single*
  TC, pre-registered aggregation. Answers: "is this feature's TC still
  needed on the current CC/model?"
- `noise-aware-ratchet` — monotonic anchor with σ margin. Answers:
  "did this iteration beat the best-ever?"
- `harness-rip-test` — with/without arm discipline. Answers: "is this
  feature redundant given the current CC/model?"

None of these is `eval compare`. The gap: given two *catalog snapshots*
(e.g., before Meta HyperAgents deep-dive vs. after, or Opus vs.
Sonnet), run the *entire* feature catalog's TC suite on both and
report paired deltas per feature. That is what `eval compare` would
add to this project.

## Harness-relevant decomposition

| Phase | Role |
|---|---|
| post-loop (primary) | After a loop terminates, `eval compare` the baseline commit vs. the final commit on the full TC suite; the resulting paired report is attached to the loop report. |
| pre-loop | When swapping models (Opus → Sonnet), `eval compare` the current catalog on both before committing to the swap. |
| in-loop | Not used — comparisons happen at well-defined commit boundaries, not mid-iteration. |

## Mapping to this project's axes

- **axis1:** `outer` — implemented as `scripts/harness/eval_compare.sh
  <baseline> <candidate>` that runs `verify.sh` on both refs and
  diffs per-feature outcomes. Claude Code has no native notion of
  catalog-level A/B comparison.
- **axis2:** `post-loop` (primary) with a `pre-loop` use-case for
  model swaps.

## Rippable signal

Absorbed when Claude Code's runtime exposes a user-facing
`/compare <ref_a> <ref_b>` (or equivalent) that runs any Goal's
verify command on both refs and returns paired effect sizes with
bootstrap CIs. Probe:

1. Pick two catalog snapshots known to differ in feature outcomes
   (baseline of 13 features vs. current 19+).
2. Run CC-native compare primitive on both.
3. If the paired report names which specific features flipped AND
   reports an aggregate effect size within 5% of the external
   `eval_compare.sh` output, rip.

## Distinction from existing features

| Existing feature | What it answers | What `eval compare` adds |
|---|---|---|
| `statistical-tc-runner` | "Is this TC still needed? (within-feature N-sample)" | Across-feature, across-commit comparison |
| `noise-aware-ratchet` | "Did this iter beat the anchor? (one number)" | Per-feature delta with CI |
| `harness-rip-test` | "Is this feature redundant? (pass/fail)" | Effect-size quantification, not just pass/fail |
| `llm-as-judge-audit` | "Is the final artefact good? (rubric score)" | Process-level A/B, not artefact score |
| `cross-domain-transfer-metric` | "Does A-learning transfer to B? (single delta)" | Full-suite deltas, not one scalar |

Each existing entry is a specialized hypothesis test. `eval compare`
is the *general* comparison interface that subsumes none of them but
composes naturally with each.

## Minimal viable implementation for neo-nixetube

1. `scripts/harness/eval_compare.sh <baseline_ref> <candidate_ref>
   [--evalset harness/tests]` — checks out each ref in a worktree,
   runs `bash harness/verify.sh`, captures per-feature TC outcomes,
   emits markdown table.
2. Pair with `sandboxed-open-ended-exploration` feature's worktree
   discipline — each ref is checked out in its own worktree, neither
   touches HEAD.
3. Report format: one row per feature, columns `baseline_tc`,
   `candidate_tc`, `delta` (emoji + symbol), plus aggregate footer
   with counts.
