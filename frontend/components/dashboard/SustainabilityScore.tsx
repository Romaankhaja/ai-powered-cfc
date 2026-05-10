'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { cn, scoreToGradient } from '@/lib/utils'
import type { SustainabilityScore as ScoreType } from '@/lib/types'

interface Props { score: ScoreType }

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

export function SustainabilityScore({ score }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const animatedScore = useCountUp(inView ? score.overall_score : 0)

  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score.overall_score / 100) * circumference

  const subScores = [
    { label: 'Transport',   value: score.transport_score,   color: '#10b981' },
    { label: 'Electricity', value: score.electricity_score, color: '#3b82f6' },
    { label: 'Food',        value: score.food_score,        color: '#f59e0b' },
    { label: 'Waste',       value: score.waste_score,       color: '#8b5cf6' },
  ]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bento-card p-6"
    >
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-5">Sustainability Score</h3>

      {/* Radial Score Ring */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {/* Track */}
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
            {/* Progress */}
            <motion.circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke={score.color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: inView ? offset : circumference }}
              transition={{ duration: 2, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 8px ${score.color}60)` }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black" style={{ color: score.color }}>{animatedScore}</span>
            <span className="text-xs text-[var(--text-secondary)] font-medium">/100</span>
          </div>
        </div>
        <div className="mt-3 text-center">
          <span className={cn('text-lg font-bold px-3 py-1 rounded-full bg-gradient-to-r text-white', scoreToGradient(score.overall_score))}>
            {score.grade} — {score.label}
          </span>
        </div>
      </div>

      {/* Sub-scores */}
      <div className="space-y-3">
        {subScores.map(({ label, value, color }) => (
          <div key={label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[var(--text-secondary)]">{label}</span>
              <span className="font-semibold" style={{ color }}>{value.toFixed(0)}</span>
            </div>
            <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                animate={{ width: inView ? `${value}%` : 0 }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
