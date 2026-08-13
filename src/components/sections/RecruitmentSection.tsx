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
  CalendarDays,
  Lightbulb,
  type LucideIcon
} from 'lucide-react'
import {
  recruitmentGeneralData,
  recruitmentDeptDefaults
} from '@/data/dashboardData'
import { RECRUITMENT_DEPARTMENTS } from '@/config/recruitmentDepartments'

const PINK = '#F0787E'
const PINK_TEXT = '#E8636F'

type PositionRow = {
  position: string
  level: string
  hc: string
  status: string
  leadTime: string
  remarks: string
}

type InsightRow = {
  text: string
}

type DeptContent = {
  requested?: string | number
  open?: string | number
  inProgress?: string | number
  onHold?: string | number
  hired?: string | number
  cancelled?: string | number
  positions?: PositionRow[]
  thisWeek?: InsightRow[]
  keyInsight?: InsightRow[]
  nextAction?: InsightRow[]
}

type GeneralContent = {
  title?: string
  subtitle?: string
  updatedAs?: string
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
        className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 icon-gradient shadow-soft"
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
    <div className="pb-4 mb-4 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0">
      <p
        className="text-sm font-extrabold mb-2"
        style={{ color: PINK_TEXT }}
      >
        {title}
      </p>

      <ol className="space-y-1.5 list-decimal list-outside pl-4 text-left">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-xs font-medium text-gray-700"
          >
            {item.text}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function RecruitmentSection() {
  const [general, setGeneral] = useState<GeneralContent>(
    recruitmentGeneralData
  )
  const [deptData, setDeptData] = useState<Record<string, DeptContent>>(
    recruitmentDeptDefaults
  )
  const [activeKey, setActiveKey] = useState<string>(
    RECRUITMENT_DEPARTMENTS[0].key
  )

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/dashboard/recruitment', {
          cache: 'no-store'
        })

        if (!res.ok) return

        const json = await res.json()

        if (json?.general) {
          setGeneral(prev => ({ ...prev, ...json.general }))
        }

        if (json?.departments) {
          setDeptData(prev => {
            const merged: Record<string, DeptContent> = { ...prev }
            for (const dept of RECRUITMENT_DEPARTMENTS) {
              const incoming = json.departments[dept.key]
              if (incoming) {
                merged[dept.key] = { ...prev[dept.key], ...incoming }
              }
            }
            return merged
          })
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadData()
  }, [])

  const d = general

  const activeDeptContent: DeptContent = useMemo(
    () => deptData[activeKey] || {},
    [deptData, activeKey]
  )

  const stats = activeDeptContent
  const positions = activeDeptContent.positions || []
  const thisWeek = activeDeptContent.thisWeek || []
  const keyInsight = activeDeptContent.keyInsight || []
  const nextAction = activeDeptContent.nextAction || []

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div
              className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 flex-shrink-0 icon-gradient shadow-badge"
              style={{ backgroundColor: PINK }}
            >
              <UserSearch className="w-8 h-8 text-white" strokeWidth={1.75} />
              <span className="text-[8px] font-bold tracking-widest text-white">
                RECRUITMENT
              </span>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight uppercase">
                {d.title || 'Recruitment Dashboard'}
              </h1>
              <p className="text-gray-500 font-medium mt-1.5">
                {d.subtitle || 'Real-Time Hiring Insights & Action Priorities'}
              </p>
            </div>
          </div>

          {d.updatedAs && (
            <p className="text-sm text-gray-400 font-medium flex items-center gap-1.5 mt-1.5 flex-shrink-0">
              Updated as of {d.updatedAs}
              <CalendarDays className="w-4 h-4" strokeWidth={2} />
            </p>
          )}
        </div>

        <div className="w-full h-px mt-6 bg-gray-200" />
      </div>

      {/* Department tabs */}
      <div className="flex flex-wrap gap-2">
        {RECRUITMENT_DEPARTMENTS.map(dept => {
          const isActive = dept.key === activeKey

          return (
            <button
              key={dept.key}
              onClick={() => setActiveKey(dept.key)}
              className="px-4 py-2 rounded-full text-sm font-bold transition-colors"
              style={
                isActive
                  ? { backgroundColor: PINK, color: 'white' }
                  : { color: PINK_TEXT }
              }
            >
              {dept.label}
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
            className="grid grid-cols-[1.8fr_0.7fr_0.5fr_1fr_1fr_2fr] px-4 py-3 text-gray-800 text-sm md:text-base font-extrabold text-center items-center bg-gray-50 border-b border-gray-200"
          >
            <span className="text-left">Position</span>
            <span>Level</span>
            <span>HC</span>
            <span>Status</span>
            <span>Lead Time</span>
            <span className="text-left">Remarks</span>
          </div>

          {positions.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-8">
              No positions for this department yet.
            </p>
          )}

          {positions.map((row, i) => (
            <div
              key={`${row.position}-${i}`}
              className={`grid grid-cols-[1.8fr_0.7fr_0.5fr_1fr_1fr_2fr] px-4 py-3 items-center text-center ${
                i > 0 ? 'border-t border-gray-100' : ''
              }`}
            >
              <span
                className="text-sm font-extrabold text-left"
                style={{ color: PINK_TEXT }}
              >
                {row.position}
              </span>

              <span className="text-sm font-bold text-gray-800">
                {row.level}
              </span>

              <span className="text-sm font-bold text-gray-800">
                {row.hc}
              </span>

              <span className="flex justify-center">
                <span
                  className="text-[11px] font-bold text-white px-3 py-1 rounded-full whitespace-nowrap"
                  style={{ backgroundColor: statusColor(row.status) }}
                >
                  {row.status}
                </span>
              </span>

              <span className="text-sm font-extrabold" style={{ color: PINK_TEXT }}>
                {row.leadTime}
              </span>

              <ol className="text-left list-decimal list-outside pl-3.5 space-y-1">
                {(row.remarks || '')
                  .split('|')
                  .map(r => r.trim())
                  .filter(Boolean)
                  .map((r, j) => (
                    <li
                      key={j}
                      className="text-[11px] font-medium leading-tight text-gray-700"
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
          <div className="px-4 py-3.5 flex items-center gap-2.5 border-b border-gray-100">
            <Lightbulb className="w-5 h-5" style={{ color: PINK_TEXT }} strokeWidth={1.75} />
            <span className="text-sm font-extrabold tracking-wide text-gray-900 uppercase">Insight</span>
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
