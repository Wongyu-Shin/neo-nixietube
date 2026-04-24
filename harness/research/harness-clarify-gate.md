# Harness Clarify Gate — Coverage-Based Ambiguity Resolution

**Inspiration sources:**
- GitHub spec-kit `/speckit.clarify` —
  "Sequential, coverage-based questioning that records answers in a
  Clarifications section". https://github.com/github/spec-kit
- autoresearch `/autoresearch:plan` wizard — already asks questions but
  does not persist them. https://github.com/uditgoenka/autoresearch
- Anthropic `AskUserQuestion` tool — primitive used under the hood.

## Core idea

Before a loop enters execution, the agent must have asked enough
*structured, coverage-based* questions to cover the canonical
ambiguity dimensions, AND every question + answer + assumption must
be persisted in the loop's `clarifications.md` file.

"Coverage-based" means: there is a fixed list of dimensions the
clarify pass walks through, not an open-ended Q/A. Missing dimensions
are flagged as `[ASSUMPTION]` in the record so the operator can veto
later.

Dimensions, derived from the project's CONSTITUTION:

| Dim | Question template | Why |
|---|---|---|
| **D1 Scope-domain** | "Is the scope under `harness/` or under project-content?" | Article IV — alignment separation |
| **D2 Metric-mechanicality** | "Can the metric be extracted by a single command, exit 0?" | Article II — rippability premise |
| **D3 Direction** | "Higher or lower is better?" | standard autoresearch wizard |
| **D4 HITL-exceptions** | "Does this loop need any in-loop HITL for irreversible ops?" | Article III — opt-in to graduated confirm |
| **D5 Stop-conditions** | "Bounded (Iterations: N) or unbounded (Ctrl+C / plateau)?" | autoresearch Phase 8 |
| **D6 Wiki-contribution** | "Which wiki keywords, if any, should this loop emit at post-loop?" | Article VII — LLM-wiki |
| **D7 Guard-composition** | "Beyond composite-guard, any Goal-specific guard?" | Article VI — no contradiction |

A clarify pass is "complete" iff D1–D7 each have an explicit operator
answer or an `[ASSUMPTION]` marker.

## Why this matters for this project's axes

Currently, wizard answers live in chat history and are discarded when
the session ends. If an operator returns a week later to a loop's
`report.mdx` they cannot see *why* Scope was set one way, whether
`Iterations: N` was bounded because of budget or because of principle,
or whether the metric's direction was debated. The clarifications file
preserves that audit trail.

This also makes cross-loop learning possible: the LLM-wiki (feature 6)
can index clarifications to answer "how have we typically resolved D5
for this kind of Goal?" across historical loops.

## Harness-relevant decomposition

| Phase | Role |
|---|---|
| pre-loop (primary) | At the end of the plan wizard, before ExitPlanMode, run the 7-dim coverage pass; write answers + `[ASSUMPTION]` markers to `loops/NNN/clarifications.md`; the file becomes a required part of the spec per Article V. |
| in-loop | Consulted for borderline decisions — e.g., if an iteration considers an action that might be HITL-worthy, re-read D4 before deciding. |
| post-loop | Reporter cites specific Clarifications rows when explaining WHY a loop made certain decisions. |

## Mapping to this project's axes

- **axis1:** `inner` — uses CC's `AskUserQuestion` tool + slash
  command. No external orchestrator.
- **axis2:** `pre-loop` (primary) with in-loop consultation.

## Rippable signal

Absorbed when CC's Plan mode natively enforces a coverage-based
clarification pass before allowing ExitPlanMode — i.e., Plan mode
refuses to exit unless the plan document has a non-empty
Clarifications section covering declared dimensions. Probe:

1. Attempt ExitPlanMode with a plan missing Clarifications.
2. If CC rejects with an error mentioning missing dimensions, rip.

## Minimal viable implementation for neo-nixetube

1. `.claude/commands/harness/clarify.md` — slash command that reads the
   loop's spec, walks the 7 dimensions, uses `AskUserQuestion` batches,
   writes `loops/NNN/clarifications.md`.
2. Template `loops/TEMPLATE/clarifications.md`:

```markdown
# Clarifications

| Dim | Question | Answer | Recorded at |
|---|---|---|---|
| D1 | ... | ... | <ISO timestamp> |
| D2 | ... | ... | ... |
| ... |

## Assumptions

- `[ASSUMPTION]` <text> (for any dim where no operator answer was recorded)

## Amendments

- <YYYY-MM-DD> — <who> changed <dim> from <old> to <new> because <reason>
```

3. An `[ASSUMPTION]` in D1 (scope straddles domains) fails the
   composite-guard — the loop cannot start with alignment unresolved.

## Contrast

- `plan-mode-discipline` — hosts the HITL *channel*. This feature
  uses that channel for a *specific coverage pass*.
- `harness-loop-scaffold` — creates the container. This feature fills
  one of the container's files.
- `harness-constitution` — Article V mandates clarifications; this
  feature is the implementation of that mandate.
