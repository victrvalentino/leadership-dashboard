'use client'

import { useState } from 'react'
import RiskHeatmapTab from './leadership/RiskHeatmapTab'
import ActionBoxTab from './leadership/ActionBoxTab'
import GovernanceTab from './leadership/GovernanceTab'

type SubPage = 'heatmap' | 'actions' | 'governance'

function PageHeader() {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div
        className="w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white"
        style={{ backgroundColor: '#E65100' }}
      >
        <span className="text-2xl">📋</span>
        <span className="text-[8px] font-black tracking-widest">
          LEADERSHIP
        </span>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-orange-700">
          Leadership Action
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          What needs intervention now
        </p>
      </div>
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

      <div className="w-full h-px bg-gray-200" />

      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSub(t.id)}
            className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${
              sub === t.id
                ? 'bg-orange-500 text-white'
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