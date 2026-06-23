'use client'

import { useEffect, useState } from 'react'
import { turnoverData } from '@/data/dashboardData'
import { SimpleHBar } from '@/components/ui'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

function MetricBox({
  label,
  value,
  prev,
  prevLabel,
}: {
  label: string
  value: string
  prev?: string
  prevLabel?: string
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm text-center space-y-2 min-h-[140px] flex flex-col justify-center">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
        {label}
      </p>

      <p className="text-3xl font-black text-orange-500">
        {value}
      </p>

      {prev && (
        <p className="text-xs text-gray-400">
          {prevLabel}: {prev}{' '}
          <span className="text-red-500">↑</span>
        </p>
      )}
    </div>
  )
}

type ChartRow = {
  name?: string
  month?: string
  value: number
}

type TurnoverContent = {
  title?: string
  subtitle?: string
  turnoverRate: number
  turnoverRatePrev: number
  voluntaryTurnover: number
  voluntaryTurnoverPrev: number
  criticalPositionTurnover: number
  criticalPositionTurnoverPrev: number
  repeatedReplacementRoles: number
  timeToBackfill: number
  timeToBackfillPrev: number
  chroAnalysis1?: string
  chroAnalysis2?: string
  chroAnalysis3?: string
  byRole: ChartRow[]
  byManager: ChartRow[]
  trend: ChartRow[]
}

export default function TurnoverSection() {
  const [data, setData] = useState<TurnoverContent>({
    ...turnoverData,
    chroAnalysis1: turnoverData.chroAnalysis[0],
    chroAnalysis2: turnoverData.chroAnalysis[1],
    chroAnalysis3: turnoverData.chroAnalysis[2],
    byRole: turnoverData.byRole,
    byManager: turnoverData.byManager,
    trend: turnoverData.trend
  })

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/dashboard/turnover', {
          cache: 'no-store'
        })

        if (!res.ok) return
        const json = await res.json()

        if (json?.data) {
          setData(prev => ({
            ...prev,
            ...json.data,
            byRole: json.data.byRole?.length ? json.data.byRole : prev.byRole,
            byManager: json.data.byManager?.length ? json.data.byManager : prev.byManager,
            trend: json.data.trend?.length ? json.data.trend : prev.trend
          }))
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadData()
  }, [])

  const d = data

  const insights = [
    d.chroAnalysis1,
    d.chroAnalysis2,
    d.chroAnalysis3
  ].filter(Boolean)

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white"
          style={{ backgroundColor: '#E65100' }}
        >
          <span className="text-2xl">🔄</span>
          <span className="text-[8px] font-black tracking-widest">
            TURNOVER
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-orange-700">
            {d.title || 'Turnover'}
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            {d.subtitle || 'Workforce Continuity Risk'}
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-gray-200" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">

          <div className="rounded-2xl bg-orange-600 px-5 py-3 text-center font-black text-sm uppercase tracking-widest text-white">
            Key Metrics
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-2xl p-4 bg-orange-50">
            <MetricBox
              label="Turnover Rate"
              value={`${d.turnoverRate}%`}
              prevLabel="vs Last 12 Months"
              prev={`${d.turnoverRatePrev}%`}
            />

            <MetricBox
              label="Voluntary Turnover"
              value={`${d.voluntaryTurnover}%`}
              prevLabel="vs Last 12 Months"
              prev={`${d.voluntaryTurnoverPrev}%`}
            />

            <MetricBox
              label="Critical Position Turnover"
              value={`${d.criticalPositionTurnover}%`}
              prevLabel="vs Last 12 Months"
              prev={`${d.criticalPositionTurnoverPrev}%`}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-2xl p-4 bg-orange-50">
            <div className="bg-white rounded-2xl p-4 shadow-sm text-center min-h-[170px] flex flex-col items-center">
              <div className="text-3xl mb-3">🔁</div>

              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Repeated Replacement Roles
              </p>

              <p className="text-4xl font-black text-orange-500 mt-4">
                {d.repeatedReplacementRoles}
              </p>

              <p className="text-xs text-gray-400 mt-auto">
                Roles replaced &gt;2 times in 12 months
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm text-center min-h-[170px] flex flex-col items-center">
              <div className="text-3xl mb-3">⏱️</div>

              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-tight">
                Time-to-Backfill
                <br />
                Critical Roles
              </p>

              <p className="text-4xl font-black text-orange-500 mt-3">
                {d.timeToBackfill}
                <span className="text-xl"> Days</span>
              </p>

              <p className="text-xs text-gray-400 mt-auto">
                vs Last 12 Months: {d.timeToBackfillPrev} ↑
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-2">
                Turnover Background
                <br />
                by Role (Top 5)
              </p>

              {d.byRole.map((r, i) => (
                <SimpleHBar
                  key={`${r.name}-${i}`}
                  label={r.name || ''}
                  value={Number(r.value)}
                  max={100}
                  color="#E65100"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-2xl p-4 bg-orange-50">
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-3">
                Turnover by Manager (Top 5)
              </p>

              {d.byManager.map((r, i) => (
                <SimpleHBar
                  key={`${r.name}-${i}`}
                  label={r.name || ''}
                  value={Number(r.value)}
                  max={100}
                  color="#E65100"
                />
              ))}
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-3">
                Turnover Trend (Last 12 Months)
              </p>

              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={d.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} unit="%" domain={[5, 20]} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#E65100"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#E65100' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl p-4 text-center font-black text-sm uppercase tracking-widest text-white bg-orange-600">
            Leadership Insight
          </div>

          {insights.map((text, i) => (
            <div
              key={i}
              className="bg-orange-50 rounded-2xl p-4 flex gap-3 items-start border border-orange-100"
            >
              <div className="w-10 h-10 rounded-full border-2 border-orange-400 flex items-center justify-center text-orange-500 flex-shrink-0 text-xl">
                ⚠️
              </div>

              <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1">
                  CHRO Analysis
                </p>
                <p className="text-sm text-gray-700">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}