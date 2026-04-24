#!/usr/bin/env bash
# TC for feature: reflexion
#
# Validates that the Reflexion research note and design contract exist and
# satisfy the minimum structural requirements. This is a deterministic smoke
# TC — the heavier statistical arm (with vs. without reflexion on a failing
# fixture) lives in harness/tests/statistical/reflexion-stat.sh (TODO) and
# runs via `HARNESS_TIER=stat bash harness/verify.sh`.
#
# Exits 0 iff the feature is still needed (design artifacts present and
# coherent). Exits non-zero once Claude Code absorbs the feature — the
# rippable_check note in the feature frontmatter tells us what signal to
# look for.

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTE="$ROOT/harness/research/reflexion.md"

[ -f "$NOTE" ] || { echo "TC_FAIL reflexion: missing research note"; exit 1; }

# Contract: the note must cite the original paper, describe axis mapping,
# and specify a rippable signal. Missing any of these means the catalog
# entry is too thin to be actionable.
grep -q "arxiv.org/abs/2303.11366" "$NOTE" || { echo "TC_FAIL reflexion: missing primary citation"; exit 1; }
grep -q "axis1:" "$NOTE" || { echo "TC_FAIL reflexion: missing axis1 discussion"; exit 1; }
grep -q "axis2:" "$NOTE" || { echo "TC_FAIL reflexion: missing axis2 discussion"; exit 1; }
grep -qi "rippable" "$NOTE" || { echo "TC_FAIL reflexion: missing rippable signal"; exit 1; }

echo "TC_PASS reflexion: research note complete"
exit 0
