"""
environment.py
==============
GET /environment/weather - Real-time weather data
GET /environment/air-quality - Real-time air quality data
GET /environment/locations - OpenWeatherMap geocoding suggestions
"""

from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from models.response_models import AirQualityData, LocationSuggestion, WeatherData
from services.air_quality_service import fetch_air_quality
from services.location_service import search_locations
from services.weather_service import fetch_weather

router = APIRouter(prefix="/environment", tags=["Environment"])


@router.get("/weather", response_model=WeatherData, summary="Get current weather for a city")
async def get_weather(
    city: Optional[str] = Query(default=None, description="City name", example="London"),
    country_code: Optional[str] = Query(default=None, description="ISO country code", example="GB"),
    lat: Optional[float] = Query(default=None, description="Latitude from geocoding"),
    lon: Optional[float] = Query(default=None, description="Longitude from geocoding"),
) -> WeatherData:
    """
    Fetch current weather conditions from OpenWeatherMap.
    Includes a climate-related sustainability suggestion based on conditions.
    """
    if lat is not None and lon is not None:
        return await fetch_weather(city or "Selected location", country_code, lat, lon)
    if city:
        return await fetch_weather(city, country_code)
    raise HTTPException(status_code=400, detail="Provide either a city name or latitude/longitude coordinates.")


@router.get("/air-quality", response_model=AirQualityData, summary="Get air quality for a city")
async def get_air_quality(
    city: Optional[str] = Query(default=None, description="City name", example="London"),
    lat: Optional[float] = Query(default=None, description="Latitude from geocoding"),
    lon: Optional[float] = Query(default=None, description="Longitude from geocoding"),
) -> AirQualityData:
    """
    Fetch current air quality index and pollutant readings from OpenAQ.
    Includes health advisory and sustainability messaging.
    """
    if lat is not None and lon is not None:
        return await fetch_air_quality(city or "Selected location", lat, lon)
    if city:
        return await fetch_air_quality(city)
    raise HTTPException(status_code=400, detail="Provide either a city name or latitude/longitude coordinates.")


@router.get("/locations", response_model=list[LocationSuggestion], summary="Search locations")
async def get_locations(
    query: str = Query(description="Location search text", min_length=1, max_length=100, example="London"),
    limit: int = Query(default=6, ge=1, le=10, description="Maximum number of suggestions"),
) -> list[LocationSuggestion]:
    """
    Search for exact location matches using OpenWeatherMap geocoding.
    Returns coordinates so the frontend can fetch weather by lat/lon.
    """
    return await search_locations(query, limit)
