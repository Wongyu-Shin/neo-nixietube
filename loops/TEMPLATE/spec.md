# Loop Spec — `<slug>`

> Loop NNN — created via `/harness:new-loop <slug>`.
> This file is the single source of truth for what this loop will do.
> Fill every section before invoking `/harness:clarify`.

## Goal

<!-- One sentence: what should be true at the end of this loop that is not
true now? Avoid means; describe ends. -->

## Scope

<!-- File globs that the loop is allowed to modify. Per Article IV
(alignment-free separation), Scope must live in exactly one of:
  - harness domain: harness/, scripts/harness/, .claude/
  - content domain: cad/, sim/, reason/, predict/, scenario/, web/, tests/
A scope spanning both fails composite-guard. -->

## Metric

<!-- Mechanical, single-number output. The verify command must extract
this number from a tool's output. Forbidden: any subjective metric. -->

- **Name**:
- **Direction**: lower-is-better | higher-is-better
- **Floor / target**:

## Verify

<!-- Shell command that prints `<METRIC_NAME>=<value>` on its last line.
Must exit 0 on success, non-zero on crash. -->

```bash
# verify command goes here
```

## Guard

<!-- Optional. Shell command that must always pass — protects existing
behavior while the metric is optimized. Defaults to
`bash harness/composite-guard.sh` for harness-domain loops. -->

```bash
bash harness/composite-guard.sh
```

## Direction discipline (Article III + V)

The wizard at `/harness:clarify` will check 7 dimensions (D1–D7) before
this loop is allowed to enter the in-loop phase. After entry, HITL is
forbidden inside the loop except for the two exceptions in
`harness/CONSTITUTION.md` Article III.

## Stop conditions

<!-- One or more of: bounded N, target reached, plateau detected,
operator pause, operator abandon. -->
