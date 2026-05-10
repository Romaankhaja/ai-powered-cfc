'use client'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import type { CalculationResponse } from '@/lib/types'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6']
const LABELS = ['Transport', 'Electricity', 'Food', 'Waste']

interface Props { data: CalculationResponse }

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bento-card px-3 py-2 text-sm">
      <p className="font-semibold" style={{ color: item.payload.fill }}>{item.name}</p>
      <p className="text-[var(--text-secondary)]">{item.value.toFixed(1)} kg CO₂/yr</p>
      <p className="text-[var(--text-secondary)]">{item.payload.pct.toFixed(1)}%</p>
    </div>
  )
}

export function EmissionPieChart({ data }: Props) {
  const { emissions, percentages } = data
  const chartData = [
    { name: 'Transport',   value: emissions.transport_kg,   pct: percentages.transport_pct,   fill: COLORS[0] },
    { name: 'Electricity', value: emissions.electricity_kg, pct: percentages.electricity_pct, fill: COLORS[1] },
    { name: 'Food',        value: emissions.food_kg,        pct: percentages.food_pct,        fill: COLORS[2] },
    { name: 'Waste',       value: emissions.waste_kg,       pct: percentages.waste_pct,       fill: COLORS[3] },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bento-card p-6"
    >
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">Emission Breakdown</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.fill} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span className="text-xs text-[var(--text-secondary)]">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="text-center -mt-2">
        <p className="text-2xl font-bold gradient-text">{emissions.total_annual_tonnes.toFixed(2)}t</p>
        <p className="text-xs text-[var(--text-secondary)]">Annual CO₂e</p>
      </div>
    </motion.div>
  )
}
