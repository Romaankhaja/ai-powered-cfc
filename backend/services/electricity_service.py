"""
electricity_service.py
======================
Deterministic carbon calculations for electricity consumption.
Formula: monthly_kwh × 12 × grid_emission_factor
"""

from data.emission_factors import ELECTRICITY_FACTORS, DAYS_PER_YEAR
from models.request_models import ElectricityInput


def calculate_electricity_emissions(electricity: ElectricityInput) -> float:
    """
    Calculate annual electricity CO₂ emissions.
    
    Args:
        electricity: ElectricityInput with monthly kWh and grid type
        
    Returns:
        Annual CO₂ in kg
    """
    factor = ELECTRICITY_FACTORS.get(electricity.grid_type.value, ELECTRICITY_FACTORS["global_average"])
    annual_kwh = electricity.monthly_kwh * 12
    annual_kg = annual_kwh * factor
    return round(annual_kg, 2)


def calculate_electricity_score(annual_kg: float) -> float:
    """Score electricity emissions 0-100 (100 = zero emissions)."""
    if annual_kg <= 300:
        return 100.0
    elif annual_kg <= 1500:
        return 100 - ((annual_kg - 300) / 1200) * 25
    elif annual_kg <= 3500:
        return 75 - ((annual_kg - 1500) / 2000) * 30
    elif annual_kg <= 6000:
        return 45 - ((annual_kg - 3500) / 2500) * 25
    else:
        return max(0.0, 20 - ((annual_kg - 6000) / 4000) * 20)
