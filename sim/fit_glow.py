"""Fit glow discharge model parameters to reference data."""

import numpy as np
from scipy.optimize import minimize
from glow_reference_data import DC_REFERENCE_DATA


def dc_model(p, dc_pd_0, p_ref, alpha):
    """dc = dc_pd_0 * (1 + (p/p_ref)^alpha) / p"""
    return dc_pd_0 * (1 + (p / p_ref) ** alpha) / p


def fit_gas(gas):
    data = DC_REFERENCE_DATA[gas]
    p_data = data[:, 0]
    dc_data = data[:, 1]

    def objective(params):
        dc_pd_0, p_ref, alpha = params
        if dc_pd_0 <= 0 or p_ref <= 0 or alpha <= 0 or alpha > 2:
            return 1e6
        dc_pred = dc_model(p_data, dc_pd_0, p_ref, alpha)
        errors = np.abs(dc_pred - dc_data) / dc_data * 100
        return np.mean(errors)

    best = None
    best_mape = 1e6
    for x0 in [
        [0.4, 20, 0.5],
        [0.3, 30, 0.6],
        [0.5, 15, 0.4],
        [0.3, 50, 0.8],
        [0.8, 10, 0.3],
    ]:
        result = minimize(objective, x0, method="Nelder-Mead",
                          options={"maxiter": 10000, "xatol": 1e-8, "fatol": 1e-8})
        if result.fun < best_mape:
            best_mape = result.fun
            best = result

    dc_pd_0, p_ref, alpha = best.x
    return {
        "dc_pd_0": round(dc_pd_0, 6),
        "p_ref": round(p_ref, 4),
        "alpha": round(alpha, 6),
        "mape": round(best_mape, 2),
    }


if __name__ == "__main__":
    for gas in DC_REFERENCE_DATA:
        result = fit_gas(gas)
        print(f"{gas}: dc_pd_0={result['dc_pd_0']}, p_ref={result['p_ref']}, "
              f"alpha={result['alpha']}, MAPE={result['mape']}%")
