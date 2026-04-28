#!/usr/bin/env bash
# scripts/harness/component-translate-guard.sh — regression guard for the
# harness TSX component translation loop.
#
# Three checks:
#   G1 build       — `cd web && npm run build` succeeds.
#   G2 imports     — every component's import lines and the 5 MDX pages'
#                     import lines are byte-identical to source-en/.
#   G3 jsx_struct  — for each component, export name, props identifier set,
#                     and useState/useEffect count are unchanged vs source-en.
#                     Catches translations that accidentally rename a hook,
#                     change props names, or break component identity.
#
# Exits 0 if all pass; non-zero on failure with diagnostic.

set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WEB="$ROOT/web"
COMP_DIR="$WEB/app/components/harness"
APP_DIR="$WEB/app"
LOOP_DIR="$ROOT/loops/docs-loop-translate-comp"
SOURCE_DIR="$LOOP_DIR/source-en"
SOURCE_MDX_DIR="$ROOT/loops/docs-loop-translate/source-en"  # reuse prev loop's MDX freeze

PAGES=(overview constitution flow wiki catalog)
fail=0

# --- G1 build ---
echo "=== G1 build ==="
if ( cd "$WEB" && npm run build > /tmp/component-translate-guard-build.log 2>&1 ); then
    echo "G1=PASS build"
else
    echo "G1=FAIL build — see /tmp/component-translate-guard-build.log" >&2
    tail -30 /tmp/component-translate-guard-build.log >&2
    fail=$((fail+1))
fi

# --- G2 imports (components + MDX pages) ---
echo "=== G2 imports ==="
g2_fail=0
# 2a. Component import lines
for f in "$COMP_DIR"/*.tsx; do
    bn=$(basename "$f")
    src="$SOURCE_DIR/$bn"
    [ -f "$src" ] || { echo "  $bn: source-en missing — re-bootstrap" >&2; g2_fail=$((g2_fail+1)); continue; }
    cur_imports=$(grep -E "^import " "$f" | sort)
    src_imports=$(grep -E "^import " "$src" | sort)
    if [ "$cur_imports" != "$src_imports" ]; then
        echo "  component $bn: imports DIVERGED" >&2
        diff <(printf '%s\n' "$src_imports") <(printf '%s\n' "$cur_imports") >&2 || true
        g2_fail=$((g2_fail+1))
    fi
done
# 2b. MDX page imports vs prev loop's frozen baseline
for slug in "${PAGES[@]}"; do
    cur="$APP_DIR/harness/page.mdx"
    [ "$slug" != "overview" ] && cur="$APP_DIR/harness/$slug/page.mdx"
    src="$SOURCE_MDX_DIR/$slug.mdx"
    [ -f "$src" ] && [ -f "$cur" ] || continue
    cur_imports=$(grep -E "^import " "$cur" | sort)
    src_imports=$(grep -E "^import " "$src" | sort)
    if [ "$cur_imports" != "$src_imports" ]; then
        echo "  mdx $slug: imports DIVERGED" >&2
        g2_fail=$((g2_fail+1))
    fi
done
if [ "$g2_fail" -eq 0 ]; then
    echo "G2=PASS imports (34 components + 5 mdx)"
else
    echo "G2=FAIL imports ($g2_fail divergence)" >&2
    fail=$((fail+1))
fi

# --- G3 JSX structure (export, props, hook count) ---
echo "=== G3 jsx_struct ==="
sig() {
    local f="$1"
    # export default: name token after 'export default function NAME' or 'export default NAME'
    local exp=$(grep -oE "export default function [A-Za-z0-9_]+|export default [A-Za-z0-9_]+" "$f" | head -1)
    # props identifier signature: anything after `= (` or `function NAME(` until `)`, normalized
    local props=$(grep -oE "function [A-Za-z0-9_]+\([^)]*\)|=\s*\([^)]*\)\s*=>" "$f" | head -1 | tr -d ' ')
    # hook counts (inclusive of imports)
    local us=$(grep -cE "useState\b" "$f")
    local ue=$(grep -cE "useEffect\b" "$f")
    local um=$(grep -cE "useMemo\b" "$f")
    local uc=$(grep -cE "useCallback\b" "$f")
    echo "exp=$exp|props=$props|useState=$us|useEffect=$ue|useMemo=$um|useCallback=$uc"
}
g3_fail=0
for f in "$COMP_DIR"/*.tsx; do
    bn=$(basename "$f")
    src="$SOURCE_DIR/$bn"
    [ -f "$src" ] || continue
    cur_sig=$(sig "$f")
    src_sig=$(sig "$src")
    if [ "$cur_sig" != "$src_sig" ]; then
        echo "  $bn: JSX struct DIVERGED" >&2
        echo "    src: $src_sig" >&2
        echo "    cur: $cur_sig" >&2
        g3_fail=$((g3_fail+1))
    fi
done
if [ "$g3_fail" -eq 0 ]; then
    echo "G3=PASS jsx_struct (export + props + hook counts intact across 34 components)"
else
    echo "G3=FAIL jsx_struct ($g3_fail divergence)" >&2
    fail=$((fail+1))
fi

echo "==="
if [ "$fail" -eq 0 ]; then
    echo "GUARD=PASS"
    exit 0
else
    echo "GUARD=FAIL ($fail/3 checks failed)"
    exit 1
fi
