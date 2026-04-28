#!/usr/bin/env bash
# scripts/harness/component-residue.sh — mechanical English-phrase residue counter
# for harness component TSX files.
#
# Counts user-facing English phrases (multi-word English in string literals or
# JSX text) that still need to be translated to Korean.
#
# Filters out:
#   - import / export lines
#   - className="..." attribute values
#   - path-like strings ('/...', file extensions)
#
# Usage:
#   bash scripts/harness/component-residue.sh           — total across all components
#   bash scripts/harness/component-residue.sh --per-file — per-file breakdown + total

set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DIR="$ROOT/web/app/components/harness"

count_eng_phrases() {
    local file="$1"
    sed -E 's/className="[^"]*"//g; s/className=\{[^}]*\}//g' "$file" \
      | grep -v '^import ' \
      | grep -v '^export ' \
      | grep -oE "\"[^\"]+\"|'[^']+'" \
      | grep -E "[A-Za-z][a-z]{2,}[ ][A-Za-z][a-z]{2,}" \
      | grep -vE "^['\"][/]" \
      | grep -vE "\.(md|sh|tsx|ts|js|json|mdx|css|html)['\"]" \
      | wc -l | tr -d ' '
}

mode="${1:-total}"
total=0

if [ "$mode" = "--per-file" ]; then
    for f in "$DIR"/*.tsx; do
        n=$(count_eng_phrases "$f")
        total=$((total+n))
        printf "%-45s %s\n" "$(basename "$f")" "$n"
    done | sort -k2 -rn
    # recompute total (since the loop ran in subshell)
    total=0
    for f in "$DIR"/*.tsx; do
        n=$(count_eng_phrases "$f")
        total=$((total+n))
    done
fi

# Always emit total at end
total=0
for f in "$DIR"/*.tsx; do
    n=$(count_eng_phrases "$f")
    total=$((total+n))
done
echo "RESIDUE=$total"
exit 0
