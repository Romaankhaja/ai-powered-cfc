'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Droplets, MapPin, Wind } from 'lucide-react'

import type { AirQualityData } from '@/lib/types'

interface Props {
  data: AirQualityData
}

const pollutantMeta = [
  { label: 'PM2.5', key: 'pm25', unit: 'µg/m³', limit: 35 },
  { label: 'PM10', key: 'pm10', unit: 'µg/m³', limit: 150 },
  { label: 'NO₂', key: 'no2', unit: 'µg/m³', limit: 100 },
  { label: 'O₃', key: 'o3', unit: 'µg/m³', limit: 100 },
] as const

export function AirQualityCard({ data }: Props) {
  const aqiPercent = Math.min((data.aqi / 300) * 100, 100)
  const isGood = data.aqi <= 50
  const pollutants = pollutantMeta.filter(meta => data[meta.key] !== null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bento-card overflow-hidden border border-[var(--border)] bg-[linear-gradient(180deg,rgba(15,16,24,0.93),rgba(21,18,33,0.8))] p-0 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
    >
      <div className="border-b border-[var(--border)] px-6 pt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-300">
                Air Quality
              </span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--card-hover)] px-3 py-1 text-[11px] text-[var(--text-secondary)]">
                Monitoring nearest station
              </span>
            </div>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-[var(--text-primary)]">{data.city}</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
            </p>
          </div>

          <div className="rounded-2xl px-3 py-1.5 text-xs font-semibold text-white" style={{ backgroundColor: data.aqi_color }}>
            {data.aqi_category}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-[var(--border)] bg-white/[0.03] p-5">
            <div className="flex items-center gap-4">
              <div className="relative h-28 w-28 flex-shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke={data.aqi_color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={251}
                    initial={{ strokeDashoffset: 251 }}
                    animate={{ strokeDashoffset: 251 - (aqiPercent / 100) * 251 }}
                    transition={{ duration: 1.4, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black" style={{ color: data.aqi_color }}>
                    {data.aqi.toFixed(0)}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-secondary)]">AQI</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {isGood ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                  )}
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {isGood ? 'Good air quality' : 'Sensitive groups should monitor exposure'}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {data.health_message}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'PM2.5', value: data.pm25 },
              { label: 'PM10', value: data.pm10 },
              { label: 'NO₂', value: data.no2 },
              { label: 'O₃', value: data.o3 },
            ].map(item => (
              <div key={item.label} className="rounded-2xl border border-[var(--border)] bg-white/[0.04] p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-secondary)]">{item.label}</p>
                  <Droplets className="h-3.5 w-3.5 text-cyan-300" />
                </div>
                <p className="mt-2 text-lg font-bold text-[var(--text-primary)]">
                  {item.value !== null ? item.value.toFixed(1) : '--'}
                </p>
                <p className="mt-1 text-[11px] text-[var(--text-secondary)]">µg/m³</p>
              </div>
            ))}
          </div>
        </div>

        {pollutants.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {pollutants.map(({ label, key, unit, limit }) => {
              const value = data[key]
              const pct = Math.min(((value ?? 0) / limit) * 100, 100)
              const color = pct > 80 ? '#ef4444' : pct > 50 ? '#f59e0b' : '#10b981'
              return (
                <div key={label} className="rounded-2xl border border-[var(--border)] bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-[var(--text-secondary)]">{label}</span>
                    <span className="font-semibold" style={{ color }}>
                      {value?.toFixed(1)} {unit}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[var(--border)] bg-gradient-to-r from-slate-900/60 to-emerald-950/40 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <MapPin className="h-4 w-4 text-emerald-300" />
            Exact location context from the nearest monitoring station
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Wind className="h-4 w-4 text-cyan-300" />
            Data source enriched for sustainability planning
          </div>
        </div>
      </div>
    </motion.div>
  )
}
