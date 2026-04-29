#!/usr/bin/env bash
# scripts/harness/wiki-web-verify.sh — Web exposure auditor for the
# harness wiki layer (Article VII).
#
# Counts how many of the harness/wiki/*.md entries (excluding SCHEMA.md
# and _archive/) are exposed as static HTML under web/out/harness/wiki/
# after `npm run build` (Next.js output: 'export').
#
# Output (last line, machine-parseable): WIKI_WEB_MISSING=<int>
# Direction: lower-is-better. Floor: 0.
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WIKI_DIR="$ROOT/harness/wiki"
WEB_DIR="$ROOT/web"
OUT_DIR="$WEB_DIR/out/harness/wiki"

# Build the site (silent unless build fails).
if ! ( cd "$WEB_DIR" && npm run build > /tmp/wiki-web-build.log 2>&1 ); then
    echo "DETAIL build failed — see /tmp/wiki-web-build.log"
    tail -20 /tmp/wiki-web-build.log
    echo "WIKI_WEB_MISSING=999"
    exit 1
fi

# Enumerate wiki entries on disk (slug = filename without .md, exclude SCHEMA + _archive).
declare -a slugs=()
shopt -s nullglob
for f in "$WIKI_DIR"/*.md; do
    bn=$(basename "$f" .md)
    case "$bn" in
        SCHEMA|_*) continue ;;
    esac
    slugs+=("$bn")
done

expected=${#slugs[@]}
rendered=0
declare -a missing=()
for slug in "${slugs[@]}"; do
    if [ -f "$OUT_DIR/$slug/index.html" ]; then
        rendered=$((rendered+1))
    else
        missing+=("$slug")
    fi
done

# Index page must also list entry slugs (HTML must contain links to each).
index_html="$OUT_DIR/index.html"
declare -a index_unlinked=()
if [ -f "$index_html" ]; then
    for slug in "${slugs[@]}"; do
        if ! grep -q "/harness/wiki/$slug/" "$index_html"; then
            index_unlinked+=("$slug")
        fi
    done
else
    index_unlinked=("${slugs[@]}")
fi

missing_str="${missing[*]:-}"
unlinked_str="${index_unlinked[*]:-}"
echo "DETAIL expected=$expected rendered=$rendered missing=(${missing_str:-none}) index_unlinked=(${unlinked_str:-none})"

# Composite metric: union of two failure sets. Each unique slug counts once.
unique_problems=$(printf '%s\n' $missing_str $unlinked_str | sort -u | grep -v '^$' | wc -l | tr -d ' ')
echo "WIKI_WEB_MISSING=$unique_problems"
