import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'CarbonIQ — AI-Powered Carbon Footprint Intelligence',
  description:
    'Calculate your carbon footprint, visualize your environmental impact, and get AI-powered sustainability recommendations. Join the journey to a greener future.',
  keywords: ['carbon footprint', 'sustainability', 'AI', 'climate', 'emissions', 'green'],
  openGraph: {
    title: 'CarbonIQ — Carbon Footprint Intelligence Platform',
    description: 'AI-powered sustainability analytics. Measure. Understand. Reduce.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster
            position="bottom-right"
            richColors
            theme="system"
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
