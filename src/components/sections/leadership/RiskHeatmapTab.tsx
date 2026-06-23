'use client'

import { useEffect, useState } from 'react'
import { riskHeatmapData } from '@/data/dashboardData'
import { RiskDot } from '@/components/ui'

type RiskLevel = 'low' | 'medium' | 'high'

type RiskRow = {
  area: string
  icon: string
  status: string
  signal: string
}

type RiskContent = {
  insight?: string
  rows?: RiskRow[]
}

function normalizeStatus(status: string): RiskLevel {
  const s = status.toLowerCase()

  if (s.includes('low')) return 'low'
  if (s.includes('medium')) return 'medium'
  if (s.includes('high')) return 'high'

  return 'low'
}

function getFallbackIcon(area: string) {
  const a = area.toLowerCase()

  if (a.includes('recruit') || a.includes('hiring')) return '👥'
  if (a.includes('experience')) return '🛡️'
  if (a.includes('development')) return '📈'
  if (a.includes('turnover')) return '🔄'
  if (a.includes('exit')) return '💬'
  if (a.includes('cost')) return '💰'

  return '📌'
}

export default function RiskHeatmapTab() {
  const [data, setData] = useState<RiskContent>({
    insight:
      'Focus areas in red and yellow require immediate leadership attention to reduce risk and protect business continuity',
    rows: riskHeatmapData,
  })

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/dashboard/riskHeatmap', {
          cache: 'no-store',
        })

        if (!res.ok) return

        const json = await res.json()

        if (json?.data) {
          setData((prev) => ({
            ...prev,
            ...json.data,
            rows: json.data.rows?.length
              ? json.data.rows
              : prev.rows,
          }))
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadData()
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black uppercase text-gray-900">
          Leadership Risk Heatmap
        </h2>

        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 max-w-xs h-px bg-gray-300" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            A Quick Overview of Workforce Risk Areas
          </p>
          <div className="flex-1 max-w-xs h-px bg-gray-300" />
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200">
        <div
          className="grid grid-cols-3 px-6 py-3 text-white text-xs font-black uppercase tracking-widest"
          style={{ backgroundColor: '#E65100' }}
        >
          <span>Area</span>
          <span>Status</span>
          <span>Signal</span>
        </div>

        {(data.rows || []).map((row, i) => {
          const normalized = normalizeStatus(row.status)

          return (
            <div
              key={row.area}
              className={`grid grid-cols-3 px-6 py-4 items-center border-b border-gray-100 ${
                i % 2 === 0 ? 'bg-white' : 'bg-orange-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {row.icon || getFallbackIcon(row.area)}
                </span>

                <span className="text-sm font-black uppercase tracking-wider text-orange-700">
                  {row.area}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <RiskDot level={normalized} />

                <span className="text-sm font-bold uppercase text-gray-700">
                  {row.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-orange-500 text-lg">🔔</span>

                <span className="text-sm font-semibold text-orange-700">
                  {row.signal}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div
        className="rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center gap-6"
        style={{ backgroundColor: '#fff7f0' }}
      >
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl flex-shrink-0">
            💡
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-widest text-orange-600 mb-1">
              Leadership Insight
            </p>

            <p className="text-sm text-gray-700">
              {data.insight}
            </p>
          </div>
        </div>

        <div className="flex gap-6 flex-shrink-0">
          {[
            { dot: 'low', label: 'LOW RISK', sub: 'On Track' },
            { dot: 'medium', label: 'MEDIUM RISK', sub: 'Monitor Closely' },
            { dot: 'high', label: 'HIGH RISK', sub: 'Immediate Action' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <RiskDot level={item.dot as RiskLevel} />

              <div>
                <p className="text-xs font-black text-gray-700">
                  {item.label}
                </p>

                <p className="text-[10px] text-gray-400">
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}