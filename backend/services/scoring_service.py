"""
scoring_service.py
==================
Sustainability scoring engine.
Produces a 0-100 score from weighted category sub-scores.
NO AI involved — purely deterministic math.
"""

from data.emission_factors import SCORING_CONFIG, GLOBAL_AVERAGES
from models.response_models import SustainabilityScore, GlobalComparison


def calculate_sustainability_score(
    transport_kg: float,
    electricity_kg: float,
    food_kg: float,
    waste_kg: float,
    transport_score: float,
    electricity_score: float,
    food_score: float,
    waste_score: float,
) -> SustainabilityScore:
    """
    Compute weighted overall sustainability score and derive grade/label/color.
    
    Weights: Transport 35%, Electricity 30%, Food 25%, Waste 10%
    """
    cfg = SCORING_CONFIG

    overall = (
        transport_score * cfg["transport_weight"]
        + electricity_score * cfg["electricity_weight"]
        + food_score * cfg["food_weight"]
        + waste_score * cfg["waste_weight"]
    )
    overall = round(overall, 1)

    grade, label, color = _derive_grade(overall)

    return SustainabilityScore(
        overall_score=overall,
        transport_score=round(transport_score, 1),
        electricity_score=round(electricity_score, 1),
        food_score=round(food_score, 1),
        waste_score=round(waste_score, 1),
        grade=grade,
        label=label,
        color=color,
    )


def _derive_grade(score: float) -> tuple[str, str, str]:
    """Map numeric score to letter grade, label, and hex color."""
    if score >= 90:
        return "A+", "Outstanding", "#10b981"  # emerald
    elif score >= 80:
        return "A", "Excellent", "#22c55e"      # green
    elif score >= 70:
        return "B", "Good", "#84cc16"           # lime
    elif score >= 60:
        return "C", "Average", "#eab308"        # yellow
    elif score >= 45:
        return "D", "Needs Work", "#f97316"     # orange
    else:
        return "F", "Critical", "#ef4444"       # red


def calculate_global_comparison(total_annual_kg: float) -> GlobalComparison:
    """
    Compare user's footprint against world, USA, EU, and Paris Agreement target.
    Positive % = user emits MORE than reference. Negative = user is BETTER.
    """
    world_avg = GLOBAL_AVERAGES["world_average"]
    usa_avg = GLOBAL_AVERAGES["usa_average"]
    eu_avg = GLOBAL_AVERAGES["eu_average"]
    paris = GLOBAL_AVERAGES["sustainability_target"]

    def pct_diff(ref: float) -> float:
        return round(((total_annual_kg - ref) / ref) * 100, 1)

    return GlobalComparison(
        vs_world_average_pct=pct_diff(world_avg),
        vs_usa_average_pct=pct_diff(usa_avg),
        vs_eu_average_pct=pct_diff(eu_avg),
        vs_paris_target_pct=pct_diff(paris),
        world_average_kg=world_avg,
        paris_target_kg=paris,
    )


def generate_monthly_trend(total_annual_kg: float) -> list[dict]:
    """
    Generate a 12-month estimated trend for chart display.
    Uses seasonal variation: summer peaks (cooling/driving), winter lower.
    """
    import random
    months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]
    # Seasonal multipliers (summer high cooling demand, winter moderate heating)
    multipliers = [0.90, 0.85, 0.92, 0.95, 1.00, 1.05,
                   1.10, 1.08, 1.00, 0.95, 0.88, 0.92]
    monthly_base = total_annual_kg / 12

    trend = []
    for i, month in enumerate(months):
        value = round(monthly_base * multipliers[i], 1)
        trend.append({
            "month": month,
            "kg": value,
            "target": round(GLOBAL_AVERAGES["sustainability_target"] / 12, 1),
        })
    return trend
