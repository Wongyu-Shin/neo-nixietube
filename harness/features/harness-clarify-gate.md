---
name: harness-clarify-gate
axis1: inner
axis2: pre-loop
applicability:
  claude_code: ">=2.0.0 <3.0.0"
  models: [claude-opus-4-7, claude-sonnet-4-6, claude-haiku-4-5]
tc_script: harness/tests/harness-clarify-gate.sh
rippable_check: "Attempt ExitPlanMode with a plan missing Clarifications. If CC natively rejects with an error naming missing dimensions, rip."
sources:
  - "https://github.com/github/spec-kit"
  - "https://github.com/uditgoenka/autoresearch"
---

# `/harness:clarify` — coverage-based ambiguity gate

Borrows spec-kit's `/speckit.clarify` pattern but binds the coverage
dimensions to this project's Constitution (9 Articles). Walks 7
dimensions (scope-domain, metric-mechanicality, direction, HITL-
exceptions, stop-conditions, wiki-contribution, guard-composition),
persists every Q/A/assumption to `loops/NNN/clarifications.md`.

Fills a file inside the container created by `harness-loop-scaffold`,
runs through the HITL channel hosted by `plan-mode-discipline`,
implements Article V of `harness-constitution`. Marks unresolved
ambiguities as `[ASSUMPTION]` so the operator can audit them; a
scope-straddle `[ASSUMPTION]` trips composite-guard (Article VI).

Unlike autoresearch's current plan wizard — which asks questions but
discards answers at session end — this feature guarantees durable,
loop-local persistence of the clarification record.

See `harness/research/harness-clarify-gate.md` for the 7 dimensions,
the clarifications.md template, and the rejected-ExitPlanMode rippable
probe.
