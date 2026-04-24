#!/usr/bin/env bash
# harness/composite-guard.sh — "무모순" guard
#
# Exits 0 iff BOTH:
#   (a) harness/guard.sh exits 0 (frontmatter schema valid)
#   (b) harness/crosscheck.sh reports CROSSCHECK_PASS=11 (no consistency violations)
#
# Used as the autoresearch Guard for any loop whose Goal says
# "add X without breaking existing structure". Any iteration that
# weakens either schema or cross-artifact consistency is discarded.
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if ! bash "$ROOT/harness/guard.sh" >/dev/null 2>&1; then
    echo "COMPOSITE_GUARD_FAIL guard.sh schema invalid"
    exit 1
fi

cc_out=$(bash "$ROOT/harness/crosscheck.sh" 2>&1)
cc_pass=$(echo "$cc_out" | awk -F= '/^CROSSCHECK_PASS=/{print $2}')
if [ "$cc_pass" != "11" ]; then
    echo "COMPOSITE_GUARD_FAIL crosscheck regression: CROSSCHECK_PASS=$cc_pass (need 11)"
    echo "$cc_out"
    exit 2
fi

echo "COMPOSITE_GUARD_OK schema=valid crosscheck=11/11"
exit 0
