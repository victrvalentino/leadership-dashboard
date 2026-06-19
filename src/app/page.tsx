'use client'
import { useState } from 'react'
import Sidebar, { type Page } from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import HomeSection from '@/components/sections/HomeSection'
import ExecutiveSection from '@/components/sections/ExecutiveSection'
import EntrySection from '@/components/sections/EntrySection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import DevelopmentSection from '@/components/sections/DevelopmentSection'
import TurnoverSection from '@/components/sections/TurnoverSection'
import ExitSection from '@/components/sections/ExitSection'
import CostSection from '@/components/sections/CostSection'
import LeadershipSection from '@/components/sections/LeadershipSection'

export default function DashboardPage() {
  const [page, setPage] = useState<Page>('home')
  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = (p: Page) => {
    setPage(p)
    window.scrollTo(0, 0)
  }

  const Section = () => {
    switch (page) {
      case 'home': return <HomeSection onNavigate={navigate} />
      case 'executive': return <ExecutiveSection />
      case 'entry': return <EntrySection />
      case 'experience': return <ExperienceSection />
      case 'development': return <DevelopmentSection />
      case 'turnover': return <TurnoverSection />
      case 'exit': return <ExitSection />
      case 'cost': return <CostSection />
      case 'leadership': return <LeadershipSection />
      default: return <HomeSection onNavigate={navigate} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        current={page}
        onNavigate={navigate}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header current={page} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto">
          <Section />
        </main>
      </div>

      {/* Home button (visible on non-home pages) */}
      {page !== 'home' && (
        <button
          onClick={() => navigate('home')}
          className="fixed bottom-6 right-6 w-12 h-12 bg-indigo-800 text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-indigo-900 transition-colors z-50"
          aria-label="Go to home"
        >
          🏠
        </button>
      )}
    </div>
  )
}
