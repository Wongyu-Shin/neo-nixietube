---
description: Resume a paused loop from its latest checkpoint, optionally with operator hint.
argument-hint: [<loop-dir>] [--hint "<text>"]
allowed-tools: Bash, Read, Skill
---

# `/harness:resume`

Resume per `harness/features/harness-pause-resume.md` (axis1=inner,
axis2=in-loop). The argument is **`$ARGUMENTS`** — either empty (use
most recent loop) or `<loop-dir> [--hint "<text>"]`.

## What this command does

1. Determine the target loop. If `$ARGUMENTS` is empty, use `ls -dt loops/[0-9]*/ | head -1`. Otherwise treat the first whitespace-separated token as `<loop-dir>` (relative to repo root).
2. Run `bash scripts/harness/pause-state.sh resume <loop-dir>`. If `--hint "<text>"` is in `$ARGUMENTS`, pass it through; the script appends the hint to the latest checkpoint and echoes it for Phase-1 injection.
3. Read the loop's `spec.md`, `clarifications.md`, and the latest checkpoint. Read the last 5 entries of `results.tsv` to re-establish loop context (per autonomous-loop-protocol Phase 1 review rules).
4. If a hint was supplied, **inject it** into the next iteration's Phase 1 review before the agent picks the next experiment. Phrasing: `"Operator hint at resume: <text>"`.
5. Invoke `autoresearch:autoresearch` (the loop runner skill) with the loop's stored Goal/Scope/Metric/Verify/Guard from `spec.md` + `plan.md`. The runner picks up at iteration `last_iter + 1`.
6. Refuse to resume if the loop directory has no checkpoint (no pause was ever issued): "No checkpoint found — was this loop paused? Start fresh with `/autoresearch:autoresearch` instead."

## Constraints

- Always honor the operator's hint — do NOT silently filter it.
- Do **not** alter `spec.md` or `plan.md` on resume; only append to checkpoint state.
- Article III: resume is the *operator's* HITL gate; the agent itself does not request resume.
