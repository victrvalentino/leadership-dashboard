'use client'

import { useEffect, useState } from 'react'
import { Lightbulb } from 'lucide-react'
import { riskHeatmapData } from '@/data/dashboardData'

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

const ORANGE = '#F58220'
const ORANGE_TEXT = '#C05E10'
const PALE = '#FDEEDD'

const RISK_COLORS: Record<RiskLevel, string> = {
  low: '#3BAA4C',
  medium: '#E09112',
  high: '#E11D2E'
}

function normalizeStatus(status: string): RiskLevel {
  const s = String(status || '').toLowerCase()

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

function RiskDot({
  level,
  size = 'w-5 h-5'
}: {
  level: RiskLevel
  size?: string
}) {
  return (
    <span
      className={`${size} rounded-full flex-shrink-0`}
      style={{ backgroundColor: RISK_COLORS[level] }}
    />
  )
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-extrabold uppercase text-gray-900 tracking-tight">
          Leadership Risk Heatmap
        </h2>

        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 max-w-xs flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          <p className="text-sm md:text-base font-extrabold uppercase tracking-widest text-gray-500 whitespace-nowrap">
            A Quick Overview of Workforce Risk Areas
          </p>

          <div className="flex-1 max-w-xs flex items-center">
            <div className="flex-1 h-px bg-gray-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
          </div>
        </div>
      </div>

      {/* Key Metrics tag */}
      <span
        className="inline-block text-white text-xs font-black px-4 py-1.5 rounded uppercase tracking-wider"
        style={{ backgroundColor: ORANGE }}
      >
        Key Metrics
      </span>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden shadow-soft panel-gradient border border-gray-100">
        <div
          className="grid grid-cols-[1.2fr_1fr_2fr] px-4 py-4 text-white text-lg md:text-xl font-extrabold uppercase tracking-wide text-center"
          style={{ backgroundColor: ORANGE }}
        >
          <span>Area</span>
          <span>Status</span>
          <span>Signal</span>
        </div>

        {(data.rows || []).map((row, i) => {
          const normalized = normalizeStatus(row.status)

          return (
            <div
              key={`${row.area}-${i}`}
              className={`grid grid-cols-[1.2fr_1fr_2fr] items-stretch ${
                i > 0 ? 'border-t border-gray-200' : ''
              }`}
            >
              {/* Area */}
              <div className="flex items-center gap-3 px-4 py-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 icon-gradient shadow-soft"
                  style={{ backgroundColor: PALE }}
                >
                  {row.icon || getFallbackIcon(row.area)}
                </div>

                <span
                  className="text-base md:text-lg font-extrabold uppercase tracking-wide"
                  style={{ color: ORANGE_TEXT }}
                >
                  {row.area}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3 px-4 py-4 border-l border-gray-200">
                <RiskDot level={normalized} />

                <span
                  className="text-base md:text-lg font-extrabold uppercase"
                  style={{ color: RISK_COLORS[normalized] }}
                >
                  {row.status}
                </span>
              </div>

              {/* Signal */}
              <div className="flex items-center px-4 py-4 border-l border-gray-200">
                <span
                  className="text-base md:text-lg font-bold"
                  style={{ color: ORANGE_TEXT }}
                >
                  {row.signal}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Insight + legend */}
      <div
        className="rounded-2xl px-6 py-5 flex flex-col md:flex-row items-start md:items-center gap-6"
        style={{ backgroundColor: PALE }}
      >
        <div className="flex items-center gap-4 flex-1">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 icon-gradient shadow-badge"
            style={{ backgroundColor: ORANGE }}
          >
            <Lightbulb className="w-10 h-10 text-white" strokeWidth={1.75} />
          </div>

          <div>
            <p
              className="text-lg font-extrabold uppercase tracking-wide mb-1"
              style={{ color: ORANGE }}
            >
              Leadership Insight
            </p>

            <p className="text-sm font-semibold text-gray-700">
              {data.insight}
            </p>
          </div>
        </div>

        <div className="hidden md:block w-px self-stretch bg-gray-400/60" />

        <div className="flex gap-6 flex-shrink-0 flex-wrap">
          {(
            [
              { dot: 'low', label: 'LOW RISK', sub: 'On Track' },
              { dot: 'medium', label: 'MEDIUM RISK', sub: 'Monitor Closely' },
              { dot: 'high', label: 'HIGH RISK', sub: 'Immediate Action' },
            ] as { dot: RiskLevel; label: string; sub: string }[]
          ).map((item) => (
            <div key={item.label} className="flex items-start gap-2.5">
              <RiskDot level={item.dot} size="w-6 h-6" />

              <div className="leading-tight">
                <p
                  className="text-sm font-extrabold"
                  style={{ color: ORANGE_TEXT }}
                >
                  {item.label}
                </p>

                <p className="text-xs font-semibold text-gray-500">
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
