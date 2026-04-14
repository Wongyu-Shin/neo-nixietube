#!/usr/bin/env bash
# Guard: interactive visualization count >= baseline AND next build passes
# Exit 0 = guard passes, Exit 1 = guard fails

set -euo pipefail
cd "$(dirname "$0")/.."

MDX="web/app/path-roomtemp/page.mdx"
BASELINE_VIZ=14  # current interactive component import count

echo "=== Guard: Visualization Count ==="

# Count unique component imports (excluding StickyProcessNav sub-exports)
VIZ_COUNT=$(grep -c '^import ' "$MDX" 2>/dev/null || echo 0)

echo "Interactive components: $VIZ_COUNT (baseline: $BASELINE_VIZ)"

if [ "$VIZ_COUNT" -lt "$BASELINE_VIZ" ]; then
  echo "FAIL: visualization count dropped ($VIZ_COUNT < $BASELINE_VIZ)"
  exit 1
fi

echo "PASS: visualization count OK ($VIZ_COUNT >= $BASELINE_VIZ)"

echo ""
echo "=== Guard: Next.js Build ==="
cd web
# Type check only (faster than full build, catches TSX errors)
npx next build 2>&1 | tail -5
BUILD_EXIT=${PIPESTATUS[0]}

if [ "$BUILD_EXIT" -ne 0 ]; then
  echo "FAIL: next build failed (exit $BUILD_EXIT)"
  exit 1
fi

echo "PASS: build OK"
exit 0
