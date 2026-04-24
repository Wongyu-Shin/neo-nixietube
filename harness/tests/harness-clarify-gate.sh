#!/usr/bin/env bash
# TC for feature: harness-clarify-gate
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTE="$ROOT/harness/research/harness-clarify-gate.md"

[ -f "$NOTE" ] || { echo "TC_FAIL clarify-gate: missing research note"; exit 1; }
grep -q "github.com/github/spec-kit" "$NOTE" \
    || { echo "TC_FAIL clarify-gate: missing spec-kit citation"; exit 1; }
grep -q "github.com/uditgoenka/autoresearch" "$NOTE" \
    || { echo "TC_FAIL clarify-gate: missing autoresearch citation"; exit 1; }

# Must name the 7 clarification dimensions.
for d in D1 D2 D3 D4 D5 D6 D7; do
    grep -q "**$d " "$NOTE" || grep -q "| $d |" "$NOTE" \
        || { echo "TC_FAIL clarify-gate: missing dimension $d"; exit 1; }
done

# Must specify the [ASSUMPTION] marker convention.
grep -qF "[ASSUMPTION]" "$NOTE" \
    || { echo "TC_FAIL clarify-gate: missing [ASSUMPTION] marker convention"; exit 1; }

# Must tie D1 to Article IV (alignment separation).
grep -qi "Article IV\|alignment" "$NOTE" \
    || { echo "TC_FAIL clarify-gate: D1 must reference alignment/Article IV"; exit 1; }

# Must be pre-loop primary.
grep -qFi "pre-loop (primary)" "$NOTE" \
    || { echo "TC_FAIL clarify-gate: missing pre-loop (primary) mapping"; exit 1; }

# Must define "coverage-based" in contrast with open-ended Q/A.
grep -qi "coverage-based" "$NOTE" \
    || { echo "TC_FAIL clarify-gate: missing coverage-based definition"; exit 1; }

# Must name the three catalog features it interacts with.
grep -q "plan-mode-discipline" "$NOTE" \
    || { echo "TC_FAIL clarify-gate: missing plan-mode-discipline contrast"; exit 1; }
grep -q "harness-loop-scaffold" "$NOTE" \
    || { echo "TC_FAIL clarify-gate: missing harness-loop-scaffold contrast"; exit 1; }
grep -q "harness-constitution" "$NOTE" \
    || { echo "TC_FAIL clarify-gate: missing harness-constitution contrast"; exit 1; }

echo "TC_PASS harness-clarify-gate"
exit 0
