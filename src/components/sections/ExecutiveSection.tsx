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
      className="rounded-2xl p-5 min-h-[290px] flex flex-col items-center justify-between text-center shadow-sm"
      style={{ backgroundColor: bg }}
    >
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center bg-transparent"
        style={{ border: `3px solid ${iconColor}` }}
      >
        <Icon
          className="w-11 h-11"
          style={{ color: iconColor }}
          strokeWidth={1.75}
        />
      </div>

      <p className="text-xs font-bold uppercase tracking-widest text-gray-600 leading-snug">
        {label}
      </p>

      <div className="w-3/4 h-px bg-gray-400/60" />

      <p className="text-4xl font-black text-gray-600">{value}</p>

      <div className="w-1/3 h-px bg-gray-400/60" />

      <div>{footer}</div>
    </div>
  )
}

export default function ExecutiveSection() {
  const [data, setData] = useState<ExecutiveContent>(
    executiveData as ExecutiveContent
  )
  const [loading, setLoading] = useState(true)

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
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-3xl md:text-4xl font-black text-center uppercase text-gray-900 tracking-tight">
        {d.title || 'Executive Snapshot'}
      </h1>

      {/* Directorate banner */}
      <div
        className="rounded-2xl px-8 py-7 flex items-center gap-5 shadow-md"
        style={{ background: '#1B1464' }}
      >
        <div className="w-20 h-20 rounded-full border-2 border-white/70 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-9 h-9 text-white" strokeWidth={1.5} />
        </div>

        <div>
          <p className="text-white text-lg md:text-xl font-bold uppercase tracking-wider">
            Directorate
          </p>
          <p className="text-white text-3xl md:text-4xl font-black tracking-wide uppercase">
            People Experience
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard
          Icon={Users}
          iconColor="#2E7CE4"
          bg="#E2F3F0"
          label="Total Headcount"
          value={d.totalHeadcount}
          footer={<Users className="w-8 h-8 text-blue-600" strokeWidth={2} />}
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
          className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#12275A' }}
        >
          <Lightbulb className="w-8 h-8 text-white" strokeWidth={1.75} />
        </div>

        <div className="w-px self-stretch bg-gray-300" />

        <div className="flex-1 text-left">
          <h3
            className="text-lg md:text-xl font-black uppercase tracking-wide"
            style={{ color: '#3B2FA3' }}
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
          <TrendingUp className="w-12 h-12" strokeWidth={2} />
          <AlertTriangle className="w-11 h-11" strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}
