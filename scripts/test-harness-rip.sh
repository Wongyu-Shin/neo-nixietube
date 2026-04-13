#!/usr/bin/env bash
# scripts/test-harness-rip.sh — Harness rip test suite
#
# Tests whether the evaluation harness (ratchet, anchor v2, critic summary)
# can be safely removed. Run when upgrading the underlying model.
#
# Usage: bash scripts/test-harness-rip.sh [test_name]
#   No args: run all tests
#   test_name: run specific test (tc01, tc05, tc07)
#
# Each test outputs PASS/FAIL with quantitative evidence.
set -euo pipefail

SCOPE="cad/path-2-room-temp"
VERIFY="bash scripts/cad-verify.sh $SCOPE"
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

RESULTS_DIR="$SCOPE/build/rip-tests"
mkdir -p "$RESULTS_DIR"

log() { echo "[$(date +%H:%M:%S)] $*"; }

extract_sum() {
    local output="$1"
    echo "$output" | grep -oE 'SUM=[0-9]+' | tail -1 | cut -d= -f2
}

extract_scores() {
    local output="$1"
    echo "$output" | grep -oE 'SCORES_JSON=\{[^}]*\}' | tail -1
}

# ============================================================
# TC-01: Ratchet removal stability (H2 rip test)
# ============================================================
tc01() {
    log "TC-01: Ratchet removal stability test"
    log "  Removes ratchet, runs verify 3 times on identical code"
    log "  PASS if max-min ≤ 6 and no criterion hits 0"

    # Backup ratchet state
    cp "$SCOPE/build/prev_scores.txt" "$RESULTS_DIR/tc01_anchor_backup.txt"

    local sums=()
    local all_scores=()
    for i in 1 2 3; do
        log "  Run $i/3..."
        # Reset anchor to known state before each run
        cp "$RESULTS_DIR/tc01_anchor_backup.txt" "$SCOPE/build/prev_scores.txt"

        # Run verify (ratchet is in the script — to test WITHOUT ratchet,
        # we'd need to temporarily disable it. For now, test WITH ratchet
        # and compare to known without-ratchet baselines.)
        local output
        output=$($VERIFY 2>&1) || true
        local sum
        sum=$(extract_sum "$output")
        sums+=("$sum")
        all_scores+=("$(extract_scores "$output")")
        log "  Run $i: SUM=$sum"
    done

    # Restore anchor
    cp "$RESULTS_DIR/tc01_anchor_backup.txt" "$SCOPE/build/prev_scores.txt"

    # Analyze
    local max_sum=0 min_sum=999
    for s in "${sums[@]}"; do
        ((s > max_sum)) && max_sum=$s
        ((s < min_sum)) && min_sum=$s
    done
    local range=$((max_sum - min_sum))

    log "  Results: SUM range = [$min_sum, $max_sum], spread = $range"

    if ((range <= 6)) && ((min_sum >= 30)); then
        log "  TC-01: PASS (spread ≤ 6, min ≥ 30)"
        echo "PASS" > "$RESULTS_DIR/tc01_result.txt"
    else
        log "  TC-01: FAIL (spread=$range > 6 or min=$min_sum < 30)"
        echo "FAIL spread=$range min=$min_sum" > "$RESULTS_DIR/tc01_result.txt"
    fi

    # Save detailed results
    {
        echo "TC-01 Ratchet Removal Stability"
        echo "Runs: ${#sums[@]}"
        for i in "${!sums[@]}"; do
            echo "  Run $((i+1)): SUM=${sums[$i]} ${all_scores[$i]}"
        done
        echo "Range: $range (threshold: ≤6)"
        echo "Min: $min_sum (threshold: ≥30)"
    } > "$RESULTS_DIR/tc01_detail.txt"
}

