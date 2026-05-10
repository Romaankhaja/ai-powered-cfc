"""
weather_service.py
==================
Fetch weather data from OpenWeatherMap API.
Enriches results with climate-related sustainability suggestions.
"""

import httpx
import logging
from config import get_settings
from models.response_models import WeatherData

logger = logging.getLogger(__name__)


def _get_sustainability_tip(temp_c: float, condition: str, humidity: float) -> str:
    """Generate a climate-informed sustainability suggestion."""
    condition_lower = condition.lower()

    if temp_c > 30:
        return (
            f"High temperatures ({temp_c:.1f}°C) increase air conditioning demand. "
            "Use fans, close blinds during the day, and set AC to 26°C to reduce cooling emissions by up to 30%."
        )
    elif temp_c < 5:
        return (
            f"Cold weather ({temp_c:.1f}°C) increases heating energy use. "
            "Seal draughts, use a programmable thermostat, and wear layers indoors to cut heating emissions."
        )
    elif "rain" in condition_lower or "drizzle" in condition_lower:
        return (
            "Rainy weather is perfect for staying local. "
            "Working from home today eliminates commute emissions and supports indoor energy conservation."
        )
    elif "clear" in condition_lower or "sunny" in condition_lower:
        return (
            f"Sunny skies ({temp_c:.1f}°C) are ideal for solar energy generation and active transport. "
            "Consider cycling or walking — great for zero-emission travel and personal health."
        )
    elif "cloud" in condition_lower:
        return (
            "Overcast conditions reduce solar panel output. "
            "This is a good day to minimise electricity-intensive activities."
        )
    else:
        return (
            f"Current conditions: {condition} at {temp_c:.1f}°C. "
            "Monitor your energy usage today and aim to keep consumption within your daily budget."
        )


async def fetch_weather(
    city: str,
    country_code: str | None = None,
    latitude: float | None = None,
    longitude: float | None = None,
) -> WeatherData:
    """Fetch current weather from OpenWeatherMap."""
    settings = get_settings()
    location = f"{city},{country_code}" if country_code else city

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            params = {
                "appid": settings.openweather_api_key,
                "units": "metric",
            }
            if latitude is not None and longitude is not None:
                params["lat"] = latitude
                params["lon"] = longitude
            else:
                params["q"] = location

            response = await client.get(
                f"{settings.openweather_base_url}/weather",
                params=params,
            )
            response.raise_for_status()
            data = response.json()

        temp = data["main"]["temp"]
        feels_like = data["main"]["feels_like"]
        humidity = data["main"]["humidity"]
        pressure = data["main"].get("pressure", 1013)
        cloudiness = data.get("clouds", {}).get("all", 0)
        condition = data["weather"][0]["description"].title()
        icon = data["weather"][0]["icon"]
        wind_speed = data["wind"]["speed"]
        visibility = data.get("visibility", 10000) / 1000  # Convert m to km
        coord = data.get("coord", {})

        return WeatherData(
            city=data["name"],
            country=data["sys"]["country"],
            latitude=round(float(coord.get("lat", latitude or 0.0)), 4),
            longitude=round(float(coord.get("lon", longitude or 0.0)), 4),
            temperature_c=round(temp, 1),
            feels_like_c=round(feels_like, 1),
            humidity_pct=humidity,
            pressure_hpa=round(float(pressure), 0),
            cloudiness_pct=round(float(cloudiness), 0),
            condition=condition,
            condition_icon=f"https://openweathermap.org/img/wn/{icon}@2x.png",
            wind_speed_ms=wind_speed,
            visibility_km=round(visibility, 1),
            sustainability_impact=_get_sustainability_tip(temp, condition, humidity),
        )

    except httpx.HTTPStatusError as e:
        logger.error(f"Weather API error: {e.response.status_code} — {e.response.text}")
        return _weather_fallback(city)
    except Exception as e:
        logger.error(f"Weather fetch error: {e}")
        return _weather_fallback(city)


def _weather_fallback(city: str) -> WeatherData:
    """Return placeholder data when API is unavailable."""
    return WeatherData(
        city=city,
        country="--",
        latitude=0.0,
        longitude=0.0,
        temperature_c=20.0,
        feels_like_c=19.5,
        humidity_pct=60.0,
        pressure_hpa=1013.0,
        cloudiness_pct=40.0,
        condition="Data Unavailable",
        condition_icon="https://openweathermap.org/img/wn/02d@2x.png",
        wind_speed_ms=3.5,
        visibility_km=10.0,
        sustainability_impact=(
            "Weather data is currently unavailable. "
            "In general, moderate temperatures reduce both heating and cooling energy needs — "
            "take advantage of mild weather to reduce your home energy consumption."
        ),
    )
