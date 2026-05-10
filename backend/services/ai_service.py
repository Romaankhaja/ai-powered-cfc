"""
ai_service.py
=============
AI insight generation layer.
Sends pre-calculated results to an OpenAI-compatible LLM.
The LLM NEVER calculates emissions — it only explains and coaches.
"""

import json
import logging
from openai import AsyncOpenAI
from config import get_settings
from models.request_models import AIInsightRequest
from models.response_models import AIInsightResponse

logger = logging.getLogger(__name__)


def _build_prompt(req: AIInsightRequest) -> str:
    """
    Construct a detailed prompt from pre-calculated results.
    The LLM receives numbers; it explains and coaches — never calculates.
    """
    total_tonnes = round(req.total_annual_kg / 1000, 2)
    transport_pct = round((req.transport_kg / req.total_annual_kg) * 100, 1) if req.total_annual_kg > 0 else 0
    electricity_pct = round((req.electricity_kg / req.total_annual_kg) * 100, 1) if req.total_annual_kg > 0 else 0
    food_pct = round((req.food_kg / req.total_annual_kg) * 100, 1) if req.total_annual_kg > 0 else 0
    waste_pct = round((req.waste_kg / req.total_annual_kg) * 100, 1) if req.total_annual_kg > 0 else 0

    return f"""You are CarbonIQ, an expert sustainability coach and environmental data analyst.

A user named {req.user_name} from {req.location} has calculated their annual carbon footprint.

== CALCULATED RESULTS (do NOT recalculate, these are final) ==
Total Annual Footprint: {total_tonnes} tonnes CO₂e ({req.total_annual_kg:,.0f} kg)
Sustainability Score: {req.sustainability_score}/100

Breakdown:
- Transport: {req.transport_kg:,.0f} kg ({transport_pct}%)
- Electricity: {req.electricity_kg:,.0f} kg ({electricity_pct}%)
- Food: {req.food_kg:,.0f} kg ({food_pct}%)
- Waste: {req.waste_kg:,.0f} kg ({waste_pct}%)

User Lifestyle Details:
- Diet: {req.food_input.diet_type.value} ({req.food_input.locally_sourced_pct}% locally sourced)
- Electricity grid: {req.electricity_input.grid_type.value} ({req.electricity_input.monthly_kwh} kWh/month)
- Waste management: {req.waste_input.waste_type.value} ({req.waste_input.kg_per_day} kg/day)
- Car: {req.transport_input.car_km_per_day} km/day
- Flights: {req.transport_input.flight_km_per_year} km/year
- Public transport: Bus {req.transport_input.bus_km_per_day} km/day, Train {req.transport_input.train_km_per_day} km/day

World average: 4,800 kg/year. Paris Agreement target: 2,300 kg/year.

== YOUR TASK ==
Provide a JSON response with these exact keys:
{{
  "summary": "1-2 sentence personalized executive summary comparing to global average",
  "hotspot_analysis": "2-3 sentence analysis of the biggest emission source and why it matters",
  "reduction_strategies": ["strategy 1", "strategy 2", "strategy 3", "strategy 4", "strategy 5"],
  "quick_wins": ["easy action 1", "easy action 2", "easy action 3"],
  "estimated_reduction_potential": "X-Y% reduction possible with above strategies",
  "motivational_message": "1-2 sentence personalized motivational coaching message",
  "full_insight": "3-4 paragraph comprehensive sustainability coaching response"
}}

Be specific, data-driven, practical, and encouraging. Reference the user's actual numbers."""


