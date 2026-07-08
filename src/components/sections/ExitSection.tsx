'use client'

import { useEffect, useState } from 'react'
import {
  LogOut,
  ClipboardCheck,
  UserX,
  CalendarDays,
  Users,
  Lightbulb,
  Network,
  Laptop,
  CircleDollarSign,
  type LucideIcon
} from 'lucide-react'
import { exitData } from '@/data/dashboardData'
import { SimpleHBar, DonutChart } from '@/components/ui'

const RED = '#E8192C'
const PANEL = '#FBE9EC'

function IconCircle({
  Icon,
  size = 'w-16 h-16',
  iconSize = 'w-8 h-8'
}: {
  Icon: LucideIcon
  size?: string
  iconSize?: string
}) {
  return (
    <div
      className={`${size} rounded-full flex items-center justify-center flex-shrink-0`}
      style={{ backgroundColor: RED }}
    >
      <Icon className={`${iconSize} text-white`} strokeWidth={1.75} />
    </div>
  )
}

function ExitKPI({
  Icon,
  label,
  sub,
  value,
  unit = '',
  trend,
  trendColor = 'text-red-500',
  trendArrow = '↑',
  caption
}: {
  Icon: LucideIcon
  label: string
  sub?: string
  value: string | number
  unit?: string
  trend?: string
  trendColor?: string
  trendArrow?: string
  caption?: string
}) {
  return (
    <div className="bg-white rounded-2xl p-4 min-h-[190px] flex flex-col justify-between text-center shadow-sm">
      <div>
        <p className="text-xs md:text-sm font-bold uppercase tracking-wide text-gray-800 leading-tight">
          {label}
        </p>
        {sub && (
          <p className="text-[11px] font-semibold text-gray-500">({sub})</p>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 my-3">
        <IconCircle Icon={Icon} />

        <p
          className="text-4xl font-black leading-none"
          style={{ color: RED }}
        >
          {value}
          {unit && <span className="text-base font-bold"> {unit}</span>}
        </p>
      </div>

      {trend ? (
        <p className="text-xs font-bold text-gray-700">
          vs Last Months: {trend}{' '}
          <span className={trendColor}>{trendArrow}</span>
        </p>
      ) : (
        <p className="text-xs font-bold text-gray-700 leading-tight">
          {caption}
        </p>
      )}
    </div>
  )
}

type ReasonRow = {
  reason: string
  pct: number
}

type TenureRow = {
  name: string
  value: number
  color: string
}

type RoleRow = {
  role: string
  exits: number
}

type ExitContent = {
  title?: string
  subtitle?: string

  exitInterviewCompletion: number
  exitInterviewCompletionPrev: number

  regrettedLoss: number
  regrettedLossPrev: number

  avgTenureAtResignation: number
  avgTenureAtResignationPrev: number

  totalExits: number
  totalExitsPrev: number
  topAffectedRoles: number

  leadershipSignal: string

  resignationReasons: ReasonRow[]
  tenureAtResignation: TenureRow[]
  topAffectedRolesList: RoleRow[]
  signalItems?: { icon: string; text: string }[]
}

const DEFAULT_SIGNAL_ITEMS: { Icon: LucideIcon; text: string }[] = [
  {
    Icon: Users,
    text: 'Repeated exits in specific teams may indicate leadership issues'
  },
  {
    Icon: Network,
    text: 'High exits in certain roles may indicate structure or role misalignment'
  },
  {
    Icon: Laptop,
    text: 'Early tenure exits may indicate workload or expectation mismatch'
  },
  {
    Icon: CircleDollarSign,
    text: 'Compensation concerns may be driving talent away'
  }
]

export default function ExitSection() {
  const [data, setData] = useState<ExitContent>({
    ...exitData,
    resignationReasons: exitData.resignationReasons,
    tenureAtResignation: exitData.tenureAtResignation,
    topAffectedRolesList: exitData.topAffectedRolesList
  })

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/dashboard/exit', {
          cache: 'no-store'
        })

        if (!res.ok) return

        const json = await res.json()

        if (json?.data) {
          setData(prev => ({
            ...prev,
            ...json.data,
            resignationReasons:
              json.data.resignationReasons?.length
                ? json.data.resignationReasons
                : prev.resignationReasons,

            tenureAtResignation:
              json.data.tenureAtResignation?.length
                ? json.data.tenureAtResignation
                : prev.tenureAtResignation,

            topAffectedRolesList:
              json.data.topAffectedRolesList?.length
                ? json.data.topAffectedRolesList
                : prev.topAffectedRolesList
          }))
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadData()
  }, [])

  const d = data

  const maxReason = Math.max(
    ...d.resignationReasons.map(r => Number(r.pct))
  )

  const maxRole = Math.max(
    ...d.topAffectedRolesList.map(r => Number(r.exits))
  )

  const chartTitleClass =
    'text-sm font-bold uppercase tracking-wide text-gray-800 text-center leading-tight'

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-4">
          <div
            className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-white flex-shrink-0"
            style={{ backgroundColor: RED }}
          >
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
              <LogOut className="w-6 h-6 text-white" strokeWidth={1.75} />
            </div>
            <span className="text-[10px] font-bold tracking-widest">
              EXIT
            </span>
          </div>

          <div>
            <h1
              className="text-4xl md:text-[42px] leading-none font-black"
              style={{ color: RED }}
            >
              {d.title || 'Exit'}
            </h1>
            <p className="text-base md:text-lg text-gray-900 font-bold mt-2">
              {d.subtitle || 'Exit Intelligence & Key Reasons'}
            </p>
          </div>
        </div>

        <div
          className="w-full h-px mt-4"
          style={{ backgroundColor: RED }}
        />
      </div>

      {/* Exit intelligence panel */}
      <div
        className="rounded-2xl p-6 space-y-5"
        style={{ backgroundColor: PANEL }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-black uppercase text-gray-900">
            Exit Intelligence
          </h2>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex-1 h-px bg-gray-400/70" />
            <p className="text-lg font-black uppercase tracking-widest text-gray-500">
              Why People Leave
            </p>
            <div className="flex-1 h-px bg-gray-400/70" />
          </div>
        </div>

        <div>
          <span
            className="text-white text-xs font-black px-4 py-1.5 rounded uppercase tracking-wider"
            style={{ backgroundColor: RED }}
          >
            Key Metrics
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <ExitKPI
            Icon={ClipboardCheck}
            label="Exit Interview Completion"
            value={`${d.exitInterviewCompletion}%`}
            trend={`${d.exitInterviewCompletionPrev}%`}
            trendColor="text-green-600"
            trendArrow="↑"
          />

          <ExitKPI
            Icon={UserX}
            label="Regretted Loss"
            sub="High Performers"
            value={`${d.regrettedLoss}%`}
            trend={`${d.regrettedLossPrev}%`}
            trendColor="text-red-500"
            trendArrow="↑"
          />

          <ExitKPI
            Icon={CalendarDays}
            label="Average Tenure at Resignation"
            value={d.avgTenureAtResignation}
            unit="Years"
            trend={`${d.avgTenureAtResignationPrev}`}
            trendColor="text-red-500"
            trendArrow="↓"
          />

          <ExitKPI
            Icon={LogOut}
            label="Total Exits"
            sub="Last 12 Months"
            value={d.totalExits}
            trend={`${d.totalExitsPrev}`}
            trendColor="text-red-500"
            trendArrow="↑"
          />

          <ExitKPI
            Icon={Users}
            label="Top Affected Roles"
            sub="By Number of Exits"
            value={d.topAffectedRoles}
            caption="Key roles driving majority of exits"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Resignation reasons */}
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
            <p className={chartTitleClass}>Top Resignation Reasons</p>

            <p className="text-[11px] font-semibold text-gray-500 text-center pb-1">
              (By % of Exits)
            </p>

            {d.resignationReasons.map(r => (
              <SimpleHBar
                key={r.reason}
                label={r.reason}
                value={Number(r.pct)}
                max={maxReason + 5}
                color={RED}
              />
            ))}
          </div>

          {/* Tenure donut */}
          <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center">
            <p className={chartTitleClass}>Tenure at Resignation</p>

            <p className="text-[11px] font-semibold text-gray-500 text-center pb-2">
              (By % of Exits)
            </p>

            <div className="flex-1 flex items-center justify-center gap-4">
              <DonutChart
                segments={d.tenureAtResignation.map(s => ({
                  value: Number(s.value),
                  color: s.color
                }))}
                size={140}
                center={
                  <div className="text-center">
                    <p className="text-2xl font-black text-gray-800">
                      {d.totalExits}
                    </p>
                    <p className="text-[10px] font-semibold text-gray-500">
                      Total Exits
                    </p>
                  </div>
                }
              />

              <div className="space-y-2">
                {d.tenureAtResignation.map(s => (
                  <div
                    key={s.name}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="font-semibold text-gray-600">
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top affected roles */}
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
            <p className={chartTitleClass}>Top Affected Roles</p>

            <p className="text-[11px] font-semibold text-gray-500 text-center pb-1">
              (By % of Exits)
            </p>

            {d.topAffectedRolesList.map(r => (
              <div
                key={r.role}
                className="flex items-center gap-2 text-xs"
              >
                <span className="w-28 font-semibold text-gray-700 truncate">
                  {r.role}
                </span>

                <div className="flex-1 h-3 rounded-full overflow-hidden bg-red-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(Number(r.exits) / maxRole) * 100}%`,
                      backgroundColor: RED
                    }}
                  />
                </div>

                <span className="w-6 text-right font-bold text-gray-800">
                  {r.exits}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership signal */}
      <div
        className="rounded-2xl px-6 py-5 flex flex-wrap items-center gap-5"
        style={{ backgroundColor: PANEL }}
      >
        <div className="flex items-center gap-4 max-w-full md:max-w-[300px]">
          <IconCircle
            Icon={Lightbulb}
            size="w-20 h-20"
            iconSize="w-10 h-10"
          />

          <div>
            <p
              className="text-lg font-black uppercase tracking-wide"
              style={{ color: RED }}
            >
              Leadership Signal
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {d.leadershipSignal}
            </p>
          </div>
        </div>

        <div className="hidden md:block w-px self-stretch bg-gray-400/60" />

        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {d.signalItems?.length
            ? d.signalItems.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xl"
                    style={{ backgroundColor: RED }}
                  >
                    {s.icon}
                  </div>
                  <span className="text-xs font-semibold text-gray-700 leading-snug">
                    {s.text}
                  </span>
                </div>
              ))
            : DEFAULT_SIGNAL_ITEMS.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <IconCircle
                    Icon={s.Icon}
                    size="w-12 h-12"
                    iconSize="w-6 h-6"
                  />
                  <span className="text-xs font-semibold text-gray-700 leading-snug">
                    {s.text}
                  </span>
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}
