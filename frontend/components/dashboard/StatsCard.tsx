'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  trend?: { value: number; label: string }
  accentColor?: string
  delay?: number
  id?: string
}

export function StatsCard({
  title, value, subtitle, icon, trend, accentColor = 'from-emerald-500 to-teal-500', delay = 0, id
}: StatsCardProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bento-card p-5 relative overflow-hidden"
    >
      {/* Background gradient accent */}
      <div className={cn('absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 bg-gradient-to-br', accentColor)} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className={cn('p-2.5 rounded-xl bg-gradient-to-br opacity-90', accentColor)}>
            {icon}
          </div>
          {trend && (
            <div className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              trend.value >= 0
                ? 'bg-red-500/10 text-red-400'
                : 'bg-emerald-500/10 text-emerald-400'
            )}>
              <span>{trend.value >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value).toFixed(1)}%</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mt-2">
          <p className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{value}</p>
          <p className="text-xs font-medium text-[var(--text-secondary)] mt-0.5">{title}</p>
          {subtitle && (
            <p className="text-[11px] text-[var(--text-secondary)] mt-1 opacity-70">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
