---
description: Project-tuned planning gate — wraps autoresearch:autoresearch:plan with harness defaults (composite-guard, loops/NNN/spec.md as source).
allowed-tools: Skill, Read, Bash, AskUserQuestion
---

# `/autoresearch:plan` (project)

Implementation of `harness/features/plan-mode-discipline.md` (axis1=inner, axis2=pre-loop) for this project. Wraps the upstream `autoresearch:autoresearch:plan` skill with three project-specific defaults:

1. **Spec source.** Read `loops/NNN-<slug>/spec.md` (most recent numbered loop) as the Goal/Scope/Metric source — not free-form prose. The wizard fills missing dimensions interactively but never overwrites operator-supplied values.
2. **Default Guard.** When the operator does not specify a guard, default to `bash harness/composite-guard.sh`. Article VI demands this guard runs every iteration on harness-domain loops. Override only if the operator explicitly opts out.
3. **`ExitPlanMode` is the sole HITL gate** into in-loop execution per Article III. After the wizard validates the plan (dry-run of Verify, baseline measurement), present `ExitPlanMode` for explicit operator approval. No other affordance routes the agent into the in-loop phase.

## What this command does

1. Locate the active loop directory: `ls -dt loops/[0-9]*/ | head -1`. Confirm it contains a `clarifications.md` with a `[RATIFIED]` marker — refuse otherwise (operator must run `/harness:clarify` first; Article V).
2. Read `spec.md`, `clarifications.md`, and `harness/CONSTITUTION.md` (the latter is loaded by `scripts/harness/load-constitution.sh` if available). Use these to seed the plan-workflow defaults.
3. Invoke the upstream skill: `autoresearch:autoresearch:plan` with the spec contents as inline `Goal:` / `Scope:` / `Metric:` / `Verify:` / `Guard:` fields. Default `Guard:` to `bash harness/composite-guard.sh` per the rule above.
4. Run the upstream wizard's 7-step planning flow (capture goal → analyze context → scope → metric → guard → direction → verify → confirm).
5. **Dry-run the Verify command** on the current HEAD to record a baseline. Append the baseline value + git SHA + ISO timestamp to `loops/NNN-<slug>/plan.md`.
6. Present `ExitPlanMode` to the operator for explicit confirmation. **Do not enter in-loop without it** (Article III).
7. On confirmation, commit `loops/NNN-<slug>/plan.md` with message `chore(loop): plan-mode-discipline pass on loops/NNN-<slug> — baseline=<value>`.

## Constraints

- Do **not** invoke `autoresearch:autoresearch` (the loop runner) directly from this command. The operator runs that as a separate slash command after `ExitPlanMode`.
- Do **not** modify `spec.md` — only `plan.md`.
- Do **not** weaken or override the composite-guard default unless the operator explicitly says so.
- If `clarifications.md` lacks `[RATIFIED]` or `D1` still has `[ASSUMPTION]`, refuse with: "D1 unratified — run /harness:clarify first (Article V)."

## ExitPlanMode discipline

`ExitPlanMode` is the **only** legal HITL gate into in-loop execution. Surface it after the plan + baseline are written, never before. Once the operator confirms, this command's job is done — the operator then invokes `autoresearch:autoresearch` separately.
