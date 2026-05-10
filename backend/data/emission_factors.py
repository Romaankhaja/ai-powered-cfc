"""
emission_factors.py
===================
Central repository of all emission factors used by the carbon calculation engine.
These are deterministic constants — NO AI involved in calculations.

Sources:
- Transport: UK DEFRA 2023 / IPCC AR6
- Electricity: IEA Global Average 2023
- Food: Oxford University / Our World in Data
- Waste: EPA / IPCC guidelines
"""

# ─── Transport Emission Factors (kg CO₂ per km) ──────────────────────────────

TRANSPORT_FACTORS = {
    "car": 0.21,        # Average petrol/diesel car
    "bus": 0.08,        # Public bus (average occupancy)
    "train": 0.04,      # Rail (mixed electric/diesel)
    "flight": 0.115,    # Short-haul flight per km (economy)
    "motorcycle": 0.11, # Average motorcycle
    "electric_car": 0.05,  # EV (grid average)
    "bicycle": 0.0,     # Zero emissions
    "walking": 0.0,     # Zero emissions
}

# ─── Electricity Emission Factors (kg CO₂ per kWh) ──────────────────────────

ELECTRICITY_FACTORS = {
    "global_average": 0.82,   # IEA global grid average
    "renewable": 0.02,        # Solar/wind dominated grid
    "coal_heavy": 1.10,       # Coal-dominated grid
    "natural_gas": 0.50,      # Gas-dominated grid
}

# Default electricity factor
DEFAULT_ELECTRICITY_FACTOR = ELECTRICITY_FACTORS["global_average"]

# ─── Food Emission Factors (kg CO₂ per day) ──────────────────────────────────

FOOD_FACTORS = {
    "meat_heavy": 7.2,    # High meat consumption (>100g red meat/day)
    "average": 5.0,       # Typical mixed Western diet
    "vegetarian": 3.8,    # No meat, includes dairy/eggs
    "vegan": 2.9,         # Fully plant-based
    "pescatarian": 4.5,   # Fish but no meat
}

# ─── Waste Emission Factors (kg CO₂ per day) ─────────────────────────────────

WASTE_FACTORS = {
    "general": 0.57,      # Landfill-bound general waste
    "recycled": 0.21,     # Mixed recycling
    "composted": 0.05,    # Organic composting
    "minimal": 0.10,      # Low-waste lifestyle
}

# ─── Global Averages (annual kg CO₂ per person) ──────────────────────────────

GLOBAL_AVERAGES = {
    "world_average": 4_800,        # ~4.8 tonnes CO₂/year
    "usa_average": 14_900,         # ~14.9 tonnes
    "eu_average": 6_800,           # ~6.8 tonnes
    "india_average": 1_900,        # ~1.9 tonnes
    "uk_average": 5_500,           # ~5.5 tonnes
    "china_average": 8_200,        # ~8.2 tonnes
    "sustainability_target": 2_300, # Paris Agreement compatible (~2.3 tonnes)
}

# ─── Scoring Thresholds ───────────────────────────────────────────────────────

SCORING_CONFIG = {
    # Annual CO₂ kg → score mapping (linear interpolation)
    "excellent_threshold": 2_500,    # Score 90-100
    "good_threshold": 5_000,         # Score 70-89
    "average_threshold": 8_000,      # Score 50-69
    "poor_threshold": 12_000,        # Score 30-49
    # Below poor_threshold scores 0-29

    # Category weights (must sum to 1.0)
    "transport_weight": 0.35,
    "electricity_weight": 0.30,
    "food_weight": 0.25,
    "waste_weight": 0.10,
}

# ─── Days per year ────────────────────────────────────────────────────────────
DAYS_PER_YEAR = 365
DAYS_PER_MONTH = 30
