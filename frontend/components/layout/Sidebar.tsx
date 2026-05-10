'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calculator, Brain, Wind, BarChart3,
  Lightbulb, Info, Leaf, ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

const navItems = [
  { href: '/',                icon: Leaf,            label: 'Home' },
  { href: '/dashboard',       icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/calculator',      icon: Calculator,      label: 'Calculator' },
  { href: '/insights',        icon: Brain,           label: 'AI Insights' },
  { href: '/environment',     icon: Wind,            label: 'Environment' },
  { href: '/recommendations', icon: Lightbulb,       label: 'Recommendations' },
  { href: '/statistics',      icon: BarChart3,       label: 'Statistics' },
  { href: '/about',           icon: Info,            label: 'About' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Toggle */}
      <button
        id="mobile-menu-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bento-card p-2 rounded-lg"
        aria-label="Toggle mobile menu"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed top-0 left-0 h-full z-40 flex flex-col',
          'bg-[var(--sidebar-bg)] border-r border-[var(--border)]',
          'shadow-glass overflow-hidden',
          // Mobile: slide in/out
          'transition-transform md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--border)]">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-glow">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <span className="font-bold text-lg gradient-text">CarbonIQ</span>
                <p className="text-[10px] text-[var(--text-secondary)] -mt-0.5">AI Sustainability</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto px-2">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm',
                  'transition-all duration-200 group relative overflow-hidden',
                  active
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]'
                )}
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-400 rounded-full"
                  />
                )}
                <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-emerald-400' : 'text-[var(--text-secondary)] group-hover:text-emerald-400')} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="truncate"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Controls */}
        <div className="px-2 pb-4 border-t border-[var(--border)] pt-4 space-y-2">
          <div className="flex items-center gap-2 px-2">
            <ThemeToggle />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-[var(--text-secondary)]"
                >
                  Toggle theme
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Collapse toggle — desktop only */}
          <button
            id="sidebar-collapse"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center gap-2 w-full px-3 py-2 rounded-xl
                       text-xs text-[var(--text-secondary)] hover:bg-[var(--card-hover)]
                       transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </motion.aside>
    </>
  )
}
