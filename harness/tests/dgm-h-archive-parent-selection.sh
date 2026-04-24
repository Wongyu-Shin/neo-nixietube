#!/usr/bin/env bash
# TC for feature: dgm-h-archive-parent-selection
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTE="$ROOT/harness/research/dgm-h-archive-parent-selection.md"

[ -f "$NOTE" ] || { echo "TC_FAIL dgm-h-archive: missing research note"; exit 1; }
grep -q "arxiv.org/abs/2603.19461" "$NOTE" \
    || { echo "TC_FAIL dgm-h-archive: missing Zhang 2026 citation"; exit 1; }
grep -q "facebookresearch/Hyperagents" "$NOTE" \
    || { echo "TC_FAIL dgm-h-archive: missing facebookresearch repo citation"; exit 1; }

# Must reference the concrete file select_next_parent.py from the repo.
grep -qi "select_next_parent" "$NOTE" \
    || { echo "TC_FAIL dgm-h-archive: missing select_next_parent.py reference"; exit 1; }

# The dual-weight rule MUST be spelled out — that's the specific
# mechanism this feature catalogues.
grep -qi "proportional to.*performance" "$NOTE" \
    || { echo "TC_FAIL dgm-h-archive: missing performance-weighted rule"; exit 1; }
grep -qi "inversely proportional\|1 / #.*children\|1/compiled\|/ (1 + #" "$NOTE" \
    || { echo "TC_FAIL dgm-h-archive: missing inverse-children-count rule"; exit 1; }

# Must contrast with voyager-skill-library so catalog readers see why
# this is a separate entry, not a duplicate.
grep -qi "voyager" "$NOTE" \
    || { echo "TC_FAIL dgm-h-archive: missing voyager contrast"; exit 1; }

# Must cite DGM as the predecessor.
grep -qi "DGM\|Darwin Gödel\|Darwin Godel" "$NOTE" \
    || { echo "TC_FAIL dgm-h-archive: missing DGM predecessor"; exit 1; }

# Must link to open-ended exploration / stepping-stones theory.
grep -qi "stepping stone\|stepping-stone\|MAP-Elites\|Quality-Diversity\|open-ended" "$NOTE" \
    || { echo "TC_FAIL dgm-h-archive: missing open-ended exploration theory link"; exit 1; }

# Rippable probe must define a concrete fixture + thresholds.
grep -qE "N=20|5 seeds|15%|fixture Goal|two.*optima" "$NOTE" \
    || { echo "TC_FAIL dgm-h-archive: rippable probe lacks concrete fixture/threshold"; exit 1; }

echo "TC_PASS dgm-h-archive-parent-selection"
exit 0
