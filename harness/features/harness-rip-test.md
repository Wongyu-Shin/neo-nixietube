---
name: harness-rip-test
axis1: outer
axis2: in-loop
applicability:
  claude_code: ">=2.0.0 <3.0.0"
  models: [claude-opus-4-7, claude-sonnet-4-6, claude-haiku-4-5]
tc_script: harness/tests/harness-rip-test.sh
rippable_check: "Claude Code ships a native feature-ablation runner that consumes the `rippable_check` frontmatter field and executes the with/without comparison. Probe: run CC-native on the existing tc01/tc05/tc07; 100% pass/fail agreement across 3 consecutive Goals → rip."
sources:
  - "scripts/test-harness-rip.sh"
  - "https://arxiv.org/abs/2408.08435"
---

# Harness rip-test discipline

Canonicalises the `scripts/test-harness-rip.sh` precedent already in
this repo (TC01 ratchet stability, TC05 anchor v2 rip, TC07 critic
summary rip). Obligates every feature in this catalog to ship a sibling
rip test under `harness/tests/rip/<name>.sh` with the same interface:

- Inputs: feature name (implicit via script name).
- Outputs: `PASS` / `FAIL` + one line of quantitative evidence.
- Runtime: under 5 minutes on Opus.
- Parallel-safe: writes only to `harness/build/rip/<name>/`.

Pairs with `statistical-tc-runner` (infrastructure) — this feature is
the *discipline* that says every feature's claim of rippability must
be backed by a script of this exact shape. Without it the
`rippable_check` frontmatter field is just prose.

See `harness/research/harness-rip-test.md` for the interface contract
and the CI-matrix sketch.

## Referenced by

- `gcli-eval-compare-primitive`
