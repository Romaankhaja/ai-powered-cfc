"""
ai_insights.py
==============
POST /ai-insights — AI coaching and recommendation endpoint.
"""

from fastapi import APIRouter, HTTPException
from models.request_models import AIInsightRequest
from models.response_models import AIInsightResponse
from services.ai_service import generate_ai_insights
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai-insights", tags=["AI Insights"])


@router.post("", response_model=AIInsightResponse, summary="Generate AI sustainability insights")
async def get_ai_insights(request: AIInsightRequest) -> AIInsightResponse:
    """
    Generate AI-powered sustainability coaching from pre-calculated emission results.
    
    The AI NEVER calculates emissions — it only explains, coaches, and recommends.
    Falls back to deterministic template if LLM API is unavailable.
    """
    try:
        return await generate_ai_insights(request)
    except Exception as e:
        logger.error(f"AI insights error: {e}")
        raise HTTPException(status_code=500, detail=f"AI insights failed: {str(e)}")
