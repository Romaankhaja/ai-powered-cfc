/**
 * types.ts — All shared TypeScript interfaces for the Carbon Footprint Platform
 */

// ─── API Request Types ────────────────────────────────────────────────────────

export type TransportMode = 'car' | 'bus' | 'train' | 'flight' | 'motorcycle' | 'electric_car' | 'bicycle' | 'walking'
export type DietType = 'meat_heavy' | 'average' | 'vegetarian' | 'vegan' | 'pescatarian'
export type WasteType = 'general' | 'recycled' | 'composted' | 'minimal'
export type GridType = 'global_average' | 'renewable' | 'coal_heavy' | 'natural_gas'

export interface TransportInput {
  car_km_per_day: number
  bus_km_per_day: number
  train_km_per_day: number
  flight_km_per_year: number
  motorcycle_km_per_day: number
  electric_car_km_per_day: number
}

export interface ElectricityInput {
  monthly_kwh: number
  grid_type: GridType
}

export interface FoodInput {
  diet_type: DietType
  locally_sourced_pct: number
}

export interface WasteInput {
  waste_type: WasteType
  kg_per_day: number
}

export interface CalculationRequest {
  user_name?: string
  location?: string
  transport: TransportInput
  electricity: ElectricityInput
  food: FoodInput
  waste: WasteInput
}

export interface AIInsightRequest {
  user_name: string
  location?: string
  total_annual_kg: number
  transport_kg: number
  electricity_kg: number
  food_kg: number
  waste_kg: number
  sustainability_score: number
  transport_input: TransportInput
  food_input: FoodInput
  electricity_input: ElectricityInput
  waste_input: WasteInput
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface EmissionBreakdown {
  transport_kg: number
  electricity_kg: number
  food_kg: number
  waste_kg: number
  total_annual_kg: number
  total_annual_tonnes: number
  daily_kg: number
  monthly_kg: number
}

export interface CategoryPercentage {
  transport_pct: number
  electricity_pct: number
  food_pct: number
  waste_pct: number
}

export interface TransportDetail {
  car_annual_kg: number
  bus_annual_kg: number
  train_annual_kg: number
  flight_annual_kg: number
  motorcycle_annual_kg: number
  electric_car_annual_kg: number
  total_kg: number
}

export interface SustainabilityScore {
  overall_score: number
  transport_score: number
  electricity_score: number
  food_score: number
  waste_score: number
  grade: string
  label: string
  color: string
}

export interface GlobalComparison {
  vs_world_average_pct: number
  vs_usa_average_pct: number
  vs_eu_average_pct: number
  vs_paris_target_pct: number
  world_average_kg: number
  paris_target_kg: number
}

export interface MonthlyTrendPoint {
  month: string
  kg: number
  target: number
}

export interface CalculationResponse {
  user_name: string
  location: string
  calculated_at: string
  emissions: EmissionBreakdown
  percentages: CategoryPercentage
  transport_detail: TransportDetail
  score: SustainabilityScore
  global_comparison: GlobalComparison
  monthly_trend: MonthlyTrendPoint[]
}

export interface AIInsightResponse {
  user_name: string
  generated_at: string
  summary: string
  hotspot_analysis: string
  reduction_strategies: string[]
  quick_wins: string[]
  estimated_reduction_potential: string
  motivational_message: string
  full_insight: string
}

export interface WeatherData {
  city: string
  country: string
  latitude: number
  longitude: number
  temperature_c: number
  feels_like_c: number
  humidity_pct: number
  pressure_hpa: number
  cloudiness_pct: number
  condition: string
  condition_icon: string
  wind_speed_ms: number
  visibility_km: number
  sustainability_impact: string
  fetched_at: string
}

export interface LocationSuggestion {
  name: string
  display_name: string
  country: string
  state?: string | null
  latitude: number
  longitude: number
}

export interface AirQualityData {
  city: string
  latitude: number
  longitude: number
  aqi: number
  aqi_category: string
  aqi_color: string
  pm25: number | null
  pm10: number | null
  no2: number | null
  o3: number | null
  health_message: string
  fetched_at: string
}

export interface GlobalStatistics {
  world_avg_annual_kg: number
  usa_avg_annual_kg: number
  eu_avg_annual_kg: number
  india_avg_annual_kg: number
  paris_target_kg: number
  global_temp_increase_c: number
  co2_concentration_ppm: number
  renewable_energy_pct: number
  annual_deforestation_mha: number
  description: string
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  icon: string
}

export type Theme = 'light' | 'dark'
