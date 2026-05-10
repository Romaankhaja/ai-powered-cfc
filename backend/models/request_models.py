"""
request_models.py
=================
Pydantic v2 request schemas for all API endpoints.
All fields include validation constraints and examples.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
from enum import Enum


# ─── Enums ────────────────────────────────────────────────────────────────────

class TransportMode(str, Enum):
    car = "car"
    bus = "bus"
    train = "train"
    flight = "flight"
    motorcycle = "motorcycle"
    electric_car = "electric_car"
    bicycle = "bicycle"
    walking = "walking"


class DietType(str, Enum):
    meat_heavy = "meat_heavy"
    average = "average"
    vegetarian = "vegetarian"
    vegan = "vegan"
    pescatarian = "pescatarian"


class WasteType(str, Enum):
    general = "general"
    recycled = "recycled"
    composted = "composted"
    minimal = "minimal"


class GridType(str, Enum):
    global_average = "global_average"
    renewable = "renewable"
    coal_heavy = "coal_heavy"
    natural_gas = "natural_gas"


# ─── Sub-models ───────────────────────────────────────────────────────────────

class TransportInput(BaseModel):
    """Daily transport usage across different modes."""
    car_km_per_day: float = Field(default=0.0, ge=0, le=5000, description="Car km driven per day")
    bus_km_per_day: float = Field(default=0.0, ge=0, le=2000, description="Bus km per day")
    train_km_per_day: float = Field(default=0.0, ge=0, le=2000, description="Train km per day")
    flight_km_per_year: float = Field(default=0.0, ge=0, le=200000, description="Total flight km per year")
    motorcycle_km_per_day: float = Field(default=0.0, ge=0, le=1000, description="Motorcycle km per day")
    electric_car_km_per_day: float = Field(default=0.0, ge=0, le=5000, description="Electric car km per day")

    model_config = {
        "json_schema_extra": {
            "example": {
                "car_km_per_day": 30,
                "bus_km_per_day": 10,
                "train_km_per_day": 5,
                "flight_km_per_year": 15000,
                "motorcycle_km_per_day": 0,
                "electric_car_km_per_day": 0,
            }
        }
    }


class ElectricityInput(BaseModel):
    """Monthly electricity consumption."""
    monthly_kwh: float = Field(default=0.0, ge=0, le=10000, description="Monthly electricity usage in kWh")
    grid_type: GridType = Field(default=GridType.global_average, description="Type of electricity grid")

    model_config = {
        "json_schema_extra": {
            "example": {"monthly_kwh": 300, "grid_type": "global_average"}
        }
    }


class FoodInput(BaseModel):
    """Daily food consumption type."""
    diet_type: DietType = Field(default=DietType.average, description="Primary diet type")
    locally_sourced_pct: float = Field(
        default=20.0, ge=0, le=100,
        description="Percentage of food sourced locally (reduces food miles)"
    )

    model_config = {
        "json_schema_extra": {
            "example": {"diet_type": "average", "locally_sourced_pct": 30}
        }
    }


class WasteInput(BaseModel):
    """Daily waste generation."""
    waste_type: WasteType = Field(default=WasteType.general, description="Primary waste management method")
    kg_per_day: float = Field(default=1.0, ge=0, le=50, description="Total waste generated per day in kg")

    model_config = {
        "json_schema_extra": {
            "example": {"waste_type": "recycled", "kg_per_day": 1.5}
        }
    }


# ─── Main Request Models ──────────────────────────────────────────────────────

class CalculationRequest(BaseModel):
    """
    Main request model for carbon footprint calculation.
    All fields are optional with sensible defaults.
    """
    user_name: Optional[str] = Field(default="Anonymous", max_length=100)
    location: Optional[str] = Field(default="Global", description="City or country for context")
    transport: TransportInput = Field(default_factory=TransportInput)
    electricity: ElectricityInput = Field(default_factory=ElectricityInput)
    food: FoodInput = Field(default_factory=FoodInput)
    waste: WasteInput = Field(default_factory=WasteInput)

    model_config = {
        "json_schema_extra": {
            "example": {
                "user_name": "Alex",
                "location": "London",
                "transport": {
                    "car_km_per_day": 25,
                    "bus_km_per_day": 5,
                    "flight_km_per_year": 12000,
                },
                "electricity": {"monthly_kwh": 280, "grid_type": "global_average"},
                "food": {"diet_type": "average", "locally_sourced_pct": 25},
                "waste": {"waste_type": "recycled", "kg_per_day": 1.2},
            }
        }
    }


class AIInsightRequest(BaseModel):
    """
    Request model for AI insight generation.
    Receives pre-calculated results and asks LLM to explain/advise.
    """
    user_name: str = Field(default="User")
    location: Optional[str] = Field(default="Global")
    total_annual_kg: float = Field(description="Total annual CO₂ in kg")
    transport_kg: float = Field(description="Transport annual CO₂ in kg")
    electricity_kg: float = Field(description="Electricity annual CO₂ in kg")
    food_kg: float = Field(description="Food annual CO₂ in kg")
    waste_kg: float = Field(description="Waste annual CO₂ in kg")
    sustainability_score: float = Field(description="Score from 0-100")
    transport_input: TransportInput = Field(default_factory=TransportInput)
    food_input: FoodInput = Field(default_factory=FoodInput)
    electricity_input: ElectricityInput = Field(default_factory=ElectricityInput)
    waste_input: WasteInput = Field(default_factory=WasteInput)

    model_config = {
        "json_schema_extra": {
            "example": {
                "user_name": "Alex",
                "location": "London",
                "total_annual_kg": 7200,
                "transport_kg": 3500,
                "electricity_kg": 2200,
                "food_kg": 1100,
                "waste_kg": 400,
                "sustainability_score": 62,
            }
        }
    }


class WeatherRequest(BaseModel):
    city: str = Field(description="City name", min_length=1, max_length=100)
    country_code: Optional[str] = Field(default=None, description="ISO 3166 country code e.g. 'GB', 'US'")
