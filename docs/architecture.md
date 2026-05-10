# Architecture Overview

## Frontend
- Next.js app router
- TypeScript throughout
- TailwindCSS for design tokens and responsive layout
- Framer Motion for transitions and animated dashboards
- Recharts for the analytics layer

## Backend
- FastAPI router-based API
- Pydantic request and response schemas
- Service layer per emission category
- Central scoring service for cross-category aggregation

## AI Layer
- Uses an OpenAI-compatible client interface
- Receives only pre-calculated results
- Generates summaries, hotspots, and recommendations
- Falls back to deterministic coaching when the provider is unavailable

## External Intelligence
- Weather data from OpenWeatherMap
- Air quality data from OpenAQ
- Global statistics are served from curated constants for reliable dashboard rendering

## Deployment
- Frontend ships as a Vercel-friendly Next.js app
- Backend runs as an ASGI service with CORS enabled
- Docker Compose ties both services together for local development
