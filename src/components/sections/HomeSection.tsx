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
  ChevronRight,
  ArrowRight,
  CalendarDays,
  type LucideIcon
} from 'lucide-react'
import WelcomeModal from '@/components/WelcomeModal'

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
  { id: 'entry', label: 'Entry', Icon: LogIn, color: '#22A346', subtitle: 'Hiring & Onboarding Visibility' },
  { id: 'experience', label: 'Experience', Icon: Users, color: '#2563EB', subtitle: 'Team & Workforce Health' },
  { id: 'development', label: 'Development', Icon: TrendingUp, color: '#9333EA', subtitle: 'Growth & Capability Building' },
  { id: 'turnover', label: 'Turnover', Icon: RefreshCw, color: '#F97316', subtitle: 'Workforce Continuity & Replacement Risk' },
  { id: 'exit', label: 'Exit', Icon: LogOut, color: '#E11D2E', subtitle: 'Exit Intelligence & Key Reasons' },
  { id: 'cost', label: 'Cost', Icon: DollarSign, color: '#0F9488', subtitle: 'People Cost & Investment' },
]

// Shared row layout for the three "featured" links (Executive, Recruitment,
// Leadership Action) — icon, title/subtitle, then a divider + preview icon +
// chevron affordance on the right.
function FeatureRow({
  onClick,
  bgColor,
  iconColor,
  Icon,
  title,
  subtitle,
  PreviewIcon,
}: {
  onClick: () => void
  bgColor?: string
  iconColor: string
  Icon: LucideIcon
  title: string
  subtitle: string
  PreviewIcon: LucideIcon
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl px-6 py-5 flex items-center justify-between gap-4 bg-white border border-gray-100 shadow-soft hover:shadow-elevated transition-all text-left"
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
      <div className="flex items-center gap-5 min-w-0">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 icon-gradient shadow-soft"
          style={{ backgroundColor: iconColor }}
        >
          <Icon className="w-7 h-7 text-white" strokeWidth={1.75} />
        </div>

        <div className="min-w-0">
          <h2 className="text-lg md:text-xl font-extrabold text-gray-900 truncate">{title}</h2>
          <p className="text-sm text-gray-500 font-medium mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
        <div className="w-px h-9" style={{ backgroundColor: `${iconColor}30` }} />
        <PreviewIcon className="w-6 h-6" style={{ color: iconColor }} strokeWidth={1.75} />
        <ChevronRight className="w-5 h-5 text-gray-300" strokeWidth={2} />
      </div>
    </button>
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
      <WelcomeModal />

      {/* Title row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight uppercase">
            One Leadership Dashboard
          </h1>
          <p className="text-gray-500 font-medium mt-1.5">People Experience Directorate</p>
        </div>

        {updatedAt && (
          <p className="text-sm text-gray-400 font-medium flex items-center gap-1.5 mt-1.5 flex-shrink-0">
            Updated as of {updatedAt}
            <CalendarDays className="w-4 h-4" strokeWidth={2} />
          </p>
        )}
      </div>

      {/* Executive Snapshot */}
      <FeatureRow
        onClick={() => onNavigate('executive')}
        iconColor="#1B3C8C"
        Icon={BarChart3}
        title="Executive Snapshot"
        subtitle="A quick leadership view about the workforce condition."
        PreviewIcon={LineChart}
      />

      {/* Lifecycle Intelligence */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-gray-800 whitespace-nowrap">Lifecycle Intelligence</h2>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <FeatureRow
          onClick={() => onNavigate('recruitment')}
          bgColor="#FDF0F1"
          iconColor="#E8636F"
          Icon={UserSearch}
          title="Recruitment Dashboard"
          subtitle="Real-time hiring insights & action priorities."
          PreviewIcon={Search}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {LIFECYCLE_CARDS.map(({ id, label, Icon, color, subtitle }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="rounded-2xl p-5 flex flex-col items-start bg-white border border-gray-100 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all text-left"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center icon-gradient shadow-soft mb-3"
                style={{ backgroundColor: color }}
              >
                <Icon className="w-6 h-6 text-white" strokeWidth={1.75} />
              </div>

              <span className="text-[15px] font-extrabold text-gray-900">{label}</span>
              <p className="mt-1 text-xs text-gray-500 font-medium leading-snug">{subtitle}</p>

              <ArrowRight className="w-4 h-4 text-gray-300 mt-3" strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>

      {/* Leadership Action Focus */}
      <FeatureRow
        onClick={() => onNavigate('leadership')}
        bgColor="#FEFAE8"
        iconColor="#E9A319"
        Icon={ClipboardCheck}
        title="Leadership Action Focus"
        subtitle="What needs intervention now."
        PreviewIcon={Target}
      />
    </div>
  )
}