async def generate_ai_insights(req: AIInsightRequest) -> AIInsightResponse:
    """
    Generate AI sustainability insights using OpenAI-compatible API.
    Falls back to deterministic template if API unavailable.
    """
    settings = get_settings()

    try:
        if not settings.openai_api_key:
            raise ValueError("No API key configured")

        client = AsyncOpenAI(
            api_key=settings.openai_api_key,
            base_url=settings.openai_base_url,
        )

        prompt = _build_prompt(req)

        response = await client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {
                    "role": "system",
                    "content": "You are CarbonIQ, an expert sustainability coach. Always respond with valid JSON."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=settings.openai_max_tokens,
            temperature=settings.openai_temperature,
            response_format={"type": "json_object"},
        )

        raw = response.choices[0].message.content
        data = json.loads(raw)

        return AIInsightResponse(
            user_name=req.user_name,
            summary=data.get("summary", ""),
            hotspot_analysis=data.get("hotspot_analysis", ""),
            reduction_strategies=data.get("reduction_strategies", []),
            quick_wins=data.get("quick_wins", []),
            estimated_reduction_potential=data.get("estimated_reduction_potential", ""),
            motivational_message=data.get("motivational_message", ""),
            full_insight=data.get("full_insight", ""),
        )

    except Exception as e:
        logger.warning(f"AI API error — using deterministic fallback: {e}")
        return _deterministic_fallback(req)


def _deterministic_fallback(req: AIInsightRequest) -> AIInsightResponse:
    """
    Template-based fallback when AI API is unavailable.
    Provides useful insights without requiring an LLM.
    """
    total_tonnes = round(req.total_annual_kg / 1000, 2)
    world_avg_tonnes = 4.8
    diff_pct = round(((req.total_annual_kg - 4800) / 4800) * 100, 1)
    comparison = "above" if diff_pct > 0 else "below"

    # Identify hotspot
    categories = {
        "Transport": req.transport_kg,
        "Electricity": req.electricity_kg,
        "Food": req.food_kg,
        "Waste": req.waste_kg,
    }
    hotspot = max(categories, key=categories.get)
    hotspot_pct = round((categories[hotspot] / req.total_annual_kg) * 100, 1) if req.total_annual_kg > 0 else 0

    summary = (
        f"{req.user_name}'s annual carbon footprint is {total_tonnes} tonnes CO₂e, "
        f"which is {abs(diff_pct)}% {comparison} the global average of {world_avg_tonnes} tonnes. "
        f"With a sustainability score of {req.sustainability_score}/100, there is meaningful room for improvement."
    )

    hotspot_analysis = (
        f"{hotspot} is your largest emission source at {hotspot_pct}% of your total footprint. "
        f"This category contributes {categories[hotspot]:,.0f} kg CO₂ annually. "
        f"Focusing reduction efforts here will have the highest impact on your overall footprint."
    )

    strategies = [
        "Switch to public transport or electric vehicle for daily commutes",
        "Transition to a renewable energy provider or install solar panels",
        "Reduce meat consumption by 3+ days per week",
        "Implement a comprehensive home recycling and composting system",
        "Offset unavoidable emissions through certified carbon offset programs",
    ]

    quick_wins = [
        "Enable power-saving mode on all devices and unplug chargers when not in use",
        "Replace one meat meal per week with a plant-based alternative",
        "Use reusable bags, bottles, and containers to reduce daily waste",
    ]

    full_insight = (
        f"Based on your calculated footprint of {total_tonnes} tonnes CO₂e per year, "
        f"your {hotspot.lower()} emissions represent your biggest opportunity for improvement at {hotspot_pct}% of the total.\n\n"
        f"Compared to the world average of {world_avg_tonnes} tonnes, you are {abs(diff_pct)}% {comparison}. "
        f"To align with the Paris Agreement's 2.3-tonne target, a reduction of "
        f"{round(max(0, req.total_annual_kg - 2300) / 1000, 1)} tonnes is needed.\n\n"
        f"Your sustainability score of {req.sustainability_score}/100 reflects your current lifestyle. "
        f"The strategies above, if implemented, could reduce your footprint by 20-35% within 12 months.\n\n"
        f"Small, consistent changes compound over time. Starting with quick wins builds momentum "
        f"for larger lifestyle shifts that create lasting environmental impact."
    )

    return AIInsightResponse(
        user_name=req.user_name,
        summary=summary,
        hotspot_analysis=hotspot_analysis,
        reduction_strategies=strategies,
        quick_wins=quick_wins,
        estimated_reduction_potential="20-35% reduction possible with recommended strategies",
        motivational_message=(
            f"Every action counts, {req.user_name}. Your score of {req.sustainability_score}/100 "
            f"is a starting point — not a ceiling. The planet needs champions like you."
        ),
        full_insight=full_insight,
    )
