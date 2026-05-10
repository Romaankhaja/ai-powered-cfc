"""
calculate.py
============
POST /calculate — Main carbon footprint calculation endpoint.
Orchestrates all calculation services and returns full results.
"""

from fastapi import APIRouter, HTTPException
from models.request_models import CalculationRequest
from models.response_models import CalculationResponse, EmissionBreakdown, CategoryPercentage
from services.transport_service import calculate_transport_emissions, calculate_transport_score
from services.electricity_service import calculate_electricity_emissions, calculate_electricity_score
from services.food_service import calculate_food_emissions, calculate_food_score
from services.waste_service import calculate_waste_emissions, calculate_waste_score
from services.scoring_service import (
    calculate_sustainability_score,
    calculate_global_comparison,
    generate_monthly_trend,
)
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/calculate", tags=["Calculation"])


@router.post("", response_model=CalculationResponse, summary="Calculate carbon footprint")
async def calculate_footprint(request: CalculationRequest) -> CalculationResponse:
    """
    Calculate the user's complete annual carbon footprint.
    
    Uses deterministic emission factors — NO AI involved in calculations.
    
    Returns:
    - Full emission breakdown by category
    - Transport sub-breakdown
    - Sustainability score (0-100) with grade
    - Global comparison percentages
    - 12-month trend data for charts
    """
    try:
        # ── Step 1: Calculate raw emissions ──────────────────────────────────
        transport_detail = calculate_transport_emissions(request.transport)
        transport_kg = transport_detail.total_kg

        electricity_kg = calculate_electricity_emissions(request.electricity)

        food_kg = calculate_food_emissions(request.food)

        waste_kg = calculate_waste_emissions(request.waste)

        total_annual_kg = transport_kg + electricity_kg + food_kg + waste_kg

        # ── Step 2: Calculate category scores ────────────────────────────────
        transport_score = calculate_transport_score(transport_kg)
        electricity_score = calculate_electricity_score(electricity_kg)
        food_score = calculate_food_score(food_kg, request.food.diet_type.value)
        waste_score = calculate_waste_score(waste_kg, request.waste.waste_type.value)

        # ── Step 3: Sustainability score ──────────────────────────────────────
        score = calculate_sustainability_score(
            transport_kg, electricity_kg, food_kg, waste_kg,
            transport_score, electricity_score, food_score, waste_score,
        )

        # ── Step 4: Category percentages ─────────────────────────────────────
        def safe_pct(val: float) -> float:
            return round((val / total_annual_kg) * 100, 1) if total_annual_kg > 0 else 0.0

        percentages = CategoryPercentage(
            transport_pct=safe_pct(transport_kg),
            electricity_pct=safe_pct(electricity_kg),
            food_pct=safe_pct(food_kg),
            waste_pct=safe_pct(waste_kg),
        )

        # ── Step 5: Emission breakdown ────────────────────────────────────────
        emissions = EmissionBreakdown(
            transport_kg=round(transport_kg, 2),
            electricity_kg=round(electricity_kg, 2),
            food_kg=round(food_kg, 2),
            waste_kg=round(waste_kg, 2),
            total_annual_kg=round(total_annual_kg, 2),
            total_annual_tonnes=round(total_annual_kg / 1000, 3),
            daily_kg=round(total_annual_kg / 365, 2),
            monthly_kg=round(total_annual_kg / 12, 2),
        )

        # ── Step 6: Global comparison & trend ────────────────────────────────
        global_comparison = calculate_global_comparison(total_annual_kg)
        monthly_trend = generate_monthly_trend(total_annual_kg)

        logger.info(
            f"Calculated footprint for {request.user_name}: "
            f"{total_annual_kg:.0f} kg/year, score={score.overall_score}"
        )

        return CalculationResponse(
            user_name=request.user_name,
            location=request.location,
            emissions=emissions,
            percentages=percentages,
            transport_detail=transport_detail,
            score=score,
            global_comparison=global_comparison,
            monthly_trend=monthly_trend,
        )

    except Exception as e:
        logger.error(f"Calculation error: {e}")
        raise HTTPException(status_code=500, detail=f"Calculation failed: {str(e)}")
