#!/usr/bin/env bash
# TC for feature: swe-agent-aci
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTE="$ROOT/harness/research/swe-agent-aci.md"

[ -f "$NOTE" ] || { echo "TC_FAIL swe-agent-aci: missing research note"; exit 1; }
grep -q "arxiv.org/abs/2405.15793" "$NOTE" || { echo "TC_FAIL swe-agent-aci: missing primary citation"; exit 1; }
grep -qi "agent-computer interface\|ACI" "$NOTE" || { echo "TC_FAIL swe-agent-aci: missing ACI discussion"; exit 1; }
grep -qi "settings.json\|hook\|permission" "$NOTE" || { echo "TC_FAIL swe-agent-aci: missing inner-harness anchor"; exit 1; }
grep -q "rippable\|differential\|10%" "$NOTE" || { echo "TC_FAIL swe-agent-aci: missing quantitative rip signal"; exit 1; }

echo "TC_PASS swe-agent-aci"
exit 0
