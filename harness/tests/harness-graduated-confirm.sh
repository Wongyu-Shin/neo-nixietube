#!/usr/bin/env bash
# TC for feature: harness-graduated-confirm
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTE="$ROOT/harness/research/harness-graduated-confirm.md"

[ -f "$NOTE" ] || { echo "TC_FAIL graduated-confirm: missing research note"; exit 1; }
grep -q "docs.openhands.dev" "$NOTE" \
    || { echo "TC_FAIL graduated-confirm: missing OpenHands security citation"; exit 1; }

# Must enumerate the three tiers.
for tier in "L0" "L1" "L2"; do
    grep -q "$tier" "$NOTE" \
        || { echo "TC_FAIL graduated-confirm: missing tier $tier"; exit 1; }
done

# Must list at least 5 concrete L2 action examples.
l2_count=0
for probe in "git push --force" "git reset --hard" "curl.*|.*sh" "chmod 777" "sudo" "rm" "npm publish\|pip upload\|gh release"; do
    grep -qE "$probe" "$NOTE" && l2_count=$((l2_count + 1))
done
[ "$l2_count" -ge 5 ] \
    || { echo "TC_FAIL graduated-confirm: need ≥5 L2 examples, got $l2_count"; exit 1; }

# Must be in-loop primary.
grep -qFi "in-loop (primary)" "$NOTE" \
    || { echo "TC_FAIL graduated-confirm: missing in-loop (primary) mapping"; exit 1; }

# Must tie to Article III (the HITL invariant).
grep -qi "Article III" "$NOTE" \
    || { echo "TC_FAIL graduated-confirm: missing Article III reference"; exit 1; }

# Must contrast with cc-hook-guardrail and harness-pause-resume.
grep -q "cc-hook-guardrail" "$NOTE" \
    || { echo "TC_FAIL graduated-confirm: missing cc-hook-guardrail contrast"; exit 1; }
grep -q "harness-pause-resume" "$NOTE" \
    || { echo "TC_FAIL graduated-confirm: missing harness-pause-resume contrast"; exit 1; }

# Must name the deterministic-classifier (not LLM judgment).
grep -qi "classifier\|classif" "$NOTE" \
    || { echo "TC_FAIL graduated-confirm: missing classifier concept"; exit 1; }
grep -qi "deterministic\|static rule\|not a model judgment" "$NOTE" \
    || { echo "TC_FAIL graduated-confirm: missing deterministic-classifier claim"; exit 1; }

echo "TC_PASS harness-graduated-confirm"
exit 0
