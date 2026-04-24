---
name: gcli-eval-compare-primitive
axis1: outer
axis2: post-loop
applicability:
  claude_code: ">=2.0.0 <3.0.0"
  models: [claude-opus-4-7, claude-sonnet-4-6]
tc_script: harness/tests/gcli-eval-compare-primitive.sh
rippable_check: "CC-native /compare (or similar) that runs verify on two refs and returns paired effect size. Probe on two known-differing catalog snapshots; if feature-level flip list + aggregate effect size agree with external within 5%, rip."
sources:
  - "https://github.com/google/agents-cli"
  - "https://doi.org/10.1093/biomet/34.1-2.28"
---

# Eval Compare primitive (catalog-level A/B)

google/agents-cli exposes two distinct eval commands: `eval run`
(score current agent) and `eval compare` (paired A/B between two
agents / commits / models). The *compare* primitive is a first-class
user-facing interface — not a background filter like a ratchet, not
an in-feature hypothesis test like `statistical-tc-runner`.

Applied to this project: `scripts/harness/eval_compare.sh
<baseline_ref> <candidate_ref>` runs the full TC suite on both refs
in separate worktrees, emits a per-feature paired report with
deltas. Used at model swaps (Opus ↔ Sonnet) and at loop-report time
(baseline ↔ final).

Strict non-overlap:
- `statistical-tc-runner` — N-sample within one TC
- `noise-aware-ratchet` — keep/discard on one iteration
- `harness-rip-test` — pass/fail on with/without
- `llm-as-judge-audit` — artefact rubric score
- `cross-domain-transfer-metric` — single cross-domain scalar

This feature is the **general comparison interface** none of the
above provide. Pairs with `sandboxed-open-ended-exploration` for
worktree-based isolation of each ref.

See `harness/research/gcli-eval-compare-primitive.md` for the
distinction table and the `scripts/harness/eval_compare.sh`
contract.

## Referenced by

- `gcli-agent-run-telemetry`
