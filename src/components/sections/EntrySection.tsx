'use client'

import { useEffect, useState } from 'react'
import {
  LogIn,
  Users,
  Briefcase,
  ShieldCheck,
  ClipboardCheck,
  Megaphone,
  CalendarDays,
  type LucideIcon
} from 'lucide-react'
import { entryData } from '@/data/dashboardData'
import { StatusBadge, DonutChart } from '@/components/ui'

type EntryContent = {
  title?: string
  subtitle?: string
  joinersMonthly: number
  joinersQuarterly: number
  criticalRolesFilled: number
  criticalRolesTotal: number
  criticalRolesPct: number
  criticalRolesStatus?: string
  newHireStability: number
  newHireStabilityCaption?: string
  newHireStabilityStatus?: string
  onboardingCompletion: number
  onboardingCompletionCaption?: string
  onboardingCompletionStatus?: string
  leadershipSignal: string
}

const STATUSES = ['healthy', 'watchlist', 'high', 'medium', 'low'] as const
type Status = (typeof STATUSES)[number]

function toStatus(value: unknown, fallback: Status): Status {
  const s = String(value || '').toLowerCase().trim()
  return (STATUSES as readonly string[]).includes(s)
    ? (s as Status)
    : fallback
}

const GREEN = '#1D7A34'
const GREEN_TINT = '#E7F5EA'

function CardIcon({ Icon }: { Icon: LucideIcon }) {
  return (
    <div className="flex justify-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center icon-gradient shadow-soft"
        style={{ backgroundColor: GREEN_TINT }}
      >
        <Icon className="w-7 h-7" style={{ color: GREEN }} strokeWidth={1.75} />
      </div>
    </div>
  )
}

