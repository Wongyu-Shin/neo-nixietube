# Harness Feature Schema

Every `harness/features/*.md` file MUST contain YAML frontmatter with the fields below. The frontmatter is validated by `harness/guard.sh` and scored by `harness/verify.sh`.

## Required frontmatter fields

```yaml
---
name: <short identifier, matches filename stem>
axis1: inner | outer
axis2: pre-loop | in-loop | post-loop
applicability:
  claude_code: <semver range, e.g. ">=2.0.0 <3.0.0" or "*">
  models: [<model-id>, ...]   # e.g. [claude-opus-4-7, claude-sonnet-4-6]
tc_script: harness/tests/<script>.sh
rippable_check: <1-line statement of the empirical signal that tells us this feature is absorbed upstream and can be ripped out>
sources: [<url-or-citation>, ...]   # papers, blog posts, code repos
---
```

## Field semantics

- **axis1** — Is the feature implemented inside Claude Code (`inner`: settings, hooks, skills, built-in tools) or outside (`outer`: external CLI, cron, scripts, CI)?
- **axis2** — Which pipeline phase the feature gates: `pre-loop` (goal design, context gather, planning), `in-loop` (mid-iteration safety/persistence/plateau detection), `post-loop` (report, guard audit, HITL handback).
- **applicability** — Machine-readable scope of when this feature should be active. `guard.sh` uses it to detect stale features after a CC or model upgrade.
- **tc_script** — Path to a reproducible, parallel-safe test case. Must exit 0 when the feature is still needed (statistically differentiable from baseline); non-zero when upstream has absorbed it.
- **rippable_check** — The signal you look for. E.g. "If Claude Code 2.5+ automatically runs schema validation on plan output, TC will see identical scores with/without this feature and fail (as expected) → rip."
- **sources** — At least one citation (paper URL, Anthropic doc, GitHub repo, etc.). When citing HyperAgent(s)-family work, disambiguate Meta HyperAgents (Zhang 2026) from FPT HyperAgent (Phan 2024) — the two systems share only a name prefix.

## Scoring rules (verify.sh)

A feature entry counts toward the score iff ALL of the following hold:

1. Frontmatter parses and contains all required fields.
2. `tc_script` exists and is executable.
3. `tc_script` exits 0 on the current machine/model.
4. `sources` is non-empty.

The final metric is `SCORE=N` where N is the count of qualifying entries.
