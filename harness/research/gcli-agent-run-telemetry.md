# Agent-Run Telemetry — google/agents-cli Observability

**Primary source:** Google, *google/agents-cli.* Apache-2.0.
https://github.com/google/agents-cli
(skill `google-agents-cli-observability`)

**Related references:**
- OpenTelemetry Agent Semantic Conventions (draft 2024) —
  https://opentelemetry.io/docs/specs/semconv/ai/
- Langfuse, Helicone, Phoenix — the LLM observability tool space that
  normalized structured run tracing as a first-class concept.
- Anthropic, *Claude Code Hooks.* — the `PreToolUse` / `PostToolUse`
  / `UserPromptSubmit` / `Stop` events that can sink telemetry.

## Core idea

google/agents-cli treats **observability as its own skill domain**,
on par with scaffold/eval/deploy/publish. That design choice is
worth importing: *running telemetry is not a post-loop concern*. It
is an in-loop concern that produces structured traces during every
iteration, which are then consumed by the post-loop reporter (and
the outer `eval compare` primitive).

Without a named telemetry concept, agent harnesses tend to collapse
observability into one of:

1. **Print debugging** — interleaved with tool output; unstructured,
   not machine-consumable.
2. **Post-loop narrative** — covered by `cc-post-loop-slash`. But
   narratives are lossy; they compress away timestamps, token counts,
   tool latencies, cache hits.
3. **Raw transcripts** — the full conversation log. Structured but
   voluminous; querying "which tool took >2s on iteration 17" requires
   parsing the transcript each time.

Telemetry-as-its-own-axis solves this: every iteration emits a
`harness/build/telemetry/<iter>.jsonl` with one line per event. Fields
are semver-pinned so downstream tools (plateau detection, ratchet,
eval compare) can read them deterministically.

## Why this matters for this project's axes

The existing catalog covers:
- `cc-post-loop-slash` — post-loop *narrative* (prose + citations)
- `llm-as-judge-audit` — post-loop *rubric score* (one number + critique)
- `statistical-tc-runner` — in-loop *hypothesis test* (pass/fail + p-value)

Nothing is **in-loop structured trace**. That is the gap this feature
fills. Telemetry is the substrate that makes the other three more
honest: a plateau-detection signal sourced from timestamps in
telemetry is verifiable; the same signal sourced from in-memory
counters is not.

## Harness-relevant decomposition

| Phase | Role |
|---|---|
| in-loop (primary) | Every iteration emits `harness/build/telemetry/<ts>-<short_hash>.jsonl` with events `{iter_start, tool_call, tool_return, verify_start, verify_end, keep_decision, iter_end}`; schema versioned. |
| pre-loop | Initialise a run manifest (`run_id`, `goal`, `scope`, `baseline_metric`) that keys every subsequent event. |
| post-loop | Reporter + `eval compare` consume the JSONL files; raw data is retained for reproducibility. |

## Mapping to this project's axes

- **axis1:** `outer` — telemetry writes go to an on-disk JSONL store
  via Claude Code hooks (PostToolUse → log) + harness scripts. Claude
  Code emits transcripts but does not emit structured telemetry in
  a schema a third-party tool can bind to.
- **axis2:** `in-loop` (primary).

## Rippable signal

Absorbed when Claude Code ships a structured-telemetry primitive
(OTel spans with AI-specific attributes, or an analogous native
format) whose schema is versioned and documented. Probe:

1. Run the same Goal twice: once with the external telemetry hook
   installed, once with only CC's native emission.
2. Run `eval compare` on a telemetry-derived metric (e.g., median
   tool latency, cache-hit rate, p95 verify time).
3. If native emission yields the same answers within 10% without
   the external hook, rip.

## Minimal viable implementation for neo-nixetube

1. `.claude/settings.json` PostToolUse hook pointing to
   `scripts/hooks/telemetry.sh` — writes a JSONL line per tool call.
2. `harness/telemetry/SCHEMA.md` — one-page schema doc listing
   required fields with semver.
3. `scripts/harness/telemetry_query.sh <jq-expr> [<run_id>]` —
   convenience wrapper for common queries (latency p95, verify wall-
   time, keep-rate).
4. Integration: `plateau-detection`, `noise-aware-ratchet`, and
   `gcli-eval-compare-primitive` all optionally read telemetry files
   instead of only the results TSV.

## Strict non-overlap

| Feature | When it runs | Output shape |
|---|---|---|
| `gcli-agent-run-telemetry` (this) | **in-loop**, every event | structured JSONL stream, versioned |
| `cc-post-loop-slash` | post-loop, once | human-readable MDX narrative |
| `llm-as-judge-audit` | post-loop, once | one number + rubric critique |
| `cc-hook-guardrail` | in-loop, on specific tool calls | deny (exit 1) or allow |
| `statistical-tc-runner` | per-TC, aggregated | Welch t / p-value |

The discriminating axis is "continuous structured output per event"
vs. everything else. This feature owns that output.
