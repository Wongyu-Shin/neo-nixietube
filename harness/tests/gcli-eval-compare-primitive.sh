#!/usr/bin/env bash
# TC for feature: gcli-eval-compare-primitive
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NOTE="$ROOT/harness/research/gcli-eval-compare-primitive.md"

[ -f "$NOTE" ] || { echo "TC_FAIL gcli-eval-compare: missing research note"; exit 1; }
grep -q "github.com/google/agents-cli" "$NOTE" \
    || { echo "TC_FAIL gcli-eval-compare: missing google/agents-cli citation"; exit 1; }

# Must distinguish eval run vs eval compare commands.
grep -qi "eval compare" "$NOTE" && grep -qi "eval run" "$NOTE" \
    || { echo "TC_FAIL gcli-eval-compare: missing both eval run AND eval compare commands"; exit 1; }

# Must post-loop primary.
grep -qi "post-loop" "$NOTE" \
    || { echo "TC_FAIL gcli-eval-compare: missing post-loop mapping"; exit 1; }

# Must differentiate from every comparable existing feature.
for f in statistical-tc-runner noise-aware-ratchet harness-rip-test llm-as-judge-audit cross-domain-transfer-metric; do
    grep -q "$f" "$NOTE" \
        || { echo "TC_FAIL gcli-eval-compare: missing distinction from $f"; exit 1; }
done

# Must cite Welch foundation (shared with statistical-tc-runner — so the
# reader can see the two are related but distinct).
grep -q "doi.org/10.1093/biomet/34" "$NOTE" \
    || { echo "TC_FAIL gcli-eval-compare: missing Welch foundational citation"; exit 1; }

# Must specify paired / effect-size semantics.
grep -qi "paired\|effect size\|bootstrap CI" "$NOTE" \
    || { echo "TC_FAIL gcli-eval-compare: missing paired/effect-size semantics"; exit 1; }

# Rippable probe must specify ≤5% agreement and concrete snapshot pair.
grep -qE "within 5%|effect size within|paired report" "$NOTE" \
    || { echo "TC_FAIL gcli-eval-compare: rippable probe lacks agreement threshold"; exit 1; }

echo "TC_PASS gcli-eval-compare-primitive"
exit 0
