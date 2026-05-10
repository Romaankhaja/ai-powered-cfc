"""
config.py
=========
Centralized configuration using pydantic-settings.
All values read from environment variables with sensible defaults.
"""

from pydantic_settings import BaseSettings
from pydantic import Field, field_validator
from functools import lru_cache


class Settings(BaseSettings):
    # ── App ──────────────────────────────────────────────────────────────────
    app_name: str = "CarbonIQ API"
    app_version: str = "1.0.0"
    debug: bool = False

    @field_validator("debug", mode="before")
    @classmethod
    def _parse_debug(cls, value):
        """Accept common non-boolean environment values without failing startup."""
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"1", "true", "yes", "on", "dev", "development"}:
                return True
            if normalized in {"0", "false", "no", "off", "prod", "production", "release"}:
                return False
        return bool(value)

    # ── CORS ─────────────────────────────────────────────────────────────────
    allowed_origins: str = "http://localhost:3000,http://localhost:3001"

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    # ── OpenAI-compatible LLM ─────────────────────────────────────────────────
    openai_api_key: str = Field(default="", description="LLM API key")
    openai_base_url: str = Field(
        default="https://api.openai.com/v1",
        description="LLM base URL (Ollama, OpenAI, etc.)"
    )
    openai_model: str = Field(default="gpt-4o-mini", description="LLM model name")
    openai_max_tokens: int = Field(default=1024, description="Max tokens for AI responses")
    openai_temperature: float = Field(default=0.7, description="LLM temperature")

    # ── OpenWeatherMap ────────────────────────────────────────────────────────
    openweather_api_key: str = Field(default="")
    openweather_base_url: str = Field(
        default="https://api.openweathermap.org/data/2.5"
    )
    openweather_geo_base_url: str = Field(
        default="https://api.openweathermap.org/geo/1.0"
    )

    # ── OpenAQ ────────────────────────────────────────────────────────────────
    air_quality_api_key: str = Field(default="")
    air_quality_base_url: str = Field(default="https://api.openaq.org/v3")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance — call this everywhere."""
    return Settings()
