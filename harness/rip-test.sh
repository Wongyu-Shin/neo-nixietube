#!/usr/bin/env bash
# harness/rip-test.sh — Ripple/absorb tester for catalog features.
#
# Implements harness/features/harness-rip-test.md (axis1=inner,
# axis2=post-loop). Article II "absorbability" — every feature must
# have a rippable_check that names a concrete experiment to determine
# whether the feature has been absorbed by the underlying platform
# (Claude Code, the OS, etc).
#
# This script is the runner. It walks harness/features/*.md, extracts
# each entry's `rippable_check:` field from the frontmatter, and prints
# the check text alongside the feature slug for the operator to execute
# manually (most checks involve installing CC versions, comparing output,
# or running benchmarks — too varied to automate uniformly).
#
# Subcommands:
#   list                        — list all features + their rippable_check
#   show <slug>                 — print one feature's full check text
#   batch <slug-list>           — parallel-friendly batch shell of the above
#   check                       — sanity: every feature has a non-empty rippable_check (used by crosscheck)
#
# Output (subcommand 'check'):
#   RIPPABLE_CHECK_PRESENT=N/M
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FEATURES="$ROOT/harness/features"

PY=/opt/homebrew/Caskroom/miniforge/base/bin/python
[ -x "$PY" ] || PY=$(command -v python3)

extract_field() {
    # extract a YAML scalar/multiline value from a feature.md frontmatter
    local file="$1" key="$2"
    "$PY" - "$file" "$key" <<'PY'
import sys, re, pathlib
p, key = sys.argv[1], sys.argv[2]
text = pathlib.Path(p).read_text(encoding='utf-8')
m = re.match(r'^---\n(.*?)\n---\n', text, re.DOTALL)
if not m: sys.exit(0)
fm = m.group(1)
# match "key: value" or 'key: "value with quotes"'
mm = re.search(rf'^{re.escape(key)}:\s*"?(.+?)"?\s*$', fm, re.MULTILINE)
if mm:
    print(mm.group(1).strip())
PY
}

usage() {
    cat <<EOF >&2
usage: rip-test.sh <list|show|batch|check> [args...]
  list                        list all features + rippable_check
  show <slug>                 print one feature's rippable_check
  batch <slug> [<slug>...]    print check text for each (newline-separated)
  check                       sanity audit: every feature has a non-empty
                              rippable_check (used by crosscheck)
EOF
    exit 64
}

[ $# -lt 1 ] && usage
sub="$1"; shift

case "$sub" in
    list)
        for f in "$FEATURES"/*.md; do
            slug=$(basename "$f" .md)
            chk=$(extract_field "$f" rippable_check)
            short="${chk:0:120}"
            [ "${#chk}" -gt 120 ] && short="$short..."
            printf "%-40s %s\n" "$slug" "$short"
        done
        ;;

    show)
        [ $# -lt 1 ] && usage
        slug="$1"
        f="$FEATURES/$slug.md"
        [ -f "$f" ] || { echo "rip-test: unknown slug: $slug" >&2; exit 1; }
        echo "Feature: $slug"
        echo "Rippable check:"
        extract_field "$f" rippable_check
        ;;

    batch)
        [ $# -lt 1 ] && usage
        for slug in "$@"; do
            f="$FEATURES/$slug.md"
            [ -f "$f" ] || { echo "rip-test: unknown slug: $slug" >&2; continue; }
            echo "═══ $slug ═══"
            extract_field "$f" rippable_check
            echo
        done
        ;;

    check)
        total=0; present=0
        for f in "$FEATURES"/*.md; do
            total=$((total+1))
            chk=$(extract_field "$f" rippable_check)
            if [ -n "$chk" ]; then present=$((present+1)); else
                echo "MISSING rippable_check: $(basename "$f" .md)" >&2
            fi
        done
        echo "RIPPABLE_CHECK_PRESENT=$present/$total"
        [ "$present" -eq "$total" ]
        ;;

    *)
        usage
        ;;
esac
