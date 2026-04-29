#!/usr/bin/env bash
# scripts/harness/load-constitution.sh — Phase 1 loader for the
# harness constitution.
#
# Implements harness/features/harness-constitution.md (axis1=inner,
# axis2=in-loop). Every loop's Phase 1 review must read CONSTITUTION.md
# *before* the loop's spec.md. This script is the canonical loader.
#
# Output (stdout): the full text of harness/CONSTITUTION.md prefixed
# with a banner that names the source and the freeze SHA so the agent
# can cite exact constitution wording in its decisions.
#
# Usage:
#   bash scripts/harness/load-constitution.sh           # full text
#   bash scripts/harness/load-constitution.sh --path    # just the path
#   bash scripts/harness/load-constitution.sh --sha     # just the SHA of HEAD's CONSTITUTION.md blob
#
# Exit 0 on success. Exit 1 if CONSTITUTION.md is missing — that is
# itself a project invariant violation (Article IX is self-referential;
# its own absence is unrecoverable).

set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DOC="$ROOT/harness/CONSTITUTION.md"

if [ ! -f "$DOC" ]; then
    echo "LOAD_CONSTITUTION_FAIL: $DOC missing — Article IX self-reference violation" >&2
    exit 1
fi

mode="${1:-full}"

case "$mode" in
    --path)
        echo "$DOC"
        ;;
    --sha)
        # Blob SHA of CONSTITUTION.md at HEAD (or working-tree if dirty).
        if git -C "$ROOT" rev-parse --git-dir >/dev/null 2>&1; then
            git -C "$ROOT" hash-object "$DOC"
        else
            shasum -a 1 "$DOC" | awk '{print $1}'
        fi
        ;;
    full|*)
        sha=$(git -C "$ROOT" hash-object "$DOC" 2>/dev/null || shasum -a 1 "$DOC" | awk '{print $1}')
        wc=$(awk 'END{print NR}' "$DOC")
        echo "═══ CONSTITUTION.md (sha=${sha:0:12}, ${wc} lines) ═══"
        echo "═══ Source: harness/CONSTITUTION.md — load via scripts/harness/load-constitution.sh ═══"
        echo
        cat "$DOC"
        echo
        echo "═══ End CONSTITUTION.md ═══"
        ;;
esac
