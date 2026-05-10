/**
 * api.ts — Axios client and all API call functions
 */

import axios from 'axios'
import type {
  CalculationRequest,
  CalculationResponse,
  AIInsightRequest,
  AIInsightResponse,
  WeatherData,
  AirQualityData,
  GlobalStatistics,
  LocationSuggestion,
} from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Calculation ──────────────────────────────────────────────────────────────

export async function calculateFootprint(data: CalculationRequest): Promise<CalculationResponse> {
  const res = await apiClient.post<CalculationResponse>('/calculate', data)
  return res.data
}

// ─── AI Insights ──────────────────────────────────────────────────────────────

export async function getAIInsights(data: AIInsightRequest): Promise<AIInsightResponse> {
  const res = await apiClient.post<AIInsightResponse>('/ai-insights', data)
  return res.data
}

// ─── Environment ──────────────────────────────────────────────────────────────

export async function searchLocations(query: string, limit = 6): Promise<LocationSuggestion[]> {
  const res = await apiClient.get<LocationSuggestion[]>('/environment/locations', {
    params: { query, limit },
  })
  return res.data
}

export async function getWeather(
  city?: string,
  countryCode?: string,
  lat?: number,
  lon?: number
): Promise<WeatherData> {
  const params: Record<string, string | number> = {}
  if (city) params.city = city
  if (countryCode) params.country_code = countryCode
  if (lat !== undefined && lon !== undefined) {
    params.lat = lat
    params.lon = lon
  }
  const res = await apiClient.get<WeatherData>('/environment/weather', { params })
  return res.data
}

export async function getAirQuality(
  city?: string,
  lat?: number,
  lon?: number
): Promise<AirQualityData> {
  const params: Record<string, string | number> = {}
  if (city) params.city = city
  if (lat !== undefined && lon !== undefined) {
    params.lat = lat
    params.lon = lon
  }
  const res = await apiClient.get<AirQualityData>('/environment/air-quality', { params })
  return res.data
}

// ─── Statistics ───────────────────────────────────────────────────────────────

export async function getGlobalStatistics(): Promise<GlobalStatistics> {
  const res = await apiClient.get<GlobalStatistics>('/statistics/global')
  return res.data
}

export async function checkHealth(): Promise<{ status: string; version: string }> {
  const res = await apiClient.get('/health')
  return res.data
}
