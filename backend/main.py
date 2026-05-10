"""
main.py
=======
FastAPI application entry point.
Registers all routers, configures CORS, and sets up middleware.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import sys

from config import get_settings
from routers import calculate, ai_insights, environment, statistics

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)


# ── Lifespan ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logger.info(f"[CarbonIQ] {settings.app_name} v{settings.app_version} starting up")
    logger.info(f"   LLM model: {settings.openai_model}")
    logger.info(f"   LLM base URL: {settings.openai_base_url}")
    yield
    logger.info("[CarbonIQ] API shutting down")


# ── App ───────────────────────────────────────────────────────────────────────
settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "AI-powered Carbon Footprint Intelligence Platform API.\n\n"
        "**Architecture**: All carbon calculations use deterministic Python math. "
        "The AI layer is used exclusively for explanations, coaching, and recommendations.\n\n"
        "**Data sources**: DEFRA 2023, IPCC AR6, IEA 2023, Our World in Data"
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(calculate.router)
app.include_router(ai_insights.router)
app.include_router(environment.router)
app.include_router(statistics.router)

# ── Root ──────────────────────────────────────────────────────────────────────
@app.get("/", include_in_schema=False)
async def root():
    return JSONResponse({
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "docs": "/docs",
        "health": "/health",
    })
