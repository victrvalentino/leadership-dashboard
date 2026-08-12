'use client'

import { useState } from 'react'
import { ClipboardList } from 'lucide-react'
import RiskHeatmapTab from './leadership/RiskHeatmapTab'
import ActionBoxTab from './leadership/ActionBoxTab'
import GovernanceTab from './leadership/GovernanceTab'

type SubPage = 'heatmap' | 'actions' | 'governance'

const ORANGE = '#F58220'

function PageHeader() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-24 h-24 rounded-[26px] flex flex-col items-center justify-center gap-1.5 text-white flex-shrink-0 icon-gradient shadow-badge"
          style={{ backgroundColor: ORANGE }}
        >
          <div className="w-12 h-12 rounded-full border-[1.5px] border-white/60 flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-white" strokeWidth={1.75} />
          </div>
          <span className="text-[9px] font-bold tracking-widest">
            LEADERSHIP
          </span>
        </div>

        <div>
          <h1
            className="text-4xl md:text-[42px] leading-none font-extrabold tracking-tight"
            style={{ color: ORANGE }}
          >
            Leadership Action
          </h1>
          <p className="text-base md:text-lg text-gray-900 font-bold mt-2">
            What needs intervention now
          </p>
        </div>
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