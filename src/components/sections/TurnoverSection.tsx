'use client'

import { useEffect, useState } from 'react'
import {
  Users,
  LogOut,
  ScanFace,
  RefreshCw,
  Clock,
  AlertTriangle,
  CalendarDays,
  type LucideIcon
} from 'lucide-react'
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

const ORANGE = '#F4611A'
const ORANGE_TINT = '#FCE3D4'

function BannerHeader({
  text,
  withBars = false
}: {
  text: string
  withBars?: boolean
}) {
  return (
    <div className="flex items-center">
      {withBars && (
        <div
          className="flex-1 h-2.5 rounded-full"
          style={{ backgroundColor: ORANGE }}
        />
      )}

      <div
        className={`${withBars ? '' : 'w-full text-center '}rounded-xl px-8 py-3`}
        style={{ backgroundColor: ORANGE }}
      >
        <p className="text-white text-lg md:text-xl font-black uppercase tracking-wide text-center whitespace-nowrap">
          {text}
        </p>
      </div>

      {withBars && (
        <div
          className="flex-1 h-2.5 rounded-full"
          style={{ backgroundColor: ORANGE }}
        />
      )}
    </div>
  )
}

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
      className={`${size} rounded-full flex items-center justify-center flex-shrink-0 icon-gradient shadow-soft`}
      style={{ backgroundColor: ORANGE_TINT }}
    >
      <Icon className={iconSize} style={{ color: ORANGE }} strokeWidth={1.75} />
    </div>
  )
}

