'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Globe, Thermometer, Wind, TreePine, Zap, Loader2 } from 'lucide-react'
import { getGlobalStatistics } from '@/lib/api'
import type { GlobalStatistics } from '@/lib/types'
import { toast } from 'sonner'

function StatBadge({ value, label, icon: Icon, color }: { value: string; label: string; icon: any; color: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="bento-card p-5 text-center">
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${color} mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-2xl font-black gradient-text mb-1">{value}</p>
      <p className="text-xs text-[var(--text-secondary)]">{label}</p>
    </motion.div>
  )
}

const comparisons = [
  { country: 'USA',    kg: 14900, color: '#ef4444' },
  { country: 'China',  kg: 8200,  color: '#f97316' },
  { country: 'EU',     kg: 6800,  color: '#eab308' },
  { country: 'World',   kg: 4800,  color: '#3b82f6' },
  { country: 'UK',     kg: 5500,  color: '#8b5cf6' },
  { country: 'India',  kg: 1900,  color: '#10b981' },
  { country: 'Target',  kg: 2300,  color: '#06b6d4' },
]

export default function StatisticsPage() {
  const [stats, setStats] = useState<GlobalStatistics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGlobalStatistics().then(setStats).catch(() => toast.error('Backend not connected')).finally(() => setLoading(false))
  }, [])

  const maxKg = Math.max(...comparisons.map(c => c.kg))

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-emerald-500" /> Global Statistics
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Real-world environmental data from IEA, IPCC, and Our World in Data.</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>
      ) : stats ? (
        <>
          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatBadge value={`${stats.co2_concentration_ppm} ppm`} label="Atmospheric CO₂" icon={Wind} color="from-red-500 to-orange-500" />
            <StatBadge value={`+${stats.global_temp_increase_c}°C`} label="Global Temp Rise" icon={Thermometer} color="from-orange-500 to-amber-500" />
            <StatBadge value={`${stats.renewable_energy_pct}%`} label="Renewable Energy" icon={Zap} color="from-emerald-500 to-teal-500" />
            <StatBadge value={`${stats.annual_deforestation_mha}M ha`} label="Annual Deforestation" icon={TreePine} color="from-green-700 to-green-500" />
            <StatBadge value={`${(stats.world_avg_annual_kg/1000).toFixed(1)}t`} label="World Avg per Person" icon={Globe} color="from-blue-500 to-cyan-500" />
            <StatBadge value={`${(stats.usa_avg_annual_kg/1000).toFixed(1)}t`} label="USA Avg per Person" icon={BarChart3} color="from-red-500 to-rose-500" />
            <StatBadge value={`${(stats.paris_target_kg/1000).toFixed(1)}t`} label="Paris Agreement Target" icon={Globe} color="from-violet-500 to-purple-500" />
            <StatBadge value={`${(stats.eu_avg_annual_kg/1000).toFixed(1)}t`} label="EU Avg per Person" icon={Globe} color="from-blue-600 to-blue-400" />
          </div>

          {/* Country Comparison Bars */}
          <div className="bento-card p-6">
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-6">Annual Per-Capita Footprint by Country</h3>
            <div className="space-y-4">
              {comparisons.map(({ country, kg, color }, i) => (
                <motion.div key={country} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[var(--text-primary)] font-medium">{country}</span>
                    <span className="text-[var(--text-secondary)]">{(kg/1000).toFixed(1)}t CO₂/yr</span>
                  </div>
                  <div className="h-3 bg-[var(--card-hover)] rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(kg / maxKg) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: i * 0.05 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bento-card p-6 border-l-4 border-blue-500">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{stats.description}</p>
          </div>
        </>
      ) : (
        <div className="bento-card p-12 text-center text-[var(--text-secondary)]">Backend not connected.</div>
      )}
    </div>
  )
}
