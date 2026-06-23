'use client'

import { useEffect, useState } from 'react'
import { executiveData } from '@/data/dashboardData'
import { StatusBadge, LeadershipSignal } from '@/components/ui'

type BadgeStatus = 'high' | 'watchlist' | 'healthy'

type Metric =
  | string
  | number
  | {
      value: string | number
      status?: BadgeStatus
    }

type ExecutiveContent = {
  title?: string
  subtitle?: string
  totalHeadcount: number | string
  turnover: Metric
  attendance: Metric
  monthlyManpowerCost: string
  criticalRolesOpen: Metric
  leadershipInsight: string
}

function normalizeMetric(
  metric: Metric,
  defaultStatus: BadgeStatus
) {
  if (
    typeof metric === 'object' &&
    metric !== null &&
    'value' in metric
  ) {
    return metric
  }

  return {
    value: metric,
    status: defaultStatus
  }
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
  const turnover = normalizeMetric(d.turnover, 'high')
  const attendance = normalizeMetric(d.attendance, 'watchlist')
  const criticalRoles = normalizeMetric(
    d.criticalRolesOpen,
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

      <div
        className="rounded-2xl px-6 py-5 flex items-center gap-4"
        style={{ background: '#0D1B4B' }}
      >
        <div className="w-14 h-14 rounded-full border-2 border-white/40 flex items-center justify-center text-2xl flex-shrink-0">
          🏢
        </div>

        <div>
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">
            Directorate
          </p>
          <p className="text-white text-2xl font-black tracking-wide">
            People Experience
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Shared card style */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 h-[275px] flex flex-col items-center justify-between text-center">
          <div className="w-16 h-16 rounded-full border-2 border-blue-300 flex items-center justify-center text-3xl">
            👥
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Total Headcount
          </p>

          <div className="w-8 h-px bg-gray-300" />

          <p className="text-4xl font-black text-gray-700">
            {d.totalHeadcount}
          </p>

          <div className="text-blue-600 text-2xl">👤</div>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 h-[275px] flex flex-col items-center justify-between text-center">
          <div className="w-16 h-16 rounded-full border-2 border-red-300 flex items-center justify-center text-3xl">
            🔄
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Turn Over
          </p>

          <div className="w-8 h-px bg-gray-300" />

          <p className="text-4xl font-black text-gray-700">
            {turnover.value}
          </p>

          <StatusBadge status={turnover.status || 'high'} />
        </div>

        <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-5 h-[275px] flex flex-col items-center justify-between text-center">
          <div className="w-16 h-16 rounded-full border-2 border-yellow-300 flex items-center justify-center text-3xl">
            📅
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Attendance
          </p>

          <div className="w-8 h-px bg-gray-300" />

          <p className="text-4xl font-black text-gray-700">
            {attendance.value}
          </p>

          <StatusBadge status={attendance.status || 'watchlist'} />
        </div>

        <div className="rounded-2xl border border-green-100 bg-green-50 p-5 h-[275px] flex flex-col items-center justify-between text-center">
          <div className="w-16 h-16 rounded-full border-2 border-green-300 flex items-center justify-center text-3xl">
            👛
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Monthly Manpower Cost
          </p>

          <div className="w-8 h-px bg-gray-300" />

          <p className="text-3xl font-black text-gray-700">
            {d.monthlyManpowerCost}
          </p>

          <span className="text-xs bg-green-100 text-green-700 rounded-full px-3 py-1 font-bold">
            Rp
          </span>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 h-[275px] flex flex-col items-center justify-between text-center">
          <div className="w-16 h-16 rounded-full border-2 border-red-300 flex items-center justify-center text-3xl">
            🎯
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Critical Replacement Roles Open
          </p>

          <div className="w-8 h-px bg-gray-300" />

          <p className="text-4xl font-black text-gray-700">
            {criticalRoles.value}
          </p>

          <StatusBadge status={criticalRoles.status || 'high'} />
        </div>
      </div>

      <LeadershipSignal
        label="LEADERSHIP INSIGHT"
        text={d.leadershipInsight}
        color="#1565C0"
        bgColor="#e8f4fd"
        icon="💡"
      />
    </div>
  )
}