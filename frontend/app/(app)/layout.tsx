'use client'
import { TopNav } from '@/components/layout/TopNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-secondary)]">
      <TopNav />
      {/* Main content centered and padded */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
