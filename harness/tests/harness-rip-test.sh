#!/usr/bin/env bash
# TC for feature: harness-rip-test
#
# This TC is meta: it validates that the existing scripts/test-harness-rip.sh
# (the empirical precedent) is present and exposes the expected interface.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTE="$ROOT/harness/research/harness-rip-test.md"
PRECEDENT="$ROOT/scripts/test-harness-rip.sh"

[ -f "$NOTE" ] || { echo "TC_FAIL harness-rip-test: missing research note"; exit 1; }

# The precedent script MUST exist — this feature canonicalises it.
[ -f "$PRECEDENT" ] || { echo "TC_FAIL harness-rip-test: missing precedent scripts/test-harness-rip.sh"; exit 1; }

# The precedent must expose at least one tcNN() function (the pattern we
# obligate new features to copy).
grep -qE "^tc[0-9]+\(\)" "$PRECEDENT" \
    || { echo "TC_FAIL harness-rip-test: precedent lacks tcNN() contract"; exit 1; }

# The research note must name the two-arm protocol explicitly.
grep -qi "with.*feature.*without\|with vs\|two arm\|two-arm\|with-feature\|without-feature" "$NOTE" \
    || { echo "TC_FAIL harness-rip-test: note missing two-arm protocol"; exit 1; }

# Interface contract (PASS/FAIL + quantitative evidence) must be spelled out.
grep -qi "PASS.*FAIL\|PASS/FAIL" "$NOTE" \
    || { echo "TC_FAIL harness-rip-test: note missing PASS/FAIL interface contract"; exit 1; }

# Must require parallel-safety (ties the feature to statistical-tc-runner).
grep -qi "parallel-safe\|parallel safe" "$NOTE" \
    || { echo "TC_FAIL harness-rip-test: note missing parallel-safe requirement"; exit 1; }

echo "TC_PASS harness-rip-test"
exit 0
