"""
waste_service.py
================
Deterministic carbon calculations for waste generation.
Formula: kg_per_day × waste_emission_factor × 365
"""

from data.emission_factors import WASTE_FACTORS, DAYS_PER_YEAR
from models.request_models import WasteInput


def calculate_waste_emissions(waste: WasteInput) -> float:
    """
    Calculate annual waste CO₂ emissions.
    
    Args:
        waste: WasteInput with waste type and daily kg
        
    Returns:
        Annual CO₂ in kg
    """
    factor = WASTE_FACTORS.get(waste.waste_type.value, WASTE_FACTORS["general"])
    
    # Base emission = kg_waste × factor × 365
    # Factor already accounts for waste management method's CO₂ output
    annual_kg = waste.kg_per_day * factor * DAYS_PER_YEAR
    return round(annual_kg, 2)


def calculate_waste_score(annual_kg: float, waste_type: str) -> float:
    """Score waste emissions 0-100."""
    # Bonus for eco-friendly waste management
    method_bonus = {
        "composted": 15,
        "minimal": 12,
        "recycled": 5,
        "general": 0,
    }.get(waste_type, 0)

    if annual_kg <= 50:
        base_score = 100.0
    elif annual_kg <= 100:
        base_score = 100 - ((annual_kg - 50) / 50) * 20
    elif annual_kg <= 200:
        base_score = 80 - ((annual_kg - 100) / 100) * 30
    elif annual_kg <= 400:
        base_score = 50 - ((annual_kg - 200) / 200) * 25
    else:
        base_score = max(0.0, 25 - ((annual_kg - 400) / 400) * 25)

    return round(min(100.0, max(0.0, base_score + method_bonus)), 1)
