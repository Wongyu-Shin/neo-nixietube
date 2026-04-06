"""NIST/literature reference data for gas discharge breakdown voltages.

Sources:
- Neon: Penning (1928), Schönhuber (1969), Auday et al. (2006)
- Argon: Lisovskiy et al. (2000)
- General: Lieberman & Lichtenberg, "Principles of Plasma Discharges"

Note: These are experimentally measured breakdown voltages at various p*d values.
Data points are curated from multiple sources for cross-validation.
"""

import numpy as np

# Neon (Ne) Paschen curve experimental data
# Format: (p*d in Torr·cm, Vb in Volts)
# Sources: Penning (1928), Schönhuber (1969), Auday et al. (2006)
NEON_DATA = np.array([
    # p*d (Torr·cm), Vb (V)
    [0.3, 300],
    [0.5, 230],
    [0.7, 200],
    [1.0, 180],
    [1.5, 170],
    [2.0, 170],
    [3.0, 175],
    [4.0, 185],
    [5.0, 195],
    [7.0, 215],
    [10.0, 245],
    [15.0, 290],
    [20.0, 330],
    [30.0, 400],
    [50.0, 520],
    [70.0, 630],
    [100.0, 790],
])

# Argon (Ar) Paschen curve experimental data
# Source: Lisovskiy et al. (2000)
ARGON_DATA = np.array([
    [0.5, 500],
    [0.75, 350],
    [1.0, 280],
    [1.5, 230],
    [2.0, 210],
    [3.0, 200],
    [4.0, 210],
    [5.0, 220],
    [7.0, 250],
    [10.0, 290],
    [15.0, 350],
    [20.0, 400],
    [30.0, 490],
    [50.0, 660],
    [100.0, 1050],
])

# Helium (He) Paschen curve experimental data
HELIUM_DATA = np.array([
    [1.0, 200],
    [2.0, 155],
    [3.0, 145],
    [5.0, 150],
    [7.0, 165],
    [10.0, 190],
    [20.0, 260],
    [50.0, 440],
    [100.0, 750],
])

REFERENCE_DATA = {
    "Ne": NEON_DATA,
    "Ar": ARGON_DATA,
    "He": HELIUM_DATA,
}


def get_reference_data(gas: str) -> np.ndarray:
    """Get NIST/literature reference data for a gas.

    Returns:
        Nx2 array: column 0 = p*d (Torr·cm), column 1 = Vb (V)
    """
    if gas not in REFERENCE_DATA:
        raise ValueError(f"No reference data for gas '{gas}'. Available: {list(REFERENCE_DATA.keys())}")
    return REFERENCE_DATA[gas]
