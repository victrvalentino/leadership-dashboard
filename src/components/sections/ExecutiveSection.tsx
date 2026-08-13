'use client'

import { useEffect, useState } from 'react'
import {
  Building2,
  Users,
  RefreshCw,
  CalendarCheck,
  Wallet,
  Crosshair,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CalendarDays,
  ChevronRight,
  type LucideIcon
} from 'lucide-react'
import { executiveData } from '@/data/dashboardData'
import { StatusBadge } from '@/components/ui'

const STATUSES = ['healthy', 'watchlist', 'high', 'medium', 'low'] as const
type Status = (typeof STATUSES)[number]

function isStatus(value: unknown): value is Status {
  return (
    typeof value === 'string' &&
    (STATUSES as readonly string[]).includes(value.toLowerCase().trim())
  )
}

function toStatus(value: unknown, fallback: Status): Status {
  return isStatus(value)
    ? (String(value).toLowerCase().trim() as Status)
    : fallback
}

type Metric =
  | string
  | number
  | {
      value: string | number
      status?: Status
    }

type ExecutiveContent = {
  title?: string
  subtitle?: string
  totalHeadcount: number | string
  turnover: Metric
  turnoverStatus?: string
  attendance: Metric
  attendanceStatus?: string
  monthlyManpowerCost: string
  criticalRolesOpen: Metric
  criticalRolesStatus?: string
  leadershipInsight: string
}

function normalizeMetric(
  metric: Metric,
  override: unknown,
  defaultStatus: Status
): { value: string | number; status: Status } {
  const base =
    typeof metric === 'object' && metric !== null && 'value' in metric
      ? metric
      : { value: metric as string | number, status: undefined }

  return {
    value: base.value,
    status: isStatus(override)
      ? toStatus(override, defaultStatus)
      : toStatus(base.status, defaultStatus)
  }
}

