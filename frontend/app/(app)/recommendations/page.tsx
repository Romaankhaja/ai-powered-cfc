'use client'
import { motion } from 'framer-motion'
import { Lightbulb, Car, Zap, Salad, Trash2, TrendingDown, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const recommendations = [
  {
    category: 'Transport', icon: Car, color: 'from-emerald-500 to-teal-500',
    impact: 'High', saving: '~1.2t CO₂/yr',
    tips: [
      'Replace 2 car commute days/week with public transport',
      'Switch to an electric vehicle when next replacing your car',
      'Combine errands into single trips to reduce total km driven',
      'Use video calls instead of business travel when possible',
    ]
  },
  {
    category: 'Electricity', icon: Zap, color: 'from-blue-500 to-cyan-500',
    impact: 'High', saving: '~0.8t CO₂/yr',
    tips: [
      'Switch to a 100% renewable energy tariff',
      'Install LED bulbs throughout your home',
      'Set heating/cooling 2°C closer to outdoor temperature',
      'Install a smart meter to identify wasteful appliances',
    ]
  },
  {
    category: 'Food & Diet', icon: Salad, color: 'from-amber-500 to-yellow-500',
    impact: 'Medium', saving: '~0.5t CO₂/yr',
    tips: [
      'Go meat-free 3 days per week (Flexitarian diet)',
      'Buy locally sourced and seasonal produce',
      'Reduce food waste with meal planning',
      'Grow a small herb or vegetable garden',
    ]
  },
  {
    category: 'Waste', icon: Trash2, color: 'from-violet-500 to-purple-500',
    impact: 'Medium', saving: '~0.3t CO₂/yr',
    tips: [
      'Set up a home composting system for organic waste',
      'Follow local recycling guidelines carefully',
      'Buy second-hand clothing and electronics',
      'Use reusable bags, bottles, and containers',
    ]
  },
]

const impactColors: Record<string, string> = {
  High:   'bg-red-500/10 text-red-400 border-red-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Low:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

export default function RecommendationsPage() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Lightbulb className="w-7 h-7 text-amber-500" /> Sustainability Recommendations
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Prioritized actions based on emission category impact.
        </p>
      </motion.div>

      {/* Total Potential Savings */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bento-card p-6 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-glow">
          <TrendingDown className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-[var(--text-secondary)] text-sm">Total Reduction Potential</p>
          <p className="text-2xl font-black gradient-text">~2.8 tonnes CO₂/yr</p>
          <p className="text-xs text-[var(--text-secondary)]">If all recommendations are followed</p>
        </div>
        <Link href="/calculator" id="cta-calc-from-rec"
          className="ml-auto flex items-center gap-1 btn-primary"
          Calculate mine <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Recommendation Cards */}
      <div className="space-y-6">
        {recommendations.map((rec, i) => {
          const Icon = rec.icon
          return (
            <motion.div key={rec.category}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className="bento-card p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${rec.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--text-primary)]">{rec.category}</h3>
                  <p className="text-xs text-emerald-400 font-medium">Potential saving: {rec.saving}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${impactColors[rec.impact]}`}>
                  {rec.impact} Impact
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rec.tips.map((tip, j) => (
                  <motion.div key={j} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    transition={{ delay: j * 0.05 }} viewport={{ once: true }}
                    className="flex items-start gap-2.5 bg-[var(--card-hover)] rounded-xl px-3 py-2.5">
                    <span className="text-emerald-400 font-bold flex-shrink-0 mt-0.5">✓</span>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{tip}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
