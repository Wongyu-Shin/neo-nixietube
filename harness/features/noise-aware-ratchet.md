---
name: noise-aware-ratchet
axis1: outer
axis2: in-loop
applicability:
  claude_code: ">=2.0.0 <3.0.0"
  models: [claude-opus-4-7, claude-sonnet-4-6]
tc_script: harness/tests/noise-aware-ratchet.sh
rippable_check: "Inject N=20 measurements of a fixed commit with σ_true=10. If CC-native ratchet's σ̂ converges to within ±15% of σ_true AND refuses to keep iterations that beat the anchor by <σ̂, rip."
sources:
  - "https://arxiv.org/abs/1601.07077"
  - "https://arxiv.org/abs/1709.06560"
  - "https://doi.org/10.1093/biomet/39.3-4.324"
---

# Noise-aware ratchet

Canonicalises the project's already-learned rule (user-memory
`feedback_gan_noise_handling.md`): under a noisy metric the anchor must
be (1) monotonic best-ever, (2) periodically re-measured, (3) beaten by
a margin > noise-floor σ before a candidate is kept. Without all three,
noise masquerades as progress or the anchor drifts.

Paired with `plateau-detection` — both consume the same σ estimate but
answer different questions (which iterations to keep vs. when to stop).
Paired with `llm-as-judge-audit` — when the metric is a noisy judge
score, the ratchet is the only thing stopping the loop from regressing
to whichever lucky iteration got a high score once.

See `harness/research/noise-aware-ratchet.md` for the three-rule proof
sketch and the σ̂-convergence rippable probe.

## Referenced by

- `gcli-eval-compare-primitive`
- `gcli-agent-run-telemetry`
