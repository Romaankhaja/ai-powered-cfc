"""
statistics.py
=============
GET /statistics/global — Global environmental statistics
GET /health — Health check
"""

from fastapi import APIRouter
from models.response_models import GlobalStatistics, HealthResponse
from config import get_settings
from datetime import datetime

router = APIRouter(tags=["Statistics"])


@router.get("/statistics/global", response_model=GlobalStatistics, summary="Global environmental statistics")
async def get_global_statistics() -> GlobalStatistics:
    """
    Returns curated global environmental statistics for dashboard display.
    Data sourced from IEA, IPCC AR6, Our World in Data (2023/2024).
    """
    return GlobalStatistics(
        world_avg_annual_kg=4_800,
        usa_avg_annual_kg=14_900,
        eu_avg_annual_kg=6_800,
        india_avg_annual_kg=1_900,
        paris_target_kg=2_300,
        global_temp_increase_c=1.2,
        co2_concentration_ppm=421.0,
        renewable_energy_pct=30.0,
        annual_deforestation_mha=10.0,
        description=(
            "Global CO₂ concentration reached 421 ppm in 2024, the highest in 3 million years. "
            "The world average footprint of 4.8 tonnes per person per year must reach 2.3 tonnes "
            "by 2030 to stay within 1.5°C warming, per the Paris Agreement."
        ),
    )


@router.get("/health", response_model=HealthResponse, summary="API health check")
async def health_check() -> HealthResponse:
    """Returns API health status, version, and current timestamp."""
    settings = get_settings()
    return HealthResponse(
        status="ok",
        version=settings.app_version,
        timestamp=datetime.utcnow(),
    )
