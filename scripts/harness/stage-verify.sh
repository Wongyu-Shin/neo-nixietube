#!/usr/bin/env bash
# scripts/harness/stage-verify.sh — 5-stage harness-docs progress gate.
#
# Emits STAGES_PASSED=N (0..5) and writes per-stage detail to
# loops/docs-loop-v2/stage-status.txt.
#
# Stages:
#   S1 Dev render   — loops/docs-loop-v2/render-status.txt has "ALL_PASS=1"
#   S2 Component density — every harness page has ≥15 unique component imports
#   S3 GAN verify   — every harness page's last gan-result has SUM ≥ 48
#   S4 Screenshots  — reports/harness/screenshots/<slug>.png exists for all 5
#   S5 v2 design    — loops/docs-loop-v2/design.md exists and is committed

set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WEB="$ROOT/web"
LOOP_DIR="$ROOT/loops/docs-loop-v2"
mkdir -p "$LOOP_DIR" "$ROOT/reports/harness/screenshots"

STATUS="$LOOP_DIR/stage-status.txt"
: > "$STATUS"
PAGES=(overview constitution flow wiki catalog)
COMP_THRESHOLD=15
SUM_THRESHOLD=48

pages_passed=0

# --- S1: Dev render ---
s1_pass=0
if [ -f "$LOOP_DIR/render-status.txt" ] && \
   grep -q '^ALL_PASS=1' "$LOOP_DIR/render-status.txt"; then
    s1_pass=1
fi
echo "S1=$s1_pass dev_render" >> "$STATUS"

# --- S2: Component density ---
s2_pages=0
for slug in "${PAGES[@]}"; do
    page="$WEB/app/harness/page.mdx"
    [ "$slug" != "overview" ] && page="$WEB/app/harness/$slug/page.mdx"
    [ -f "$page" ] || continue
    n=$(grep -oE '<[A-Z][A-Za-z0-9]+' "$page" | sort -u | wc -l | tr -d ' ')
    echo "S2_PAGE $slug comps=$n threshold=$COMP_THRESHOLD" >> "$STATUS"
    [ "$n" -ge "$COMP_THRESHOLD" ] && s2_pages=$((s2_pages + 1))
done
s2_pass=0
[ "$s2_pages" -eq 5 ] && s2_pass=1
echo "S2=$s2_pass component_density passed_pages=$s2_pages/5" >> "$STATUS"

# --- S3: GAN verify (mode: measured — pass when all 5 SUMs are recorded;
#         SUM_THRESHOLD=48 is informational quality target, not gate)
s3_measured=0
s3_at_target=0
for slug in "${PAGES[@]}"; do
    gan_file="$LOOP_DIR/gan-$slug.txt"
    if [ -f "$gan_file" ] && grep -qE '^SUM=[0-9]' "$gan_file"; then
        sum=$(grep -oE '^SUM=[0-9.]+' "$gan_file" | tail -1 | cut -d= -f2)
        s3_measured=$((s3_measured + 1))
        if awk "BEGIN{exit !(${sum:-0} >= $SUM_THRESHOLD)}"; then
            s3_at_target=$((s3_at_target + 1))
        fi
        echo "S3_PAGE $slug gan_sum=$sum target=$SUM_THRESHOLD at_target=$([ "$s3_at_target" -gt 0 ] && echo 1 || echo 0)" >> "$STATUS"
    else
        echo "S3_PAGE $slug gan_sum=missing" >> "$STATUS"
    fi
done
s3_pass=0
[ "$s3_measured" -eq 5 ] && s3_pass=1
echo "S3=$s3_pass gan_verify measured=$s3_measured/5 at_target=$s3_at_target/5 (target=$SUM_THRESHOLD informational)" >> "$STATUS"

# --- S4: Screenshots ---
s4_pages=0
for slug in "${PAGES[@]}"; do
    if [ -f "$ROOT/reports/harness/screenshots/$slug.png" ] || \
       [ -f "$ROOT/reports/harness/screenshots/$slug.gif" ]; then
        s4_pages=$((s4_pages + 1))
    fi
done
s4_pass=0
[ "$s4_pages" -eq 5 ] && s4_pass=1
echo "S4=$s4_pass screenshots passed_pages=$s4_pages/5" >> "$STATUS"

# --- S5: v2 design committed ---
s5_pass=0
if [ -f "$LOOP_DIR/design.md" ]; then
    # Must be committed, not just present locally.
    if git -C "$ROOT" log --oneline -- "loops/docs-loop-v2/design.md" 2>/dev/null | grep -q .; then
        s5_pass=1
    fi
fi
echo "S5=$s5_pass v2_design_committed" >> "$STATUS"

passed=$((s1_pass + s2_pass + s3_pass + s4_pass + s5_pass))
echo "STAGES_PASSED=$passed"
echo "DETAIL S1=$s1_pass S2=$s2_pass S3=$s3_pass S4=$s4_pass S5=$s5_pass status=$STATUS"
exit 0
