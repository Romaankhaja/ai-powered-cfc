/**
 * utils.ts — Utility helpers for formatting and class merging
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely (shadcn pattern) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format kg → human-readable emission string */
export function formatEmission(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} t`
  }
  return `${kg.toFixed(1)} kg`
}

/** Format annual kg to tonnes with label */
export function formatTonnes(kg: number): string {
  return `${(kg / 1000).toFixed(2)} t CO₂`
}

/** Format large numbers with commas */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

/** Format percentage with sign */
export function formatPct(pct: number): string {
  const sign = pct > 0 ? '+' : ''
  return `${sign}${pct.toFixed(1)}%`
}

/** Return Tailwind color class for a score 0-100 */
export function scoreToColor(score: number): string {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-green-400'
  if (score >= 45) return 'text-yellow-400'
  if (score >= 30) return 'text-orange-400'
  return 'text-red-400'
}

/** Map score to background gradient */
export function scoreToGradient(score: number): string {
  if (score >= 80) return 'from-emerald-500 to-teal-500'
  if (score >= 60) return 'from-green-500 to-emerald-500'
  if (score >= 45) return 'from-yellow-500 to-orange-400'
  if (score >= 30) return 'from-orange-500 to-red-400'
  return 'from-red-600 to-rose-500'
}

/** Diet type to friendly label */
export const dietLabels: Record<string, string> = {
  meat_heavy:   'Meat-Heavy',
  average:      'Average (Mixed)',
  vegetarian:   'Vegetarian',
  vegan:        'Vegan',
  pescatarian:  'Pescatarian',
}

/** Grid type to friendly label */
export const gridLabels: Record<string, string> = {
  global_average: 'Global Average',
  renewable:      'Renewable Energy',
  coal_heavy:     'Coal-Heavy Grid',
  natural_gas:    'Natural Gas Grid',
}

/** Waste type to friendly label */
export const wasteLabels: Record<string, string> = {
  general:   'General Waste (Landfill)',
  recycled:  'Mixed Recycling',
  composted: 'Composting',
  minimal:   'Minimal Waste',
}

/** Default calculation request */
export const defaultCalculationRequest = {
  user_name: 'User',
  location: 'Global',
  transport: {
    car_km_per_day: 25,
    bus_km_per_day: 5,
    train_km_per_day: 3,
    flight_km_per_year: 10000,
    motorcycle_km_per_day: 0,
    electric_car_km_per_day: 0,
  },
  electricity: {
    monthly_kwh: 300,
    grid_type: 'global_average' as const,
  },
  food: {
    diet_type: 'average' as const,
    locally_sourced_pct: 20,
  },
  waste: {
    waste_type: 'general' as const,
    kg_per_day: 1.2,
  },
}