function KpiCard({
  Icon,
  iconColor,
  bg,
  label,
  value,
  footer
}: {
  Icon: LucideIcon
  iconColor: string
  bg: string
  label: string
  value: string | number
  footer: React.ReactNode
}) {
  return (
    <div
      className="rounded-2xl p-4 min-h-[250px] flex flex-col items-center text-center shadow-soft border border-black/5"
      style={{ backgroundColor: bg }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 icon-gradient shadow-soft"
        style={{ backgroundColor: iconColor }}
      >
        <Icon
          className="w-7 h-7 text-white"
          strokeWidth={1.75}
        />
      </div>

      {/* Fixed-height zones below the icon keep all five cards aligned
          even when titles wrap to a different number of lines. */}
      <div className="h-[36px] mt-2.5 flex items-center justify-center">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-600 leading-snug">
          {label}
        </p>
      </div>

      <div className="w-3/4 h-px" style={{ backgroundColor: `${iconColor}50` }} />

      <div className="h-[48px] flex items-center justify-center">
        <p className="text-4xl font-black text-gray-600">{value}</p>
      </div>

      <div className="w-1/3 h-px bg-gray-300 mt-1" />

      <div className="h-[34px] mt-3 flex items-center justify-center">
        {footer}
      </div>
    </div>
  )
}

export default function ExecutiveSection() {
  const [data, setData] = useState<ExecutiveContent>(
    executiveData as ExecutiveContent
  )
  const [loading, setLoading] = useState(true)
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
    async function loadExecutiveData() {
      try {
        const res = await fetch('/api/dashboard/executive', {
          cache: 'no-store'
        })

        if (!res.ok) {
          setLoading(false)
          return
        }

        const json = await res.json()

        if (json?.data) {
          setData(json.data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadExecutiveData()
  }, [])

  const d = data

  const turnover = normalizeMetric(d.turnover, d.turnoverStatus, 'high')
  const attendance = normalizeMetric(
    d.attendance,
    d.attendanceStatus,
    'watchlist'
  )
  const criticalRoles = normalizeMetric(
    d.criticalRolesOpen,
    d.criticalRolesStatus,
    'high'
  )

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Title row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight uppercase">
            {d.title || 'Executive Snapshot'}
          </h1>
          <p className="text-gray-500 font-medium mt-1.5">
            {d.subtitle || 'People Experience Directorate'}
          </p>
        </div>

        {updatedAt && (
          <p className="text-sm text-gray-400 font-medium flex items-center gap-1.5 mt-1.5 flex-shrink-0">
            Updated as of {updatedAt}
            <CalendarDays className="w-4 h-4" strokeWidth={2} />
          </p>
        )}
      </div>

      {/* Directorate banner */}
      <div
        className="rounded-2xl px-6 py-5 flex items-center gap-5 shadow-md"
        style={{ background: 'linear-gradient(120deg, #0F0C40 0%, #1B1464 100%)' }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 icon-gradient shadow-soft"
          style={{ backgroundColor: '#6D4FD1' }}
        >
          <Building2 className="w-7 h-7 text-white" strokeWidth={1.5} />
        </div>

        <div>
          <p className="text-white text-xs md:text-sm font-bold uppercase tracking-wider opacity-80">
            Directorate
          </p>
          <p className="text-white text-xl md:text-2xl font-black tracking-wide uppercase">
            People Experience
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard
          Icon={Users}
          iconColor="#2E7CE4"
          bg="#FFFFFF"
          label="Total Headcount"
          value={d.totalHeadcount}
          footer={<Users className="w-6 h-6 text-blue-600" strokeWidth={2} />}
        />

        <KpiCard
          Icon={RefreshCw}
          iconColor="#E8262D"
          bg="#FBE3E3"
          label="Turn Over"
          value={turnover.value}
          footer={<StatusBadge status={turnover.status} />}
        />

        <KpiCard
          Icon={CalendarCheck}
          iconColor="#EFB810"
          bg="#FDFAE6"
          label="Attendance"
          value={attendance.value}
          footer={<StatusBadge status={attendance.status} />}
        />

        <KpiCard
          Icon={Wallet}
          iconColor="#2C8A3E"
          bg="#E8F3EA"
          label="Monthly Manpower Cost"
          value={d.monthlyManpowerCost}
          footer={
            <span
              className="text-xs font-bold rounded-full px-3 py-1 border-2"
              style={{ color: '#2C8A3E', borderColor: '#2C8A3E' }}
            >
              Rp
            </span>
          }
        />

        <KpiCard
          Icon={Crosshair}
          iconColor="#E8262D"
          bg="#FBE3E3"
          label="Critical Replacement Roles Open"
          value={criticalRoles.value}
          footer={<StatusBadge status={criticalRoles.status} />}
        />
      </div>

      {/* Leadership Insight */}
      <div
        className="rounded-2xl px-6 py-6 flex items-center gap-5"
        style={{ backgroundColor: '#DFF5F2' }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 icon-gradient shadow-soft"
          style={{ backgroundColor: '#12275A' }}
        >
          <Lightbulb className="w-7 h-7 text-white" strokeWidth={1.75} />
        </div>

        <div className="w-px self-stretch bg-gray-300" />

        <div className="flex-1 text-left">
          <h3
            className="text-lg md:text-xl font-black uppercase tracking-wide"
            style={{ color: '#12275A' }}
          >
            Leadership Insight
          </h3>
          <p className="text-sm md:text-base text-gray-800 mt-1">
            {d.leadershipInsight}
          </p>
        </div>

        <div
          className="hidden sm:flex items-center gap-3 flex-shrink-0"
          style={{ color: '#12275A' }}
        >
          <TrendingUp className="w-9 h-9" strokeWidth={2} />
          <AlertTriangle className="w-8 h-8" strokeWidth={2} />
          <ChevronRight className="w-5 h-5 text-gray-400" strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}
