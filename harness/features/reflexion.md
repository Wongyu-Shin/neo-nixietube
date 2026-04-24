---
name: reflexion
axis1: outer
axis2: in-loop
applicability:
  claude_code: ">=2.0.0 <3.0.0"
  models: [claude-opus-4-7, claude-sonnet-4-6, claude-haiku-4-5]
tc_script: harness/tests/reflexion.sh
rippable_check: "Two-arm A/B (with vs. without reflexion-hook) on a failing autoresearch fixture; if mean iterations-to-fix is statistically indistinguishable (Welch t, p>0.1, n≥10), rip."
sources:
  - "https://arxiv.org/abs/2303.11366"
  - "https://github.com/noahshinn/reflexion"
---

# Reflexion

After every discarded autoresearch iteration, synthesise a short natural-
language reflection on *why* the change failed and persist it under
`harness/build/reflexion/`. The next iteration's Phase-1 review reads the
last N reflections alongside `git log`.

Git already persists *what* was tried; reflexion persists *why it didn't
work* in the model's own words — a signal that commit messages typically
compress away. Expected effect: fewer repeats of near-duplicate failed
experiments after the loop hits a plateau.

See `harness/research/reflexion.md` for the full methodology and
rippable-signal protocol.
