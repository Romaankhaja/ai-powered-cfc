"""
response_models.py
==================
Pydantic v2 response schemas for all API endpoints.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


# ─── Emission Breakdown ───────────────────────────────────────────────────────

class EmissionBreakdown(BaseModel):
    """Detailed breakdown of emissions by category."""
    transport_kg: float = Field(description="Annual transport CO₂ in kg")
    electricity_kg: float = Field(description="Annual electricity CO₂ in kg")
    food_kg: float = Field(description="Annual food CO₂ in kg")
    waste_kg: float = Field(description="Annual waste CO₂ in kg")
    total_annual_kg: float = Field(description="Total annual CO₂ in kg")
    total_annual_tonnes: float = Field(description="Total annual CO₂ in tonnes")
    daily_kg: float = Field(description="Average daily CO₂ in kg")
    monthly_kg: float = Field(description="Average monthly CO₂ in kg")


class CategoryPercentage(BaseModel):
    """Percentage contribution of each emission category."""
    transport_pct: float
    electricity_pct: float
    food_pct: float
    waste_pct: float


class TransportDetail(BaseModel):
    """Sub-breakdown of transport emissions."""
    car_annual_kg: float
    bus_annual_kg: float
    train_annual_kg: float
    flight_annual_kg: float
    motorcycle_annual_kg: float
    electric_car_annual_kg: float
    total_kg: float


class SustainabilityScore(BaseModel):
    """Sustainability score with component breakdown."""
    overall_score: float = Field(description="Overall score 0-100")
    transport_score: float = Field(description="Transport sub-score 0-100")
    electricity_score: float = Field(description="Electricity sub-score 0-100")
    food_score: float = Field(description="Food sub-score 0-100")
    waste_score: float = Field(description="Waste sub-score 0-100")
    grade: str = Field(description="Letter grade: A+, A, B, C, D, F")
    label: str = Field(description="Human-readable label e.g. 'Good'")
    color: str = Field(description="Hex color code for the score")


class GlobalComparison(BaseModel):
    """How the user compares to global/regional averages."""
    vs_world_average_pct: float = Field(description="% relative to world average (negative = better)")
    vs_usa_average_pct: float
    vs_eu_average_pct: float
    vs_paris_target_pct: float = Field(description="% above/below Paris Agreement target")
    world_average_kg: float
    paris_target_kg: float


# ─── Main Response Models ─────────────────────────────────────────────────────

class CalculationResponse(BaseModel):
    """Full carbon footprint calculation response."""
    user_name: str
    location: str
    calculated_at: datetime = Field(default_factory=datetime.utcnow)
    emissions: EmissionBreakdown
    percentages: CategoryPercentage
    transport_detail: TransportDetail
    score: SustainabilityScore
    global_comparison: GlobalComparison
    monthly_trend: List[Dict[str, Any]] = Field(
        description="12-month estimated trend data for charts"
    )


class AIInsightResponse(BaseModel):
    """AI-generated sustainability insights and recommendations."""
    user_name: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    summary: str = Field(description="1-2 sentence executive summary")
    hotspot_analysis: str = Field(description="Analysis of the biggest emission source")
    reduction_strategies: List[str] = Field(description="Ordered list of reduction strategies")
    quick_wins: List[str] = Field(description="Easy, immediate actions")
    estimated_reduction_potential: str = Field(description="Estimated % reduction if strategies followed")
    motivational_message: str = Field(description="Personalized sustainability coaching message")
    full_insight: str = Field(description="Full AI-generated insight text")


class WeatherData(BaseModel):
    """Weather data for a city."""
    city: str
    country: str
    latitude: float
    longitude: float
    temperature_c: float
    feels_like_c: float
    humidity_pct: float
    pressure_hpa: float
    cloudiness_pct: float
    condition: str
    condition_icon: str
    wind_speed_ms: float
    visibility_km: float
    sustainability_impact: str = Field(description="Climate-related sustainability suggestion")
    fetched_at: datetime = Field(default_factory=datetime.utcnow)


class LocationSuggestion(BaseModel):
    """Suggested locations returned from OpenWeatherMap geocoding."""
    name: str
    display_name: str
    country: str
    state: Optional[str] = None
    latitude: float
    longitude: float


class AirQualityData(BaseModel):
    """Air quality data for a city."""
    city: str
    latitude: float
    longitude: float
    aqi: float = Field(description="Air Quality Index value")
    aqi_category: str = Field(description="e.g. Good, Moderate, Unhealthy")
    aqi_color: str = Field(description="Color code for AQI level")
    pm25: Optional[float] = Field(default=None, description="PM2.5 µg/m³")
    pm10: Optional[float] = Field(default=None, description="PM10 µg/m³")
    no2: Optional[float] = Field(default=None, description="NO2 µg/m³")
    o3: Optional[float] = Field(default=None, description="O3 µg/m³")
    health_message: str = Field(description="Health advisory message")
    fetched_at: datetime = Field(default_factory=datetime.utcnow)


class GlobalStatistics(BaseModel):
    """Global environmental statistics for display."""
    world_avg_annual_kg: float
    usa_avg_annual_kg: float
    eu_avg_annual_kg: float
    india_avg_annual_kg: float
    paris_target_kg: float
    global_temp_increase_c: float
    co2_concentration_ppm: float
    renewable_energy_pct: float
    annual_deforestation_mha: float
    description: str


class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
