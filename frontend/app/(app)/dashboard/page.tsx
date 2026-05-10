'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Leaf, Car, Zap, Salad, Trash2, Globe, TrendingUp, Brain, RefreshCw } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/StatsCard'
import dynamic from 'next/dynamic'

const EmissionPieChart = dynamic(() => import('@/components/dashboard/EmissionPieChart').then(mod => mod.EmissionPieChart), { ssr: false, loading: () => <div className="bento-card h-[350px] skeleton" /> })
const TrendLineChart = dynamic(() => import('@/components/dashboard/TrendLineChart').then(mod => mod.TrendLineChart), { ssr: false, loading: () => <div className="bento-card h-[350px] skeleton" /> })
const CategoryBarChart = dynamic(() => import('@/components/dashboard/CategoryBarChart').then(mod => mod.CategoryBarChart), { ssr: false, loading: () => <div className="bento-card h-[350px] skeleton" /> })
import { SustainabilityScore } from '@/components/dashboard/SustainabilityScore'
import { AIInsightCard } from '@/components/insights/AIInsightCard'
import { calculateFootprint, getAIInsights, getGlobalStatistics } from '@/lib/api'
import { defaultCalculationRequest, formatEmission, formatPct } from '@/lib/utils'
import type { CalculationResponse, AIInsightResponse, GlobalStatistics } from '@/lib/types'
import Link from 'next/link'
import { toast } from 'sonner'

// Demo data used when no real calculation exists yet
const DEMO_REQUEST = defaultCalculationRequest

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bento-card p-5 h-32 skeleton" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bento-card h-72 skeleton" />
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [result, setResult] = useState<CalculationResponse | null>(null)
  const [insights, setInsights] = useState<AIInsightResponse | null>(null)
  const [stats, setStats] = useState<GlobalStatistics | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [res, globalStats] = await Promise.all([
        calculateFootprint(DEMO_REQUEST),
        getGlobalStatistics(),
      ])
      setResult(res)
      setStats(globalStats)
      // Try to get AI insights
      try {
        const ai = await getAIInsights({
          user_name: 'Demo User',
          location: 'Global',
          total_annual_kg: res.emissions.total_annual_kg,
          transport_kg: res.emissions.transport_kg,
          electricity_kg: res.emissions.electricity_kg,
          food_kg: res.emissions.food_kg,
          waste_kg: res.emissions.waste_kg,
          sustainability_score: res.score.overall_score,
          transport_input: DEMO_REQUEST.transport,
          food_input: DEMO_REQUEST.food,
          electricity_input: DEMO_REQUEST.electricity,
          waste_input: DEMO_REQUEST.waste,
        })
        setInsights(ai)
      } catch { /* AI is optional */ }
    } catch {
      toast.error('Could not connect to backend. Is it running on port 8000?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Leaf className="w-7 h-7 text-emerald-500" /> Carbon Dashboard
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Demo data · <Link href="/calculator" className="text-emerald-400 hover:underline">Use your own data →</Link>
          </p>
        </motion.div>
        <button id="btn-refresh-dashboard" onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                     bg-[var(--card-hover)] hover:bg-[var(--border)] transition-colors border border-[var(--border)]">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading ? <LoadingSkeleton /> : result ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard id="stat-total" title="Annual Footprint" value={`${result.emissions.total_annual_tonnes.toFixed(2)}t`}
              subtitle="CO₂ equivalent" icon={<Leaf className="w-4 h-4 text-white" />}
              accentColor="from-emerald-500 to-teal-500" delay={0} />
            <StatsCard id="stat-transport" title="Transport" value={formatEmission(result.emissions.transport_kg)}
              subtitle={`${result.percentages.transport_pct}% of total`} icon={<Car className="w-4 h-4 text-white" />}
              accentColor="from-blue-500 to-cyan-500" delay={0.05} />
            <StatsCard id="stat-electricity" title="Electricity" value={formatEmission(result.emissions.electricity_kg)}
              subtitle={`${result.percentages.electricity_pct}% of total`} icon={<Zap className="w-4 h-4 text-white" />}
              accentColor="from-amber-500 to-yellow-500" delay={0.1} />
            <StatsCard id="stat-food" title="Food & Waste" value={formatEmission(result.emissions.food_kg + result.emissions.waste_kg)}
              subtitle="Combined" icon={<Salad className="w-4 h-4 text-white" />}
              accentColor="from-violet-500 to-purple-500" delay={0.15} />
          </div>

          {/* Score + Pie + Trend */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SustainabilityScore score={result.score} />
            <EmissionPieChart data={result} />
            <div className="space-y-4">
              {/* Global comparison mini cards */}
              {[
                { label: 'vs World Average', pct: result.global_comparison.vs_world_average_pct, icon: Globe },
                { label: 'vs Paris Target',  pct: result.global_comparison.vs_paris_target_pct,  icon: TrendingUp },
              ].map(({ label, pct, icon: Icon }) => (
                <motion.div key={label} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bento-card p-4 flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${pct > 0 ? 'from-red-500 to-orange-500' : 'from-emerald-500 to-teal-500'}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">{label}</p>
                    <p className={`text-lg font-bold ${pct > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{formatPct(pct)}</p>
                  </div>
                </motion.div>
              ))}
              {/* Daily / Monthly */}
              <div className="bento-card p-4">
                <p className="text-xs text-[var(--text-secondary)] mb-2">Breakdown</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Daily</span>
                    <span className="font-semibold">{result.emissions.daily_kg.toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Monthly</span>
                    <span className="font-semibold">{(result.emissions.monthly_kg/1000).toFixed(3)} t</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Annually</span>
                    <span className="font-semibold gradient-text">{result.emissions.total_annual_tonnes.toFixed(2)} t</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendLineChart data={result} />
            <CategoryBarChart data={result} />
          </div>

          {/* AI Insights */}
          {insights && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <AIInsightCard insight={insights} />
            </motion.div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Leaf className="w-16 h-16 text-emerald-500/30 mb-4" />
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Backend not connected</h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-md">
            Start the FastAPI backend on port 8000 to see live data.
          </p>
          <Link href="/calculator" id="cta-try-calculator"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:opacity-90 transition-opacity">
            Try the Calculator →
          </Link>
        </div>
      )}
    </div>
  )
}
