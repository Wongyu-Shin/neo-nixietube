"""Optimizer — finds optimal conditions for 3 bridge technologies.

Bridge 1: Traditional/Frit-sealed (Ne, 10-30 Torr, d=1-2mm, target Vb ~170-200V)
Bridge 2: AAO nano-electrode (Ne, 10-30 Torr, d=1-2mm, reduced Vb due to field enhancement)
Bridge 3: Micro-barrier high-pressure (Ne, 100-500 Torr, d=0.05-0.1cm, target Vb ~200-500V)
"""

import json
from paschen import optimal_conditions, paschen_minimum, breakdown_voltage


def analyze_bridges():
    """Analyze all 3 bridge configurations."""

    results = {}

    # Bridge 1: Traditional/Frit-sealed Nixie tube
    print("=" * 60)
    print("Bridge 1: Frit-sealed + Bulk Ni electrode")
    print("=" * 60)
    bridge1 = optimal_conditions(
        gas="Ne",
        target_voltage=180,
        pressure_range=(10, 30),
        gap_range=(0.1, 0.2),  # 1-2mm
    )
    results["bridge1_frit"] = bridge1
    print(f"  Paschen minimum: pd={bridge1['paschen_minimum']['pd']:.2f} Torr·cm, "
          f"Vb={bridge1['paschen_minimum']['Vb']:.1f} V")
    print(f"  Feasible conditions (target {bridge1['target_voltage']}V):")
    for c in bridge1["feasible_conditions"][:5]:
        print(f"    p={c['p_torr']:.1f} Torr, d={c['d_cm']*10:.2f} mm, Vb={c['Vb']:.1f} V")

    # Bridge 2: AAO nano-electrode (field enhancement factor reduces effective Vb)
    # Model: Vb_eff = Vb_paschen / beta, where beta = field enhancement factor
    print(f"\n{'=' * 60}")
    print("Bridge 2: Frit-sealed + AAO nano-electrode")
    print("=" * 60)
    bridge2 = optimal_conditions(
        gas="Ne",
        target_voltage=150,  # Reduced target due to AAO field enhancement
        pressure_range=(10, 30),
        gap_range=(0.1, 0.2),
    )
    results["bridge2_aao"] = bridge2
    print(f"  Target Vb (with AAO enhancement): {bridge2['target_voltage']}V")
    print(f"  Feasible conditions:")
    for c in bridge2["feasible_conditions"][:5]:
        print(f"    p={c['p_torr']:.1f} Torr, d={c['d_cm']*10:.2f} mm, Vb={c['Vb']:.1f} V")
    print(f"  Note: AAO field enhancement (β≈1.1-1.2) may reduce Vb by 5-15%")
    print(f"        This is a hypothesis to be validated experimentally")

    # Bridge 3: Micro-barrier high-pressure
    print(f"\n{'=' * 60}")
    print("Bridge 3: Micro-barrier high-pressure discharge")
    print("=" * 60)
    bridge3 = optimal_conditions(
        gas="Ne",
        target_voltage=350,
        pressure_range=(100, 500),
        gap_range=(0.05, 0.1),  # 500μm - 1mm
    )
    results["bridge3_micro"] = bridge3
    print(f"  Target Vb: {bridge3['target_voltage']}V")
    print(f"  Feasible conditions:")
    for c in bridge3["feasible_conditions"][:5]:
        print(f"    p={c['p_torr']:.1f} Torr, d={c['d_cm']*10:.1f} mm, "
              f"pd={c['pd']:.1f} Torr·cm, Vb={c['Vb']:.1f} V")

    # Also check Argon (cheaper alternative)
    print(f"\n{'=' * 60}")
    print("Bonus: Argon (Ar) — cheaper alternative")
    print("=" * 60)
    bridge_ar = optimal_conditions(
        gas="Ar",
        target_voltage=200,
        pressure_range=(10, 50),
        gap_range=(0.1, 0.2),
    )
    results["argon_alternative"] = bridge_ar
    pd_min, v_min = paschen_minimum("Ar")
    print(f"  Paschen minimum: pd={pd_min:.2f} Torr·cm, Vb={v_min:.1f} V")
    print(f"  Feasible conditions (target 200V):")
    for c in bridge_ar["feasible_conditions"][:5]:
        print(f"    p={c['p_torr']:.1f} Torr, d={c['d_cm']*10:.2f} mm, Vb={c['Vb']:.1f} V")

    return results


if __name__ == "__main__":
    results = analyze_bridges()
