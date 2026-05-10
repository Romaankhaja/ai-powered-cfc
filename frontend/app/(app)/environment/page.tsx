'use client'

import { useState } from 'react'

import { motion } from 'framer-motion'
import { CloudRain, Droplets, MapPin, ShieldCheck, Thermometer, Wind } from 'lucide-react'
import { toast } from 'sonner'

import { AirQualityCard } from '@/components/environment/AirQualityCard'
import { LocationPicker } from '@/components/environment/LocationPicker'
import { WeatherCard } from '@/components/environment/WeatherCard'
import { getAirQuality, getWeather } from '@/lib/api'
import type { AirQualityData, LocationSuggestion, WeatherData } from '@/lib/types'

function MiniStat({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string
  value: string
  icon: typeof Thermometer
  accent: string
}) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-white/[0.04] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-secondary)]">{label}</p>
          <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        </div>
        <div className={`rounded-2xl bg-gradient-to-br ${accent} p-3 shadow-lg`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  )
}

export default function EnvironmentPage() {
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null)
  const [loading, setLoading] = useState(false)

  const loadLocation = async (location: LocationSuggestion) => {
    setSelectedLocation(location)
    setLoading(true)

    try {
      const [weatherData, airQualityData] = await Promise.all([
        getWeather(location.name, undefined, location.latitude, location.longitude),
        getAirQuality(location.name, location.latitude, location.longitude),
      ])

      setWeather(weatherData)
      setAirQuality(airQualityData)
      toast.success(`Loaded data for ${location.display_name}`)
    } catch {
      toast.error('Could not load the selected location right now.')
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      label: 'Temperature',
      value: weather ? `${Math.round(weather.temperature_c)}°C` : '--',
      icon: Thermometer,
      accent: 'from-orange-500 to-rose-500',
    },
    {
      label: 'Humidity',
      value: weather ? `${Math.round(weather.humidity_pct)}%` : '--',
      icon: Droplets,
      accent: 'from-sky-500 to-cyan-500',
    },
    {
      label: 'AQI',
      value: airQuality ? airQuality.aqi.toFixed(0) : '--',
      icon: Wind,
      accent: 'from-violet-500 to-fuchsia-500',
    },
    {
      label: 'Cloud cover',
      value: weather ? `${Math.round(weather.cloudiness_pct)}%` : '--',
      icon: CloudRain,
      accent: 'from-teal-500 to-emerald-500',
    },
  ]

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(8,12,20,0.95),rgba(15,23,42,0.88)_45%,rgba(6,78,59,0.65))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)] md:p-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.18),transparent_30%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              Location-aware environmental intelligence
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)] md:text-5xl">
                Weather and air quality, tuned to the exact place you choose.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                Search a city, district, or region. We resolve it through OpenWeatherMap geocoding, then pull live weather and nearby air-quality signals for a more precise sustainability picture.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
              <span className="rounded-full border border-[var(--border)] bg-[var(--card-hover)] px-3 py-1.5">Live weather</span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--card-hover)] px-3 py-1.5">Nearest AQI station</span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--card-hover)] px-3 py-1.5">Exact lat/lon selection</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <MiniStat label="Weather condition" value={weather?.condition ?? '--'} icon={Thermometer} accent="from-amber-500 to-orange-500" />
            <MiniStat label="Air quality" value={airQuality?.aqi_category ?? '--'} icon={Wind} accent="from-cyan-500 to-blue-600" />
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bento-card overflow-visible p-5 md:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">Search location</p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--text-primary)]">Choose an exact match from the dropdown</h2>
          </div>
          {selectedLocation && (
            <div className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card-hover)] px-3 py-1.5 text-xs text-[var(--text-secondary)] md:flex">
              <MapPin className="h-3.5 w-3.5 text-emerald-300" />
              {selectedLocation.display_name}
            </div>
          )}
        </div>

        <LocationPicker onSelect={loadLocation} />
      </motion.section>

      {selectedLocation && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map(stat => (
            <MiniStat key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} accent={stat.accent} />
          ))}
        </motion.section>
      )}

      {loading && (
        <div className="bento-card flex items-center justify-center py-16 text-sm text-[var(--text-secondary)]">
          Loading environmental intelligence for the selected location...
        </div>
      )}

      {weather || airQuality ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {weather && <WeatherCard weather={weather} />}
          {airQuality && <AirQualityCard data={airQuality} />}
        </div>
      ) : !loading ? (
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bento-card flex min-h-[300px] items-center justify-center p-8 text-center">
            <div className="max-w-sm space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <MapPin className="h-8 w-8 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Pick a location to begin</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  The dashboard will show live weather, humidity, visibility, AQI, and nearby pollutant signals once you select a matching place.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Why the dropdown matters</p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                Geocoding narrows ambiguous city names down to one precise location, so the weather card uses exact coordinates instead of guesswork.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Sustainability cue</p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                Heat, cloud cover, and pollution levels all influence transport and cooling decisions, so we surface them together in one place.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">What you get</p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                Exact weather coordinates, AQI station context, climate tips, and pollutant bars designed for a premium sustainability dashboard.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Best next step</p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                Select the most specific match, especially for cities with repeated names. That gives the backend the strongest location signal available.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.75rem] border border-[var(--border)] bg-white/[0.04] p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">Weather impact</p>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            {weather
              ? weather.sustainability_impact
              : 'Choose a location to see how weather patterns may affect energy demand, commuting, and day-to-day emissions.'}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-[var(--border)] bg-white/[0.04] p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">Air quality guidance</p>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            {airQuality
              ? airQuality.health_message
              : 'We will surface the local air quality signal and the cleanest travel choice once a location is selected.'}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-[var(--border)] bg-white/[0.04] p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">Location precision</p>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            {selectedLocation
              ? `${selectedLocation.display_name} resolved to ${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)}`
              : 'The location dropdown will resolve coordinates before the backend fetches environmental data.'}
          </p>
        </div>
      </div>
    </div>
  )
}
