'use client'

import { useEffect, useState } from 'react'
import { ClipboardList, CalendarDays } from 'lucide-react'
import RiskHeatmapTab from './leadership/RiskHeatmapTab'
import ActionBoxTab from './leadership/ActionBoxTab'
import GovernanceTab from './leadership/GovernanceTab'

type SubPage = 'heatmap' | 'actions' | 'governance'

const ORANGE = '#F58220'

function PageHeader() {
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

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 flex-shrink-0 icon-gradient shadow-badge"
            style={{ backgroundColor: ORANGE }}
          >
            <ClipboardList className="w-8 h-8 text-white" strokeWidth={1.75} />
            <span className="text-[10px] font-black tracking-widest text-white">
              LEADERSHIP
            </span>
          </div>

          <div>
            <h1
              className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase"
              style={{ color: ORANGE }}
            >
              Leadership Action
            </h1>
            <p className="text-gray-500 font-medium mt-1.5">
              What needs intervention now
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
        className="w-full h-px"
        style={{ backgroundColor: ORANGE }}
      />
    </div>
  )
}

export default function LeadershipSection() {
  const [sub, setSub] = useState<SubPage>('heatmap')

  const tabs: { id: SubPage; label: string }[] = [
    { id: 'heatmap', label: 'Risk Heatmap' },
    { id: 'actions', label: 'Action Box' },
    { id: 'governance', label: 'Governance Model' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      <PageHeader />

      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSub(t.id)}
            className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-all ${
              sub === t.id
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {sub === 'heatmap' && <RiskHeatmapTab />}
      {sub === 'actions' && <ActionBoxTab />}
      {sub === 'governance' && <GovernanceTab />}
    </div>
  )
}