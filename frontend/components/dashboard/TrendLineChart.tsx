'use client'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts'
import { motion } from 'framer-motion'
import type { CalculationResponse } from '@/lib/types'

interface Props { data: CalculationResponse }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bento-card px-3 py-2 text-sm space-y-1">
      <p className="font-semibold text-[var(--text-primary)]">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="text-xs">
          {p.name}: {p.value.toFixed(0)} kg
        </p>
      ))}
    </div>
  )
}

export function TrendLineChart({ data }: Props) {
  const chartData = data.monthly_trend

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bento-card p-6"
    >
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">Monthly Footprint Trend</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorKg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="transparent" />
          <YAxis tick={{ fontSize: 11 }} stroke="transparent" tickFormatter={(v) => `${(v/1000).toFixed(1)}t`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(v) => <span className="text-xs text-[var(--text-secondary)]">{v}</span>} />
          <Area type="monotone" dataKey="kg" name="Your Footprint" stroke="#10b981" strokeWidth={2.5}
            fill="url(#colorKg)" dot={false} animationDuration={1500} />
          <Area type="monotone" dataKey="target" name="Paris Target" stroke="#3b82f6" strokeWidth={1.5}
            strokeDasharray="5 5" fill="url(#colorTarget)" dot={false} animationDuration={1500} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
