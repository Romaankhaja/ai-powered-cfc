# CarbonIQ — AI-Powered Carbon Footprint Intelligence Platform

<div align="center">

![CarbonIQ](https://img.shields.io/badge/CarbonIQ-Sustainability%20AI-10b981?style=for-the-badge&logo=leaf)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)

**A production-quality AI-powered sustainability analytics platform**

[Live Demo](#) · [API Docs](http://localhost:8000/docs) · [Report Bug](#)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔢 **Deterministic Carbon Math** | IPCC/IEA emission formulas — zero AI guesswork in calculations |
| 🤖 **AI Coaching Layer** | GPT/Ollama explains results and provides personalized strategies |
| 📊 **6 Chart Types** | Pie, Line, Bar, Area, Radial score, Heatmap comparisons |
| 🌍 **Live Environmental Data** | Real-time weather (OpenWeatherMap) + AQI (OpenAQ) |
| 🎨 **Premium Dark UI** | Glassmorphism, Framer Motion animations, responsive |
| 🏆 **Sustainability Score** | Weighted 0-100 score with letter grade and color coding |
| 🌡️ **Climate-Aware Tips** | Weather-contextual sustainability suggestions |
| 🐳 **Docker Ready** | One-command full-stack deployment |

---

## 🏗️ Architecture

```
User Input
    ↓
Carbon Calculation Engine  ← Deterministic Python math (NEVER AI)
    ↓
Scoring Engine             ← Weighted 0-100 score
    ↓
Environmental API Layer    ← Weather + AQI enrichment
    ↓
AI Recommendation Engine   ← LLM explains results only
    ↓
Dashboard Visualization    ← Next.js + Recharts
```

> **Critical Rule**: The AI layer receives pre-calculated numbers and generates coaching. It never performs emission calculations.

---

## 🗂️ Project Structure

```
carbon_footprint/
├── frontend/                    # Next.js 14 + TypeScript + TailwindCSS
│   ├── app/
│   │   ├── (app)/              # Dashboard, Calculator, Insights, etc.
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── layout/             # Sidebar, ThemeToggle
│   │   ├── dashboard/          # Charts, StatsCard, Score
│   │   ├── calculator/         # Multi-step CarbonForm
│   │   ├── environment/        # Weather, AQI cards
│   │   └── insights/           # AI insight display
│   └── lib/                    # API client, types, utils
│
├── backend/                     # FastAPI + Python
│   ├── main.py                 # App entry point
│   ├── config.py               # pydantic-settings config
│   ├── routers/                # calculate, ai_insights, environment, statistics
│   ├── services/               # transport, electricity, food, waste, scoring, ai, weather, aq
│   ├── models/                 # Pydantic request/response schemas
│   └── data/                   # Emission factor constants
│
├── docs/                        # API docs, architecture
├── datasets/                    # Data reference files
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- npm or yarn

### 1. Clone & Setup

```bash
git clone <your-repo-url>
cd carbon_footprint
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp ../.env.example .env
# Edit .env with your API keys
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your API URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### One-Command Startup

From the repo root, start both services with:

```bash
npm run dev
```

That launches the FastAPI backend on `http://localhost:8000` and the Next.js frontend on `http://localhost:3000`.

---

## 🐳 Docker Deployment

```bash
# Copy and fill in environment variables
cp .env.example .env

# Start all services
docker-compose up --build

# Backend: http://localhost:8000
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `backend/.env`:

```env
# LLM (OpenAI-compatible — works with Ollama, OpenAI, etc.)
OPENAI_API_KEY=your_key_here
OPENAI_BASE_URL=https://openai.com/v1    # or http://localhost:11434/v1 for Ollama
OPENAI_MODEL=gpt-4o                      # or llama3.2 for Ollama

# OpenWeatherMap (https://openweathermap.org/api)
OPENWEATHER_API_KEY=your_key_here

# OpenAQ (https://explore.openaq.org/account)
AIR_QUALITY_API_KEY=your_key_here

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

Copy `.env.example` → `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/calculate` | Calculate full carbon footprint |
| `POST` | `/ai-insights` | Generate AI sustainability coaching |
| `GET`  | `/environment/weather?city=London` | Fetch weather data |
| `GET`  | `/environment/air-quality?city=London` | Fetch AQI data |
| `GET`  | `/statistics/global` | Global environmental statistics |
| `GET`  | `/health` | API health check |

Full interactive docs: `http://localhost:8000/docs`

---

## 📊 Emission Factors

| Category | Source | Factor |
|----------|--------|--------|
| Car | DEFRA 2023 | 0.21 kg CO₂/km |
| Bus | DEFRA 2023 | 0.08 kg CO₂/km |
| Train | DEFRA 2023 | 0.04 kg CO₂/km |
| Flight | IPCC AR6 | 0.115 kg CO₂/km |
| Electricity | IEA 2023 | 0.82 kg CO₂/kWh |
| Meat-heavy diet | Our World in Data | 7.2 kg CO₂/day |
| Vegan diet | Our World in Data | 2.9 kg CO₂/day |
| General waste | EPA | 0.57 kg CO₂/kg/day |

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel --prod
# Set NEXT_PUBLIC_API_URL to your backend URL in Vercel dashboard
```

### Backend → Render
- Connect GitHub repo
- Set root dir: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add environment variables in Render dashboard

---

## 🧠 AI Provider Compatibility

CarbonIQ uses an OpenAI-compatible API interface. Swap providers by changing env vars:

| Provider | OPENAI_BASE_URL | OPENAI_MODEL |
|----------|-----------------|--------------|
| OpenAI   | `https://api.openai.com/v1` | `gpt-4o` |
| Ollama   | `http://localhost:11434/v1` | `llama3.2` |
| Groq     | `https://api.groq.com/openai/v1` | `llama-3.1-8b-instant` |

---

## 📄 License

MIT License · Built with 💚 for the planet
