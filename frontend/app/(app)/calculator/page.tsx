'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { CarbonForm } from '@/components/calculator/CarbonForm'
import dynamic from 'next/dynamic'

const EmissionPieChart = dynamic(() => import('@/components/dashboard/EmissionPieChart').then(mod => mod.EmissionPieChart), { ssr: false, loading: () => <div className="bento-card h-[350px] skeleton" /> })
const TrendLineChart = dynamic(() => import('@/components/dashboard/TrendLineChart').then(mod => mod.TrendLineChart), { ssr: false, loading: () => <div className="bento-card h-[350px] skeleton" /> })
import { SustainabilityScore } from '@/components/dashboard/SustainabilityScore'
import { AIInsightCard } from '@/components/insights/AIInsightCard'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { Leaf, Car, Zap, Salad } from 'lucide-react'
import { formatEmission } from '@/lib/utils'
import type { CalculationResponse, AIInsightResponse } from '@/lib/types'
import Link from 'next/link'

export default function CalculatorPage() {
  const [result, setResult] = useState<CalculationResponse | null>(null)
  const [insights, setInsights] = useState<AIInsightResponse | null>(null)

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Leaf className="w-7 h-7 text-emerald-500" /> Carbon Calculator
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Fill in your lifestyle details to calculate your annual carbon footprint.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <CarbonForm onResult={(r, i) => { setResult(r); setInsights(i) }} />
        </motion.div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-4">
                <StatsCard title="Annual Footprint" value={`${result.emissions.total_annual_tonnes.toFixed(2)}t CO₂`}
                  icon={<Leaf className="w-4 h-4 text-white" />} accentColor="from-emerald-500 to-teal-500" />
                <StatsCard title="Sustainability Score" value={`${result.score.overall_score}/100`}
                  subtitle={result.score.label} icon={<Zap className="w-4 h-4 text-white" />}
                  accentColor="from-violet-500 to-purple-500" />
                <StatsCard title="Transport" value={formatEmission(result.emissions.transport_kg)}
                  icon={<Car className="w-4 h-4 text-white" />} accentColor="from-blue-500 to-cyan-500" />
                <StatsCard title="Food & Waste" value={formatEmission(result.emissions.food_kg + result.emissions.waste_kg)}
                  icon={<Salad className="w-4 h-4 text-white" />} accentColor="from-amber-500 to-orange-500" />
              </div>

              <SustainabilityScore score={result.score} />
              <EmissionPieChart data={result} />
              {insights && <AIInsightCard insight={insights} />}

              <div className="flex gap-3">
                <Link href="/dashboard" id="link-view-dashboard"
                  className="flex-1 text-center py-3 rounded-xl text-sm font-semibold
                             bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90 transition-opacity">
                  View Full Dashboard →
                </Link>
                <Link href="/insights" id="link-view-insights"
                  className="flex-1 text-center py-3 rounded-xl text-sm font-semibold
                             border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--card-hover)] transition-colors">
                  AI Insights →
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="bento-card p-8 text-center flex flex-col items-center gap-4 min-h-[400px] justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-emerald-500/50" />
              </div>
              <p className="text-[var(--text-secondary)] text-sm">
                Complete the form to see your personalized carbon footprint analysis, sustainability score, and AI recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
