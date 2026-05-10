"""
air_quality_service.py
======================
Fetch air quality data from OpenAQ API v3.
Provides AQI metrics and health/environmental messaging.
"""

import httpx
import logging
from config import get_settings
from models.response_models import AirQualityData

logger = logging.getLogger(__name__)


def _classify_aqi(aqi: float) -> tuple[str, str]:
    """Return (category label, hex color) for given AQI value (US EPA scale)."""
    if aqi <= 50:
        return "Good", "#22c55e"
    elif aqi <= 100:
        return "Moderate", "#eab308"
    elif aqi <= 150:
        return "Unhealthy for Sensitive Groups", "#f97316"
    elif aqi <= 200:
        return "Unhealthy", "#ef4444"
    elif aqi <= 300:
        return "Very Unhealthy", "#8b5cf6"
    else:
        return "Hazardous", "#7f1d1d"


def _health_message(aqi: float, category: str) -> str:
    """Generate health and sustainability advisory based on AQI."""
    if aqi <= 50:
        return (
            "Air quality is excellent today. Perfect conditions for outdoor exercise and cycling — "
            "consider replacing a short car trip with active transport."
        )
    elif aqi <= 100:
        return (
            "Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion. "
            "Vehicle emissions are a primary source of urban air pollution — consider carpooling today."
        )
    elif aqi <= 150:
        return (
            f"Air quality is {category}. Limit outdoor activity if you have respiratory conditions. "
            "Transport emissions significantly worsen air quality — working from home reduces your contribution."
        )
    elif aqi <= 200:
        return (
            f"Air quality is {category}. Everyone should reduce prolonged outdoor exertion. "
            "High pollution levels are linked to fossil fuel combustion. "
            "Avoid driving unless necessary and consider an air purifier indoors."
        )
    else:
        return (
            f"Air quality is {category} — a public health emergency level. Stay indoors, "
            "use air purifiers, and avoid all outdoor exercise. Industrial and vehicle emissions "
            "are the primary driver of hazardous air quality events."
        )


async def fetch_air_quality(
    city: str,
    latitude: float | None = None,
    longitude: float | None = None,
) -> AirQualityData:
    """Fetch latest air quality readings for a city from OpenAQ API v3."""
    settings = get_settings()

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Get location ID for city
            loc_params = {"limit": 1, "order_by": "id"}
            if latitude is not None and longitude is not None:
                loc_params["coordinates"] = f"{latitude},{longitude}"
                loc_params["radius"] = 10000
            else:
                loc_params["city"] = city

            loc_response = await client.get(
                f"{settings.air_quality_base_url}/locations",
                params=loc_params,
                headers={"X-API-Key": settings.air_quality_api_key},
            )
            loc_response.raise_for_status()
            locations = loc_response.json().get("results", [])

            if not locations:
                return _aq_fallback(city)

            location = locations[0]
            location_id = location["id"]
            coordinates = location.get("coordinates", {})

            # Get latest measurements
            meas_response = await client.get(
                f"{settings.air_quality_base_url}/sensors",
                params={"locations_id": location_id, "limit": 20},
                headers={"X-API-Key": settings.air_quality_api_key},
            )
            meas_response.raise_for_status()
            measurements = meas_response.json().get("results", [])

        # Extract pollutants
        pm25 = pm10 = no2 = o3 = None
        for m in measurements:
            param = m.get("parameter", {}).get("name", "").lower()
            value = m.get("latest", {}).get("value")
            if value is not None:
                if param == "pm25":
                    pm25 = round(float(value), 1)
                elif param == "pm10":
                    pm10 = round(float(value), 1)
                elif param == "no2":
                    no2 = round(float(value), 1)
                elif param == "o3":
                    o3 = round(float(value), 1)

        # Estimate AQI from PM2.5 if available (simplified US EPA formula)
        if pm25 is not None:
            aqi = _pm25_to_aqi(pm25)
        elif pm10 is not None:
            aqi = _pm10_to_aqi(pm10)
        else:
            aqi = 50.0  # Default moderate

        category, color = _classify_aqi(aqi)

        return AirQualityData(
            city=location.get("locality") or location.get("name") or city,
            latitude=round(float(coordinates.get("latitude", latitude or 0.0)), 4),
            longitude=round(float(coordinates.get("longitude", longitude or 0.0)), 4),
            aqi=round(aqi, 1),
            aqi_category=category,
            aqi_color=color,
            pm25=pm25,
            pm10=pm10,
            no2=no2,
            o3=o3,
            health_message=_health_message(aqi, category),
        )

    except Exception as e:
        logger.error(f"Air quality fetch error: {e}")
        return _aq_fallback(city)


def _pm25_to_aqi(pm25: float) -> float:
    """Simplified US EPA PM2.5 → AQI conversion."""
    # Breakpoints: [pm_low, pm_high, aqi_low, aqi_high]
    breakpoints = [
        (0.0, 12.0, 0, 50),
        (12.1, 35.4, 51, 100),
        (35.5, 55.4, 101, 150),
        (55.5, 150.4, 151, 200),
        (150.5, 250.4, 201, 300),
        (250.5, 500.4, 301, 500),
    ]
    for c_low, c_high, i_low, i_high in breakpoints:
        if c_low <= pm25 <= c_high:
            aqi = ((i_high - i_low) / (c_high - c_low)) * (pm25 - c_low) + i_low
            return round(aqi, 1)
    return 500.0


def _pm10_to_aqi(pm10: float) -> float:
    """Simplified PM10 → AQI conversion."""
    breakpoints = [
        (0, 54, 0, 50),
        (55, 154, 51, 100),
        (155, 254, 101, 150),
        (255, 354, 151, 200),
        (355, 424, 201, 300),
    ]
    for c_low, c_high, i_low, i_high in breakpoints:
        if c_low <= pm10 <= c_high:
            return round(((i_high - i_low) / (c_high - c_low)) * (pm10 - c_low) + i_low, 1)
    return 300.0


def _aq_fallback(city: str) -> AirQualityData:
    """Placeholder when API is unavailable."""
    return AirQualityData(
        city=city,
        latitude=0.0,
        longitude=0.0,
        aqi=75.0,
        aqi_category="Moderate",
        aqi_color="#eab308",
        pm25=18.5,
        pm10=35.0,
        no2=22.0,
        o3=45.0,
        health_message=(
            "Air quality data is currently unavailable. "
            "As a general practice, reducing vehicle usage and switching to clean energy "
            "are the most effective ways to improve local air quality."
        ),
    )