function MetricBox({
  label,
  value,
  prev,
  prevLabel,
  Icon
}: {
  label: string
  value: string
  prev?: string
  prevLabel?: string
  Icon: LucideIcon
}) {
  return (
    <div className="panel-gradient rounded-2xl p-4 shadow-soft border border-gray-100 flex flex-col items-center">
      {/* Fixed-height zones keep all cards in the row aligned even
          when titles wrap to a different number of lines. */}
      <div className="h-[44px] flex items-center justify-center">
        <p className="text-xs md:text-sm font-bold uppercase tracking-wide text-gray-800 text-center leading-tight">
          {label}
        </p>
      </div>

      <div className="h-[80px] flex items-center justify-center gap-4">
        <IconCircle Icon={Icon} />

        <p
          className="text-4xl font-black"
          style={{ color: ORANGE }}
        >
          {value}
        </p>
      </div>

      <div className="h-[36px] flex items-center justify-center">
        {prev && (
          <p className="text-xs font-bold text-gray-700 text-center">
            {prevLabel}: {prev} <span className="text-red-500">↑</span>
          </p>
        )}
      </div>
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
  repeatedReplacementRolesCaption?: string
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

  const cardTitleClass =
    'text-xs md:text-sm font-bold text-gray-800 uppercase tracking-wide text-center leading-tight'

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 flex-shrink-0 icon-gradient shadow-badge"
            style={{ backgroundColor: ORANGE }}
          >
            <RefreshCw className="w-8 h-8 text-white" strokeWidth={1.75} />
            <span className="text-[10px] font-black tracking-widest text-white">
              TURNOVER
            </span>
          </div>

          <div>
            <h1
              className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase"
              style={{ color: ORANGE }}
            >
              {d.title || 'Turnover'}
            </h1>
            <p className="text-gray-500 font-medium mt-1.5">
              {d.subtitle || 'Workforce Continuity Risk'}
            </p>
          </div>
        </div>

        {updatedAt && (
          <p className="hidden sm:flex text-sm text-gray-400 font-medium items-center gap-1.5 mt-1.5 flex-shrink-0">
            Updated as of {updatedAt}
            <CalendarDays className="w-4 h-4" strokeWidth={2} />
          </p>
        )}
      </div>

        <div
          className="w-full h-px mt-6"
          style={{ backgroundColor: ORANGE }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: key metrics */}
        <div className="lg:col-span-2 space-y-4">
          <BannerHeader text="Key Metrics" withBars />

          <div className="rounded-2xl p-4 space-y-4 panel-gradient border border-gray-100 shadow-soft">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <MetricBox
                label="Turnover Rate"
                value={`${d.turnoverRate}%`}
                prevLabel="vs Last 12 Months"
                prev={`${d.turnoverRatePrev}%`}
                Icon={Users}
              />

              <MetricBox
                label="Voluntary Turnover"
                value={`${d.voluntaryTurnover}%`}
                prevLabel="vs Last 12 Months"
                prev={`${d.voluntaryTurnoverPrev}%`}
                Icon={LogOut}
              />

              <MetricBox
                label="Critical Position Turnover"
                value={`${d.criticalPositionTurnover}%`}
                prevLabel="vs Last 12 Months"
                prev={`${d.criticalPositionTurnoverPrev}%`}
                Icon={ScanFace}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Repeated replacement roles */}
              <div className="panel-gradient rounded-2xl p-4 shadow-soft border border-gray-100 flex flex-col items-center">
                <div className="h-[44px] flex items-center justify-center">
                  <p className={cardTitleClass}>
                    Repeated Replacement Roles
                  </p>
                </div>

                <div className="h-[80px] flex items-center justify-center gap-4">
                  <IconCircle Icon={RefreshCw} />

                  <p
                    className="text-4xl font-black"
                    style={{ color: ORANGE }}
                  >
                    {d.repeatedReplacementRoles}
                  </p>
                </div>

                <div className="h-[36px] flex items-center justify-center">
                  <p className="text-xs font-bold text-gray-700 text-center leading-tight">
                    {d.repeatedReplacementRolesCaption ||
                      'Roles replaced >2 times in 12 months'}
                  </p>
                </div>
              </div>

              {/* Time to backfill */}
              <div className="panel-gradient rounded-2xl p-4 shadow-soft border border-gray-100 flex flex-col items-center">
                <div className="h-[44px] flex items-center justify-center">
                  <p className={cardTitleClass}>
                    Time-to-Backfill
                    <br />
                    Critical Roles
                  </p>
                </div>

                <div className="h-[80px] flex items-center justify-center gap-3">
                  <IconCircle Icon={Clock} />

                  <p
                    className="text-4xl font-black leading-none"
                    style={{ color: ORANGE }}
                  >
                    {d.timeToBackfill}
                    <span className="text-lg"> Days</span>
                  </p>
                </div>

                <div className="h-[36px] flex items-center justify-center">
                  <p className="text-xs font-bold text-gray-700 text-center">
                    vs Last 12 Months: {d.timeToBackfillPrev} Days{' '}
                    <span className="text-red-500">↑</span>
                  </p>
                </div>
              </div>

              {/* By role */}
              <div className="panel-gradient rounded-2xl p-4 shadow-soft border border-gray-100 space-y-2">
                <p className={`${cardTitleClass} mb-2`}>
                  Turnover Background
                  <br />
                  <span className="normal-case font-semibold text-gray-500">
                    By Role (Top 5)
                  </span>
                </p>

                {d.byRole.map((r, i) => (
                  <SimpleHBar
                    key={`${r.name}-${i}`}
                    label={r.name || ''}
                    value={Number(r.value)}
                    max={100}
                    color={ORANGE}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* By manager */}
              <div className="panel-gradient rounded-2xl p-4 shadow-soft border border-gray-100 space-y-2">
                <p className={`${cardTitleClass} mb-3`}>
                  Turnover by Manager
                  <br />
                  <span className="normal-case font-semibold text-gray-500">
                    By Role (Top 5)
                  </span>
                </p>

                {d.byManager.map((r, i) => (
                  <SimpleHBar
                    key={`${r.name}-${i}`}
                    label={r.name || ''}
                    value={Number(r.value)}
                    max={100}
                    color={ORANGE}
                  />
                ))}
              </div>

              {/* Trend */}
              <div className="panel-gradient rounded-2xl p-4 shadow-soft border border-gray-100">
                <p className={`${cardTitleClass} mb-3`} style={{ color: ORANGE }}>
                  Turnover Trend
                  <br />
                  <span className="normal-case font-semibold text-gray-500">
                    (Last 12 Months)
                  </span>
                </p>

                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={d.trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      unit="%"
                      domain={[5, 20]}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={ORANGE}
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: ORANGE, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right: leadership insight */}
        <div className="space-y-4">
          <BannerHeader text="Leadership Insight" />

          <div className="rounded-2xl p-5 panel-gradient border border-gray-100 shadow-soft">
            {insights.map((text, i) => (
              <div
                key={i}
                className={`flex gap-4 items-start py-5 ${
                  i < insights.length - 1
                    ? 'border-b border-gray-300'
                    : ''
                }`}
              >
                <AlertTriangle
                  className="w-12 h-12 text-red-600 flex-shrink-0"
                  strokeWidth={2}
                />

                <div>
                  <p className="text-sm font-black text-gray-600 uppercase tracking-wider mb-1">
                    CHRO Analysis
                  </p>
                  <p className="text-sm text-gray-700">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
