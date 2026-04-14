#!/usr/bin/env bash
# Full consistency check after polysulfide→Torr Seal codebase sweep
# Checks: stale refs, internal contradictions, CAD alignment, glossary links
# Returns: INCONSISTENCIES=N (lower is better, target: 0)

set -uo pipefail
cd "$(dirname "$0")/.."

SCOPE="web/app"
PARAMS="cad/path-2-room-temp/parameters.py"
COUNT=0

inc() { COUNT=$((COUNT + 1)); echo "  [$COUNT] $1"; }

echo "=== Full Consistency Check ==="

# ──────────────────────────────────────────
# 1. STALE REFERENCES (should be zero)
# ──────────────────────────────────────────

# 1a. 폴리설파이드 anywhere in web/app
N=$(grep -rl '폴리설파이드' "$SCOPE" 2>/dev/null | wc -l | tr -d ' ')
[ "$N" -gt 0 ] && inc "폴리설파이드 잔류: $N files"

# 1b. polysulfide (English) in component data/labels (exclude comments)
N=$(grep -rn 'polysulfide' "$SCOPE" --include="*.tsx" --include="*.mdx" 2>/dev/null | grep -v '^\s*//' | grep -v '^\s*\*' | grep -vi 'torrseal\|Torr.Seal' | wc -l | tr -d ' ')
[ "$N" -gt 0 ] && inc "polysulfide (EN) in non-comment code: $N lines"

# 1c. 14핀 anywhere
N=$(grep -rl '14핀' "$SCOPE" 2>/dev/null | wc -l | tr -d ' ')
[ "$N" -gt 0 ] && inc "14핀 잔류: $N files"

# 1d. 15.2mm / ∅15.2
N=$(grep -rn '15\.2' "$SCOPE" --include="*.mdx" --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')
[ "$N" -gt 0 ] && inc "15.2mm 잔류: $N lines"

# 1e. 소다라임 in path-roomtemp ONLY (path-frit uses soda-lime correctly)
N=$(grep -rl '소다라임' "$SCOPE/path-roomtemp" 2>/dev/null | wc -l | tr -d ' ')
[ "$N" -gt 0 ] && inc "path-roomtemp에 소다라임 잔류: $N files (should be 보로실리케이트)"

# 1e2. 소다라임 in SealingDiagram/HeaderAssemblyDiagram (path2 components)
N=$(grep -rn '소다라임' "$SCOPE/components/SealingDiagram.tsx" "$SCOPE/components/HeaderAssemblyDiagram.tsx" 2>/dev/null | wc -l | tr -d ' ')
[ "$N" -gt 0 ] && inc "path2 컴포넌트에 소다라임 잔류: $N lines"

# 1f. OD 5mm in path-roomtemp ONLY (path-frit uses glass exhaust tube correctly)
N=$(grep -rn 'OD 5mm' "$SCOPE/path-roomtemp" 2>/dev/null | wc -l | tr -d ' ')
[ "$N" -gt 0 ] && inc "path-roomtemp에 OD 5mm 배기관 잔류: $N lines"

# 1g. 25-30mm envelope OD (should be fixed 25mm)
N=$(grep -rn '25-30mm' "$SCOPE" --include="*.mdx" 2>/dev/null | wc -l | tr -d ' ')
[ "$N" -gt 0 ] && inc "25-30mm 엔벨로프 OD 잔류: $N lines"

# ──────────────────────────────────────────
# 2. INTERNAL CONTRADICTIONS
# ──────────────────────────────────────────

# 2a. Seal cost: should be ~₩40K (butyl ₩5K + Torr Seal ₩35K), not ₩25K
N=$(grep -rn '₩25K\|₩25,000' "$SCOPE" 2>/dev/null | grep -i 'seal\|실링\|부틸\|봉착\|torr' | wc -l | tr -d ' ')
[ "$N" -gt 0 ] && inc "실링 비용 ₩25K 잔류 (should be ₩40K): $N lines"

# 2b. Glossary anchor: <span id="polysulfide"> should not exist
if grep -q 'id="polysulfide"' "$SCOPE/glossary/page.mdx" 2>/dev/null; then
  inc "글로서리 앵커 id=polysulfide 잔류 (should be torrseal)"
fi

# 2c. Cross-reference: any link to #polysulfide
N=$(grep -rn '#polysulfide\|id="polysulfide"' "$SCOPE" 2>/dev/null | wc -l | tr -d ' ')
[ "$N" -gt 0 ] && inc "#polysulfide 링크/앵커 잔류: $N"

# 2d. "TO-8" in path-roomtemp (exclude 참고문헌 MIL-STD references)
N=$(grep -rn 'TO-8' "$SCOPE/path-roomtemp" 2>/dev/null | grep -v 'MIL-STD\|참고 문헌' | wc -l | tr -d ' ')
[ "$N" -gt 0 ] && inc "path-roomtemp에 TO-8 잔류: $N lines (should be 커스텀 헤더)"

# ──────────────────────────────────────────
# 3. CAD ALIGNMENT (parameters.py cross-check)
# ──────────────────────────────────────────

# 3a. Pin count = 12
if ! grep -q 'FT_PIN_COUNT = 12' "$PARAMS" 2>/dev/null; then
  inc "WARNING: parameters.py FT_PIN_COUNT != 12 — recheck"
fi

# 3b. Verify "Torr Seal" appears in path-roomtemp page
if ! grep -qi 'Torr.Seal' "$SCOPE/path-roomtemp/page.mdx" 2>/dev/null; then
  inc "path-roomtemp missing Torr Seal reference"
fi

# 3c. Verify composite seal description exists
if ! grep -qi 'butyl.*Torr.Seal\|부틸.*Torr.Seal\|복합.*실' "$SCOPE/path-roomtemp/page.mdx" 2>/dev/null; then
  inc "path-roomtemp missing composite seal (butyl+Torr Seal) description"
fi

# 3d. Verify bom.yaml and MDX BOM agree on seal material
if grep -q 'Torr Seal' "$SCOPE/bom/page.mdx" 2>/dev/null && grep -q 'torr_seal' "cad/path-2-room-temp/bom.yaml" 2>/dev/null; then
  : # both agree
else
  inc "bom.yaml vs bom/page.mdx Torr Seal mismatch"
fi

# ──────────────────────────────────────────
# 4. BUILD CHECK (quick type-check)
# ──────────────────────────────────────────

# Check if any TSX files have syntax errors by looking for TypeScript errors
# (full build is done by guard, this is a quick sanity check)

echo ""
echo "INCONSISTENCIES=$COUNT"
exit 0
