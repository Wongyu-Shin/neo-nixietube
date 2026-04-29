---
description: Pause the active loop at the next iteration boundary; write a resumable checkpoint.
allowed-tools: Bash, Read
---

# `/harness:pause`

Operator-initiated pause per `harness/features/harness-pause-resume.md`
(axis1=inner, axis2=in-loop). Article III asymmetry: operator pauses
are **always permitted** — they are not agent-requested HITL.

## What this command does

1. Locate the active loop directory: `ls -dt loops/[0-9]*/ | head -1`.
   If no numbered loop exists, refuse: "No active loop. Start one with `/harness:new-loop <slug>`."
2. Run `bash scripts/harness/pause-state.sh write <loop-dir>` to write a checkpoint at `loops/NNN/checkpoints/<timestamp>.json`. The checkpoint records: HEAD SHA, last iteration number from `results.tsv`, and a `next_action` string for resume.
3. Stop the agent's iteration loop **after** the current atomic step completes (do not abort mid-edit). If a tool call is in flight, wait for its result, log it, then return control to the operator.
4. Print a 3-line summary: pause file path, last iteration, and the resume command (`/harness:resume <loop-dir>` — operator copies and re-invokes when ready).
5. Do **not** commit anything as part of pausing — the checkpoint lives outside git intentionally so concurrent loops on different worktrees can pause independently. (Add `loops/*/checkpoints/` to `.gitignore` if it isn't already.)

## Constraints

- Always allowed; never refused based on iteration state.
- Idempotent: pausing an already-paused loop just writes another checkpoint.
- Does **not** start `/harness:report` — that is a separate post-loop action.
