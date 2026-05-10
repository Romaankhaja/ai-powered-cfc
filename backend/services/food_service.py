"""
food_service.py
===============
Deterministic carbon calculations for food consumption.
Formula: diet_factor_kg_per_day × 365 × (1 - local_sourcing_reduction)
"""

from data.emission_factors import FOOD_FACTORS, DAYS_PER_YEAR
from models.request_models import FoodInput


# Local sourcing reduces food miles by up to 15% at 100% local
LOCAL_SOURCING_MAX_REDUCTION = 0.15


def calculate_food_emissions(food: FoodInput) -> float:
    """
    Calculate annual food CO₂ emissions.
    
    Args:
        food: FoodInput with diet type and local sourcing percentage
        
    Returns:
        Annual CO₂ in kg
    """
    base_daily_kg = FOOD_FACTORS.get(food.diet_type.value, FOOD_FACTORS["average"])
    
    # Apply local sourcing reduction (max 15% reduction at 100% local)
    local_factor = 1.0 - (food.locally_sourced_pct / 100) * LOCAL_SOURCING_MAX_REDUCTION
    
    annual_kg = base_daily_kg * DAYS_PER_YEAR * local_factor
    return round(annual_kg, 2)


def calculate_food_score(annual_kg: float, diet_type: str) -> float:
    """Score food emissions 0-100."""
    # Diet type bonus
    diet_bonus = {
        "vegan": 10,
        "vegetarian": 7,
        "pescatarian": 4,
        "average": 0,
        "meat_heavy": -10,
    }.get(diet_type, 0)

    if annual_kg <= 1000:
        base_score = 100.0
    elif annual_kg <= 1500:
        base_score = 100 - ((annual_kg - 1000) / 500) * 20
    elif annual_kg <= 2000:
        base_score = 80 - ((annual_kg - 1500) / 500) * 25
    elif annual_kg <= 2500:
        base_score = 55 - ((annual_kg - 2000) / 500) * 20
    else:
        base_score = max(0.0, 35 - ((annual_kg - 2500) / 1500) * 35)

    return round(min(100.0, max(0.0, base_score + diet_bonus)), 1)
