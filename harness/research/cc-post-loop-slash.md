# Claude Code Post-loop Slash-Command Reporter

**Primary source:** Anthropic, *Claude Code Custom Slash Commands & Skills.*
https://docs.claude.com/en/docs/claude-code/slash-commands

**Related references:**
- `ultrareview` and `/review` built-in CC commands (Anthropic docs, 2025).
- Sakana AI Scientist, *Towards Fully Automated Open-Ended Scientific Discovery.* arXiv:2408.06292 (https://arxiv.org/abs/2408.06292) — §4 "Automated Paper Writeup" is the canonical post-loop report pattern.
- neo-nixetube practice: MDX result docs under `cad/path-2-room-temp/` already follow this pattern manually.

## Core idea

A custom slash command (or CC skill) that, when the loop's termination
condition fires, generates a human-readable post-mortem MDX/Markdown
report from `git log`, the results TSV, and the kept diffs. Acts as the
controlled HITL handback — the only place the agent talks to the human
after a loop completes.

Key properties that distinguish this from an ad-hoc "write a summary":

1. **Template-driven.** The skill binds the report shape (front-matter:
   `goal`, `scope`, `baseline`, `final`, `delta`, sections: `kept`,
   `discarded`, `crashes`, `lessons`) so consecutive loops produce
   diff-able reports.
2. **Artifact-linked.** Every claim in the report cites a commit hash or
   TSV row number; un-sourced claims fail the TC.
3. **No in-loop side effects.** The report is written only at loop end;
   in-loop iterations never invoke it (prevents drift).

## Why this matters for axis design

Lives at the only legal HITL boundary in the charter: post-loop. Gives
the human the compressed information needed to judge whether to start
another loop, widen scope, or pivot. Without a standardised reporter,
every loop ends with an ad-hoc summary whose quality depends on the
model of the day.

## Harness-relevant decomposition

| Phase | Role |
|---|---|
| post-loop (primary) | On loop end, the slash command writes `reports/<goal-slug>/<ts>.mdx` referencing every kept commit and every discarded experiment. |
| pre-loop (seed) | Future loops' Phase-1 review reads the last report to inherit context — fractal link to Voyager skill library. |

## Mapping to this project's axes

- **axis1:** `inner` — custom slash command lives in
  `.claude/commands/<name>.md` or as a skill under
  `.claude/skills/<name>/SKILL.md`. Zero external infrastructure.
- **axis2:** `post-loop` (primary).

## Rippable signal

Absorbed when Claude Code's built-in `/ultrareview` (or equivalent)
produces reports that:

1. Cover kept AND discarded experiments (not just the final diff).
2. Cite results-log row numbers.
3. Are idempotent on the same inputs (seeded randomness or zero-shot
   stability).

Probe: run CC-native `/ultrareview` on the same loop state N=5 times;
measure structural similarity (section ordering, artifact citation
coverage). If median ≥0.9 across runs AND citation coverage ≥95%, rip.

## Minimal viable implementation for neo-nixetube

1. `.claude/commands/harness-report.md` — slash command that reads
   `autoresearch-harness-results.tsv`, walks `git log --grep=experiment`,
   and writes `reports/harness/<iso-date>.mdx`.
2. Template: `harness/templates/report.mdx.hbs` (Handlebars-style
   placeholders substituted by a small Python script).
3. Invariant: every bullet in the "kept" section MUST reference a commit
   hash; the reporter rejects drafts that fail this.

## Contrast

`llm-as-judge-audit` grades the final artifact. This feature *reports*
on the process. Two separate outputs with different rippable signals.
