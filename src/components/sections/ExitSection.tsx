'use client'

import { useEffect, useState } from 'react'
import { exitData } from '@/data/dashboardData'
import { SimpleHBar, DonutChart } from '@/components/ui'

function ExitKPI({
  icon,
  label,
  sub,
  value,
  unit = '',
  trend,
  trendUp,
}: {
  icon: string
  label: string
  sub?: string
  value: string | number
  unit?: string
  trend?: string
  trendUp?: boolean
}) {
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col items-center text-center gap-1.5 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white text-xl">
        {icon}
      </div>

      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 leading-tight">
        {label}
      </p>

      {sub && (
        <p className="text-[10px] text-gray-400">({sub})</p>
      )}

      <p className="text-3xl font-black text-red-600">
        {value}
        <span className="text-base font-semibold text-red-400">
          {unit}
        </span>
      </p>

      {trend && (
        <p className="text-xs text-gray-400">
          vs Last Months: {trend}{' '}
          <span className={trendUp ? 'text-red-500' : 'text-green-500'}>
            {trendUp ? '↑' : '↓'}
          </span>
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white bg-red-600">
          <span className="text-2xl">📤</span>
          <span className="text-[8px] font-black tracking-widest">
            EXIT
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-red-700">
            {d.title || 'Exit'}
          </h1>

          <p className="text-sm text-gray-500 font-medium">
            {d.subtitle || 'Exit Intelligence & Key Reasons'}
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-gray-200" />

      <div
        className="rounded-2xl p-6 space-y-5"
        style={{ backgroundColor: '#fde8e8' }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-black uppercase text-gray-900">
            Exit Intelligence
          </h2>

          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">
            Why People Leave
          </p>
        </div>

        <div>
          <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded uppercase tracking-wider">
            Key Metrics
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <ExitKPI
            icon="📋"
            label="Exit Interview Completion"
            value={`${d.exitInterviewCompletion}%`}
            trend={`${d.exitInterviewCompletionPrev}%`}
            trendUp
          />

          <ExitKPI
            icon="😟"
            label="Regretted Loss"
            sub="High Performers"
            value={`${d.regrettedLoss}%`}
            trend={`${d.regrettedLossPrev}%`}
            trendUp
          />

          <ExitKPI
            icon="📅"
            label="Average Tenure at Resignation"
            value={d.avgTenureAtResignation}
            unit=" Years"
            trend={`${d.avgTenureAtResignationPrev}`}
            trendUp={false}
          />

          <ExitKPI
            icon="📤"
            label="Total Exits"
            sub="Last 12 Months"
            value={d.totalExits}
            trend={`${d.totalExitsPrev}`}
            trendUp
          />

          <ExitKPI
            icon="👥"
            label="Top Affected Roles"
            sub="By Number of Exits"
            value={d.topAffectedRoles}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-center text-gray-700">
              Top Resignation Reasons
            </p>

            <p className="text-[10px] text-gray-400 text-center">
              (By % of Exits)
            </p>

            {d.resignationReasons.map(r => (
              <SimpleHBar
                key={r.reason}
                label={r.reason}
                value={Number(r.pct)}
                max={maxReason + 5}
                color="#DC2626"
              />
            ))}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center gap-3">
            <p className="text-xs font-black uppercase tracking-widest text-gray-700">
              Tenure at Resignation
            </p>

            <p className="text-[10px] text-gray-400">
              (By % of Exits)
            </p>

            <DonutChart
              segments={d.tenureAtResignation.map(s => ({
                value: Number(s.value),
                color: s.color
              }))}
              size={130}
              center={
                <div className="text-center">
                  <p className="text-xl font-black text-gray-700">
                    {d.totalExits}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Total Exits
                  </p>
                </div>
              }
            />

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {d.tenureAtResignation.map(s => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-gray-600">{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-center text-gray-700">
              Top Affected Roles
            </p>

            <p className="text-[10px] text-gray-400 text-center">
              (By % of Exits)
            </p>

            {d.topAffectedRolesList.map(r => (
              <div key={r.role} className="flex items-center gap-2 text-xs">
                <span className="w-28 text-gray-600 truncate">
                  {r.role}
                </span>

                <div className="flex-1 h-3 bg-red-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded"
                    style={{
                      width: `${(Number(r.exits) / maxRole) * 100}%`
                    }}
                  />
                </div>

                <span className="w-5 text-right font-bold text-gray-700">
                  {r.exits}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-4 flex flex-wrap items-center gap-6 bg-red-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white text-xl flex-shrink-0">
            💡
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-widest text-red-700">
              Leadership Signal
            </p>
            <p className="text-xs text-gray-500">
              {d.leadershipSignal}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {(d.signalItems?.length
            ? d.signalItems
            : [
                { icon: '👥', text: 'Repeated exits in specific teams may indicate leadership issues' },
                { icon: '🏢', text: 'High exits in certain roles may indicate structure or role misalignment' },
                { icon: '💻', text: 'Early tenure exits may indicate workload or expectation mismatch' },
                { icon: '💰', text: 'Compensation concerns may be driving talent away' },
              ]
          ).map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-xs max-w-[160px]">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white flex-shrink-0">
                {s.icon}
              </div>
              <span className="text-gray-600">{s.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}