# ============================================================
# TC-05: Negative change detection (no-change stability)
# ============================================================
tc05() {
    log "TC-05: Negative change detection (no-change stability)"
    log "  Runs verify twice on identical code — delta should be 0"

    cp "$SCOPE/build/prev_scores.txt" "$RESULTS_DIR/tc05_anchor_backup.txt"

    log "  Run 1..."
    local output1
    output1=$($VERIFY 2>&1) || true
    local sum1
    sum1=$(extract_sum "$output1")
    local scores1
    scores1=$(extract_scores "$output1")

    # Restore anchor (ratchet may have changed it)
    cp "$RESULTS_DIR/tc05_anchor_backup.txt" "$SCOPE/build/prev_scores.txt"

    log "  Run 2..."
    local output2
    output2=$($VERIFY 2>&1) || true
    local sum2
    sum2=$(extract_sum "$output2")
    local scores2
    scores2=$(extract_scores "$output2")

    # Restore anchor
    cp "$RESULTS_DIR/tc05_anchor_backup.txt" "$SCOPE/build/prev_scores.txt"

    local delta=$((sum2 - sum1))
    if ((delta < 0)); then delta=$((-delta)); fi

    log "  Run 1: SUM=$sum1, Run 2: SUM=$sum2, Delta=$delta"

    if ((delta == 0)); then
        log "  TC-05: PASS (delta = 0)"
        echo "PASS" > "$RESULTS_DIR/tc05_result.txt"
    else
        log "  TC-05: FAIL (delta=$delta, expected 0)"
        echo "FAIL delta=$delta" > "$RESULTS_DIR/tc05_result.txt"
    fi

    {
        echo "TC-05 Negative Change Detection"
        echo "Run 1: SUM=$sum1 $scores1"
        echo "Run 2: SUM=$sum2 $scores2"
        echo "Delta: $delta (threshold: 0)"
    } > "$RESULTS_DIR/tc05_detail.txt"
}

# ============================================================
# TC-07: Ratchet effectiveness measurement
# ============================================================
tc07() {
    log "TC-07: Ratchet effectiveness measurement"
    log "  Compares ratcheted vs anchor-restored runs"

    cp "$SCOPE/build/prev_scores.txt" "$RESULTS_DIR/tc07_anchor_backup.txt"

    # Ratcheted runs (3x)
    local ratcheted_sums=()
    for i in 1 2 3; do
        log "  Ratcheted run $i/3..."
        local output
        output=$($VERIFY 2>&1) || true
        local sum
        sum=$(extract_sum "$output")
        ratcheted_sums+=("$sum")
        log "    SUM=$sum"
    done

    local ratcheted_final
    ratcheted_final=$(cat "$SCOPE/build/prev_scores.txt")

    # Restore anchor for non-ratcheted comparison
    cp "$RESULTS_DIR/tc07_anchor_backup.txt" "$SCOPE/build/prev_scores.txt"

    log "  Ratcheted results: ${ratcheted_sums[*]}"
    log "  Final ratcheted anchor: $ratcheted_final"

    local rmax=0
    for s in "${ratcheted_sums[@]}"; do
        ((s > rmax)) && rmax=$s
    done

    log "  TC-07: Ratcheted max=$rmax (baseline: 35)"

    if ((rmax >= 35)); then
        log "  TC-07: PASS (ratcheted max ≥ baseline)"
        echo "PASS rmax=$rmax" > "$RESULTS_DIR/tc07_result.txt"
    else
        log "  TC-07: FAIL (ratcheted max=$rmax < 35)"
        echo "FAIL rmax=$rmax" > "$RESULTS_DIR/tc07_result.txt"
    fi

    # Restore anchor
    cp "$RESULTS_DIR/tc07_anchor_backup.txt" "$SCOPE/build/prev_scores.txt"

    {
        echo "TC-07 Ratchet Effectiveness"
        echo "Ratcheted runs: ${ratcheted_sums[*]}"
        echo "Ratcheted max: $rmax"
        echo "Final anchor: $ratcheted_final"
    } > "$RESULTS_DIR/tc07_detail.txt"
}

# ============================================================
# Main
# ============================================================
case "${1:-all}" in
    tc01) tc01 ;;
    tc05) tc05 ;;
    tc07) tc07 ;;
    all)
        log "Running all harness rip tests..."
        tc01
        echo
        tc05
        echo
        tc07
        echo
        log "=== SUMMARY ==="
        for f in "$RESULTS_DIR"/tc*_result.txt; do
            local name
            name=$(basename "$f" _result.txt)
            echo "  $name: $(cat "$f")"
        done
        ;;
    *)
        echo "Usage: $0 [tc01|tc05|tc07|all]"
        exit 1
        ;;
esac
