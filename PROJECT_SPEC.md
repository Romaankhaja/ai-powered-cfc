# CarbonIQ Project Specification

## Overview
CarbonIQ is a production-oriented carbon footprint intelligence platform that combines deterministic environmental calculations with AI-generated coaching and recommendations.

The platform is intentionally split into two layers:
- Deterministic analytics for all emissions and scoring math
- AI explanations and recommendations for user guidance

## Core Principles
- Never use AI for carbon calculations
- Keep calculation logic modular and testable
- Use API-first architecture with typed contracts
- Prefer graceful fallbacks when external APIs are unavailable

## Primary Modules
- Frontend: Next.js, TypeScript, TailwindCSS, Framer Motion, Recharts
- Backend: FastAPI, Pydantic, async service layer
- AI: OpenAI-compatible provider abstraction with template fallback
- Environment data: Weather and AQI enrichment services

## Endpoints
- `POST /calculate`
- `POST /ai-insights`
- `GET /environment/weather`
- `GET /environment/air-quality`
- `GET /statistics/global`
- `GET /health`

## Data Flow
1. User submits lifestyle inputs
2. Backend calculates category emissions deterministically
3. Scoring service produces a sustainability score
4. Environmental APIs enrich the dashboard with live context
5. AI service converts results into personalized coaching
6. Frontend visualizes everything in a premium dashboard experience

## Deployment Targets
- Frontend: Vercel
- Backend: Render or similar ASGI host
- Local orchestration: Docker Compose

## Acceptance Criteria
- Frontend build succeeds without external font fetches
- Backend imports and compiles cleanly
- Env files use safe placeholders, not secrets
- Dashboard renders demo data even when APIs are unavailable
- AI responses degrade gracefully to deterministic templates