export default function EntrySection() {
  const [data, setData] = useState<EntryContent>(
    entryData as EntryContent
  )
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

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/dashboard/entry', {
          cache: 'no-store'
        })

        if (!res.ok) return

        const json = await res.json()

        if (json?.data) {
          const d = json.data

          setData({
            ...d,
            joinersMonthly: Number(d.joinersMonthly || 0),
            joinersQuarterly: Number(d.joinersQuarterly || 0),
            criticalRolesFilled: Number(d.criticalRolesFilled || 0),
            criticalRolesTotal: Number(d.criticalRolesTotal || 0),
            criticalRolesPct: Number(d.criticalRolesPct || 0),
            newHireStability: Number(d.newHireStability || 0),
            onboardingCompletion: Number(d.onboardingCompletion || 0),
          })
        }
      } catch (err) {
        console.error(err)
      }
    }

    loadData()
  }, [])

  const d = data

  const cardClass =
    'bg-white rounded-2xl p-5 min-h-[320px] flex flex-col items-center text-center shadow-soft border border-gray-100'

  const titleClass =
    'text-sm font-bold uppercase tracking-widest text-gray-800 leading-snug'

  const bigValueClass = 'text-4xl font-black'

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 flex-shrink-0 icon-gradient shadow-badge"
              style={{ backgroundColor: GREEN }}
            >
              <LogIn className="w-8 h-8 text-white" strokeWidth={1.75} />
              <span className="text-[10px] font-black tracking-widest text-white">
                ENTRY
              </span>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight uppercase">
                {d.title || 'Entry'}
              </h1>
              <p className="text-gray-500 font-medium mt-1.5">
                {d.subtitle || 'Hiring and onboarding metrics'}
              </p>
            </div>
          </div>

          {updatedAt && (
            <p className="text-sm text-gray-400 font-medium flex items-center gap-1.5 mt-1.5 flex-shrink-0">
              Updated as of {updatedAt}
              <CalendarDays className="w-4 h-4" strokeWidth={2} />
            </p>
          )}
        </div>

        <div className="w-full h-px mt-6 bg-gray-200" />
      </div>

      {/* Key metrics */}
      <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-soft">
        <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-800 mb-6">
          Key Metrics
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
          {/* Joiners */}
          <div className={cardClass}>
            <CardIcon Icon={Users} />

            <div className="mt-3 h-[44px] flex items-center justify-center">
              <p className={titleClass}>
                Joiners
                <br />
                (Monthly/Quarterly)
              </p>
            </div>

            <div className="w-3/4 h-px bg-gray-200 mt-2" />

            <div className="w-full mt-5 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Monthly</p>
                <p className={bigValueClass} style={{ color: GREEN }}>
                  {d.joinersMonthly}
                </p>
              </div>

              <div className="w-3/4 mx-auto h-px bg-gray-200" />

              <div>
                <p className="text-sm text-gray-500">Quarterly</p>
                <p className={bigValueClass} style={{ color: GREEN }}>
                  {d.joinersQuarterly}
                </p>
              </div>
            </div>
          </div>

          {/* Critical roles */}
          <div className={cardClass}>
            <CardIcon Icon={Briefcase} />

            <div className="mt-3 h-[44px] flex items-center justify-center">
              <p className={titleClass}>
                Critical Roles
                <br />
                Hiring Status
              </p>
            </div>

            <div className="w-3/4 h-px bg-gray-200 mt-2" />

            <div className="mt-5 flex items-center justify-center gap-2">
              <DonutChart
                size={86}
                segments={[
                  { value: d.criticalRolesPct, color: GREEN },
                  {
                    value: Math.max(100 - d.criticalRolesPct, 0),
                    color: '#D7DBE0'
                  }
                ]}
              />

              <div className="text-left leading-none">
                <p
                  className="text-2xl font-black"
                  style={{ color: GREEN }}
                >
                  {d.criticalRolesPct}
                  <span className="text-sm">%</span>
                </p>
                <p
                  className="text-lg font-black"
                  style={{ color: GREEN }}
                >
                  Filled
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500 px-2">
              {d.criticalRolesFilled} of {d.criticalRolesTotal} roles filled
            </p>

            <div className="mt-auto pt-4">
              <StatusBadge
                status={toStatus(d.criticalRolesStatus, 'watchlist')}
              />
            </div>
          </div>

          {/* New hire stability */}
          <div className={cardClass}>
            <CardIcon Icon={ShieldCheck} />

            <div className="mt-3 h-[44px] flex items-center justify-center">
              <p className={titleClass}>
                New Hire
                <br />
                Stability
              </p>
            </div>

            <div className="w-3/4 h-px bg-gray-200 mt-2" />

            <p className="mt-6" style={{ color: GREEN }}>
              <span className={bigValueClass}>{d.newHireStability}</span>
              <span className="text-xl font-black">%</span>
            </p>

            <p className="mt-3 text-xs text-gray-500 px-2">
              {d.newHireStabilityCaption ||
                'New hires retained beyond 3 months'}
            </p>

            <div className="mt-auto pt-4">
              <StatusBadge
                status={toStatus(d.newHireStabilityStatus, 'healthy')}
              />
            </div>
          </div>

          {/* Onboarding completion */}
          <div className={cardClass}>
            <CardIcon Icon={ClipboardCheck} />

            <div className="mt-3 h-[44px] flex items-center justify-center">
              <p className={titleClass}>
                Onboarding
                <br />
                Completion
              </p>
            </div>

            <div className="w-3/4 h-px bg-gray-200 mt-2" />

            <p className="mt-6" style={{ color: GREEN }}>
              <span className={bigValueClass}>
                {d.onboardingCompletion}
              </span>
              <span className="text-xl font-black">%</span>
            </p>

            <p className="mt-3 text-xs text-gray-500 px-2">
              {d.onboardingCompletionCaption ||
                'Onboarding completed on time'}
            </p>

            <div className="mt-auto pt-4">
              <StatusBadge
                status={toStatus(d.onboardingCompletionStatus, 'watchlist')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl px-6 py-5 flex items-center gap-4 bg-white border border-gray-100 shadow-soft">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 icon-gradient shadow-soft"
          style={{ backgroundColor: GREEN }}
        >
          <Megaphone className="w-6 h-6 text-white" strokeWidth={1.75} />
        </div>

        <div className="flex-1">
          <p
            className="text-sm font-extrabold uppercase tracking-wide"
            style={{ color: GREEN }}
          >
            Leadership Signal
          </p>
          <p className="text-sm text-gray-600 mt-0.5">{d.leadershipSignal}</p>
        </div>
      </div>
    </div>
  )
}
