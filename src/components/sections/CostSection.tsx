'use client'

import { useEffect, useState } from 'react'
import {
  DollarSign,
  HandCoins,
  CalendarDays,
  Users,
  TrendingUp,
  UserPlus,
  Lightbulb,
  RefreshCw,
  Banknote,
  type LucideIcon
} from 'lucide-react'
import { costData } from '@/data/dashboardData'
import { DonutChart } from '@/components/ui'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const TEAL = '#12897B'
const TEAL_TINT = '#D7EEEA'
const LINE_BLUE = '#2563EB'

function CostKPI({
  Icon,
  label,
  sub,
  value,
  prevLabel = 'vs Last',
  prev,
  chg,
}: {
  Icon: LucideIcon
  label: string
  sub?: string
  value: string
  prevLabel?: string
  prev: string
  chg?: string
}) {
  return (
    <div className="panel-gradient rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
      {/* Fixed-height zones keep all five cards aligned even when
          titles/subtitles wrap to a different number of lines. */}
      <div className="h-[52px] flex flex-col items-center justify-center">
        <p className="text-xs md:text-sm font-bold uppercase tracking-wide text-gray-800 leading-tight">
          {label}
        </p>
        {sub && (
          <p className="text-[11px] font-semibold text-gray-500">({sub})</p>
        )}
      </div>

      <div className="h-[44px] flex items-center justify-center">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 icon-gradient shadow-soft"
          style={{ backgroundColor: TEAL }}
        >
          <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
        </div>
      </div>

      <div className="h-[44px] flex items-center justify-center">
        <p
          className="text-4xl font-black leading-none"
          style={{ color: TEAL }}
        >
          {value}
        </p>
      </div>

      <div className="h-[40px] flex items-center justify-center">
        <p className="text-[11px] font-bold text-gray-700 whitespace-nowrap">
          {prevLabel}: {prev}{' '}
          {chg && (
            <>
              <span className="text-green-600">↑</span>{' '}
              <span className="text-gray-800">
                {chg.replace(/^\+/, '')}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

function TrendCard({
  title,
  unitLabel,
  data,
  domain,
  unit
}: {
  title: string
  unitLabel: string
  data: { month: string; value: number }[]
  domain: [number, number]
  unit: string
}) {
  return (
    <div className="panel-gradient rounded-2xl p-4 shadow-soft border border-gray-100">
      <p className="text-sm font-bold uppercase tracking-wide text-center text-gray-800 leading-tight">
        {title}
      </p>
      <p className="text-[11px] font-semibold text-gray-500 text-center mb-2">
        (Last 12 Months)
      </p>
      <p className="text-[10px] font-semibold text-gray-500 text-left">
        {unitLabel}
      </p>

      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 9 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9 }}
            domain={domain}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip formatter={(v) => `Rp ${v}${unit}`} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={LINE_BLUE}
            strokeWidth={2}
            dot={{ r: 3, fill: LINE_BLUE, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

type TrendRow = {
  month: string
  value: number
}

type CostBreakdownRow = {
  name: string
  amount: string
  value: number
  color: string
}

type CostContent = {
  title?: string
  subtitle?: string

  monthlyManpowerCost: string
  monthlyManpowerCostPrev: string
  monthlyManpowerCostChg: string

  annualizedCost: string
  annualizedCostPrev: string
  annualizedCostChg: string

  costPerEmployee: string
  costPerEmployeePrev: string
  costPerEmployeeChg: string

  growthYoY?: string
  growthYoYPrev?: string
  growthTrend?: string
  growthTrendPrev?: string
  growthTrendChg?: string

  replacementHiringCost: string
  replacementHiringCostPrev: string
  replacementHiringCostChg: string

  leadershipSignal: string

  manpowerTrend: TrendRow[]
  costBreakdown: CostBreakdownRow[]
  costPerEmployeeTrend: TrendRow[]
  signalItems?: { icon: string; text: string }[]
}

const DEFAULT_SIGNAL_ITEMS: { Icon: LucideIcon; text: string }[] = [
  {
    Icon: RefreshCw,
    text: 'High turnover drives recurring recruitment and onboarding cost'
  },
  {
    Icon: TrendingUp,
    text: 'Productivity loss while critical roles remain vacant'
  },
  {
    Icon: Users,
    text: 'Knowledge loss impacts delivery quality and speed'
  },
  {
    Icon: Banknote,
    text: 'True cost of turnover is 1.5 - 2.5x annual salary'
  }
]

export default function CostSection() {
  const [data, setData] = useState<CostContent>({
    ...costData,
    manpowerTrend: costData.manpowerTrend,
    costBreakdown: costData.costBreakdown,
    costPerEmployeeTrend: costData.costPerEmployeeTrend,
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
        const res = await fetch('/api/dashboard/cost', {
          cache: 'no-store',
        })

        if (!res.ok) return

        const json = await res.json()

        if (json?.data) {
          setData((prev) => ({
            ...prev,
            ...json.data,
            manpowerTrend:
              json.data.manpowerTrend?.length
                ? json.data.manpowerTrend
                : prev.manpowerTrend,
            costBreakdown:
              json.data.costBreakdown?.length
                ? json.data.costBreakdown
                : prev.costBreakdown,
            costPerEmployeeTrend:
              json.data.costPerEmployeeTrend?.length
                ? json.data.costPerEmployeeTrend
                : prev.costPerEmployeeTrend,
          }))
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadData()
  }, [])

  const d = data

  const growthValue = d.growthTrend || d.growthYoY || ''
  const growthPrev = d.growthTrendPrev || d.growthYoYPrev || ''
  const growthChg = d.growthTrendChg || '+2.9pp'

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 flex-shrink-0 icon-gradient shadow-badge"
            style={{ backgroundColor: TEAL }}
          >
            <DollarSign className="w-8 h-8 text-white" strokeWidth={1.75} />
            <span className="text-[10px] font-black tracking-widest text-white">
              COST
            </span>
          </div>

          <div>
            <h1
              className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase"
              style={{ color: TEAL }}
            >
              {d.title || 'Cost'}
            </h1>
            <p className="text-gray-500 font-medium mt-1.5">
              {d.subtitle || 'People Cost & Investment'}
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
          style={{ backgroundColor: TEAL }}
        />
      </div>

      {/* Workforce economics panel */}
      <div className="rounded-2xl p-6 space-y-5 panel-gradient border border-gray-100 shadow-soft">
        <div className="text-center">
          <h2 className="text-3xl font-black uppercase text-gray-900">
            Workforce Economics
          </h2>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex-1 h-px bg-gray-400/70" />
            <p className="text-lg font-black uppercase tracking-widest text-gray-500">
              People Cost Visibility
            </p>
            <div className="flex-1 h-px bg-gray-400/70" />
          </div>
        </div>

        <div>
          <span
            className="text-white text-xs font-black px-4 py-1.5 rounded uppercase tracking-wider"
            style={{ backgroundColor: TEAL }}
          >
            Key Metrics
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <CostKPI
            Icon={HandCoins}
            label="Monthly Manpower Cost"
            value={d.monthlyManpowerCost}
            prevLabel="vs Last Months"
            prev={d.monthlyManpowerCostPrev}
            chg={d.monthlyManpowerCostChg}
          />

          <CostKPI
            Icon={CalendarDays}
            label="Annualized Cost"
            value={d.annualizedCost}
            prevLabel="vs Last Year"
            prev={d.annualizedCostPrev}
            chg={d.annualizedCostChg}
          />

          <CostKPI
            Icon={Users}
            label="Cost Per Employee"
            value={d.costPerEmployee}
            prevLabel="vs Last Year"
            prev={d.costPerEmployeePrev}
            chg={d.costPerEmployeeChg}
          />

          <CostKPI
            Icon={TrendingUp}
            label="Growth Per Trend"
            sub="YoY"
            value={growthValue}
            prevLabel="vs Last Year"
            prev={growthPrev}
            chg={growthChg}
          />

          <CostKPI
            Icon={UserPlus}
            label="Replacement Hiring Cost"
            value={d.replacementHiringCost}
            prevLabel="vs Last Year"
            prev={d.replacementHiringCostPrev}
            chg={d.replacementHiringCostChg}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TrendCard
            title="Manpower Cost Trend"
            unitLabel="Rp (Billion)"
            data={d.manpowerTrend}
            domain={[0, 3]}
            unit="B"
          />

          {/* Cost breakdown */}
          <div className="panel-gradient rounded-2xl p-4 shadow-soft border border-gray-100 flex flex-col">
            <p className="text-sm font-bold uppercase tracking-wide text-center text-gray-800 leading-tight">
              Cost Breakdown
            </p>

            <p className="text-[11px] font-semibold text-gray-500 text-center mb-2">
              (Annualized)
            </p>

            <div className="flex-1 flex items-center justify-center gap-4">
              <DonutChart
                segments={d.costBreakdown.map((s) => ({
                  value: Number(s.value),
                  color: s.color,
                }))}
                size={130}
                center={
                  <div className="text-center">
                    <p className="text-sm font-black text-gray-900">
                      {d.annualizedCost}
                    </p>
                    <p className="text-[10px] font-semibold text-gray-500">
                      Total
                    </p>
                  </div>
                }
              />

              <div className="space-y-2">
                {d.costBreakdown.map((s) => (
                  <div key={s.name} className="flex items-start gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: s.color }}
                    />
                    <div className="text-[11px] leading-tight">
                      <p className="font-bold text-gray-700">{s.name}</p>
                      <p className="text-gray-500">
                        {s.amount} ({s.value}%)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <TrendCard
            title="Cost Per Employee Trend"
            unitLabel="Rp (Million)"
            data={d.costPerEmployeeTrend}
            domain={[0, 25]}
            unit="M"
          />
        </div>
      </div>

      {/* Leadership signal */}
      <div className="rounded-2xl px-6 py-5 flex flex-wrap items-center gap-5 panel-gradient border border-gray-100 shadow-soft">
        <div className="flex items-center gap-4 max-w-full md:max-w-[320px]">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 icon-gradient shadow-badge"
            style={{ backgroundColor: TEAL }}
          >
            <Lightbulb className="w-10 h-10 text-white" strokeWidth={1.75} />
          </div>

          <div>
            <p
              className="text-lg font-black uppercase tracking-wide"
              style={{ color: TEAL }}
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
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl icon-gradient shadow-soft"
                    style={{
                      backgroundColor: TEAL_TINT,
                      color: TEAL
                    }}
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
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 icon-gradient shadow-soft"
                    style={{ backgroundColor: TEAL_TINT }}
                  >
                    <s.Icon
                      className="w-6 h-6"
                      style={{ color: TEAL }}
                      strokeWidth={1.75}
                    />
                  </div>
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
