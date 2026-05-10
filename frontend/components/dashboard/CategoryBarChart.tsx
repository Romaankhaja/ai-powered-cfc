'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList
} from 'recharts'
import { motion } from 'framer-motion'
import type { CalculationResponse } from '@/lib/types'

interface Props { data: CalculationResponse }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bento-card px-3 py-2 text-sm">
      <p className="font-semibold text-[var(--text-primary)]">{label}</p>
      <p className="text-emerald-400">{payload[0]?.value?.toFixed(0)} kg CO₂/yr</p>
    </div>
  )
}

export function CategoryBarChart({ data }: Props) {
  const { emissions } = data
  const chartData = [
    { name: 'Transport',   kg: emissions.transport_kg,   fill: '#10b981' },
    { name: 'Electricity', kg: emissions.electricity_kg, fill: '#3b82f6' },
    { name: 'Food',        kg: emissions.food_kg,        fill: '#f59e0b' },
    { name: 'Waste',       kg: emissions.waste_kg,       fill: '#8b5cf6' },
    { name: 'World Avg',   kg: 4800,                     fill: '#475569' },
    { name: 'Paris Target',kg: 2300,                     fill: '#06b6d4' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bento-card p-6"
    >
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">Category Comparison</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="transparent" />
          <YAxis tick={{ fontSize: 11 }} stroke="transparent" tickFormatter={(v) => `${(v/1000).toFixed(1)}t`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="kg" radius={[6, 6, 0, 0]} animationDuration={1200}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.fill} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
