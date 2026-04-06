"""Glow discharge model for micro-barrier nixie tube simulation.

Models the spatial structure of DC glow discharge:
- Cathode dark space thickness (dc)
- Cathode glow region thickness
- Negative glow, Faraday dark space, positive column
- Luminous intensity estimation

Key question for neo-nixetube Bridge 3:
"At 200-500 Torr with 500μm-1mm gap, is the cathode glow visible and
does it conform to the electrode shape (nixie identity)?"

References:
- Engel & Steenbeck, "Elektrische Gasentladungen" (1934)
- Raizer, "Gas Discharge Physics" (1991), Chapter 8
- Lisovskiy et al., J. Phys. D (2000) — micro-discharge data
"""

import numpy as np


# Cathode fall parameters by gas
# dc_pd = cathode dark space thickness × pressure (Torr·cm) — approximately constant
# Vc = cathode fall voltage (V) — approximately constant for normal glow
# Source: Raizer (1991) Table 8.1, von Engel (1965) Table 7.3
CATHODE_PARAMS = {
    "Ne": {"dc_pd_0": 0.4, "p_ref": 20, "alpha": 0.6, "Vc": 120, "j_n_p2": 0.2},
    "Ar": {"dc_pd_0": 0.3, "p_ref": 20, "alpha": 0.5, "Vc": 100, "j_n_p2": 5.0},
    "He": {"dc_pd_0": 0.8, "p_ref": 20, "alpha": 0.45, "Vc": 140, "j_n_p2": 2.0},
}


def cathode_dark_space(p: float, gas: str = "Ne") -> float:
    """Calculate cathode dark space thickness.

    The cathode dark space (Crookes dark space) is where most of the
    voltage drop occurs. Its thickness × pressure is approximately constant
    for a given gas (similarity law).

    Args:
        p: Pressure in Torr

    Returns:
        Dark space thickness in cm
    """
    params = CATHODE_PARAMS[gas]
    dc_pd_0 = params["dc_pd_0"]
    p_ref = params["p_ref"]
    alpha = params["alpha"]
    # Non-similarity correction: dc*p grows at high pressure
    dc_pd = dc_pd_0 * (1 + (p / p_ref) ** alpha)
    return dc_pd / p


def cathode_glow_thickness(p: float, gas: str = "Ne") -> float:
    """Estimate the luminous cathode glow region thickness.

    The cathode glow (negative glow) sits just beyond the cathode dark space.
    Its thickness is approximately 0.5-1.0× the dark space thickness.

    Args:
        p: Pressure in Torr

    Returns:
        Glow thickness in cm
    """
    dc = cathode_dark_space(p, gas)
    # Negative glow extends ~0.7× the dark space thickness (Raizer Ch.8)
    return 0.7 * dc


def normal_current_density(p: float, gas: str = "Ne") -> float:
    """Normal glow discharge current density.

    j_n = j_n/p² × p² (similarity law)

    Args:
        p: Pressure in Torr

    Returns:
        Current density in mA/cm²
    """
    params = CATHODE_PARAMS[gas]
    return params["j_n_p2"] * p**2


def cathode_fall_voltage(gas: str = "Ne") -> float:
    """Return cathode fall voltage (approximately constant for normal glow)."""
    return CATHODE_PARAMS[gas]["Vc"]


def glow_structure(p: float, d: float, gas: str = "Ne") -> dict:
    """Calculate complete glow discharge structure for given conditions.

    Args:
        p: Pressure in Torr
        d: Gap distance in cm
        gas: Gas type

    Returns:
        Dict with all spatial/electrical parameters
    """
    dc = cathode_dark_space(p, gas)
    glow_thick = cathode_glow_thickness(p, gas)
    j_n = normal_current_density(p, gas)
    Vc = cathode_fall_voltage(gas)

    # Check if gap can sustain normal glow
    # Minimum gap ≈ cathode dark space thickness
    can_sustain = d >= dc

    # Positive column exists only if gap >> dark space
    positive_column_length = max(0, d - dc - glow_thick)
    has_positive_column = positive_column_length > 0

    # Glow-to-gap ratio: key metric for "is it visible?"
    # If glow covers most of the gap → electrode shape visible
    # If glow is tiny fraction of gap → only a thin line, not nixie-like
    glow_gap_ratio = min(1.0, (dc + glow_thick) / d) if d > 0 else 0

    # Luminous intensity estimation (relative, arbitrary units)
    # Proportional to current density × glow volume × excitation efficiency
    # At higher pressures, more collisions → more excitation per unit length
    # But also more quenching at very high pressures
    intensity_relative = j_n * glow_thick * p / (p + 500)  # simple saturation model

    return {
        "pressure_torr": p,
        "gap_cm": d,
        "gap_um": d * 10000,
        "gas": gas,
        "cathode_dark_space_cm": dc,
        "cathode_dark_space_um": dc * 10000,
        "cathode_glow_cm": glow_thick,
        "cathode_glow_um": glow_thick * 10000,
        "glow_gap_ratio": round(glow_gap_ratio, 3),
        "can_sustain_glow": can_sustain,
        "normal_current_density_mA_cm2": round(j_n, 2),
        "cathode_fall_V": Vc,
        "positive_column_length_cm": round(positive_column_length, 4),
        "has_positive_column": has_positive_column,
        "intensity_relative": round(intensity_relative, 2),
    }


def analyze_bridge3_conditions():
    """Analyze glow discharge for Bridge 3 micro-barrier conditions."""
    print("=" * 70)
    print("Bridge 3 Micro-Barrier Discharge Analysis")
    print("=" * 70)

    # Conditions from predict analysis: 500μm-1mm gap, 100-500 Torr
    conditions = [
        # (pressure, gap_cm, label)
        (100, 0.1, "1mm @ 100 Torr"),
        (200, 0.1, "1mm @ 200 Torr"),
        (200, 0.05, "500μm @ 200 Torr"),
        (300, 0.1, "1mm @ 300 Torr"),
        (300, 0.05, "500μm @ 300 Torr"),
        (500, 0.1, "1mm @ 500 Torr"),
        (500, 0.05, "500μm @ 500 Torr"),
        # Traditional nixie for comparison
        (15, 0.15, "Traditional: 1.5mm @ 15 Torr"),
    ]

    print(f"\n{'Condition':<30} {'dc(μm)':>8} {'glow(μm)':>9} {'ratio':>6} "
          f"{'sustain':>8} {'j(mA/cm²)':>10} {'intensity':>10}")
    print("-" * 90)

    for p, d, label in conditions:
        result = glow_structure(p, d, "Ne")
        sustain = "✓" if result["can_sustain_glow"] else "✗"
        print(f"{label:<30} {result['cathode_dark_space_um']:>8.0f} "
              f"{result['cathode_glow_um']:>9.0f} {result['glow_gap_ratio']:>6.3f} "
              f"{sustain:>8} {result['normal_current_density_mA_cm2']:>10.1f} "
              f"{result['intensity_relative']:>10.1f}")

    print(f"\nKey insight: glow_gap_ratio > 0.5 means glow covers most of the gap")
    print(f"            → electrode shape is visible (nixie identity preserved)")


if __name__ == "__main__":
    analyze_bridge3_conditions()
