'use client'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import type { Page } from './Sidebar'

const PAGE_LABELS: Record<Page, string> = {
  home: 'Home',
  executive: 'Executive Snapshot',
  recruitment: 'Recruitment Dashboard',
  entry: 'Entry — Hiring & Onboarding',
  experience: 'Experience',
  development: 'Development',
  turnover: 'Turnover',
  exit: 'Exit Intelligence',
  cost: 'Cost & Investment',
  leadership: 'Leadership Action',
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(
    new RegExp('(^| )' + name + '=([^;]+)')
  )
  return match ? decodeURIComponent(match[2]) : null
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Header({
  current,
  menuOpen,
  onToggleMenu,
}: {
  current: Page
  menuOpen: boolean
  onToggleMenu: () => void
}) {
  const [userName, setUserName] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    setUserName(getCookie('user-name'))
    setRole(getCookie('user-role'))
  }, [])

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 flex items-center h-14 px-4 gap-4 shadow-sm">
      <button
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
        onClick={onToggleMenu}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      <div className="h-8 w-px bg-gray-200 hidden lg:block" />
      <div>
        <p className="text-xs text-gray-400 font-medium">One Leadership Dashboard</p>
        <p className="text-sm font-black text-gray-800 uppercase tracking-wide">{PAGE_LABELS[current]}</p>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden md:inline text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-medium">
          People Experience Directorate
        </span>

        {userName && (
          <div className="text-right leading-tight hidden sm:block">
            <p className="text-sm font-bold text-gray-800">
              {userName}
            </p>
            {role && (
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {role}
              </p>
            )}
          </div>
        )}

        <div className="w-8 h-8 rounded-full bg-indigo-800 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
          {userName ? getInitials(userName) : 'PX'}
        </div>
      </div>
    </header>
  )
}
