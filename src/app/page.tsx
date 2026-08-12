'use client'
import { useState } from 'react'
import { Home } from 'lucide-react'
import Sidebar, { type Page } from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import HomeSection from '@/components/sections/HomeSection'
import ExecutiveSection from '@/components/sections/ExecutiveSection'
import RecruitmentSection from '@/components/sections/RecruitmentSection'
import EntrySection from '@/components/sections/EntrySection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import DevelopmentSection from '@/components/sections/DevelopmentSection'
import TurnoverSection from '@/components/sections/TurnoverSection'
import ExitSection from '@/components/sections/ExitSection'
import CostSection from '@/components/sections/CostSection'
import LeadershipSection from '@/components/sections/LeadershipSection'
import VersionHistorySection from '@/components/sections/VersionHistorySection'

export default function DashboardPage() {
  const [page, setPage] = useState<Page>('home')
  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = (p: Page) => {
    setPage(p)
    window.scrollTo(0, 0)
  }

  const Section = () => {
    switch (page) {
      case 'home':
        return <HomeSection onNavigate={navigate} />
      case 'executive':
        return <ExecutiveSection />
      case 'recruitment':
        return <RecruitmentSection />
      case 'entry':
        return <EntrySection />
      case 'experience':
        return <ExperienceSection />
      case 'development':
        return <DevelopmentSection />
      case 'turnover':
        return <TurnoverSection />
      case 'exit':
        return <ExitSection />
      case 'cost':
        return <CostSection />
      case 'leadership':
        return <LeadershipSection />
      case 'history':
        return <VersionHistorySection />
      default:
        return <HomeSection onNavigate={navigate} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        current={page}
        onNavigate={navigate}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          current={page}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((v) => !v)}
        />

        <main
          key={page}
          className="flex-1 overflow-y-auto section-enter"
        >
          <Section />
        </main>
      </div>

      {page !== 'home' && (
        <button
          onClick={() => navigate('home')}
          className="fixed bottom-6 right-6 w-12 h-12 bg-indigo-800 text-white rounded-xl shadow-badge flex items-center justify-center hover:bg-indigo-900 hover:shadow-elevated transition-all z-50"
          aria-label="Go to home"
        >
          <Home className="w-6 h-6" strokeWidth={2} />
        </button>
      )}
    </div>
  )
}