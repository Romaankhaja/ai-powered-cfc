'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Loader2, Sparkles } from 'lucide-react'
import { AIInsightCard } from '@/components/insights/AIInsightCard'
import { calculateFootprint, getAIInsights } from '@/lib/api'
import { defaultCalculationRequest } from '@/lib/utils'
import type { AIInsightResponse } from '@/lib/types'
import { toast } from 'sonner'

export default function InsightsPage() {
  const [insights, setInsights] = useState<AIInsightResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const generateInsights = async () => {
    setLoading(true)
    try {
      const result = await calculateFootprint(defaultCalculationRequest)
      const ai = await getAIInsights({
        user_name: 'Demo User', location: 'Global',
        total_annual_kg: result.emissions.total_annual_kg,
        transport_kg: result.emissions.transport_kg,
        electricity_kg: result.emissions.electricity_kg,
        food_kg: result.emissions.food_kg,
        waste_kg: result.emissions.waste_kg,
        sustainability_score: result.score.overall_score,
        transport_input: defaultCalculationRequest.transport,
        food_input: defaultCalculationRequest.food,
        electricity_input: defaultCalculationRequest.electricity,
        waste_input: defaultCalculationRequest.waste,
      })
      setInsights(ai)
      toast.success('AI insights generated!')
    } catch { toast.error('Backend not connected.') }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Brain className="w-7 h-7 text-violet-500" /> AI Sustainability Insights
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">AI coaching, hotspot analysis, and personalized strategies.</p>
      </motion.div>

      <div className="bento-card p-4 border-l-4 border-violet-500">
        <p className="text-sm text-[var(--text-secondary)]">
          <span className="text-violet-400 font-semibold">Architecture:</span> AI only explains pre-calculated results — never recalculates emissions.
        </p>
      </div>

      {!insights ? (
        <div className="bento-card p-12 text-center">
          <Brain className="w-16 h-16 text-violet-400/40 mx-auto mb-6 animate-pulse-slow" />
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Generate AI Insights</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto text-sm">
            CarbonIQ calculates your footprint with Python math, then sends results to the AI for coaching.
          </p>
          <button id="btn-generate-insights" onClick={generateInsights} disabled={loading}
            className="btn-primary flex items-center gap-2 mx-auto disabled:opacity-50">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <><Sparkles className="w-5 h-5" /> Generate Insights</>}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <AIInsightCard insight={insights} />
          <div className="mt-4 text-center">
            <button id="btn-regenerate" onClick={generateInsights} disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm
                         border border-[var(--border)] hover:bg-[var(--card-hover)] text-[var(--text-secondary)] transition-colors">
              <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Regenerate
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
