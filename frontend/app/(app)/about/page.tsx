'use client'
import { motion } from 'framer-motion'
import { Leaf, Shield, Code, PenLine, Calculator, BarChart3, Globe, Brain, Sparkles, Info } from 'lucide-react'

const techStack = [
  { name: 'Next.js 14', desc: 'React framework with App Router', color: 'text-white' },
  { name: 'TypeScript', desc: 'Full type safety', color: 'text-blue-400' },
  { name: 'TailwindCSS', desc: 'Utility-first styling', color: 'text-cyan-400' },
  { name: 'Framer Motion', desc: 'Smooth animations', color: 'text-violet-400' },
  { name: 'Recharts', desc: 'Animated data charts', color: 'text-emerald-400' },
  { name: 'FastAPI', desc: 'Python async API', color: 'text-green-400' },
  { name: 'Pydantic', desc: 'Data validation', color: 'text-red-400' },
  { name: 'OpenAI SDK', desc: 'LLM-agnostic AI layer', color: 'text-yellow-400' },
]

const dataSources = [
  'UK DEFRA 2023 Transport Emission Factors',
  'IPCC AR6 Lifecycle Analysis',
  'IEA Global Electricity Emission Factors 2023',
  'Oxford University / Our World in Data — Food Emissions',
  'US EPA Waste Emission Guidelines',
  'OpenWeatherMap — Real-time Weather',
  'OpenAQ — Global Air Quality Data',
]

const architecture = [
  { step: '1', title: 'User Input', desc: 'Lifestyle data collected via multi-step form', icon: <PenLine className="w-6 h-6" /> },
  { step: '2', title: 'Calculation Engine', desc: 'Deterministic Python math — IPCC/IEA emission factors', icon: <Calculator className="w-6 h-6" /> },
  { step: '3', title: 'Scoring Engine', desc: 'Weighted 0-100 sustainability score', icon: <BarChart3 className="w-6 h-6" /> },
  { step: '4', title: 'Environmental APIs', desc: 'Live weather + AQI enrichment', icon: <Globe className="w-6 h-6" /> },
  { step: '5', title: 'AI Layer', desc: 'LLM explains results — never calculates', icon: <Brain className="w-6 h-6" /> },
  { step: '6', title: 'Dashboard', desc: 'Animated charts, insights, recommendations', icon: <Sparkles className="w-6 h-6" /> },
]

export default function AboutPage() {
  return (
    <div className="space-y-10 max-w-4xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Info className="w-7 h-7 text-emerald-500" /> About CarbonIQ
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Platform architecture, data sources, and methodology.</p>
      </motion.div>

      {/* Hero description */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bento-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-semibold text-[var(--text-primary)] text-lg">What is CarbonIQ?</h2>
        </div>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          CarbonIQ is a production-quality AI-powered sustainability analytics platform that calculates personal carbon footprints
          using deterministic scientific formulas, visualizes environmental impact with beautiful charts,
          and uses a separate AI coaching layer to explain results and provide personalized reduction strategies.
          It integrates real-world APIs for live weather and air quality data.
        </p>
      </motion.div>

      {/* Architecture */}
      <div className="bento-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
            <Code className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-semibold text-[var(--text-primary)] text-lg">Data Flow Architecture</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {architecture.map((a, i) => (
            <motion.div key={a.step} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} viewport={{ once: true }}
              className="bg-[var(--card-hover)] rounded-xl p-4 text-center">
              <div className="flex justify-center mb-3 text-[var(--text-secondary)]">{a.icon}</div>
              <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">{a.title}</p>
              <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Architecture Note */}
      <div className="bento-card p-5 border-l-4 border-emerald-500">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[var(--text-primary)] text-sm mb-1">Critical Architecture Rule</p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              The AI layer (LLM) <strong className="text-emerald-400">never calculates emissions</strong>.
              All carbon math uses deterministic Python formulas with published emission factors.
              The AI only receives finished results and generates natural-language explanations, coaching, and recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bento-card p-6">
        <h2 className="font-semibold text-[var(--text-primary)] text-lg mb-4">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {techStack.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }} viewport={{ once: true }}
              className="bg-[var(--card-hover)] rounded-xl p-3">
              <p className={`font-semibold text-sm ${t.color}`}>{t.name}</p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <div className="bento-card p-6">
        <h2 className="font-semibold text-[var(--text-primary)] text-lg mb-4">Data Sources & Methodology</h2>
        <div className="space-y-2">
          {dataSources.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span className="text-emerald-400">•</span> {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
