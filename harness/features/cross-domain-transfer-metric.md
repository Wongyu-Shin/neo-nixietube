---
name: cross-domain-transfer-metric
axis1: outer
axis2: post-loop
applicability:
  claude_code: ">=2.0.0 <3.0.0"
  models: [claude-opus-4-7, claude-sonnet-4-6]
tc_script: harness/tests/cross-domain-transfer-metric.sh
rippable_check: "Declare A/B pair at plan time; run loop on A; have CC-native and external compute transfer_delta on B. If agree within 5% on 3 consecutive Goals, rip."
sources:
  - "https://arxiv.org/abs/2603.19461"
  - "https://github.com/facebookresearch/Hyperagents"
  - "https://doi.org/10.1109/TKDE.2009.191"
---

# Cross-domain transfer metric

Zhang 2026 §5.2 / §5.3: hyperagent optimised on domain A is evaluated
*without further modification* on held-out domain B. Positive
`transfer_delta = score_B(final) − score_B(baseline)` means the
learnt meta-level mechanisms generalise; negative means A-gain was
overfitting. The only honest validation that self-improvement is
actually happening, not alignment-regime gaming.

Operationalises `alignment-free-self-improvement`: that feature says
"don't straddle domains"; this one catches you when you did anyway.

Concrete A/B pairs available in this project: `cad/path-2-room-temp`
↔ `sim/paschen`, `reason/` ↔ `predict/`, `scenario/` ↔ `tests/`.
Listed in `harness/pairs.tsv` once implemented.

Pairs with `llm-as-judge-audit` at the post-loop junction — judge
grades the artefact, this one grades the *learning*. Neither
subsumes the other.

See `harness/research/cross-domain-transfer-metric.md` for the
transfer protocol, the curated A/B pair list, and the agreement-
threshold rippable probe.
