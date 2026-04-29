# Plan — `<slug>` (Loop NNN)

> Operator-approved plan emitted by `/autoresearch:plan` (feature
> `plan-mode-discipline`). The `ExitPlanMode` action at the bottom of
> this file is the **only** legitimate HITL gate into in-loop execution
> per Article III.

## Strategy

<!-- 3–6 sentences: what cohesive change the loop will pursue, what
direction(s) it expects to explore first, and why this metric responds
to those directions. -->

## Iteration sequence (initial)

1. <change description>
2. <change description>
3. …

## Risk register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Guard regression | … | composite-guard catches schema/crosscheck breaks |
| Metric noise | … | min-delta floor, multi-run median, env pinning |

## Baseline

- Verify command run on HEAD: `…`
- Baseline metric: `…`
- Date / git SHA: `…`

## ExitPlanMode

- Operator confirmed: `[ ]`
- Loop entered at: `…`
