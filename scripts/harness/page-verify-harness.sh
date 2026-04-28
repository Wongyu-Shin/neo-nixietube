#!/usr/bin/env bash
# scripts/harness/page-verify-harness.sh <slug> — GAN page verifier for harness pages.
#
# Adapted from scripts/page-verify.sh with these changes:
#   - takes <slug> arg (overview/constitution/flow/wiki/catalog)
#   - bundles harness/CONSTITUTION.md + harness/UX.md instead of cad/ assets
#   - 6 criteria reframed for harness docs:
#       C1 doc_structure        — section flow, H1/H2 hierarchy
#       C2 component_density    — count of unique components + their semantic fit
#       C3 interactive_quality  — gold-tier components per NixieDiagram benchmark
#       C4 charter_alignment    — citations to Articles I-IX + UX.md sections
#       C5 cross_links          — hrefs to companion pages, feature slugs
#       C6 reader_path          — entry point clarity, "where to next" navigation
#   - persists anchor at loops/docs-loop-v2/prev-scores-<slug>.txt
#   - emits JUDGE_OUT to loops/docs-loop-v2/gan-<slug>.txt
#
# Usage: bash scripts/harness/page-verify-harness.sh <slug>
# Exits 0; final stdout line = SUM (max 60).

set -uo pipefail
SLUG="${1:?Usage: page-verify-harness.sh <slug>}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WEB="$ROOT/web/app"
LOOP_DIR="$ROOT/loops/docs-loop-v2"
mkdir -p "$LOOP_DIR"

case "$SLUG" in
    overview)     PAGE="$WEB/harness/page.mdx" ;;
    constitution) PAGE="$WEB/harness/constitution/page.mdx" ;;
    flow)         PAGE="$WEB/harness/flow/page.mdx" ;;
    wiki)         PAGE="$WEB/harness/wiki/page.mdx" ;;
    catalog)      PAGE="$WEB/harness/catalog/page.mdx" ;;
    *) echo "invalid slug $SLUG"; exit 2 ;;
esac
[ -f "$PAGE" ] || { echo "page missing: $PAGE"; exit 2; }

WORK=$(mktemp -d -t harnessverify.XXXXXX)
trap "rm -rf '$WORK'" EXIT

BUNDLE="$WORK/bundle.txt"
{
    echo "### PROJECT CONTEXT"
    echo "Harness docs page '$SLUG' — interactive Next.js MDX page"
    echo "describing the agent harness charter (28 features + 9 Articles)."
    echo "Density target: 15+ unique components per page."
    echo "Interactive component quality target: at least 1 gold-tier"
    echo "(≥400 lines, ≥2 useState, ≥10 SVG primitives — per NixieDiagram benchmark)."
    echo
    echo "### EVALUATION RUBRIC (0-10)"
    echo "0 = critical defect (broken layout, unreadable)"
    echo "3 = barely functional"
    echo "5 = average (works but unremarkable)"
    echo "7 = strong (clean, consistent, well-cited)"
    echo "9 = exceptional (publication-quality technical doc)"
    echo "10 = theoretical max"
    echo
    echo "### 6 CRITERIA"
    echo "C1 doc_structure       — H1/H2 hierarchy, section flow, no orphan content"
    echo "C2 component_density   — ≥15 unique components, each semantically fitting"
    echo "C3 interactive_quality — ≥1 gold-tier component (NixieDiagram-level richness)"
    echo "C4 charter_alignment   — explicit citations to Articles I–IX and UX.md sections"
    echo "C5 cross_links         — hrefs to /harness/{constitution,flow,wiki,catalog} where appropriate"
    echo "C6 reader_path         — entry hook + 'where to go next' navigation"
    echo
    echo "### TARGET PAGE: $SLUG"
    echo "----- $PAGE -----"
    cat "$PAGE"
    echo
    echo "### CHARTER REFERENCES (for grading C4)"
    echo "----- harness/CONSTITUTION.md (excerpt) -----"
    head -80 "$ROOT/harness/CONSTITUTION.md"
    echo
    echo "----- harness/UX.md (toc) -----"
    grep -E '^#+' "$ROOT/harness/UX.md" | head -30
    echo
    echo "### COMPONENT FILES IMPORTED"
    grep -oE "from '[^']*components/harness/[A-Za-z0-9]+'" "$PAGE" | sed -E "s#.*components/harness/([A-Za-z0-9]+).*#\1#" | sort -u | while read c; do
        f="$ROOT/web/app/components/harness/$c.tsx"
        [ -f "$f" ] || continue
        lines=$(wc -l < "$f" | tr -d ' ')
        states=$(grep -c "useState\|useReducer" "$f")
        svgs=$(grep -cE '<(path|circle|rect|line|g|defs|gradient|filter|polygon|polyline|ellipse|text)' "$f")
        printf "  %s — %d lines, %d states, %d svg primitives\n" "$c" "$lines" "$states" "$svgs"
    done
} > "$BUNDLE"
BUNDLE_CONTENT=$(cat "$BUNDLE")

