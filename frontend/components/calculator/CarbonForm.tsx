'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Zap, Salad, Trash2, ChevronRight, ChevronLeft, Loader2, Leaf } from 'lucide-react'
import { calculateFootprint, getAIInsights } from '@/lib/api'
import { defaultCalculationRequest, dietLabels, gridLabels, wasteLabels } from '@/lib/utils'
import type { CalculationRequest, CalculationResponse, AIInsightResponse } from '@/lib/types'
import { toast } from 'sonner'

const STEPS = [
  { id: 'transport',    label: 'Transport',    icon: Car,    color: 'from-emerald-500 to-teal-500' },
  { id: 'electricity',  label: 'Electricity',  icon: Zap,    color: 'from-blue-500 to-cyan-500' },
  { id: 'food',         label: 'Food & Diet',  icon: Salad,  color: 'from-amber-500 to-yellow-500' },
  { id: 'waste',        label: 'Waste',        icon: Trash2, color: 'from-violet-500 to-purple-500' },
]

interface Props {
  onResult: (result: CalculationResponse, insights: AIInsightResponse | null) => void
}

export function CarbonForm({ onResult }: Props) {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<CalculationRequest>({
    ...defaultCalculationRequest,
    user_name: '',
    location: '',
  })

  const updateTransport = (k: string, v: number) =>
    setForm(f => ({ ...f, transport: { ...f.transport, [k]: v } }))
  const updateElectricity = (k: string, v: any) =>
    setForm(f => ({ ...f, electricity: { ...f.electricity, [k]: v } }))
  const updateFood = (k: string, v: any) =>
    setForm(f => ({ ...f, food: { ...f.food, [k]: v } }))
  const updateWaste = (k: string, v: any) =>
    setForm(f => ({ ...f, waste: { ...f.waste, [k]: v } }))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const result = await calculateFootprint(form)
      let insights: AIInsightResponse | null = null
      try {
        insights = await getAIInsights({
          user_name: form.user_name || 'User',
          location: form.location,
          total_annual_kg: result.emissions.total_annual_kg,
          transport_kg: result.emissions.transport_kg,
          electricity_kg: result.emissions.electricity_kg,
          food_kg: result.emissions.food_kg,
          waste_kg: result.emissions.waste_kg,
          sustainability_score: result.score.overall_score,
          transport_input: form.transport,
          food_input: form.food,
          electricity_input: form.electricity,
          waste_input: form.waste,
        })
      } catch { /* AI is optional */ }
      toast.success('Carbon footprint calculated!')
      onResult(result, insights)
    } catch (e) {
      toast.error('Calculation failed. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "input-field"
  const labelClass = "block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider"
  const selectClass = "input-field cursor-pointer"

  return (
    <div className="bento-card p-6">
      {/* User Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className={labelClass}>Your Name</label>
          <input id="input-name" className={inputClass} placeholder="Alex" value={form.user_name}
            onChange={e => setForm(f => ({ ...f, user_name: e.target.value }))} />
        </div>
        <div>
          <label className={labelClass}>Location (City)</label>
          <input id="input-location" className={inputClass} placeholder="London" value={form.location}
            onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
        </div>
      </div>

      {/* Step Tabs */}
      <div className="flex gap-2 mb-6">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          return (
            <button key={s.id} onClick={() => setStep(i)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-xs font-medium transition-all ${
                step === i
                  ? `bg-gradient-to-br ${s.color} text-white shadow-lg`
                  : i < step
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-[var(--card-hover)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:block">{s.label}</span>
            </button>
          )
        })}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 min-h-[260px]"
        >
          {step === 0 && (
            <>
              <p className="text-xs text-[var(--text-secondary)] mb-4">Enter your average daily transport distances.</p>
              {[
                { key: 'car_km_per_day',           label: 'Car (km/day)',          id: 'input-car' },
                { key: 'bus_km_per_day',            label: 'Bus (km/day)',          id: 'input-bus' },
                { key: 'train_km_per_day',          label: 'Train (km/day)',        id: 'input-train' },
                { key: 'flight_km_per_year',        label: 'Flights (km/year)',     id: 'input-flight' },
                { key: 'motorcycle_km_per_day',     label: 'Motorcycle (km/day)',   id: 'input-moto' },
                { key: 'electric_car_km_per_day',   label: 'Electric Car (km/day)', id: 'input-ev' },
              ].map(({ key, label, id }) => (
                <div key={key}>
                  <label className={labelClass}>{label}</label>
                  <input id={id} type="number" min={0} className={inputClass}
                    value={(form.transport as any)[key]}
                    onChange={e => updateTransport(key, parseFloat(e.target.value) || 0)} />
                </div>
              ))}
            </>
          )}

          {step === 1 && (
            <>
              <p className="text-xs text-[var(--text-secondary)] mb-4">Enter your monthly electricity usage.</p>
              <div>
                <label className={labelClass}>Monthly Electricity Usage (kWh)</label>
                <input id="input-kwh" type="number" min={0} className={inputClass}
                  value={form.electricity.monthly_kwh}
                  onChange={e => updateElectricity('monthly_kwh', parseFloat(e.target.value) || 0)} />
                <p className="text-[11px] text-[var(--text-secondary)] mt-1">Tip: Check your utility bill. Average home uses 250-400 kWh/month.</p>
              </div>
              <div>
                <label className={labelClass}>Electricity Grid Type</label>
                <select id="input-grid" className={selectClass} value={form.electricity.grid_type}
                  onChange={e => updateElectricity('grid_type', e.target.value)}>
                  {Object.entries(gridLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-xs text-[var(--text-secondary)] mb-4">Your diet is one of the biggest factors in your footprint.</p>
              <div>
                <label className={labelClass}>Primary Diet Type</label>
                <select id="input-diet" className={selectClass} value={form.food.diet_type}
                  onChange={e => updateFood('diet_type', e.target.value)}>
                  {Object.entries(dietLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Locally Sourced Food ({form.food.locally_sourced_pct}%)</label>
                <input id="input-local" type="range" min={0} max={100} step={5} className="w-full accent-emerald-500"
                  value={form.food.locally_sourced_pct}
                  onChange={e => updateFood('locally_sourced_pct', parseInt(e.target.value))} />
                <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mt-1">
                  <span>0% (Imported)</span><span>100% (Local)</span>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-xs text-[var(--text-secondary)] mb-4">How do you manage your household waste?</p>
              <div>
                <label className={labelClass}>Waste Management Method</label>
                <select id="input-waste-type" className={selectClass} value={form.waste.waste_type}
                  onChange={e => updateWaste('waste_type', e.target.value)}>
                  {Object.entries(wasteLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Daily Waste Generated (kg)</label>
                <input id="input-waste-kg" type="number" min={0} max={20} step={0.1} className={inputClass}
                  value={form.waste.kg_per_day}
                  onChange={e => updateWaste('kg_per_day', parseFloat(e.target.value) || 0)} />
                <p className="text-[11px] text-[var(--text-secondary)] mt-1">Average household generates 1-2 kg/day per person.</p>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-6 pt-5 border-t border-[var(--border)]">
        <button
          id="btn-prev-step"
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
          className="btn-secondary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {step < STEPS.length - 1 ? (
          <button id="btn-next-step" onClick={() => setStep(s => s + 1)}
            className="btn-primary flex items-center gap-2">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button id="btn-calculate" onClick={handleSubmit} disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Calculating...</> : <><Leaf className="w-4 h-4" /> Calculate Footprint</>}
          </button>
        )}
      </div>
    </div>
  )
}
