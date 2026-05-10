'use client'

import { motion } from 'framer-motion'
import { Cloud, Droplets, Eye, MapPin, Thermometer, Wind } from 'lucide-react'
import Image from 'next/image'

import type { WeatherData } from '@/lib/types'

interface Props {
  weather: WeatherData
}

const statItems = [
  { label: 'Humidity', key: 'humidity_pct', icon: Droplets, color: 'text-sky-300', suffix: '%' },
  { label: 'Pressure', key: 'pressure_hpa', icon: Thermometer, color: 'text-amber-300', suffix: ' hPa' },
  { label: 'Clouds', key: 'cloudiness_pct', icon: Cloud, color: 'text-violet-300', suffix: '%' },
  { label: 'Wind', key: 'wind_speed_ms', icon: Wind, color: 'text-emerald-300', suffix: ' m/s' },
  { label: 'Visibility', key: 'visibility_km', icon: Eye, color: 'text-cyan-300', suffix: ' km' },
  { label: 'Feels Like', key: 'feels_like_c', icon: Thermometer, color: 'text-orange-300', suffix: '°C' },
] as const

export function WeatherCard({ weather }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bento-card overflow-hidden border border-[var(--border)] bg-[linear-gradient(180deg,rgba(10,14,24,0.92),rgba(16,24,40,0.75))] p-0 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
    >
      <div className="border-b border-[var(--border)] px-6 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                Live Weather
              </span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--card-hover)] px-3 py-1 text-[11px] text-[var(--text-secondary)]">
                Exact coordinates enabled
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                {weather.city}
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {weather.country} · {weather.latitude.toFixed(4)}, {weather.longitude.toFixed(4)}
              </p>
            </div>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--card-hover)] ring-1 ring-white/10">
            {weather.condition_icon ? (
              <Image
                src={weather.condition_icon}
                alt={weather.condition}
                width={56}
                height={56}
                className="h-12 w-12"
                unoptimized
              />
            ) : (
              <Cloud className="h-8 w-8 text-sky-300" />
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="flex items-end gap-4">
              <div>
                <div className="flex items-start gap-1">
                  <span className="text-6xl font-black tracking-tight gradient-text">
                    {Math.round(weather.temperature_c)}
                  </span>
                  <span className="mt-2 text-3xl font-semibold text-[var(--text-secondary)]">°C</span>
                </div>
                <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                  {weather.condition}
                </p>
              </div>
              <div className="mb-1 rounded-2xl border border-[var(--border)] bg-[var(--card-hover)] px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-secondary)]">Feels like</p>
                <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">{weather.feels_like_c}°C</p>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                <MapPin className="h-4 w-4 text-emerald-300" />
                Climate context
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {weather.sustainability_impact}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {statItems.map(({ label, key, icon: Icon, color, suffix }) => {
              const value = weather[key as keyof WeatherData]
              return (
                <div key={label} className="rounded-2xl border border-[var(--border)] bg-white/[0.04] p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-secondary)]">{label}</p>
                      <p className={`mt-1 text-base font-semibold ${color}`}>
                        {typeof value === 'number' ? value.toFixed(key === 'pressure_hpa' ? 0 : 1) : value}
                        {suffix}
                      </p>
                    </div>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
