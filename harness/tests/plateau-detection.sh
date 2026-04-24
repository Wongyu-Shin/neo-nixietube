#!/usr/bin/env bash
# TC for feature: plateau-detection
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTE="$ROOT/harness/research/plateau-detection.md"

[ -f "$NOTE" ] || { echo "TC_FAIL plateau-detection: missing research note"; exit 1; }
grep -q "prechelt" "$NOTE" 2>/dev/null \
    || grep -qi "prechelt" "$NOTE" \
    || { echo "TC_FAIL plateau-detection: missing Prechelt early-stopping citation"; exit 1; }
grep -qi "in-loop" "$NOTE" || { echo "TC_FAIL plateau-detection: missing in-loop mapping"; exit 1; }
grep -qi "outer" "$NOTE" || { echo "TC_FAIL plateau-detection: missing outer-harness anchor"; exit 1; }

# The whole point: noise-aware. A plain "N discards in a row" criterion
# is what the base autoresearch SKILL already provides. This feature MUST
# justify itself against that baseline.
grep -qi "noise" "$NOTE" || { echo "TC_FAIL plateau-detection: missing noise-awareness discussion"; exit 1; }

# Must enumerate multiple detectors (at least 2) — combining them is the
# whole reason this feature exists beyond the CC default.
detector_count=0
grep -qi "patience" "$NOTE" && detector_count=$((detector_count + 1))
grep -qi "trend\|slope\|regression" "$NOTE" && detector_count=$((detector_count + 1))
grep -qi "GL\|generalization-loss\|gl_alpha" "$NOTE" && detector_count=$((detector_count + 1))
[ "$detector_count" -ge 2 ] || { echo "TC_FAIL plateau-detection: need ≥2 detectors enumerated, got $detector_count"; exit 1; }

# Rippable signal must be quantitative.
grep -qi "K-L divergence\|p >\|σ\|sigma\|noise floor\|within ±" "$NOTE" \
    || { echo "TC_FAIL plateau-detection: rippable signal not quantitative"; exit 1; }

echo "TC_PASS plateau-detection"
exit 0
