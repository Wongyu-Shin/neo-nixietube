#!/usr/bin/env bash
# scripts/harness/pause-state.sh — Checkpoint reader/writer for
# harness-pause-resume.
#
# Implements harness/features/harness-pause-resume.md (axis1=inner,
# axis2=in-loop, operator-initiated). Operator pauses are always
# allowed (asymmetric from agent-requested HITL per Article III).
#
# Subcommands:
#   write <loop-dir> [--hint "<text>"]   write a checkpoint at the next
#                                         iteration boundary; creates
#                                         loops/NNN/checkpoints/<ts>.json
#   read  <loop-dir>                     emit the latest checkpoint to stdout
#   list  <loop-dir>                     list all checkpoints (oldest first)
#   resume <loop-dir> [--hint "<text>"]  load latest checkpoint; if --hint
#                                         given, append to checkpoint and
#                                         echo back the hint for Phase 1
#                                         injection
#   status <loop-dir>                    1-line summary of pause state
#
# Exit 0 on success; non-zero with a message on missing loop / IO failure.
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

usage() {
    cat <<'EOF' >&2
usage: pause-state.sh <write|read|list|resume|status> <loop-dir> [--hint "<text>"]
       <loop-dir> — relative path to loops/NNN-<slug>
EOF
    exit 64
}

[ $# -lt 2 ] && usage
sub="$1"; loopdir="$2"; shift 2

# Normalise loop dir: accept relative to repo root or absolute
case "$loopdir" in
    /*)  ;;
    *)   loopdir="$ROOT/$loopdir" ;;
esac
[ -d "$loopdir" ] || { echo "pause-state: loop dir not found: $loopdir" >&2; exit 1; }

ckpt_dir="$loopdir/checkpoints"
mkdir -p "$ckpt_dir"

ts() { date -u +%Y-%m-%dT%H:%M:%SZ; }

# Parse optional --hint
hint=""
while [ $# -gt 0 ]; do
    case "$1" in
        --hint) hint="$2"; shift 2 ;;
        *) echo "pause-state: unknown arg: $1" >&2; exit 64 ;;
    esac
done

write_checkpoint() {
    local fname="$ckpt_dir/$(ts).json"
    local head_sha; head_sha=$(git -C "$ROOT" rev-parse HEAD 2>/dev/null || echo "")
    local results_path="$loopdir/results.tsv"
    local last_iter=0
    [ -f "$results_path" ] && last_iter=$(awk -F'\t' 'NR>2 && $1+0>0{n=$1+0} END{print n+0}' "$results_path")

    cat > "$fname" <<JSON
{
  "timestamp": "$(ts)",
  "loop_dir": "$(basename "$loopdir")",
  "head_sha": "$head_sha",
  "last_iter": $last_iter,
  "hint": $(printf '%s' "$hint" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))'),
  "next_action": "resume via /harness:resume $(basename "$loopdir")"
}
JSON
    echo "$fname"
}

read_latest() {
    ls -1t "$ckpt_dir"/*.json 2>/dev/null | head -1
}

case "$sub" in
    write)
        f=$(write_checkpoint)
        echo "PAUSE_STATE=written"
        echo "PAUSE_FILE=$f"
        ;;
    read)
        f=$(read_latest)
        [ -z "$f" ] && { echo "pause-state: no checkpoint" >&2; exit 1; }
        cat "$f"
        ;;
    list)
        ls -1 "$ckpt_dir"/*.json 2>/dev/null
        ;;
    resume)
        f=$(read_latest)
        [ -z "$f" ] && { echo "pause-state: no checkpoint to resume from" >&2; exit 1; }
        echo "RESUME_FROM=$f"
        if [ -n "$hint" ]; then
            # Append hint to checkpoint
            python3 -c "import json,sys; p='$f'; d=json.load(open(p)); d.setdefault('resume_hints',[]).append({'ts':'$(ts)','text':'''$hint'''}); json.dump(d,open(p,'w'),indent=2)"
            echo "RESUME_HINT_INJECTED=1"
            echo "$hint"
        fi
        ;;
    status)
        f=$(read_latest)
        if [ -z "$f" ]; then
            echo "PAUSE_STATE=running loop=$(basename "$loopdir") checkpoints=0"
        else
            n=$(ls "$ckpt_dir"/*.json 2>/dev/null | wc -l | tr -d ' ')
            iter=$(python3 -c "import json; print(json.load(open('$f')).get('last_iter',0))")
            echo "PAUSE_STATE=paused loop=$(basename "$loopdir") checkpoints=$n last_iter=$iter latest=$(basename "$f")"
        fi
        ;;
    *)
        usage
        ;;
esac
