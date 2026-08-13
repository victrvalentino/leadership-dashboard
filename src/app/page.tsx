'use client'
import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
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
import ContactModal from '@/components/ContactModal'

export default function DashboardPage() {
  const [page, setPage] = useState<Page>('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

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
    <>
      {/* Company logo watermark — fixed to the viewport (not the scrolling
          content) so it stays vertically centered on screen regardless of
          which section is open or how far the page is scrolled. Kept as a
          top-level sibling with its own low z-index, and everything real
          is wrapped in one explicitly higher z-index below, so the layering
          is unambiguous rather than depending on DOM order. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-icon-blue.png"
        alt=""
        aria-hidden="true"
        className="fixed right-16 top-1/2 -translate-y-1/2 w-[420px] h-auto opacity-[0.05] pointer-events-none select-none z-0"
      />

      <div className="relative z-10 flex h-screen overflow-hidden">
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

        <button
          onClick={() => setContactOpen(true)}
          className="fixed bottom-6 right-6 w-12 h-12 bg-indigo-800 text-white rounded-xl icon-gradient shadow-badge flex items-center justify-center hover:bg-indigo-900 transition-all z-50"
          aria-label="Contact your PEX representative"
          style={{ backgroundColor: '#0D1B4B' }}
        >
          <MessageCircle className="w-6 h-6" strokeWidth={2} />
        </button>

        <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      </div>
    </>
  )
}