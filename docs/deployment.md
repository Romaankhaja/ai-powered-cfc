# Deployment Notes

## Frontend
- Deploy to Vercel
- Set `NEXT_PUBLIC_API_URL` to the backend URL
- Ensure build-time environment variables are present in the hosting dashboard

## Backend
- Deploy to Render or another ASGI-capable host
- Set CORS origins to the deployed frontend URL
- Provide API keys only through environment variables

## Docker
- Use `docker-compose.yml` for local orchestration
- Keep secrets out of source control

## Operational Guidance
- Keep AI provider keys optional so the app can still run in fallback mode
- Leave weather and AQI services enabled through env vars when available
- Validate both frontend and backend before shipping a release
