"""
transport_service.py
====================
Deterministic carbon calculations for all transport modes.
Formula: distance_km × emission_factor_kg_per_km × days_per_year
"""

from data.emission_factors import TRANSPORT_FACTORS, DAYS_PER_YEAR
from models.request_models import TransportInput
from models.response_models import TransportDetail


def calculate_transport_emissions(transport: TransportInput) -> TransportDetail:
    """
    Calculate annual transport CO₂ emissions from daily usage inputs.
    
    Args:
        transport: TransportInput with km/day for each mode
        
    Returns:
        TransportDetail with per-mode and total annual kg CO₂
    """
    # Annual km for daily modes
    car_km_annual = transport.car_km_per_day * DAYS_PER_YEAR
    bus_km_annual = transport.bus_km_per_day * DAYS_PER_YEAR
    train_km_annual = transport.train_km_per_day * DAYS_PER_YEAR
    motorcycle_km_annual = transport.motorcycle_km_per_day * DAYS_PER_YEAR
    electric_car_km_annual = transport.electric_car_km_per_day * DAYS_PER_YEAR

    # Calculate emissions per mode (kg CO₂)
    car_kg = car_km_annual * TRANSPORT_FACTORS["car"]
    bus_kg = bus_km_annual * TRANSPORT_FACTORS["bus"]
    train_kg = train_km_annual * TRANSPORT_FACTORS["train"]
    # Flight is already annual km
    flight_kg = transport.flight_km_per_year * TRANSPORT_FACTORS["flight"]
    motorcycle_kg = motorcycle_km_annual * TRANSPORT_FACTORS["motorcycle"]
    electric_car_kg = electric_car_km_annual * TRANSPORT_FACTORS["electric_car"]

    total_kg = car_kg + bus_kg + train_kg + flight_kg + motorcycle_kg + electric_car_kg

    return TransportDetail(
        car_annual_kg=round(car_kg, 2),
        bus_annual_kg=round(bus_kg, 2),
        train_annual_kg=round(train_kg, 2),
        flight_annual_kg=round(flight_kg, 2),
        motorcycle_annual_kg=round(motorcycle_kg, 2),
        electric_car_annual_kg=round(electric_car_kg, 2),
        total_kg=round(total_kg, 2),
    )


def calculate_transport_score(annual_kg: float) -> float:
    """
    Score transport emissions from 0-100 (100 = best / zero emissions).
    Uses linear interpolation between thresholds.
    """
    if annual_kg <= 500:
        return 100.0
    elif annual_kg <= 2000:
        # 100 → 80 between 500-2000
        return 100 - ((annual_kg - 500) / 1500) * 20
    elif annual_kg <= 5000:
        # 80 → 50 between 2000-5000
        return 80 - ((annual_kg - 2000) / 3000) * 30
    elif annual_kg <= 10000:
        # 50 → 20 between 5000-10000
        return 50 - ((annual_kg - 5000) / 5000) * 30
    else:
        return max(0.0, 20 - ((annual_kg - 10000) / 5000) * 20)
