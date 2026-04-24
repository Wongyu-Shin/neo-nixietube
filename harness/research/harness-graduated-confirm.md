# Harness Graduated Confirm — Irreversible-Action HITL

**Inspiration sources:**
- OpenHands *Security Analyzer & Action Confirmation*:
  "Control agent action execution through confirmation policy and
  security analyzer." https://docs.openhands.dev/sdk/guides/security.md
  (repo: https://github.com/All-Hands-AI/OpenHands)
- Claude Code `Agent` tool permission modes: `default`, `acceptEdits`,
  `plan`, `bypassPermissions`, `dontAsk`.
- Devin-style action-classification — low/medium/high risk tiers.
- nikrag / cursor confirmation dialogs — "this will delete 7 files —
  confirm?" pattern.

## Core idea

Article III of the Constitution permits exactly two in-loop HITL
exceptions: operator-initiated pause (`harness-pause-resume`) and
graduated confirmation for irreversible operations. This feature
formalises the second.

Three action tiers with different confirmation semantics:

| Tier | Examples | Confirmation |
|---|---|---|
| **L0 reversible** | `Read`, `Grep`, `Edit` inside Scope, `Bash(git log:*)` | Silent — no confirm |
| **L1 reversible-but-notable** | `Bash(rm)` on files under Scope, `git reset --soft`, package install | Stateless confirm — shown to operator, default-approve after 30s |
| **L2 irreversible** | `git push --force`, `git reset --hard` on main, `rm` outside Scope, external API POST that bills, `chmod 777` | **Blocking** confirm — pause the loop, write checkpoint, require explicit operator keystroke before proceeding |

The agent classifies each pending tool call into a tier using a
static rule table (not a model judgment — deterministic). L2 calls
trigger the `harness-pause-resume` checkpoint machinery, so the
operator can approve, veto, or abandon.

## Why this matters for this project's axes

`cc-hook-guardrail` is a binary deny-list: the op is either allowed
or hard-denied. That is too coarse. A `git push --force` is not
inherently wrong — it may be the right action during a deliberate
history-rewrite session — but it deserves an explicit operator
nod. Deny lists cannot express "ask the human" semantics; they can
only express yes/no.

Graduated confirm also resolves a known issue with `cc-hook-guardrail`:
that feature is written as a single deny-list. Real-world harnesses
need policies keyed by context (e.g., `rm` on a test fixture is OK,
`rm` on a tracked source file is not). The L0/L1/L2 classifier table
is expressive enough to capture both.

## Harness-relevant decomposition

| Phase | Role |
|---|---|
| in-loop (primary) | Before every tool call, classify into L0/L1/L2. L2 triggers pause-resume checkpoint + blocking operator prompt. |
| pre-loop | Per-Goal classifier overrides in `loops/NNN/spec.md` — e.g., a Goal explicitly targeting history rewrite downgrades `git push --force` to L1. |
| post-loop | Report lists every L2 event + operator decision in a dedicated section. |

## Mapping to this project's axes

- **axis1:** `inner` — implemented as a `PreToolUse` hook (same
  primitive as `cc-hook-guardrail`, different policy shape). Classifier
  table lives in `.claude/settings.json` + per-loop overrides in
  `loops/NNN/spec.md`.
- **axis2:** `in-loop` (primary).

## Rippable signal

Absorbed when CC ships a multi-tier Agent permission mode beyond
current `default` / `acceptEdits` / `plan` / `bypassPermissions` —
specifically a mode that classifies tool calls into reversibility
tiers and routes L2 through a standardized operator prompt. Probe:

1. Enumerate the L2 action list (≈10 items).
2. In CC-native mode, attempt each from within an Agent run.
3. If the L2 actions trigger an operator prompt (not silent allow,
   not binary deny) for all 10, rip.

## Minimal viable implementation for neo-nixetube

1. `harness/policies/tier-classifier.jsonc` — the L0/L1/L2 rule table.
2. `.claude/settings.json` `PreToolUse` hook that:
   - Matches tool call against the classifier.
   - For L1: emits a notice to telemetry (`gcli-agent-run-telemetry`),
     logs a 30s countdown approval, proceeds if no objection.
   - For L2: writes a pause-resume checkpoint
     (`harness-pause-resume`), emits an operator prompt, blocks.
3. Per-loop override file: `loops/NNN/tier-overrides.yaml`.
4. Default L2 list (initial):
   - `git push --force` (all variants including `--force-with-lease`)
   - `git reset --hard` when current branch is `main` or `master`
   - `rm` targeting paths outside declared Scope
   - `curl ... | sh` / `curl ... | bash`
   - POST to any `*.openai.com` / `*.anthropic.com` / `*.googleapis.com`
     billing endpoint
   - `chmod 777` recursively
   - `sudo` of any form
   - `docker build` with `--pull=always`
   - `npm publish` / `pip upload` / `gh release create`
   - Editing files under `.git/` or `.github/workflows/`

## Contrast

- `cc-hook-guardrail` — binary deny at PreToolUse. This feature is the
  *three-tier* version that routes L2 through HITL instead of binary
  denying.
- `harness-pause-resume` — the *mechanism* used when L2 triggers. This
  feature is the *policy* that decides when to trigger.
- `sandboxed-open-ended-exploration` — worktree isolation prevents
  destructive candidates from reaching the parent archive. This
  feature prevents *the operator's session* from being blindsided
  mid-loop.
