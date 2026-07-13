'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  UserSearch,
  Users,
  Briefcase,
  UserPlus,
  PauseCircle,
  ShieldCheck,
  UserX,
  type LucideIcon
} from 'lucide-react'
import { recruitmentData } from '@/data/dashboardData'

const PINK = '#F0787E'
const PINK_TEXT = '#E8636F'
const ORANGE_TEXT = '#D9640E'

type DeptStat = {
  department: string
  requested: string
  open: string
  inProgress: string
  onHold: string
  hired: string
  cancelled: string
}

type PositionRow = {
  department: string
  position: string
  level: string
  hc: string
  status: string
  leadTime: string
  remarks: string
}

type InsightRow = {
  department: string
  text: string
}

type RecruitmentContent = {
  title?: string
  subtitle?: string
  updatedAs?: string
  deptStats?: DeptStat[]
  positions?: PositionRow[]
  thisWeek?: InsightRow[]
  keyInsight?: InsightRow[]
  nextAction?: InsightRow[]
}

const STATUS_STYLES: { match: RegExp; bg: string }[] = [
  { match: /hired/i, bg: '#1D8348' },
  { match: /hold/i, bg: '#1B2A6B' },
  { match: /progress/i, bg: '#F0A030' },
  { match: /cancel/i, bg: '#E8262D' },
]

function statusColor(status: string): string {
  for (const s of STATUS_STYLES) {
    if (s.match.test(status)) return s.bg
  }
  return '#6B7280'
}

function matchesDept(rowDept: string | undefined, active: string) {
  if (!rowDept) return true
  return rowDept.trim().toLowerCase() === active.trim().toLowerCase()
}

function KpiPill({
  Icon,
  color,
  label,
  value
}: {
  Icon: LucideIcon
  color: string
  label: string
  value: string | number
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex items-center gap-3 shadow-sm">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        <Icon className="w-5.5 h-5.5 text-white" style={{ width: 22, height: 22 }} strokeWidth={1.75} />
      </div>

      <p className="text-[11px] font-semibold text-gray-500 leading-tight flex-1">
        {label}
      </p>

      <p
        className="text-2xl font-black flex-shrink-0"
        style={{ color }}
      >
        {value}
      </p>
    </div>
  )
}

