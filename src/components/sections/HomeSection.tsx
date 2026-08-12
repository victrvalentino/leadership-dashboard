'use client'
import { useEffect, useState } from 'react'
import {
  UserSearch,
  Search,
  LogIn,
  Users,
  TrendingUp,
  RefreshCw,
  LogOut,
  DollarSign,
  BarChart3,
  LineChart,
  ClipboardCheck,
  Target,
  type LucideIcon
} from 'lucide-react'

type Page =
  | 'home'
  | 'executive'
  | 'recruitment'
  | 'entry'
  | 'experience'
  | 'development'
  | 'turnover'
  | 'exit'
  | 'cost'
  | 'leadership'

const LIFECYCLE_CARDS: {
  id: Page
  label: string
  Icon: LucideIcon
  color: string
  subtitle: string
}[] = [
  {
    id: 'entry',
    label: 'ENTRY',
    Icon: LogIn,
    color: '#22A346',
    subtitle: 'Hiring & Onboarding Visibility',
  },
  {
    id: 'experience',
    label: 'EXPERIENCE',
    Icon: Users,
    color: '#2563EB',
    subtitle: 'Team & Workforce Health',
  },
  {
    id: 'development',
    label: 'DEVELOPMENT',
    Icon: TrendingUp,
    color: '#9333EA',
    subtitle: 'Growth & Capability Building',
  },
  {
    id: 'turnover',
    label: 'TURN OVER',
    Icon: RefreshCw,
    color: '#F97316',
    subtitle: 'Workforce Continuity & Replacement Risk',
  },
  {
    id: 'exit',
    label: 'EXIT',
    Icon: LogOut,
    color: '#E11D2E',
    subtitle: 'Exit Intelligence & Key Reasons',
  },
  {
    id: 'cost',
    label: 'COST',
    Icon: DollarSign,
    color: '#0F9488',
    subtitle: 'People Cost & Investment',
  },
]

function SectionDivider({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="flex-1 flex items-center">
        <div className="flex-1 h-px bg-gray-800" />
        <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
      </div>

      <h2 className="text-xl md:text-2xl font-black tracking-wide text-gray-900 whitespace-nowrap">
        {text}
      </h2>

      <div className="flex-1 flex items-center">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
        <div className="flex-1 h-px bg-gray-800" />
      </div>
    </div>
  )
}

export default function HomeSection({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/dashboard/last-updated', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.updatedAt) {
          const d = new Date(json.updatedAt)
          const dd = String(d.getDate()).padStart(2, '0')
          const mm = String(d.getMonth() + 1).padStart(2, '0')
          const yyyy = d.getFullYear()
          setUpdatedAt(`${dd}/${mm}/${yyyy}`)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Updated as of */}
      {updatedAt && (
        <p className="text-right text-sm font-black text-gray-900 -mb-6">
          Updated as of {updatedAt}
        </p>
      )}

      {/* Title */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">
          One Leadership Dashboard
        </h1>

        <SectionDivider text="People Experience Directorate" />
      </div>

      {/* Executive Snapshot Banner */}
      <button
        onClick={() => onNavigate('executive')}
        className="w-full rounded-2xl px-6 py-5 flex items-center justify-between gap-4 hover:shadow-lg transition-all cursor-pointer"
        style={{ backgroundColor: '#D8EAF3' }}
      >
        <div className="flex items-center gap-5">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 icon-gradient shadow-soft"
            style={{ backgroundColor: '#1B3C8C' }}
          >
            <BarChart3 className="w-7 h-7 text-white" strokeWidth={1.75} />
          </div>

          <div className="text-left">
            <h2
              className="text-xl md:text-2xl font-black tracking-wide"
              style={{ color: '#1B4B91' }}
            >
              EXECUTIVE SNAPSHOT
            </h2>
            <p className="text-sm md:text-base font-bold text-gray-800">
              (a quick leadership view about the workforce condition)
            </p>
          </div>
        </div>

        <LineChart
          className="w-11 h-11 flex-shrink-0 hidden sm:block"
          style={{ color: '#1B3C8C' }}
          strokeWidth={2}
        />
      </button>

      {/* Lifecycle Intelligence */}
      <div className="space-y-6">
        <SectionDivider text="LIFECYCLE INTELLIGENCE" />
        <button
          onClick={() => onNavigate('recruitment')}
          className="w-full rounded-2xl px-6 py-5 flex items-center justify-between gap-4 hover:shadow-lg transition-all cursor-pointer"
          style={{ backgroundColor: '#FDE8E9' }}
        >
          <div className="flex items-center gap-5">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 icon-gradient shadow-soft"
              style={{ backgroundColor: '#F0787E' }}
            >
              <UserSearch className="w-7 h-7 text-white" strokeWidth={1.75} />
            </div>

            <div className="text-left">
              <h2
                className="text-xl md:text-2xl font-black tracking-wide"
                style={{ color: '#E8636F' }}
              >
                RECRUITMENT DASHBOARD
              </h2>
              <p className="text-sm md:text-base font-bold text-gray-800">
                (Real-Time Hiring Insights & Action Priorities)
              </p>
            </div>
          </div>

          <Search
            className="w-11 h-11 flex-shrink-0 hidden sm:block"
            style={{ color: '#F0787E' }}
            strokeWidth={2}
          />
        </button>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {LIFECYCLE_CARDS.map(({ id, label, Icon, color, subtitle }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="rounded-2xl px-3 py-5 flex flex-col items-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer text-center"
              style={{ backgroundColor: '#FDFCF2' }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center icon-gradient shadow-soft"
                style={{ backgroundColor: color }}
              >
                <Icon className="w-7 h-7 text-white" strokeWidth={1.75} />
              </div>

              <span
                className="mt-5 text-sm font-black uppercase tracking-wide"
                style={{ color }}
              >
                {label}
              </span>

              <div
                className="w-16 h-px mt-2"
                style={{ backgroundColor: color }}
              />

              <p className="mt-4 text-xs font-semibold text-gray-700 leading-snug">
                {subtitle}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Leadership Action Focus */}
      <button
        onClick={() => onNavigate('leadership')}
        className="w-full rounded-2xl px-6 py-5 flex items-center justify-between gap-4 hover:shadow-lg transition-all cursor-pointer"
        style={{ backgroundColor: '#FCF7DE' }}
      >
        <div className="flex items-center gap-5">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 icon-gradient shadow-soft"
            style={{ backgroundColor: '#E9A319' }}
          >
            <ClipboardCheck className="w-7 h-7 text-white" strokeWidth={1.75} />
          </div>

          <div className="text-left">
            <h2
              className="text-xl md:text-2xl font-black tracking-wide"
              style={{ color: '#F5902B' }}
            >
              LEADERSHIP ACTION FOCUS
            </h2>
            <p className="text-sm md:text-base font-bold text-gray-800">
              (What needs intervention now)
            </p>
          </div>
        </div>

        <Target
          className="w-11 h-11 flex-shrink-0 hidden sm:block"
          style={{ color: '#E9A319' }}
          strokeWidth={2}
        />
      </button>
    </div>
  )
}
