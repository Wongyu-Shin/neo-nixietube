# SWE-agent — Agent-Computer Interface (ACI)

**Citation:** Yang, J., Jimenez, C.E., Wettig, A., Lieret, K., Yao, S., Narasimhan, K., Press, O.
*SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering.*
NeurIPS 2024. arXiv:2405.15793.

**Primary source:** https://arxiv.org/abs/2405.15793
**Reference code:** https://github.com/SWE-agent/SWE-agent

## Core idea

The *Agent-Computer Interface* is the specific set of tools, output formats
and guardrails the agent sees — distinct from the underlying environment.
The paper shows that careful ACI design (concise file viewer with line
numbers, edit-with-linter, scrollable search output, hard syntax-error
rejection) raises GPT-4's SWE-bench-Lite pass rate from 3.8% → 18.0% with
no change to the model.

Headline lessons:

- **Concise output** beats raw shell output; every extra token the agent has
  to parse is a tax.
- **Guardrails on destructive ops** (edit refused on syntax error) prevent
  the model from committing broken states.
- **Structured feedback** (which line the linter rejected) beats generic
  stack traces.

## Harness-relevant decomposition

| Phase | ACI concern |
|---|---|
| pre-loop | Choose the right tools/MCP servers; strip those the model won't use. |
| in-loop | Enforce "no-op on syntax error" in edit tools, capped output size, deterministic file views. |
| post-loop | Dump a cost/token ledger so the next ACI revision has data. |

## Mapping to this project's axes

- **axis1:** `inner` — implemented via Claude Code `settings.json` permissions,
  hook filters, and the enabled MCP surface. Unlike reflexion/voyager this
  lives entirely inside the Claude Code harness and has no external daemon.
- **axis2:** `pre-loop` (tool curation) + `in-loop` (edit-time guardrails).

## Rippable signal

ACI tuning is *always* needed in principle — models change and so do the
sharp edges. The right TC is a **differential budget test**: run the same
autoresearch Goal twice, once with the pared-down ACI and once with the
default ACI. If median tokens-per-iteration and median iterations-to-keep
are within 10% of each other for 3 consecutive Goals, the default ACI is
good enough — rip the custom overrides.

## Minimal viable implementation for neo-nixetube

1. `.claude/settings.json` — project-scoped permissions:
   `allow: [Bash(grep:*), Bash(git log:*), Read, Edit]`,
   `deny: [Bash(rm -rf:*), Bash(git push --force:*)]`.
2. `fewer-permission-prompts` skill (already available) — scans transcripts
   and pre-allowlists common read-only calls.
3. Hook: pre-commit in `.claude/settings.json` blocks commits that touch
   files outside the declared `Scope:`.

## Contrast

Reflexion/Voyager change *what the model remembers*. ACI changes *what the
model sees*. Both axes of improvement are orthogonal and should be tracked
independently.
