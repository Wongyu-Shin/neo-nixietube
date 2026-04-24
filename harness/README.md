# Harness Architecture Catalog

Working repository for the **neo-nixetube agent-harness research loop**.

The loop's job is to research published recursive-self-improvement harnesses
(Meta HyperAgent, Reflexion, Voyager, SWE-agent, Devin-style scaffolds, …)
and convert each reusable idea into a catalogued `feature` that is classified
along two axes:

| Axis | Values | Meaning |
|---|---|---|
| **axis1** | `inner` / `outer` | Lives inside Claude Code (settings/hooks/skills/tools) vs. outside (external CLI, cron, scripts, CI). |
| **axis2** | `pre-loop` / `in-loop` / `post-loop` | Which phase of the agent pipeline the feature gates. |

Every feature must be **rippable** — when Claude Code or the active model
absorbs the feature upstream, its TC starts failing and the entry is
quarantined/removed. See `SCHEMA.md` for the mandatory frontmatter.

## Layout

```
harness/
├── SCHEMA.md              # Feature frontmatter spec (MUST read)
├── README.md              # This file
├── guard.sh               # Catalog schema validator (autoresearch Guard)
├── verify.sh              # Harness Feature Completeness Score (Metric)
├── features/              # One .md per classified feature (persisted knowledge)
├── research/              # Paper/repo notes feeding the feature catalog
├── tests/                 # Reproducible, parallel-safe TC scripts
└── build/                 # verify/guard logs, TC outputs (gitignored)
```

## Metric

`bash harness/verify.sh` prints `SCORE=N`. The autoresearch loop maximises N.
An entry counts iff its frontmatter is valid, its `tc_script` is present and
exits 0, and `sources` is non-empty.

## Guard

`bash harness/guard.sh` exits non-zero if any feature entry has a malformed
or incomplete frontmatter. Autoresearch discards any iteration that trips the
guard, so the catalog always stays machine-readable.

## HITL boundary

Per the design charter: HITL belongs **outside** the agent loop whenever
possible. `pre-loop` features explicitly gate HITL; `in-loop` features must
never request HITL (they page via persistence + post-loop reports instead);
`post-loop` features are the only legal place to hand control back.
