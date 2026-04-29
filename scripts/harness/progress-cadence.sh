#!/usr/bin/env bash
# scripts/harness/progress-cadence.sh — Milestone block writer.
#
# Implements harness/features/harness-progress-cadence.md (axis1=outer,
# axis2=in-loop). Article VIII discipline: every 5 iterations the
# loop emits a milestone block summarising the last 5 keeps/discards
# so a future reader (or paused-and-resumed agent) can scan progress
# without diffing the full TSV.
#
# Subcommands:
#   tick <loop-dir>            — append a one-line tick after every iter
#   milestone <loop-dir>       — write a full block every 5 ticks
#   status <loop-dir>          — print compact summary (n_iter, anchor,
#                                last 5 statuses)
#
# Output format (appended to loops/NNN/cadence.md):
#   ## Milestone @ iter <N> — <ts>
#   anchor=<value>  Δsince=<delta>  keeps=<k>  discards=<d>  crashes=<c>
#   - iter N-4: <status> <commit> <metric> <description>
#   - iter N-3: ...
#   ...
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

usage() {
    echo "usage: progress-cadence.sh <tick|milestone|status> <loop-dir>" >&2
    exit 64
}

[ $# -lt 2 ] && usage
sub="$1"; loopdir="$2"
case "$loopdir" in /*) ;; *) loopdir="$ROOT/$loopdir" ;; esac
[ -d "$loopdir" ] || { echo "progress-cadence: loop dir not found: $loopdir" >&2; exit 1; }

cadence_file="$loopdir/cadence.md"
results_tsv="$loopdir/results.tsv"

ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }

last_n_kept_metrics() {
    [ -f "$results_tsv" ] || return
    awk -F'\t' '
        NR>2 && ($6=="keep" || $6=="keep (reworked)" || $6=="baseline") {
            print $3
        }' "$results_tsv"
}

count_status() {
    local s="$1"
    [ -f "$results_tsv" ] || { echo 0; return; }
    awk -F'\t' -v s="$s" 'NR>2 && $6==s' "$results_tsv" | wc -l | tr -d ' '
}

n_iter() {
    [ -f "$results_tsv" ] || { echo 0; return; }
    awk -F'\t' 'NR>2 && $1+0>n {n=$1+0} END{print n+0}' "$results_tsv"
}

tick() {
    n=$(n_iter)
    echo "[cadence] tick @ iter $n loop=$(basename "$loopdir") at $(ts)"
    # every 5th tick → milestone
    if [ $((n % 5)) -eq 0 ] && [ "$n" -gt 0 ]; then
        milestone
    fi
}

milestone() {
    n=$(n_iter)
    keeps=$(count_status keep)
    discards=$(count_status discard)
    crashes=$(count_status crash)
    metrics=( $(last_n_kept_metrics) )
    anchor=""
    delta=""
    if [ ${#metrics[@]} -gt 0 ]; then
        # SUM=MAX would need direction; default: last value as anchor reference.
        # For lower-is-better metrics the milestone shows the min so far;
        # for higher-is-better the max. Heuristic: take both extremes.
        local hi lo last
        last="${metrics[-1]}"
        hi=$(printf '%s\n' "${metrics[@]}" | sort -g | tail -1)
        lo=$(printf '%s\n' "${metrics[@]}" | sort -g | head -1)
        anchor="hi=$hi lo=$lo last=$last"
    fi

    {
        echo
        echo "## Milestone @ iter $n — $(ts)"
        echo "$anchor  keeps=$keeps  discards=$discards  crashes=$crashes"
        # last 5 rows
        if [ -f "$results_tsv" ]; then
            tail -5 "$results_tsv" | awk -F'\t' '{
                printf "- iter %s: %s %s metric=%s — %s\n", $1, $6, substr($2,1,7), $3, $7
            }'
        fi
    } >> "$cadence_file"
    echo "[cadence] milestone written → $cadence_file"
}

status_compact() {
    n=$(n_iter)
    keeps=$(count_status keep)
    discards=$(count_status discard)
    last5=$(awk -F'\t' 'NR>2 {print $6}' "$results_tsv" 2>/dev/null | tail -5 | tr '\n' '/' | sed 's:/$::')
    echo "CADENCE iter=$n keeps=$keeps discards=$discards last5=${last5:-none}"
}

case "$sub" in
    tick) tick ;;
    milestone) milestone ;;
    status) status_compact ;;
    *) usage ;;
esac
