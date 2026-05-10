# API Reference

## `POST /calculate`
Calculates the annual carbon footprint from deterministic input data.

### Input
- Transport usage
- Electricity usage
- Food profile
- Waste profile

### Output
- Emission breakdown
- Category percentages
- Transport sub-breakdown
- Sustainability score
- Global comparison
- Monthly trend data

## `POST /ai-insights`
Generates coaching and recommendations from already calculated emissions.

### Important
AI is not allowed to recalculate emissions. It only explains and recommends.

## `GET /environment/weather`
Fetches weather details and returns a sustainability tip based on conditions.

## `GET /environment/air-quality`
Fetches AQI and pollutant context for a city.

## `GET /statistics/global`
Returns global environmental reference values for dashboard cards and charts.

## `GET /health`
Returns a simple health payload with version and timestamp.
