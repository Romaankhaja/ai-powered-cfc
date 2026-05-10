'use client'

import { useEffect, useMemo, useState } from 'react'
import { Loader2, MapPin, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { searchLocations } from '@/lib/api'
import type { LocationSuggestion } from '@/lib/types'

interface Props {
  onSelect: (location: LocationSuggestion) => void
  placeholder?: string
}

export function LocationPicker({ onSelect, placeholder = 'Search a city, district, or region...' }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<LocationSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const visibleResults = useMemo(() => results.slice(0, 6), [results])

  useEffect(() => {
    const trimmed = query.trim()

    if (trimmed.length < 2) {
      setResults([])
      setOpen(false)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    const timer = window.setTimeout(async () => {
      try {
        const suggestions = await searchLocations(trimmed, 6)
        if (!cancelled) {
          setResults(suggestions)
          setOpen(true)
          setActiveIndex(0)
        }
      } catch {
        if (!cancelled) {
          setResults([])
          setOpen(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 250)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [query])

  const handleSelect = (location: LocationSuggestion) => {
    setQuery(location.display_name)
    setOpen(false)
    setResults([])
    onSelect(location)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (visibleResults[0]) {
      handleSelect(visibleResults[0])
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 120)}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card-hover)] px-11 py-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.07]"
          />
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
          {['London', 'Mumbai', 'New York', 'Tokyo', 'Sydney'].map(city => (
            <button
              key={city}
              type="button"
              onClick={() => setQuery(city)}
              className="rounded-full border border-[var(--border)] bg-[var(--card-hover)] px-3 py-1.5 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300"
            >
              {city}
            </button>
          ))}
        </div>
      </form>

      <AnimatePresence>
        {open && visibleResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className="absolute z-20 mt-3 w-full overflow-hidden rounded-3xl border border-[var(--border)] bg-[rgba(8,12,20,0.96)] shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                Exact location matches
              </p>
              <span className="text-[10px] text-[var(--text-secondary)]">
                Use the most specific result for the best weather data
              </span>
            </div>
            <div className="max-h-72 overflow-auto p-2">
              {visibleResults.map((location, index) => (
                <button
                  key={`${location.display_name}-${location.latitude}-${location.longitude}`}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => handleSelect(location)}
                  className={[
                    'flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition-all',
                    index === activeIndex
                      ? 'bg-emerald-500/15 ring-1 ring-emerald-400/30'
                      : 'hover:bg-[var(--card-hover)]',
                  ].join(' ')}
                >
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="font-semibold text-[var(--text-primary)]">{location.name}</p>
                      <span className="rounded-full border border-[var(--border)] bg-[var(--card-hover)] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                        {location.country}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {location.display_name}
                    </p>
                    <p className="mt-1 text-[11px] text-[var(--text-secondary)]/80">
                      {location.state ? `${location.state} · ` : ''}
                      {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
