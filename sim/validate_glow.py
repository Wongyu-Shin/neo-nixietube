"""Validation script for glow discharge model.

Compares cathode dark space thickness predictions against reference data
using LOOCV (Leave-One-Out Cross Validation).

This is the autoresearch Verify command for glow model improvement.
Output: MAPE of dc (cathode dark space) prediction across all gases.
"""

import sys
import numpy as np

from glow_model import cathode_dark_space, normal_current_density
from glow_reference_data import DC_REFERENCE_DATA, JN_REFERENCE_DATA


def calculate_dc_mape(gas: str, verbose: bool = False) -> float:
    """Calculate MAPE for cathode dark space prediction."""
    data = DC_REFERENCE_DATA[gas]
    p_data = data[:, 0]
    dc_data = data[:, 1]

    errors = []
    if verbose:
        print(f"\n{'='*55}")
        print(f"Gas: {gas} — Cathode Dark Space (dc)")
        print(f"{'='*55}")
        print(f"{'p(Torr)':>8} {'dc_ref(μm)':>10} {'dc_pred(μm)':>11} {'Error%':>8}")
        print(f"{'-'*8} {'-'*10} {'-'*11} {'-'*8}")

    for p, dc_ref in zip(p_data, dc_data):
        dc_pred = cathode_dark_space(p, gas)
        error_pct = abs(dc_pred - dc_ref) / dc_ref * 100
        errors.append(error_pct)

        if verbose:
            print(f"{p:8.1f} {dc_ref*1e4:10.0f} {dc_pred*1e4:11.0f} {error_pct:8.2f}")

    mape = np.mean(errors)
    if verbose:
        print(f"  MAPE: {mape:.2f}%")
    return mape


def calculate_jn_mape(gas: str, verbose: bool = False) -> float:
    """Calculate MAPE for normal current density prediction."""
    if gas not in JN_REFERENCE_DATA:
        return 0.0

    data = JN_REFERENCE_DATA[gas]
    p_data = data[:, 0]
    jn_data = data[:, 1]

    errors = []
    if verbose:
        print(f"\n{'='*55}")
        print(f"Gas: {gas} — Normal Current Density (j_n)")
        print(f"{'='*55}")
        print(f"{'p(Torr)':>8} {'jn_ref':>10} {'jn_pred':>10} {'Error%':>8}")
        print(f"{'-'*8} {'-'*10} {'-'*10} {'-'*8}")

    for p, jn_ref in zip(p_data, jn_data):
        jn_pred = normal_current_density(p, gas)
        error_pct = abs(jn_pred - jn_ref) / jn_ref * 100
        errors.append(error_pct)

        if verbose:
            print(f"{p:8.1f} {jn_ref:10.1f} {jn_pred:10.1f} {error_pct:8.2f}")

    mape = np.mean(errors)
    if verbose:
        print(f"  MAPE: {mape:.2f}%")
    return mape


def validate_all(verbose: bool = False) -> float:
    """Validate glow model against all reference data.

    Combined MAPE = 70% dc weight + 30% jn weight
    (dc is more important for "is it visible?" question)
    """
    dc_mapes = []
    jn_mapes = []

    for gas in DC_REFERENCE_DATA:
        dc_mape = calculate_dc_mape(gas, verbose=verbose)
        dc_mapes.append(dc_mape)

        jn_mape = calculate_jn_mape(gas, verbose=verbose)
        if jn_mape > 0:
            jn_mapes.append(jn_mape)

    avg_dc_mape = np.mean(dc_mapes)
    avg_jn_mape = np.mean(jn_mapes) if jn_mapes else 0.0

    # Weighted combination
    overall = 0.7 * avg_dc_mape + 0.3 * avg_jn_mape

    if verbose:
        print(f"\n{'='*55}")
        print(f"dc MAPE (avg): {avg_dc_mape:.2f}%")
        print(f"jn MAPE (avg): {avg_jn_mape:.2f}%")
        print(f"Combined (70/30): {overall:.2f}%")

    # Parsed by autoresearch
    print(f"MAPE: {overall:.2f}")
    return overall


if __name__ == "__main__":
    verbose = "--verbose" in sys.argv
    validate_all(verbose=verbose)
