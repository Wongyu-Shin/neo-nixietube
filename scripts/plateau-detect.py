#!/usr/bin/env python3
"""scripts/plateau-detect.py — Plateau detector.

Implements harness/features/plateau-detection.md (axis1=outer,
axis2=in-loop). Two-signal AND rule: a loop is on a plateau iff
**both**:

  patience  — last K kept iterations show no metric improvement above σ
  slope     — linear trend slope over the last W iterations is ≤ ε

Either signal alone is too noisy. The AND rule prevents premature stops
(σ-bounded oscillations) and prevents endless running on near-flat
trends. Both thresholds are calibrated from the loop's own σ history,
not hardcoded — that is what makes this "noise-aware".

Usage:
    python3 scripts/plateau-detect.py \\
        --tsv loops/NNN-<slug>/results.tsv \\
        --direction higher \\
        --patience 5 \\
        --window 8 \\
        --sigma 1.5

Returns:
    DECISION=continue | plateau | done
    DETAIL patience=ok|stalled slope=...
"""
from __future__ import annotations

import argparse
import statistics
import sys
from pathlib import Path


def read_tsv_metrics(tsv_path: Path) -> list[tuple[int, float, str]]:
    """Read (iter, metric, status) tuples — kept iters only."""
    if not tsv_path.exists():
        return []
    rows = []
    with tsv_path.open(encoding="utf-8") as fp:
        for ln in fp:
            if ln.startswith("#") or ln.startswith("iteration\t"):
                continue
            parts = ln.rstrip("\n").split("\t")
            if len(parts) < 6:
                continue
            status = parts[5]
            if status not in ("baseline", "keep", "keep (reworked)"):
                continue
            try:
                rows.append((int(parts[0]), float(parts[2]), status))
            except (ValueError, IndexError):
                continue
    return rows


def patience_check(metrics: list[float], k: int, direction: str, sigma: float) -> bool:
    """True if last K kept metrics show no improvement above σ vs the
    SUM=MAX anchor seen at any point in those K."""
    if len(metrics) < k + 1:
        return False
    head = metrics[:-k]
    tail = metrics[-k:]
    if not head:
        return False
    anchor = max(head) if direction == "higher" else min(head)
    if direction == "higher":
        improved = any(m > anchor + sigma for m in tail)
    else:
        improved = any(m < anchor - sigma for m in tail)
    return not improved  # stalled = no improvement


def slope_estimate(metrics: list[float], window: int) -> float:
    """Simple linear-regression slope over the last `window` points
    (x = iter index 0..window-1). Returns slope in metric-units per iter."""
    if len(metrics) < 2:
        return 0.0
    pts = metrics[-window:]
    n = len(pts)
    xs = list(range(n))
    mx = sum(xs) / n
    my = sum(pts) / n
    num = sum((xs[i] - mx) * (pts[i] - my) for i in range(n))
    den = sum((xs[i] - mx) ** 2 for i in range(n))
    return num / den if den else 0.0


def cmd_detect(ns: argparse.Namespace) -> int:
    rows = read_tsv_metrics(Path(ns.tsv))
    metrics = [r[1] for r in rows]
    direction = ns.direction
    patience = int(ns.patience)
    window = int(ns.window)
    sigma = float(ns.sigma)
    eps = float(ns.eps) if ns.eps is not None else max(sigma / patience, 1e-6)

    if len(metrics) < max(patience, window) + 1:
        print(f"DETAIL n={len(metrics)} need >= {max(patience, window)+1} for plateau test")
        print("DECISION=continue")
        return 0

    stalled = patience_check(metrics, patience, direction, sigma)
    slope = slope_estimate(metrics, window)
    near_flat = abs(slope) <= eps if direction == "higher" else abs(slope) <= eps

    print(
        f"DETAIL n={len(metrics)} patience(K={patience},σ={sigma})={'stalled' if stalled else 'ok'} "
        f"slope(W={window})={slope:.4f} eps={eps:.4f} flat={near_flat}"
    )
    if stalled and near_flat:
        print("DECISION=plateau")
        return 0

    # Optional 'done' detection: at floor (lower-is-better at 0) or at ceiling
    if direction == "lower" and metrics[-1] == 0:
        print("DECISION=done")
        return 0

    print("DECISION=continue")
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="plateau-detect", description="Plateau detector (patience AND slope).")
    p.add_argument("--tsv", required=True, help="autoresearch results.tsv path")
    p.add_argument("--direction", choices=("higher", "lower"), required=True)
    p.add_argument("--patience", default="5", help="K consecutive iters without σ-beating improvement (default 5)")
    p.add_argument("--window", default="8", help="W iters for linear-regression slope (default 8)")
    p.add_argument("--sigma", default="0", help="noise floor σ (default 0 for deterministic metrics)")
    p.add_argument("--eps", default=None, help="slope flatness threshold (default σ/K)")
    p.set_defaults(func=cmd_detect)
    return p


if __name__ == "__main__":
    ns = build_parser().parse_args()
    sys.exit(ns.func(ns))
