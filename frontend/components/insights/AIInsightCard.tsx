'use client'
import { motion } from 'framer-motion'
import { Brain, Zap, TrendingDown, Star, Heart } from 'lucide-react'
import type { AIInsightResponse } from '@/lib/types'

interface Props { insight: AIInsightResponse }

export function AIInsightCard({ insight }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bento-card p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--text-primary)]">AI Sustainability Analysis</h3>
          <p className="text-xs text-[var(--text-secondary)]">Personalized for {insight.user_name}</p>
        </div>
        <div className="ml-auto">
          <span className="text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30 px-2 py-1 rounded-full font-medium">
            AI Generated
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-4">
        <p className="text-sm text-[var(--text-primary)] leading-relaxed">{insight.summary}</p>
      </div>

      {/* Hotspot */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">Emission Hotspot</span>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{insight.hotspot_analysis}</p>
      </div>

      {/* Quick Wins */}
      {insight.quick_wins?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">Quick Wins</span>
          </div>
          <div className="space-y-2">
            {insight.quick_wins.map((win, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
              >
                <span className="text-emerald-400 font-bold mt-0.5 flex-shrink-0">✓</span>
                <span>{win}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Reduction Strategies */}
      {insight.reduction_strategies?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">Reduction Strategies</span>
          </div>
          <div className="space-y-2">
            {insight.reduction_strategies.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-2.5 text-sm"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400
                                 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span className="text-[var(--text-secondary)]">{s}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Motivational Footer */}
      <div className="border-t border-[var(--border)] pt-4">
        <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed">
          <Heart className="w-4 h-4 inline text-emerald-400 mr-1" /> {insight.motivational_message}
        </p>
        {insight.estimated_reduction_potential && (
          <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium
                          bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <TrendingDown className="w-3 h-3" />
            {insight.estimated_reduction_potential}
          </div>
        )}
      </div>
    </motion.div>
  )
}
