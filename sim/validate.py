"""Validation script — compares Paschen simulation against NIST reference data.

This is the autoresearch Verify command.
Output: MAPE (Mean Absolute Percentage Error) across all gas types and data points.

Usage:
    python sim/validate.py
    python sim/validate.py --gas Ne
    python sim/validate.py --verbose
"""

import sys
import numpy as np

from paschen import breakdown_voltage
from nist_data import REFERENCE_DATA, get_reference_data


def calculate_mape(gas: str) -> tuple[float, list[dict]]:
    """Calculate MAPE for a single gas.

    Returns:
        (mape_percent, list of per-point errors)
    """
    data = get_reference_data(gas)
    errors = []

    for pd_val, vb_nist in data:
        vb_sim = breakdown_voltage(pd_val, 1.0, gas)
        if np.isnan(vb_sim):
            errors.append({
                "pd": pd_val,
                "vb_nist": vb_nist,
                "vb_sim": None,
                "error_pct": 100.0,  # Penalize NaN as 100% error
            })
        else:
            error_pct = abs(vb_sim - vb_nist) / vb_nist * 100
            errors.append({
                "pd": pd_val,
                "vb_nist": vb_nist,
                "vb_sim": round(vb_sim, 1),
                "error_pct": round(error_pct, 2),
            })

    mape = np.mean([e["error_pct"] for e in errors])
    return mape, errors


def validate_all(verbose: bool = False) -> float:
    """Validate against all available reference data.

    Returns:
        Overall MAPE across all gases.
    """
    all_errors = []
    gas_results = {}

    for gas in REFERENCE_DATA:
        mape, errors = calculate_mape(gas)
        gas_results[gas] = mape
        all_errors.extend([e["error_pct"] for e in errors])

        if verbose:
            print(f"\n{'='*50}")
            print(f"Gas: {gas} — MAPE: {mape:.2f}%")
            print(f"{'='*50}")
            print(f"{'pd':>8} {'Vb_NIST':>8} {'Vb_sim':>8} {'Error%':>8}")
            print(f"{'-'*8} {'-'*8} {'-'*8} {'-'*8}")
            for e in errors:
                vb_sim_str = f"{e['vb_sim']}" if e['vb_sim'] is not None else "NaN"
                print(f"{e['pd']:8.1f} {e['vb_nist']:8.1f} {vb_sim_str:>8} {e['error_pct']:8.2f}")

    overall_mape = np.mean(all_errors)

    if verbose:
        print(f"\n{'='*50}")
        print("Per-gas MAPE:")
        for gas, mape in gas_results.items():
            print(f"  {gas}: {mape:.2f}%")

    # This line is parsed by autoresearch
    print(f"MAPE: {overall_mape:.2f}")

    return overall_mape


if __name__ == "__main__":
    verbose = "--verbose" in sys.argv

    gas_filter = None
    for arg in sys.argv[1:]:
        if arg.startswith("--gas"):
            idx = sys.argv.index(arg)
            if idx + 1 < len(sys.argv):
                gas_filter = sys.argv[idx + 1]

    if gas_filter:
        mape, errors = calculate_mape(gas_filter)
        print(f"MAPE: {mape:.2f}")
    else:
        validate_all(verbose=verbose)
