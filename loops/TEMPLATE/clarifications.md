# Clarifications — `<slug>` (Loop NNN)

> Recorded Q/A from `/harness:clarify`. Article V demands every
> ambiguity be resolved before the loop enters in-loop. Open
> `[ASSUMPTION]` markers fail `harness/composite-guard.sh`.

## D1 · Scope alignment (Article IV)

- Domain: harness | content
- Globs: …
- Crosses domain boundary? no | `[ASSUMPTION] …`

## D2 · Metric mechanicality

- Single-number output? yes | no
- Extracted by deterministic command? yes | no
- Noise floor (if known): …

## D3 · Direction

- Higher-is-better | lower-is-better
- Tie-break rule on equal metric: …

## D4 · HITL boundary (Article III)

- Pre-loop HITL events: clarify, plan-approval
- In-loop HITL exceptions used: none | L2 graduated-confirm | Ctrl+C
- Post-loop HITL events: report review, wiki-add approvals

## D5 · Stop condition

- Bounded N: …
- Target metric: …
- Plateau patience / slope: …

## D6 · Wiki / persistence

- Knowledge that should land in `harness/wiki/`: …
- Cross-loop dependencies on existing wiki entries: …

## D7 · Guard

- Guard command: `bash harness/composite-guard.sh`
- What regression patterns it protects against: schema validity,
  cross-artifact consistency (CROSSCHECK_PASS=11/11).

## Operator approval

- `[RATIFIED]` — operator confirmed all dimensions resolved.
