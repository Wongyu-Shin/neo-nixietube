#!/usr/bin/env bash
# harness/guard.sh — Catalog schema validator
#
# Exits 0 iff every harness/features/*.md has a valid frontmatter block
# per harness/SCHEMA.md. Empty catalog is valid (exit 0).
#
# Used as the autoresearch Guard: any iteration that leaves a malformed
# or incomplete feature entry is discarded.

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FEATURES_DIR="$PROJECT_ROOT/harness/features"

REQUIRED_FIELDS=(name axis1 axis2 applicability tc_script rippable_check sources)
AXIS1_VALUES_RE='^(inner|outer)$'
AXIS2_VALUES_RE='^(pre-loop|in-loop|post-loop)$'

fail=0
total=0

if [ ! -d "$FEATURES_DIR" ]; then
    echo "GUARD=OK reason=no-features-dir"
    exit 0
fi

shopt -s nullglob
for f in "$FEATURES_DIR"/*.md; do
    total=$((total + 1))
    name=$(basename "$f" .md)

    # Extract frontmatter (between first two --- lines).
    fm=$(awk '/^---$/{c++; next} c==1{print} c==2{exit}' "$f")

    if [ -z "$fm" ]; then
        echo "GUARD_FAIL $name reason=missing-frontmatter"
        fail=$((fail + 1))
        continue
    fi

    # Required top-level keys (allow nested block for applicability).
    for field in "${REQUIRED_FIELDS[@]}"; do
        if ! printf '%s\n' "$fm" | grep -qE "^${field}:"; then
            echo "GUARD_FAIL $name reason=missing-field:${field}"
            fail=$((fail + 1))
            continue 2
        fi
    done

    # Enum validation for axis1 / axis2.
    axis1=$(printf '%s\n' "$fm" | awk -F': *' '/^axis1:/{print $2; exit}' | tr -d '"'\''' )
    axis2=$(printf '%s\n' "$fm" | awk -F': *' '/^axis2:/{print $2; exit}' | tr -d '"'\''' )
    if ! [[ "$axis1" =~ $AXIS1_VALUES_RE ]]; then
        echo "GUARD_FAIL $name reason=bad-axis1:${axis1}"
        fail=$((fail + 1))
        continue
    fi
    if ! [[ "$axis2" =~ $AXIS2_VALUES_RE ]]; then
        echo "GUARD_FAIL $name reason=bad-axis2:${axis2}"
        fail=$((fail + 1))
        continue
    fi

    # applicability block must contain claude_code and models subkeys.
    if ! printf '%s\n' "$fm" | grep -qE '^[[:space:]]+claude_code:'; then
        echo "GUARD_FAIL $name reason=missing-applicability.claude_code"
        fail=$((fail + 1))
        continue
    fi
    if ! printf '%s\n' "$fm" | grep -qE '^[[:space:]]+models:'; then
        echo "GUARD_FAIL $name reason=missing-applicability.models"
        fail=$((fail + 1))
        continue
    fi

    # sources must be non-empty list.
    if printf '%s\n' "$fm" | awk '/^sources:/{getline l; if(l ~ /^[[:space:]]*-/){found=1}} END{exit !found}'; then
        :
    else
        # Also accept inline list: sources: [a, b]
        if ! printf '%s\n' "$fm" | grep -qE '^sources:[[:space:]]*\[[^]]+\]'; then
            echo "GUARD_FAIL $name reason=empty-sources"
            fail=$((fail + 1))
            continue
        fi
    fi

    # tc_script path must exist.
    tc=$(printf '%s\n' "$fm" | awk -F': *' '/^tc_script:/{print $2; exit}' | tr -d '"'\''' )
    if [ ! -f "$PROJECT_ROOT/$tc" ]; then
        echo "GUARD_FAIL $name reason=missing-tc:${tc}"
        fail=$((fail + 1))
        continue
    fi

    echo "GUARD_OK $name"
done

echo "GUARD_SUMMARY total=$total fail=$fail"
[ "$fail" -eq 0 ]
