#!/usr/bin/env bash
# harness/statistical-tc-runner.sh — Parallel N-sample TC runner.
#
# Implements harness/features/statistical-tc-runner.md (axis1=inner,
# axis2=in-loop, jobs/--samples). Runs a TC script N times in parallel,
# aggregates pass/fail rate + effect size, decides per pre-registered
# rule. The axis-1 meta-feature that makes Article II rippability
# statistically honest.
#
# Subcommands:
#   run <tc-script>            — N parallel runs of one TC, report pass rate
#   compare <a> <b>            — A/B compare two TCs (with vs without arm)
#                                 via Welch t-test on iterations-to-fix
#   ab-runs <a> <b> --samples N --metric <name>
#                              — explicit two-arm experiment
#
# Output (canonical):
#   PASS_RATE=<n>/N            for `run`
#   WELCH_T=<t> P=<p> EFFECT=<d>  for `compare`
#
# The TC script is run as `bash <tc-script>` per project convention.
# Default jobs = N (one process per sample). Default N=10. Bounded
# by GNU parallel if available, else xargs -P.
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PY=/opt/homebrew/Caskroom/miniforge/base/bin/python
[ -x "$PY" ] || PY=$(command -v python3)

usage() {
    cat <<'EOF' >&2
usage:
  statistical-tc-runner.sh run <tc-script> [--samples N] [--jobs J] [--timeout T]
  statistical-tc-runner.sh compare <tc-a> <tc-b> [--samples N] [--metric <name>]
  statistical-tc-runner.sh ab-runs <a> <b> --samples N [--metric <name>]
EOF
    exit 64
}

[ $# -lt 1 ] && usage
sub="$1"; shift

# Default flags
samples=10
jobs=""
timeout=120
metric_name=""

# Parse rest
positional=()
while [ $# -gt 0 ]; do
    case "$1" in
        --samples) samples="$2"; shift 2 ;;
        --jobs)    jobs="$2"; shift 2 ;;
        --timeout) timeout="$2"; shift 2 ;;
        --metric)  metric_name="$2"; shift 2 ;;
        *)         positional+=("$1"); shift ;;
    esac
done
set -- "${positional[@]+"${positional[@]}"}"
[ -z "$jobs" ] && jobs="$samples"

run_one() {
    local script="$1" idx="$2"
    local out; local rc
    out=$(timeout "$timeout" bash "$script" 2>&1) && rc=0 || rc=$?
    # Extract metric value if requested
    local mv=""
    if [ -n "$metric_name" ]; then
        mv=$(printf '%s\n' "$out" | awk -F= -v k="$metric_name" '$1==k{print $2; exit}')
    fi
    printf '%s\t%s\t%s\n' "$idx" "$rc" "$mv"
}
export -f run_one

run_n() {
    local script="$1"
    [ -f "$script" ] || { echo "stc-runner: tc script not found: $script" >&2; exit 1; }
    local idxs; idxs=$(seq 1 "$samples")
    if command -v parallel >/dev/null 2>&1; then
        printf '%s\n' "$idxs" | parallel -j "$jobs" run_one "$script" {}
    else
        printf '%s\n' "$idxs" | xargs -P "$jobs" -I{} bash -c "run_one '$script' {}"
    fi
}

case "$sub" in
    run)
        [ $# -lt 1 ] && usage
        script="$1"
        results=$(run_n "$script")
        passes=$(printf '%s\n' "$results" | awk -F'\t' '$2==0' | wc -l | tr -d ' ')
        echo "DETAIL samples=$samples script=$script"
        echo "PASS_RATE=$passes/$samples"
        ;;

    compare|ab-runs)
        [ $# -lt 2 ] && usage
        a="$1"; b="$2"
        [ -z "$metric_name" ] && { echo "stc-runner: --metric required for compare" >&2; exit 64; }
        ra=$(run_n "$a")
        rb=$(run_n "$b")
        a_vals=$(printf '%s\n' "$ra" | awk -F'\t' '$2==0 && $3!=""{print $3}')
        b_vals=$(printf '%s\n' "$rb" | awk -F'\t' '$2==0 && $3!=""{print $3}')
        "$PY" - <<PY
import statistics, math, sys
a = [float(x) for x in """$a_vals""".split() if x]
b = [float(x) for x in """$b_vals""".split() if x]
if len(a) < 2 or len(b) < 2:
    print(f"DETAIL a_n={len(a)} b_n={len(b)} — too few samples")
    print("WELCH_T=NaN P=NaN EFFECT=NaN")
    sys.exit(1)
ma, mb = statistics.mean(a), statistics.mean(b)
sa, sb = statistics.stdev(a), statistics.stdev(b)
na, nb = len(a), len(b)
# Welch t
denom = math.sqrt(sa**2/na + sb**2/nb)
t = (ma - mb) / denom if denom else 0.0
# df via Welch–Satterthwaite
if denom:
    df = (sa**2/na + sb**2/nb)**2 / ((sa**2/na)**2/(na-1) + (sb**2/nb)**2/(nb-1))
else:
    df = na + nb - 2
# Cohen's d (pooled, classical)
sp = math.sqrt(((na-1)*sa**2 + (nb-1)*sb**2) / (na + nb - 2))
d = (ma - mb) / sp if sp else 0.0
# crude two-sided p approximation via Student's t survival (no scipy):
# use erfc on z if df is large enough; else conservative report
import math as _m
def t_p_two_sided(t, df):
    # Approximate normal-ish for df ≥ 30; otherwise note uncertainty.
    if df >= 30:
        z = abs(t)
        return _m.erfc(z / _m.sqrt(2))
    return float('nan')
p = t_p_two_sided(t, df)
print(f"DETAIL a(n={na} mean={ma:.3f} sd={sa:.3f}) b(n={nb} mean={mb:.3f} sd={sb:.3f}) df={df:.1f}")
print(f"WELCH_T={t:.4f} P={p:.4f} EFFECT={d:.4f}")
PY
        ;;
    *)
        usage
        ;;
esac
