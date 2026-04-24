#!/usr/bin/env bash
# TC for feature: gcli-agent-run-telemetry
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTE="$ROOT/harness/research/gcli-agent-run-telemetry.md"

[ -f "$NOTE" ] || { echo "TC_FAIL gcli-telemetry: missing research note"; exit 1; }
grep -q "github.com/google/agents-cli" "$NOTE" \
    || { echo "TC_FAIL gcli-telemetry: missing google/agents-cli citation"; exit 1; }

# Must cite an OpenTelemetry / observability-spec reference.
grep -qE "opentelemetry\.io|OTel|OpenTelemetry" "$NOTE" \
    || { echo "TC_FAIL gcli-telemetry: missing OpenTelemetry reference"; exit 1; }

# Must be in-loop primary (the whole point vs. post-loop alternatives).
grep -qE "in-loop \(primary\)" "$NOTE" \
    || { echo "TC_FAIL gcli-telemetry: must be in-loop primary"; exit 1; }

# Must enumerate the specific event types emitted.
events_found=0
for ev in iter_start tool_call tool_return verify_start verify_end keep_decision iter_end; do
    grep -q "$ev" "$NOTE" && events_found=$((events_found + 1))
done
[ "$events_found" -ge 5 ] \
    || { echo "TC_FAIL gcli-telemetry: need ≥5 event types, got $events_found"; exit 1; }

# Must establish JSONL + versioned schema contract.
grep -qi "jsonl" "$NOTE" && grep -qi "schema.*version\|versioned\|semver" "$NOTE" \
    || { echo "TC_FAIL gcli-telemetry: missing JSONL + versioned schema contract"; exit 1; }

# Must differentiate from every existing post-loop/in-loop emit feature.
for f in cc-post-loop-slash llm-as-judge-audit cc-hook-guardrail statistical-tc-runner; do
    grep -q "$f" "$NOTE" \
        || { echo "TC_FAIL gcli-telemetry: missing distinction from $f"; exit 1; }
done

# Rippable probe must be quantitative.
grep -qE "within 10%|median.*latency|p95|cache-hit" "$NOTE" \
    || { echo "TC_FAIL gcli-telemetry: rippable probe lacks quantitative signal"; exit 1; }

echo "TC_PASS gcli-agent-run-telemetry"
exit 0
