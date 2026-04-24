#!/usr/bin/env bash
# TC for feature: noise-aware-ratchet
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTE="$ROOT/harness/research/noise-aware-ratchet.md"

[ -f "$NOTE" ] || { echo "TC_FAIL noise-aware-ratchet: missing research note"; exit 1; }

# The three rules MUST all be present — if any one is missing the
# feature is unsafe to deploy.
grep -qi "best-ever\|monotonic\|ratchet_MAX" "$NOTE" \
    || { echo "TC_FAIL noise-aware-ratchet: rule 1 (best-ever anchor) missing"; exit 1; }
grep -qi "re-measure\|re-run verify\|resample" "$NOTE" \
    || { echo "TC_FAIL noise-aware-ratchet: rule 2 (re-measure anchor) missing"; exit 1; }
grep -qi "noise floor\|sigma\|σ\|margin" "$NOTE" \
    || { echo "TC_FAIL noise-aware-ratchet: rule 3 (beat by >σ) missing"; exit 1; }

# Must cite at least one external source.
grep -qE "arxiv\.org|doi\.org" "$NOTE" \
    || { echo "TC_FAIL noise-aware-ratchet: missing external citation"; exit 1; }

# Must distinguish itself from plateau-detection.
grep -qi "plateau" "$NOTE" \
    || { echo "TC_FAIL noise-aware-ratchet: missing contrast with plateau-detection"; exit 1; }

# Rippable probe must be quantitative.
grep -qi "within ±\|N=20\|σ_true\|15%" "$NOTE" \
    || { echo "TC_FAIL noise-aware-ratchet: rippable probe not quantitative"; exit 1; }

echo "TC_PASS noise-aware-ratchet"
exit 0
