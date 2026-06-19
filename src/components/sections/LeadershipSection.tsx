'use client'
import { riskHeatmapData, actionBoxData, governanceData } from '@/data/dashboardData'
import { RiskDot } from '@/components/ui'

// ── Sub-tabs ──────────────────────────────────────────────────────────────────
type SubPage = 'heatmap' | 'actions' | 'governance'

function PageHeader() {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#E65100' }}>
        <span className="text-2xl">📋</span>
        <span className="text-[8px] font-black tracking-widest">LEADERSHIP</span>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-orange-700">Leadership Action</h1>
        <p className="text-sm text-gray-500 font-medium">What needs intervention now</p>
      </div>
    </div>
  )
}

// ── Risk Heatmap ──────────────────────────────────────────────────────────────
function RiskHeatmap() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black uppercase text-gray-900">Leadership Risk Heatmap</h2>
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 max-w-xs h-px bg-gray-300" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">A Quick Overview of Workforce Risk Areas</p>
          <div className="flex-1 max-w-xs h-px bg-gray-300" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200">
        {/* Header */}
        <div className="grid grid-cols-3 px-6 py-3 text-white text-xs font-black uppercase tracking-widest" style={{ backgroundColor: '#E65100' }}>
          <span>Area</span>
          <span>Status</span>
          <span>Signal</span>
        </div>
        {/* Rows */}
        {riskHeatmapData.map((row, i) => (
          <div
            key={row.area}
            className={`grid grid-cols-3 px-6 py-4 items-center border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-orange-50'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{row.icon}</span>
              <span className="text-sm font-black uppercase tracking-wider text-orange-700">{row.area}</span>
            </div>
            <div className="flex items-center gap-2">
              <RiskDot level={row.status} />
              <span className="text-sm font-bold uppercase text-gray-700">{row.status}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-500 text-lg">🔔</span>
              <span className="text-sm font-semibold text-orange-700">{row.signal}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Insight & Legend */}
      <div className="rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center gap-6" style={{ backgroundColor: '#fff7f0' }}>
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl flex-shrink-0">💡</div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-orange-600 mb-1">Leadership Insight</p>
            <p className="text-sm text-gray-700">Focus areas in red and yellow require immediate leadership attention to reduce risk and protect business continuity</p>
          </div>
        </div>
        <div className="flex gap-6 flex-shrink-0">
          {[
            { dot: 'low', label: 'LOW RISK', sub: 'On Track' },
            { dot: 'medium', label: 'MEDIUM RISK', sub: 'Monitor Closely' },
            { dot: 'high', label: 'HIGH RISK', sub: 'Immediate Action' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <RiskDot level={item.dot} />
              <div>
                <p className="text-xs font-black text-gray-700">{item.label}</p>
                <p className="text-[10px] text-gray-400">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Action Box ────────────────────────────────────────────────────────────────
function ActionBox() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black uppercase text-gray-900">Leadership Action Box</h2>
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 max-w-xs h-px bg-gray-300" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">What Requires Immediate Action</p>
          <div className="flex-1 max-w-xs h-px bg-gray-300" />
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-sm border border-orange-100">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4 text-white" style={{ backgroundColor: '#E65100' }}>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">🎯</div>
          <div>
            <p className="font-black uppercase tracking-widest">Recommended Leadership Focus</p>
            <p className="text-sm text-orange-100">Prioritized action strengthen workforce health and reduce business risk</p>
          </div>
        </div>

        {/* Action items */}
        <div className="divide-y divide-gray-100 bg-white">
          {actionBoxData.map((item) => (
            <div key={item.number} className="flex items-start gap-5 px-6 py-5">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0 text-xl"
                style={{ backgroundColor: item.bgColor }}
              >
                <span style={{ color: item.color }} className="text-xl font-black">
                  {item.number === 1 && '🛡️'}
                  {item.number === 2 && '👥'}
                  {item.number === 3 && '🤝'}
                  {item.number === 4 && '📈'}
                  {item.number === 5 && '🔄'}
                </span>
              </div>
              <div className="border-l-2 pl-4" style={{ borderColor: item.color }}>
                <p className="text-sm font-black uppercase tracking-wider" style={{ color: item.color }}>
                  {item.number}. {item.title}
                </p>
                <p className="text-sm text-gray-600 mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Governance Model ──────────────────────────────────────────────────────────
function GovernanceModel() {
  const d = governanceData
  const stepColors = ['#1565C0', '#2E7D32', '#E65100', '#C62828']

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black uppercase text-gray-900">Governance Model</h2>
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 max-w-xs h-px bg-gray-300" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Monthly Leadership Workforce Review</p>
          <div className="flex-1 max-w-xs h-px bg-gray-300" />
        </div>
      </div>

      {/* Cadence */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-orange-100">
        <div className="px-6 py-3 text-white text-center font-black uppercase tracking-widest" style={{ backgroundColor: '#E65100' }}>
          Cadence
        </div>
        <div className="bg-white p-5 grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {d.cadence.map((step, i) => (
            <div key={step.step} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0" style={{ backgroundColor: stepColors[i] }}>
                  {step.step}
                </div>
                <p className="text-xs font-black uppercase tracking-wider" style={{ color: stepColors[i] }}>{step.title}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex-1">
                <ul className="space-y-1.5">
                  {step.bullets.map((b, j) => (
                    <li key={j} className="text-xs text-gray-600 flex gap-1.5">
                      <span className="text-gray-400 mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {i < 3 && <div className="hidden md:block absolute top-12 text-gray-300 text-2xl" style={{ left: `${(i + 1) * 25 - 2}%` }}>→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Ownership */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-orange-100">
        <div className="px-6 py-3 text-white text-center font-black uppercase tracking-widest" style={{ backgroundColor: '#E65100' }}>
          Ownership
        </div>
        <div className="bg-white p-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* PX */}
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-full bg-blue-800 flex items-center justify-center text-white font-black text-lg flex-shrink-0">PX</div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-blue-800 mb-2">PX = Insight Generation</p>
              <ul className="space-y-1">
                {d.pxResponsibilities.map((r, i) => (
                  <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                    <span className="text-blue-600">✓</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Partnership */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-gray-400 flex items-center justify-center text-3xl">🤝</div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Partnership<br />For Outcomes</p>
          </div>

          {/* Leader */}
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-white text-3xl flex-shrink-0">👤</div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-green-700 mb-2">Leader = Decision Ownership</p>
              <ul className="space-y-1">
                {d.leaderResponsibilities.map((r, i) => (
                  <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                    <span className="text-green-600">✓</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="rounded-2xl p-4 flex flex-wrap items-center gap-6 bg-orange-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-lg">🎯</div>
          <span className="text-sm font-black uppercase tracking-wider text-orange-700">Benefits</span>
        </div>
        {d.benefits.map((b, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-lg">{b.icon}</div>
            <p className="text-xs text-gray-700 max-w-[120px]">{b.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Leadership Section ───────────────────────────────────────────────────
import { useState } from 'react'

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

      {/* Sub-tabs */}
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

      {sub === 'heatmap' && <RiskHeatmap />}
      {sub === 'actions' && <ActionBox />}
      {sub === 'governance' && <GovernanceModel />}
    </div>
  )
}
