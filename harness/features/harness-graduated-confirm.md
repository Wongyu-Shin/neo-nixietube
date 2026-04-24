---
name: harness-graduated-confirm
axis1: inner
axis2: in-loop
applicability:
  claude_code: ">=2.0.0 <3.0.0"
  models: [claude-opus-4-7, claude-sonnet-4-6, claude-haiku-4-5]
tc_script: harness/tests/harness-graduated-confirm.sh
rippable_check: "Enumerate the L2 action list (~10 items); in CC-native multi-tier permission mode, attempt each inside an Agent run. If all trigger an operator prompt (not silent allow, not binary deny), rip."
sources:
  - "https://docs.openhands.dev/sdk/guides/security.md"
  - "https://github.com/All-Hands-AI/OpenHands"
---

# Graduated confirm — L0 / L1 / L2 tiers

Borrows OpenHands' Security Analyzer + Action Confirmation. Replaces
the binary deny-list of `cc-hook-guardrail` with a three-tier
classifier:

- **L0 reversible** — silent allow (Read, Grep, in-scope Edit).
- **L1 reversible-but-notable** — stateless notify; auto-approve
  after 30s if no operator objection.
- **L2 irreversible** — pause loop via `harness-pause-resume`
  checkpoint; block until explicit operator keystroke.

Classifier is a deterministic rule table, not a model judgment —
same action always gets same tier. Per-loop overrides live in
`loops/NNN/tier-overrides.yaml` so a deliberate history-rewrite Goal
can downgrade `git push --force` to L1.

The only legal in-loop HITL per Article III (alongside operator-
initiated pause). Uses `harness-pause-resume` as its mechanism,
`gcli-agent-run-telemetry` for the L1 notice stream, `cc-hook-guardrail`
as a coarser fallback for truly always-denied operations.

See `harness/research/harness-graduated-confirm.md` for the default
L2 list, the classifier schema, and the CC-native-multi-tier-mode
rippable probe.