# --- Stage 1: Defender ---
DEFENDER_OUT="$WORK/defender.txt"
claude --print --model claude-sonnet-4-6 --dangerously-skip-permissions <<PROMPT > "$DEFENDER_OUT" 2>/dev/null || echo "(defender claude -p failed)" > "$DEFENDER_OUT"
You are the DEFENDER for harness docs page '$SLUG'. Justify the page on each
of the 6 criteria, 80 words max per criterion, citing concrete components
and section content. Do not score; only defend.

$BUNDLE_CONTENT
PROMPT

# --- Stage 2: 4 critics in parallel ---
RED_DIR="$WORK/red"
mkdir -p "$RED_DIR"
red_team() {
    local persona="$1" criteria="$2" outfile="$3"
    claude --print --model claude-sonnet-4-6 --dangerously-skip-permissions > "$outfile" 2>/dev/null <<PROMPT || echo "(red team $persona claude -p failed)" > "$outfile"
You are a RED TEAM critic — $persona. Attack page '$SLUG' on: $criteria.
For each criterion: 1) name single most damaging flaw 2) classify
CRITICAL (0-3) / MINOR (3-5) / COSMETIC (5-7) / NONE (7+) 3) cite
exact code/component proving it. Be ruthless but honest.

$BUNDLE_CONTENT
PROMPT
}

red_team "a software engineer skeptical of self-improving agent systems" \
    "C1 doc_structure, C4 charter_alignment" "$RED_DIR/c1.txt" &
P1=$!
red_team "a frontend engineer scrutinising responsive design + a11y" \
    "C2 component_density, C3 interactive_quality" "$RED_DIR/c2.txt" &
P2=$!
red_team "a technical writer who edits hardware engineering docs" \
    "C1 doc_structure, C6 reader_path" "$RED_DIR/c3.txt" &
P3=$!
red_team "a researcher who skim-reads ML papers and demands citations" \
    "C4 charter_alignment, C5 cross_links" "$RED_DIR/c4.txt" &
P4=$!

wait $P1 $P2 $P3 $P4 2>/dev/null || true

DEFENDER_CONTENT=$(cat "$DEFENDER_OUT" 2>/dev/null)
CRITIC1=$(cat "$RED_DIR/c1.txt" 2>/dev/null)
CRITIC2=$(cat "$RED_DIR/c2.txt" 2>/dev/null)
CRITIC3=$(cat "$RED_DIR/c3.txt" 2>/dev/null)
CRITIC4=$(cat "$RED_DIR/c4.txt" 2>/dev/null)

PREV_SCORES_FILE="$LOOP_DIR/prev-scores-$SLUG.txt"
PREV_LINE=""
[ -f "$PREV_SCORES_FILE" ] && PREV_LINE=$(cat "$PREV_SCORES_FILE")

# --- Stage 3: Judge ---
JUDGE_OUT="$LOOP_DIR/gan-$SLUG.txt"
claude --print --model claude-sonnet-4-6 --dangerously-skip-permissions > "$JUDGE_OUT" 2>/dev/null <<PROMPT || echo "(judge claude -p failed)" > "$JUDGE_OUT"
You are the JUDGE for harness docs page '$SLUG'. Score each criterion 0-10
per the rubric.

ANCHOR RULES:
- PREVIOUS SCORES (last iter): $PREV_LINE
- DEFAULT keep previous score. Only change if:
  (a) defender shows concrete fix → promote one rubric level
  (b) new critical flaw found → demote
- No taste-shifts.

Output exactly 3 lines, no extra prose:
SCORES_JSON={"C1":N,"C2":N,"C3":N,"C4":N,"C5":N,"C6":N}
MIN=<min>
SUM=<sum>

### BUNDLE
$BUNDLE_CONTENT

### DEFENDER
$DEFENDER_CONTENT

### CRITIC 1
$CRITIC1

### CRITIC 2
$CRITIC2

### CRITIC 3
$CRITIC3

### CRITIC 4
$CRITIC4
PROMPT

JUDGE_CONTENT=$(cat "$JUDGE_OUT" 2>/dev/null)
SUM_VAL=$(echo "$JUDGE_CONTENT" | grep -oE 'SUM=[0-9]+(\.[0-9]+)?' | tail -1 | cut -d= -f2)
SCORES_LINE=$(echo "$JUDGE_CONTENT" | grep -oE 'SCORES_JSON=\{[^}]*\}' | tail -1)

[ -n "$SCORES_LINE" ] && echo "$SCORES_LINE" > "$PREV_SCORES_FILE"

if [ -z "$SUM_VAL" ]; then
    echo "VERIFY-FAIL: judge produced no SUM line for $SLUG" >&2
    echo "SUM=0" >> "$JUDGE_OUT"
    SUM_VAL=0
fi

# Final two lines: SUM and bare value (autoresearch parses last line).
echo "SUM=$SUM_VAL"
echo "$SUM_VAL"
exit 0
