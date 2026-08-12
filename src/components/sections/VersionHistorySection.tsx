'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  History,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  FileEdit,
  UploadCloud,
  User,
  Clock,
  ChevronDown,
  CheckCircle2,
  MinusCircle,
} from 'lucide-react'

type FieldChange = { field: string; before: unknown; after: unknown }

type TodayEntry = {
  id: string
  action: 'draft_save' | 'publish'
  changeSummary: string
  editorName: string
  editorRole: string | null
  changes: FieldChange[]
  createdAt: string
}

type SectionStatus = {
  sectionKey: string
  title: string
  group: 'core' | 'recruitment' | 'leadership'
  color: string
  changedToday: boolean
  entriesToday: TodayEntry[]
  lastChange: { action: string; editorName: string; createdAt: string } | null
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function shiftDate(date: string, days: number) {
  const d = new Date(date + 'T12:00:00.000Z')
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

function formatDateLabel(date: string) {
  return new Date(date + 'T12:00:00.000Z').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function fieldValue(v: unknown) {
  if (v === undefined) return '—'
  if (v === null) return 'empty'
  if (v === '[object]') return '(complex value)'
  return String(v)
}

function SectionRow({ section }: { section: SectionStatus }) {
  const [open, setOpen] = useState(section.changedToday)
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)

  return (
    <li className="p-4">
      <div className="flex items-start gap-4">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 shadow-sm"
          style={{ backgroundColor: section.color }}
        />

        <div className="flex-1 min-w-0">
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-2 text-left cursor-pointer"
            aria-expanded={open}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-800 text-[15px]">{section.title}</span>
              {section.changedToday ? (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-3 h-3" /> Changed
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                  <MinusCircle className="w-3 h-3" /> Unchanged
                </span>
              )}
            </div>

            <span
              className="w-5 h-5 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label={open ? 'Minimize' : 'Expand'}
            >
              <ChevronDown className={'w-3.5 h-3.5 transition-transform duration-200 ' + (open ? 'rotate-180' : '')} />
            </span>
          </button>

          {open && (section.changedToday ? (
            <div className="mt-2 space-y-2 section-enter">
              {section.entriesToday.map((entry) => {
                const isOpen = expandedEntry === entry.id
                const isPublish = entry.action === 'publish'
                return (
                  <div key={entry.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center gap-2">
                      {isPublish ? (
                        <UploadCloud className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />
                      ) : (
                        <FileEdit className="w-3.5 h-3.5 text-amber-600" strokeWidth={2} />
                      )}
                      <span className="text-xs font-bold text-gray-700">
                        {isPublish ? 'Published' : 'Draft Saved'}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-500">{entry.changeSummary}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400 font-medium">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {entry.editorName}
                        {entry.editorRole ? ` · ${entry.editorRole}` : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(entry.createdAt)}
                      </span>
                    </div>

                    {entry.changes.length > 0 && (
                      <button
                        onClick={() => setExpandedEntry(isOpen ? null : entry.id)}
                        className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900"
                      >
                        <ChevronDown className={'w-3 h-3 transition-transform ' + (isOpen ? 'rotate-180' : '')} />
                        {isOpen ? 'Hide field changes' : `View ${entry.changes.length} field change${entry.changes.length === 1 ? '' : 's'}`}
                      </button>
                    )}

                    {isOpen && (
                      <div className="mt-2 space-y-1.5 border-t border-gray-200 pt-2">
                        {entry.changes.map((c) => (
                          <div key={c.field} className="text-[11px] grid grid-cols-[100px_1fr] gap-2">
                            <span className="font-bold text-gray-500 truncate">{c.field}</span>
                            <span className="text-gray-700">
                              <span className="text-gray-400 line-through">{fieldValue(c.before)}</span>
                              {' → '}
                              <span className="font-semibold text-gray-800">{fieldValue(c.after)}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400 font-medium mt-1 section-enter">
              {section.lastChange
                ? `Last changed ${formatShortDate(section.lastChange.createdAt)} by ${section.lastChange.editorName}`
                : 'No history recorded yet'}
            </p>
          ))}
        </div>
      </div>
    </li>
  )
}

function GroupBlock({
  title,
  sections,
  defaultOpen = true,
}: {
  title: string
  sections: SectionStatus[]
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  if (sections.length === 0) return null
  const changedCount = sections.filter((s) => s.changedToday).length

  return (
    <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50/70 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
          {title} <span className="text-gray-300 font-semibold">· {sections.length}</span>
        </span>
        <div className="flex items-center gap-2">
          {changedCount > 0 && (
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              {changedCount} changed
            </span>
          )}
          <span
            className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label={open ? 'Minimize' : 'Expand'}
          >
            <ChevronDown className={'w-4 h-4 transition-transform duration-200 ' + (open ? 'rotate-180' : '')} />
          </span>
        </div>
      </button>

      {open && <ul className="divide-y divide-gray-100 section-enter">{sections.map((s) => <SectionRow key={s.sectionKey} section={s} />)}</ul>}
    </div>
  )
}

export default function VersionHistorySection() {
  const [date, setDate] = useState(todayStr())
  const [sections, setSections] = useState<SectionStatus[]>([])
  const [changedCount, setChangedCount] = useState(0)
  const [activeDates, setActiveDates] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (d: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard/history?date=${d}`, { cache: 'no-store' })
      const json = await res.json()
      setSections(json?.sections || [])
      setChangedCount(json?.changedCount || 0)
      setActiveDates(json?.activeDates || [])
    } catch (error) {
      console.error(error)
      setSections([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(date)
  }, [date, load])

  const isToday = date === todayStr()
  const core = sections.filter((s) => s.group === 'core')
  const leadership = sections.filter((s) => s.group === 'leadership')
  const recruitment = sections.filter((s) => s.group === 'recruitment')

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-[26px] flex flex-col items-center justify-center gap-1.5 text-white flex-shrink-0 icon-gradient shadow-badge" style={{ backgroundColor: '#475569' }}>
            <div className="w-12 h-12 rounded-full border-[1.5px] border-white/60 flex items-center justify-center">
              <History className="w-6 h-6 text-white" strokeWidth={1.75} />
            </div>
            <span className="text-[9px] font-extrabold tracking-widest">AUDIT TRAIL</span>
          </div>

          <div>
            <h1 className="text-4xl md:text-[42px] leading-none font-extrabold tracking-tight text-slate-700">
              Version History
            </h1>
            <p className="text-base md:text-lg text-gray-900 font-bold mt-2">
              Every section&apos;s status, for any day you choose
            </p>
          </div>
        </div>
        <div className="w-full h-px mt-6 bg-slate-300" />
      </div>

      {/* Date picker */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-gray-100 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDate((d) => shiftDate(d, -1))}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="relative">
            <CalendarDays className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={date}
              max={todayStr()}
              onChange={(e) => e.target.value && setDate(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <button
            onClick={() => setDate((d) => shiftDate(d, 1))}
            disabled={isToday}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Next day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isToday && (
            <button
              onClick={() => setDate(todayStr())}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Today
            </button>
          )}
        </div>

        <div className="text-sm font-bold text-gray-800">{formatDateLabel(date)}</div>

        {!loading && sections.length > 0 && (
          <span className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
            {changedCount} of {sections.length} sections changed
          </span>
        )}

        {activeDates.length > 1 && (
          <div className="flex items-center gap-1.5 ml-auto flex-wrap">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mr-1">
              Recent activity
            </span>
            {activeDates.slice(0, 8).map((d) => (
              <button
                key={d}
                onClick={() => setDate(d)}
                className={
                  'text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ' +
                  (d === date
                    ? 'bg-slate-700 border-slate-700 text-white'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50')
                }
              >
                {d.slice(5)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Per-section status, every section, changed or not */}
      {loading ? (
        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-10 text-center text-gray-400 text-sm font-semibold">
          Loading…
        </div>
      ) : sections.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-10 text-center text-gray-500 font-semibold">
          No sections found.
        </div>
      ) : (
        <div className="space-y-4">
          <GroupBlock title="Lifecycle Sections" sections={core} defaultOpen />
          <GroupBlock title="Leadership Action" sections={leadership} defaultOpen />
          <GroupBlock title="Recruitment Departments" sections={recruitment} defaultOpen={false} />
        </div>
      )}
    </div>
  )
}
