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
} from 'lucide-react'

type FieldChange = { field: string; before: unknown; after: unknown }

type HistoryEntry = {
  id: string
  action: 'draft_save' | 'publish'
  targetSection: string
  sectionLabel: string
  sectionColor: string
  changeSummary: string
  editorName: string
  editorRole: string | null
  changes: FieldChange[]
  createdAt: string
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

function fieldValue(v: unknown) {
  if (v === undefined) return '—'
  if (v === null) return 'empty'
  if (v === '[object]') return '(complex value)'
  return String(v)
}

export default function VersionHistorySection() {
  const [date, setDate] = useState(todayStr())
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [activeDates, setActiveDates] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = useCallback(async (d: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard/history?date=${d}`, { cache: 'no-store' })
      const json = await res.json()
      setEntries(json?.entries || [])
      setActiveDates(json?.activeDates || [])
    } catch (error) {
      console.error(error)
      setEntries([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(date)
  }, [date, load])

  const isToday = date === todayStr()

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-[26px] flex flex-col items-center justify-center gap-1.5 text-white flex-shrink-0 shadow-badge bg-gradient-to-br from-slate-600 to-slate-800">
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
              See exactly what changed, on any day
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

      {/* Timeline */}
      <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400 text-sm font-semibold">Loading…</div>
        ) : entries.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500 font-semibold">No changes recorded on this date.</p>
            <p className="text-gray-400 text-sm mt-1">
              Try a different day{activeDates.length > 0 ? ' — see "Recent activity" above.' : '.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {entries.map((entry) => {
              const isOpen = expanded === entry.id
              const isPublish = entry.action === 'publish'
              return (
                <li key={entry.id} className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-sm"
                      style={{ backgroundColor: entry.sectionColor }}
                    >
                      {isPublish ? (
                        <UploadCloud className="w-5 h-5" strokeWidth={1.75} />
                      ) : (
                        <FileEdit className="w-5 h-5" strokeWidth={1.75} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-gray-800">{entry.sectionLabel}</span>
                        <span
                          className={
                            'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ' +
                            (isPublish
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700')
                          }
                        >
                          {isPublish ? 'Published' : 'Draft Saved'}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mt-1">{entry.changeSummary}</p>

                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 font-medium">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {entry.editorName}
                          {entry.editorRole ? ` · ${entry.editorRole}` : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTime(entry.createdAt)}
                        </span>
                      </div>

                      {entry.changes.length > 0 && (
                        <button
                          onClick={() => setExpanded(isOpen ? null : entry.id)}
                          className="mt-2 flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900"
                        >
                          <ChevronDown
                            className={'w-3.5 h-3.5 transition-transform ' + (isOpen ? 'rotate-180' : '')}
                          />
                          {isOpen ? 'Hide field changes' : `View ${entry.changes.length} field change${entry.changes.length === 1 ? '' : 's'}`}
                        </button>
                      )}

                      {isOpen && (
                        <div className="mt-3 bg-gray-50 rounded-2xl p-4 space-y-2 border border-gray-100">
                          {entry.changes.map((c) => (
                            <div key={c.field} className="text-xs grid grid-cols-[120px_1fr] gap-2">
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
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