function InsightGroup({
  title,
  items
}: {
  title: string
  items: InsightRow[]
}) {
  if (!items.length) return null

  return (
    <div className="pb-4 mb-4 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
      <p
        className="text-sm font-black text-center mb-2"
        style={{ color: PINK_TEXT }}
      >
        {title}
      </p>

      <ol className="space-y-1 list-decimal list-inside">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-xs font-semibold"
            style={{ color: '#9C3D10' }}
          >
            {item.text}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function RecruitmentSection() {
  const [data, setData] = useState<RecruitmentContent>(recruitmentData)
  const [activeDept, setActiveDept] = useState<string>('')

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/dashboard/recruitment', {
          cache: 'no-store'
        })

        if (!res.ok) return

        const json = await res.json()

        if (json?.data) {
          setData(prev => ({
            ...prev,
            ...json.data,
            deptStats: json.data.deptStats?.length ? json.data.deptStats : prev.deptStats,
            positions: json.data.positions?.length ? json.data.positions : prev.positions,
            thisWeek: json.data.thisWeek?.length ? json.data.thisWeek : prev.thisWeek,
            keyInsight: json.data.keyInsight?.length ? json.data.keyInsight : prev.keyInsight,
            nextAction: json.data.nextAction?.length ? json.data.nextAction : prev.nextAction,
          }))
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadData()
  }, [])

  const d = data

  const departments = useMemo(() => {
    const seen: string[] = []
    for (const row of d.deptStats || []) {
      const name = (row.department || '').trim()
      if (name && !seen.includes(name)) seen.push(name)
    }
    return seen
  }, [d.deptStats])

  const active = activeDept || departments[0] || ''

  const stats =
    (d.deptStats || []).find(s => matchesDept(s.department, active) && s.department) ||
    ({} as DeptStat)

  const positions = (d.positions || []).filter(p =>
    matchesDept(p.department, active)
  )

  const thisWeek = (d.thisWeek || []).filter(r => matchesDept(r.department, active))
  const keyInsight = (d.keyInsight || []).filter(r => matchesDept(r.department, active))
  const nextAction = (d.nextAction || []).filter(r => matchesDept(r.department, active))

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-start gap-4">
          <div
            className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-white flex-shrink-0"
            style={{ backgroundColor: PINK }}
          >
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
              <UserSearch className="w-6 h-6 text-white" strokeWidth={1.75} />
            </div>
            <span className="text-[8px] font-bold tracking-widest">
              RECRUITMENT
            </span>
          </div>

          <div className="flex-1">
            <h1
              className="text-4xl md:text-[42px] leading-none font-black"
              style={{ color: PINK }}
            >
              {d.title || 'Recruitment Dashboard'}
            </h1>
            <p className="text-base md:text-lg text-gray-900 font-bold mt-2">
              {d.subtitle || 'Real-Time Hiring Insights & Action Priorities'}
            </p>
          </div>

          <p className="hidden md:block text-sm font-black text-gray-900 flex-shrink-0">
            {d.updatedAs}
          </p>
        </div>

        <div className="w-full h-px mt-4" style={{ backgroundColor: PINK }} />
      </div>

      {/* Department tabs */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {departments.map(dept => {
          const isActive = dept === active

          return (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className="px-4 py-2 rounded-t-lg text-sm font-bold transition-colors"
              style={
                isActive
                  ? { backgroundColor: PINK, color: 'white' }
                  : { color: PINK_TEXT }
              }
            >
              {dept}
            </button>
          )
        })}
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        <KpiPill Icon={Users} color="#1B2A6B" label="Total Requested Headcount" value={stats.requested ?? 0} />
        <KpiPill Icon={Briefcase} color="#F0912D" label="Open Positions" value={stats.open ?? 0} />
        <KpiPill Icon={UserPlus} color="#21A04B" label="In Progress" value={stats.inProgress ?? 0} />
        <KpiPill Icon={PauseCircle} color="#17A2A6" label="On Hold" value={stats.onHold ?? 0} />
        <KpiPill Icon={ShieldCheck} color="#5B2FB8" label="Successfully Hired" value={stats.hired ?? 0} />
        <KpiPill Icon={UserX} color="#E8262D" label="Cancelled" value={stats.cancelled ?? 0} />
      </div>

      {/* Table + insight */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.6fr_1fr] gap-4 items-start">
        {/* Positions table */}
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
          <div
            className="grid grid-cols-[1.8fr_0.7fr_0.5fr_1fr_1fr_2fr] px-3 py-3 text-white text-sm md:text-base font-black text-center items-center"
            style={{ backgroundColor: PINK }}
          >
            <span>Position</span>
            <span>Level</span>
            <span>HC</span>
            <span>Status</span>
            <span>Lead Time</span>
            <span>Remarks</span>
          </div>

          {positions.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-8">
              No positions for this department yet.
            </p>
          )}

          {positions.map((row, i) => (
            <div
              key={`${row.position}-${i}`}
              className={`grid grid-cols-[1.8fr_0.7fr_0.5fr_1fr_1fr_2fr] px-3 py-3 items-center text-center ${
                i > 0 ? 'border-t border-gray-200' : ''
              }`}
            >
              <span
                className="text-sm font-black"
                style={{ color: ORANGE_TEXT }}
              >
                {row.position}
              </span>

              <span className="text-sm font-black" style={{ color: ORANGE_TEXT }}>
                {row.level}
              </span>

              <span className="text-sm font-black" style={{ color: ORANGE_TEXT }}>
                {row.hc}
              </span>

              <span className="flex justify-center">
                <span
                  className="text-[11px] font-bold text-white px-3 py-1 rounded-md whitespace-nowrap"
                  style={{ backgroundColor: statusColor(row.status) }}
                >
                  {row.status}
                </span>
              </span>

              <span className="text-sm font-black" style={{ color: ORANGE_TEXT }}>
                {row.leadTime}
              </span>

              <ol className="text-left list-decimal list-inside space-y-0.5">
                {(row.remarks || '')
                  .split('|')
                  .map(r => r.trim())
                  .filter(Boolean)
                  .map((r, j) => (
                    <li
                      key={j}
                      className="text-[10px] font-semibold leading-tight"
                      style={{ color: '#9C3D10' }}
                    >
                      {r}
                    </li>
                  ))}
              </ol>
            </div>
          ))}
        </div>

        {/* Insight panel */}
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
          <div
            className="px-4 py-3 text-white text-base font-black text-center"
            style={{ backgroundColor: PINK }}
          >
            Insight
          </div>

          <div className="p-4">
            {thisWeek.length === 0 &&
              keyInsight.length === 0 &&
              nextAction.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-4">
                  No insights for this department yet.
                </p>
              )}

            <InsightGroup title="This Week Update" items={thisWeek} />
            <InsightGroup title="Key Insight" items={keyInsight} />
            <InsightGroup title="Next Action" items={nextAction} />
          </div>
        </div>
      </div>
    </div>
  )
}
