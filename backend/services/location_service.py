"""
location_service.py
===================
Location search utilities powered by OpenWeatherMap geocoding.
Returns exact latitude/longitude suggestions so the frontend can offer a
precise location dropdown before fetching weather and air quality data.
"""

from __future__ import annotations

import logging

import httpx

from config import get_settings
from models.response_models import LocationSuggestion

logger = logging.getLogger(__name__)


async def search_locations(query: str, limit: int = 6) -> list[LocationSuggestion]:
    """Search for matching locations using OpenWeatherMap direct geocoding."""
    settings = get_settings()
    query = query.strip()
    if not query:
        return []

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{settings.openweather_geo_base_url}/direct",
                params={
                    "q": query,
                    "limit": max(1, min(limit, 10)),
                    "appid": settings.openweather_api_key,
                },
            )
            response.raise_for_status()
            raw_results = response.json()

        return [
            LocationSuggestion(
                name=item["name"],
                display_name=_format_display_name(item),
                country=item.get("country", "--"),
                state=item.get("state"),
                latitude=float(item["lat"]),
                longitude=float(item["lon"]),
            )
            for item in raw_results
        ]

    except Exception as exc:
        logger.warning("Location search failed for %s: %s", query, exc)
        return _fallback_locations(query)


def _format_display_name(item: dict) -> str:
    parts = [item.get("name")]
    if item.get("state"):
        parts.append(item["state"])
    if item.get("country"):
        parts.append(item["country"])
    return ", ".join(part for part in parts if part)


def _fallback_locations(query: str) -> list[LocationSuggestion]:
    """Deterministic fallback when geocoding is unavailable."""
    return []
