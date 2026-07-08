'use client'
import {
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
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
      {/* Title */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight uppercase">
          One Leadership Dashboard
        </h1>

        <SectionDivider text="People Experience Directorate" />
      </div>

      {/* Executive Snapshot Banner */}
      <button
        onClick={() => onNavigate('executive')}
        className="w-full rounded-2xl px-8 py-7 flex items-center justify-between gap-4 hover:shadow-lg transition-all cursor-pointer"
        style={{ backgroundColor: '#D8EAF3' }}
      >
        <div className="flex items-center gap-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#1B3C8C' }}
          >
            <BarChart3 className="w-8 h-8 text-white" strokeWidth={1.75} />
          </div>

          <div className="text-left">
            <h2
              className="text-2xl md:text-3xl font-black tracking-wide"
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
          className="w-14 h-14 flex-shrink-0 hidden sm:block"
          style={{ color: '#1B3C8C' }}
          strokeWidth={2}
        />
      </button>

      {/* Lifecycle Intelligence */}
      <div className="space-y-8">
        <SectionDivider text="LIFECYCLE INTELLIGENCE" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {LIFECYCLE_CARDS.map(({ id, label, Icon, color, subtitle }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="rounded-2xl px-3 py-6 flex flex-col items-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer text-center"
              style={{ backgroundColor: '#FDFCF2' }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: color }}
              >
                <Icon className="w-9 h-9 text-white" strokeWidth={1.75} />
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
        className="w-full rounded-2xl px-8 py-7 flex items-center justify-between gap-4 hover:shadow-lg transition-all cursor-pointer"
        style={{ backgroundColor: '#FCF7DE' }}
      >
        <div className="flex items-center gap-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#E9A319' }}
          >
            <ClipboardCheck className="w-8 h-8 text-white" strokeWidth={1.75} />
          </div>

          <div className="text-left">
            <h2
              className="text-2xl md:text-3xl font-black tracking-wide"
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
          className="w-14 h-14 flex-shrink-0 hidden sm:block"
          style={{ color: '#E9A319' }}
          strokeWidth={2}
        />
      </button>
    </div>
  )
}
