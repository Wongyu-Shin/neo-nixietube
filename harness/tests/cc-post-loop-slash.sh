#!/usr/bin/env bash
# TC for feature: cc-post-loop-slash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTE="$ROOT/harness/research/cc-post-loop-slash.md"

[ -f "$NOTE" ] || { echo "TC_FAIL cc-post-loop-slash: missing research note"; exit 1; }
grep -q "docs.claude.com.*slash-commands" "$NOTE" || { echo "TC_FAIL cc-post-loop-slash: missing slash-commands doc URL"; exit 1; }
grep -qi "post-loop" "$NOTE" || { echo "TC_FAIL cc-post-loop-slash: missing post-loop mapping"; exit 1; }
grep -qi "inner" "$NOTE" || { echo "TC_FAIL cc-post-loop-slash: missing inner-harness anchor"; exit 1; }
grep -qi "template\|artifact-link\|commit hash" "$NOTE" || { echo "TC_FAIL cc-post-loop-slash: missing discriminating properties"; exit 1; }
grep -qi "ultrareview\|structural similarity\|citation coverage" "$NOTE" || { echo "TC_FAIL cc-post-loop-slash: missing rippable probe spec"; exit 1; }

# Phase-boundary invariant: post-loop reporter must NOT run in-loop.
grep -qi "no in-loop side effects\|loop end\|loop's termination" "$NOTE" \
    || { echo "TC_FAIL cc-post-loop-slash: missing no-in-loop invariant"; exit 1; }

echo "TC_PASS cc-post-loop-slash"
exit 0
