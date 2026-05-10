'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Calculator, Brain, Wind, BarChart3, Lightbulb, Info, Leaf, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

const navItems = [
  { href: '/dashboard',       icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/calculator',      icon: Calculator,      label: 'Calculator' },
  { href: '/insights',        icon: Brain,           label: 'AI Insights' },
  { href: '/environment',     icon: Wind,            label: 'Environment' },
  { href: '/recommendations', icon: Lightbulb,       label: 'Recommendations' },
  { href: '/statistics',      icon: BarChart3,       label: 'Statistics' },
]

export function TopNav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg-primary)] shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-[1400px] mx-auto">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white transition-transform group-hover:scale-105">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg hidden sm:block tracking-tight text-[var(--text-primary)]">CarbonIQ</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  active
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]'
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/about" className="hidden sm:flex p-2 text-[var(--text-secondary)] hover:bg-[var(--card-hover)] rounded-full transition-colors">
            <Info className="w-5 h-5" />
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-[var(--text-secondary)] hover:bg-[var(--card-hover)] rounded-full transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[280px] bg-[var(--bg-primary)] z-50 border-l border-[var(--border)] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-[var(--text-secondary)] hover:bg-[var(--card-hover)] rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map(({ href, icon: Icon, label }) => {
                  const active = pathname === href
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors',
                        active
                          ? 'bg-[var(--primary)] text-white'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </Link>
                  )
                })}
                <Link
                  href="/about"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[var(--text-secondary)] hover:bg-[var(--card-hover)] transition-colors"
                >
                  <Info className="w-5 h-5" />
                  About
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
