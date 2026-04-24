---
name: plateau-detection
axis1: outer
axis2: in-loop
applicability:
  claude_code: ">=2.0.0 <3.0.0"
  models: [claude-opus-4-7, claude-sonnet-4-6]
tc_script: harness/tests/plateau-detection.sh
rippable_check: "Inject metric = score + N(0,σ=10), true slope=0 into a fixture loop. If the CC-native stopping rule terminates within ±5 iterations of the oracle and K-L divergence on iteration distribution <0.1, rip the external detector."
sources:
  - "https://page.mi.fu-berlin.de/prechelt/Biblio/stop_tricks1997.pdf"
  - "https://karpathy.github.io/2019/04/25/recipe/"
  - "https://arxiv.org/abs/1206.2944"
---

# Noise-aware plateau detection

Explicitly named in the project's axis-2 charter. The autoresearch SKILL
already ships a primitive "≥5 consecutive discards → stuck" rule, but
this project has empirically hit noise-dominated plateaus (path-2 CAD
loop, 41 iterations, ±10-point LLM-as-judge noise — see user-memory
`project_cad_loop_state.md`) where the naive rule either mis-fires or
wastes budget.

The feature combines *at least two* detectors (patience on ratchet-MAX
plus trend-slope confidence interval, optionally Prechelt's GL_α) so
that neither noise nor a slow-but-real trend triggers a false positive.

Pairs with the existing feedback entry in user memory that dictates
"ratchet MAX, never weaken anchor" — same mechanism, made explicit and
rippable.

See `harness/research/plateau-detection.md` for the detector formulas,
the combined-criterion rule, and the noise-injection rippable probe.
