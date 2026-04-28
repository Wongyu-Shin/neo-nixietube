#!/usr/bin/env bash
# scripts/harness/component-translate-verify.sh — orchestrator for the
# harness TSX component English → Korean translation loop.
#
# Metric: PROGRESS = (1 − residue / baseline) × 100, higher_is_better.
# Deterministic, no LLM noise. Anchor stickiness from prev loop avoided
# by design.
#
# Files:
#   loops/docs-loop-translate-comp/baseline-residue.txt
#                                  — frozen at first run, never overwritten
#   loops/docs-loop-translate-comp/source-en/<comp>.tsx
#                                  — frozen English source per component
#                                    (fidelity reference for optional GAN)
#
# Flags:
#   --bootstrap     freeze baseline residue + per-component English source
#                   and exit 0 (PROGRESS=0.0)
#   --gan           in addition to residue, run page-translate-verify on
#                   the 5 MDX pages (uses existing scripts/harness/page-
#                   translate-verify.sh) to confirm page-level quality.
#                   Slow (~25 min). Use only on final iter.
#
# Output (last line, parsed by autoresearch):
#   PROGRESS=NN.N

set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
COMP_DIR="$ROOT/web/app/components/harness"
LOOP_DIR="$ROOT/loops/docs-loop-translate-comp"
SOURCE_DIR="$LOOP_DIR/source-en"
BASELINE_FILE="$LOOP_DIR/baseline-residue.txt"
mkdir -p "$LOOP_DIR" "$SOURCE_DIR"

MODE=run
GAN=0
for arg in "$@"; do
    case "$arg" in
        --bootstrap) MODE=bootstrap ;;
        --gan)       GAN=1 ;;
        *) echo "unknown arg: $arg" >&2; exit 2 ;;
    esac
done

current_residue() {
    bash "$ROOT/scripts/harness/component-residue.sh" 2>/dev/null \
      | grep -oE 'RESIDUE=[0-9]+' | tail -1 | cut -d= -f2
}

# --- Bootstrap: freeze baseline + source ---
if [ "$MODE" = "bootstrap" ]; then
    if [ -f "$BASELINE_FILE" ]; then
        echo "Baseline already frozen: $(cat "$BASELINE_FILE")"
    else
        b=$(current_residue)
        echo "$b" > "$BASELINE_FILE"
        echo "BASELINE residue frozen: $b"
    fi
    n=0
    for f in "$COMP_DIR"/*.tsx; do
        bn=$(basename "$f")
        dst="$SOURCE_DIR/$bn"
        if [ ! -f "$dst" ]; then
            cp "$f" "$dst"
            n=$((n+1))
        fi
    done
    echo "BOOTSTRAP DONE. Froze $n source-en/ files (already-frozen skipped)."
    echo "PROGRESS=0.0"
    exit 0
fi

# Sanity
[ -f "$BASELINE_FILE" ] || { echo "ERROR: $BASELINE_FILE missing — run --bootstrap first" >&2; exit 2; }
baseline=$(cat "$BASELINE_FILE")
[ "$baseline" -gt 0 ] || { echo "ERROR: baseline=$baseline (must be >0)" >&2; exit 2; }

current=$(current_residue)
progress=$(awk -v b="$baseline" -v c="$current" 'BEGIN{printf "%.1f", (1 - c/b) * 100}')

echo "RESIDUE current=$current baseline=$baseline"
echo "PROGRESS=$progress"

# --- Optional: page-level GAN re-verify (confirmation only, doesn't gate) ---
if [ "$GAN" = "1" ]; then
    echo "=== Optional GAN re-verify (5 pages) ==="
    if [ -x "$ROOT/scripts/harness/translation-verify.sh" ]; then
        bash "$ROOT/scripts/harness/translation-verify.sh" 2>&1 | tail -10
    else
        echo "translation-verify.sh missing — skip GAN" >&2
    fi
fi

# Emit PROGRESS again as the LAST line (autoresearch parses last line)
echo "PROGRESS=$progress"
exit 0
