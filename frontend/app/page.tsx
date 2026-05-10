'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Leaf, BarChart3, Brain, Wind, Shield, Zap, Globe, Code } from 'lucide-react'
import { TopNav } from '@/components/layout/TopNav'

const features = [
  { icon: BarChart3, title: 'Actionable Analytics', desc: 'Beautiful charts and dashboards to visualize your environmental impact', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: Brain,     title: 'AI Coaching',          desc: 'GPT-powered sustainability coaching personalized to your lifestyle',       color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { icon: Wind,      title: 'Local Environment',    desc: 'Live weather and air quality data with climate-aware sustainability tips',  color: 'text-sky-500', bg: 'bg-sky-500/10' },
  { icon: Shield,    title: 'Deterministic Math',   desc: 'Precise emission formulas based on IPCC and IEA data — zero AI guesswork', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
]

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      <TopNav />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 lg:py-24">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto space-y-8 mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--card-bg)] border border-[var(--border)] text-sm font-medium text-[var(--text-secondary)] mb-6 shadow-sm">
              <Leaf className="w-4 h-4 text-[var(--primary)]" /> Introducing CarbonIQ 2.0
            </div>
            <h1 className="title-xl text-[var(--text-primary)] mb-6">
              Intelligence for a <br className="hidden sm:block"/>
              <span className="text-[var(--primary)]">Sustainable</span> Future.
            </h1>
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Measure your exact footprint, understand your local environment, and get personalized AI strategies to reduce emissions.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/calculator" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 text-lg px-8 py-4">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 text-lg px-8 py-4">
              <Code className="w-5 h-5" /> View on GitHub
            </a>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Main feature card */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bento-card lg:col-span-2 p-8 md:p-12 flex flex-col justify-between min-h-[300px] bg-gradient-to-br from-[var(--primary)] to-blue-600">
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[var(--card-hover)] backdrop-blur-md flex items-center justify-center mb-6 shadow-lg border border-white/20">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight max-w-md">Understand your true impact.</h2>
              <p className="text-blue-100 text-lg max-w-md leading-relaxed">We calculate everything deterministically, then use AI to explain how to improve it.</p>
            </div>
            {/* Abstract decoration */}
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-[var(--border)] rounded-full blur-3xl -mr-20 -mb-20 pointer-events-none" />
          </motion.div>

          {/* Quick Stat Card */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="bento-card p-8 flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-2">
              <Zap className="w-8 h-8 text-[var(--primary)]" />
            </div>
            <h3 className="text-4xl font-black text-[var(--text-primary)]">Lightning Fast</h3>
            <p className="text-[var(--text-secondary)]">Built on Next.js 14 and FastAPI for immediate calculations.</p>
          </motion.div>

          {/* Smaller Features */}
          {features.map((feature, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 + (idx * 0.1) }} className="bento-card p-6 flex flex-col gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.bg}`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">{feature.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 mt-auto">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-[var(--primary)]" />
            <span className="font-bold text-[var(--text-primary)]">CarbonIQ</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">© 2026 CarbonIQ. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/about" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">About</Link>
            <a href="https://github.com" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
