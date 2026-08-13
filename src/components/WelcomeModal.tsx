'use client'

import { useEffect, useState } from 'react'
import { X, CalendarDays, Sparkles } from 'lucide-react'

const STORAGE_KEY = 'ld-welcome-shown-date'

function ordinal(n: number) {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

function formatFriendlyDate(d: Date) {
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' })
  const month = d.toLocaleDateString('en-US', { month: 'long' })
  return `${weekday}, ${ordinal(d.getDate())} ${month} ${d.getFullYear()}`
}

export default function WelcomeModal() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [today] = useState(() => new Date())

  // Show once per calendar day — reappears each new day, not on every
  // navigation back to Home within the same day.
  useEffect(() => {
    try {
      const todayKey = today.toISOString().slice(0, 10)
      const lastShown = localStorage.getItem(STORAGE_KEY)
      if (lastShown !== todayKey) {
        setVisible(true)
        requestAnimationFrame(() => setMounted(true))
      }
    } catch {
      // localStorage unavailable (e.g. private browsing) — just skip
      // the "once per day" memory and don't show, to be safe.
    }
  }, [today])

  useEffect(() => {
    if (!visible) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dismiss()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const dismiss = () => {
    setMounted(false)
    try {
      localStorage.setItem(STORAGE_KEY, today.toISOString().slice(0, 10))
    } catch {
      // ignore
    }
    setTimeout(() => setVisible(false), 220)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className={
          'absolute inset-0 bg-slate-900/45 backdrop-blur-[3px] transition-opacity duration-300 ' +
          (mounted ? 'opacity-100' : 'opacity-0')
        }
        onClick={dismiss}
      />

      <div
        className={
          'relative bg-white rounded-[28px] shadow-2xl max-w-[420px] w-full p-8 sm:p-9 transition-all duration-300 ease-out ' +
          (mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2')
        }
      >
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" strokeWidth={2.25} />
        </button>

        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[30px] icon-gradient shadow-soft">
            👋
          </div>
        </div>

        <h2 className="text-center text-[21px] font-extrabold text-gray-900 leading-snug tracking-tight">
          Welcome to
          <br />
          One Leadership Dashboard.
        </h2>
        <div className="w-10 h-[3px] rounded-full bg-[#1565C0] mx-auto mt-3.5 mb-6" />

        <p className="text-center text-[13.5px] text-gray-600 font-medium flex items-center justify-center gap-1.5">
          <CalendarDays className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={2} />
          Today is <span className="font-bold text-[#1565C0]">{formatFriendlyDate(today)}.</span>
        </p>
        <p className="text-center text-[13.5px] text-gray-500 mt-2.5 leading-relaxed max-w-[320px] mx-auto">
          Here&apos;s your one-stop view to stay informed, aligned, and ready to lead with impact.
        </p>

        <div className="mt-6 bg-gray-50 rounded-2xl p-4 flex items-start gap-3">
          <Sparkles className="w-[18px] h-[18px] text-[#1565C0] flex-shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-[13px] text-gray-700 leading-relaxed">
            <span className="font-bold text-gray-900">Your leadership makes the difference.</span>
            <br />
            Let&apos;s continue building a stronger organization, together.
          </p>
        </div>
      </div>
    </div>
  )
}
