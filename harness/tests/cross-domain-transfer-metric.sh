#!/usr/bin/env bash
# TC for feature: cross-domain-transfer-metric
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTE="$ROOT/harness/research/cross-domain-transfer-metric.md"

[ -f "$NOTE" ] || { echo "TC_FAIL cross-domain-transfer: missing research note"; exit 1; }
grep -q "arxiv.org/abs/2603.19461" "$NOTE" \
    || { echo "TC_FAIL cross-domain-transfer: missing Zhang 2026 citation"; exit 1; }

# Must cite the Pan-Yang transfer-learning survey or an equivalent foundational reference.
grep -qE "doi\.org|TKDE|transfer learning|Pan.*Yang" "$NOTE" \
    || { echo "TC_FAIL cross-domain-transfer: missing foundational transfer-learning citation"; exit 1; }

# Must specify the train-on-A / evaluate-on-B / measure-delta protocol.
grep -qi "train.*domain A\|evolve on domain A\|held-out domain\|domain B" "$NOTE" \
    || { echo "TC_FAIL cross-domain-transfer: missing A/B protocol"; exit 1; }

# Must give this project at least one concrete A/B pair.
grep -qi "cad" "$NOTE" && grep -qi "sim\|paschen" "$NOTE" \
    || { echo "TC_FAIL cross-domain-transfer: missing project-specific A/B pair"; exit 1; }

# Must be post-loop primary.
grep -qi "post-loop" "$NOTE" \
    || { echo "TC_FAIL cross-domain-transfer: missing post-loop mapping"; exit 1; }

# Rippable probe must define a numerical agreement threshold.
grep -qE "within 5%|3 consecutive|agree within" "$NOTE" \
    || { echo "TC_FAIL cross-domain-transfer: rippable probe lacks agreement threshold"; exit 1; }

# Must contrast with llm-as-judge-audit and alignment-free to earn its place.
grep -qi "llm-as-judge" "$NOTE" \
    || { echo "TC_FAIL cross-domain-transfer: missing llm-as-judge contrast"; exit 1; }
grep -qi "alignment-free" "$NOTE" \
    || { echo "TC_FAIL cross-domain-transfer: missing alignment-free contrast"; exit 1; }

echo "TC_PASS cross-domain-transfer-metric"
exit 0
