'use client'

import { useEffect, useState } from 'react'
import {
  Users,
  ClipboardList,
  BarChart3,
  CalendarDays,
  CalendarCheck,
  UserX,
  Megaphone
} from 'lucide-react'
import { experienceData } from '@/data/dashboardData'
import {
  DonutChart,
  CircularProgress,
  StatusBadge,
  SimpleHBar
} from '@/components/ui'

type MixItem = {
  label: string
  value: number
}

type ExperienceContent = {
  title?: string
  subtitle?: string
  totalHeadcount: number
  male?: number
  female?: number
  permanent?: number
  contract?: number
  other?: number
  averageTenure: number
  attendanceRate: number
  attendanceStatus?: string
  absenteeismRate: number
  absenteeismStatus?: string
  leadershipSignal: string
  levelMix: MixItem[] | Record<string, number>
  tenureMix: MixItem[] | Record<string, number>
}

const STATUSES = ['healthy', 'watchlist', 'high', 'medium', 'low'] as const
type Status = (typeof STATUSES)[number]

function toStatus(value: unknown, fallback: Status): Status {
  const s = String(value || '').toLowerCase().trim()
  return (STATUSES as readonly string[]).includes(s)
    ? (s as Status)
    : fallback
}

function normalizeLevelMix(
  mix: MixItem[] | Record<string, number> | undefined
): MixItem[] {
  if (!mix) return []
  if (Array.isArray(mix)) {
    return mix.map(item => ({
      ...item,
      value: Number(item.value || 0)
    }))
  }

  return Object.entries(mix).map(([label, value]) => ({
    label:
      label === 'AssistantManager'
        ? 'Assistant Manager'
        : label,
    value: Number(value || 0)
  }))
}

function normalizeTenureMix(
  mix: MixItem[] | Record<string, number> | undefined
): MixItem[] {
  if (!mix) return []
  if (Array.isArray(mix)) {
    return mix.map(item => ({
      ...item,
      value: Number(item.value || 0)
    }))
  }

  const mapper: Record<string, string> = {
    lt1: '< 1 Year',
    yr1to3: '1 – 3 Years',
    yr3to5: '3 – 5 Years',
    gt5: '> 5 Years'
  }

  return Object.entries(mix).map(([label, value]) => ({
    label: mapper[label] || label,
    value: Number(value || 0)
  }))
}

function CardIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center mb-2">
      <div className="w-16 h-16 rounded-full flex items-center justify-center text-blue-600 icon-gradient shadow-soft" style={{ backgroundColor: '#E8EFFE' }}>
        {children}
      </div>
    </div>
  )
}

function CardFooter({
  label,
  value,
  unit
}: {
  label: string
  value: string | number
  unit?: string
}) {
  return (
    <div className="border-t border-gray-100 mt-auto pt-3 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-4xl font-black text-blue-700">
        {value}
        {unit && (
          <span className="text-sm ml-1 font-semibold">{unit}</span>
        )}
      </p>
    </div>
  )
}

function LegendDot({
  color,
  label,
  value
}: {
  color: string
  label: string
  value: number
}) {
  return (
    <div className="flex items-start gap-1.5 text-[11px] leading-tight">
      <span
        className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5"
        style={{ backgroundColor: color }}
      />
      <span className="text-gray-600">
        {label}
        <br />
        <span className="font-bold text-gray-700">{value}%</span>
      </span>
    </div>
  )
}

export default function ExperienceSection() {
  const [data, setData] = useState(
    experienceData as unknown as ExperienceContent
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
        const res = await fetch('/api/dashboard/experience', {
          cache: 'no-store'
        })

        if (!res.ok) return

        const json = await res.json()

        if (json?.data) {
          const d = json.data

          setData({
            ...d,
            totalHeadcount: Number(d.totalHeadcount || 0),
            male: Number(d.male ?? d.genderMix?.male ?? 0),
            female: Number(d.female ?? d.genderMix?.female ?? 0),
            permanent: Number(
              d.permanent ?? d.employmentStatus?.permanent ?? 0
            ),
            contract: Number(
              d.contract ?? d.employmentStatus?.contract ?? 0
            ),
            other: Number(
              d.other ?? d.employmentStatus?.other ?? 0
            ),
            averageTenure: Number(d.averageTenure || 0),
            attendanceRate: Number(d.attendanceRate || 0),
            absenteeismRate: Number(d.absenteeismRate || 0),
            levelMix: d.levelMix || {},
            tenureMix: d.tenureMix || {},
            leadershipSignal: d.leadershipSignal || '',
          })
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadData()
  }, [])

  const d = data

  const levelMix = normalizeLevelMix(d.levelMix)
  const tenureMix = normalizeTenureMix(d.tenureMix)

  const male = Number(d.male ?? 0)
  const female = Number(d.female ?? 0)
  const permanent = Number(d.permanent ?? 0)
  const contract = Number(d.contract ?? 0)
  const other = Number(d.other ?? 0)

  const cardClass =
    'bg-white rounded-3xl p-4 shadow-soft border border-gray-100 min-h-[320px] flex flex-col'

  const titleClass =
    'text-xs font-black text-gray-800 uppercase tracking-wide mb-3 text-center leading-tight'

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 flex-shrink-0 icon-gradient shadow-badge"
              style={{ backgroundColor: '#1D4ED8' }}
            >
              <Users className="w-8 h-8 text-white" strokeWidth={1.75} />
              <span className="text-[10px] font-black tracking-widest text-white">
                EXPERIENCE
              </span>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight uppercase">
                {d.title || 'Experience'}
              </h1>
              <p className="text-gray-500 font-medium mt-1.5">
                {d.subtitle || 'Experience and engagement overview'}
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

      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-soft">
        <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-800 mb-5">
          Key Metrics
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className={cardClass}>
            <CardIcon>
              <Users size={28} strokeWidth={1.75} />
            </CardIcon>

            <h3 className={titleClass}>Gender Mix</h3>
            <div className="w-3/4 h-px bg-gray-200 mx-auto mb-3" />

            <div className="flex items-center justify-center gap-2">
              <DonutChart
                size={78}
                segments={[
                  { value: male, color: '#2563EB' },
                  { value: female, color: '#EC4899' }
                ]}
              />

              <div className="space-y-1.5">
                <LegendDot color="#2563EB" label="Male" value={male} />
                <LegendDot color="#EC4899" label="Female" value={female} />
              </div>
            </div>

            <CardFooter
              label="Total Headcount"
              value={d.totalHeadcount}
            />
          </div>

          <div className={cardClass}>
            <CardIcon>
              <ClipboardList size={28} strokeWidth={1.75} />
            </CardIcon>

            <h3 className={titleClass}>Employment Status</h3>
            <div className="w-3/4 h-px bg-gray-200 mx-auto mb-3" />

            <div className="flex items-center justify-center gap-2">
              <DonutChart
                size={78}
                segments={[
                  { value: permanent, color: '#2563EB' },
                  { value: contract, color: '#60A5FA' },
                  { value: other, color: '#BFDBFE' }
                ]}
              />

              <div className="space-y-1.5">
                <LegendDot color="#2563EB" label="Permanent" value={permanent} />
                <LegendDot color="#60A5FA" label="Contract" value={contract} />
                <LegendDot color="#BFDBFE" label="Other" value={other} />
              </div>
            </div>

            <CardFooter
              label="Total Headcount"
              value={d.totalHeadcount}
            />
          </div>

          <div className={cardClass}>
            <CardIcon>
              <BarChart3 size={28} strokeWidth={1.75} />
            </CardIcon>

            <h3 className={titleClass}>Level Mix</h3>
            <div className="w-3/4 h-px bg-gray-200 mx-auto mb-3" />

            <div className="space-y-2">
              {levelMix.map(item => (
                <SimpleHBar
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  max={100}
                  color="#2563EB"
                />
              ))}
            </div>

            <CardFooter
              label="Total Headcount"
              value={d.totalHeadcount}
            />
          </div>

          <div className={cardClass}>
            <CardIcon>
              <CalendarDays size={28} strokeWidth={1.75} />
            </CardIcon>

            <h3 className={titleClass}>Tenure Mix</h3>
            <div className="w-3/4 h-px bg-gray-200 mx-auto mb-3" />

            <div className="space-y-2">
              {tenureMix.map(item => (
                <SimpleHBar
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  max={100}
                  color="#2563EB"
                />
              ))}
            </div>

            <CardFooter
              label="Average Tenure"
              value={d.averageTenure}
              unit="Years"
            />
          </div>

          <div className={cardClass}>
            <CardIcon>
              <CalendarCheck size={28} strokeWidth={1.75} />
            </CardIcon>

            <h3 className={titleClass}>Attendance</h3>
            <div className="w-3/4 h-px bg-gray-200 mx-auto mb-3" />

            <div className="flex justify-center mt-2">
              <CircularProgress
                value={Number(d.attendanceRate)}
                color="#2563EB"
                label={`${d.attendanceRate}%`}
              />
            </div>

            <div className="border-t border-gray-100 mt-auto pt-3 text-center">
              <p className="text-xs text-gray-500">Attendance Rate</p>

              <div className="mt-2 flex justify-center">
                <StatusBadge
                  status={toStatus(d.attendanceStatus, 'watchlist')}
                />
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <CardIcon>
              <UserX size={28} strokeWidth={1.75} />
            </CardIcon>

            <h3 className={titleClass}>Absenteeism</h3>
            <div className="w-3/4 h-px bg-gray-200 mx-auto mb-3" />

            <div className="flex justify-center mt-2">
              <CircularProgress
                value={Number(d.absenteeismRate)}
                color="#2563EB"
                label={`${d.absenteeismRate}%`}
              />
            </div>

            <div className="border-t border-gray-100 mt-auto pt-3 text-center">
              <p className="text-xs text-gray-500">Absenteeism Rate</p>

              <div className="mt-2 flex justify-center">
                <StatusBadge
                  status={toStatus(d.absenteeismStatus, 'healthy')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl px-6 py-5 flex items-center gap-4 bg-white border border-gray-100 shadow-soft">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 icon-gradient shadow-soft"
          style={{ backgroundColor: '#1D4ED8' }}
        >
          <Megaphone className="w-6 h-6 text-white" strokeWidth={1.75} />
        </div>

        <div className="flex-1">
          <p
            className="text-sm font-extrabold uppercase tracking-wide"
            style={{ color: '#1D4ED8' }}
          >
            Leadership Signal
          </p>
          <p className="text-sm text-gray-600 mt-0.5">{d.leadershipSignal}</p>
        </div>
      </div>
    </div>
  )
}
