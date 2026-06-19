'use client'
import { turnoverData } from '@/data/dashboardData'
import { SimpleHBar } from '@/components/ui'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

function MetricBox({
  label, value, unit = '', prev, prevLabel,
}: {
  label: string; value: number | string; unit?: string; prev?: string; prevLabel?: string
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm text-center space-y-2">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</p>
      <p className="text-3xl font-black text-orange-500">
        {value}<span className="text-lg font-bold text-orange-400">{unit}</span>
      </p>
      {prev && <p className="text-xs text-gray-400">{prevLabel}: {prev} <span className="text-red-500">↑</span></p>}
    </div>
  )
}

export default function TurnoverSection() {
  const d = turnoverData
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#E65100' }}>
          <span className="text-2xl">🔄</span>
          <span className="text-[8px] font-black tracking-widest">TURNOVER</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-orange-700">Turnover</h1>
          <p className="text-sm text-gray-500 font-medium">Workforce Continuity Risk</p>
        </div>
      </div>
      <div className="w-full h-px bg-gray-200" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — Key Metrics */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header label */}
          <div className="rounded-t-2xl px-5 py-3 text-center font-black text-sm uppercase tracking-widest text-white" style={{ backgroundColor: '#E65100' }}>
            Key Metrics
          </div>

          {/* Top 3 metrics */}
          <div className="grid grid-cols-3 gap-3" style={{ background: '#fff7f0', borderRadius: '1rem', padding: '1rem' }}>
            <MetricBox label="Turnover Rate" value={`${d.turnoverRate}%`} prevLabel="vs Last 12 Months" prev={`${d.turnoverRatePrev}%`} />
            <MetricBox label="Voluntary Turnover" value={`${d.voluntaryTurnover}%`} prevLabel="vs Last 12 Months" prev={`${d.voluntaryTurnoverPrev}%`} />
            <MetricBox label="Critical Position Turnover" value={`${d.criticalPositionTurnover}%`} prevLabel="vs Last 12 Months" prev={`${d.criticalPositionTurnoverPrev}%`} />
          </div>

          {/* Middle row */}
          <div className="grid grid-cols-3 gap-3 rounded-2xl p-4" style={{ backgroundColor: '#fff7f0' }}>
            <div className="bg-white rounded-2xl p-4 shadow-sm text-center space-y-1">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">🔁</div>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Repeated Replacement Roles</p>
              <p className="text-4xl font-black text-orange-500">{d.repeatedReplacementRoles}</p>
              <p className="text-xs text-gray-400">Roles replaced &gt;2 times in 12 months</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm text-center space-y-1">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">⏱️</div>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Time-to-Backfill Critical Roles</p>
              <p className="text-4xl font-black text-orange-500">{d.timeToBackfill}<span className="text-lg font-bold text-orange-400">Days</span></p>
              <p className="text-xs text-red-400">vs Last 12 Months: {d.timeToBackfillPrev} Days ↑</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Turnover Background By Role (Top 5)</p>
              {d.byRole.map((r) => (
                <SimpleHBar key={r.name} label={r.name} value={r.value} max={30} color="#E65100" />
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-2 gap-3 rounded-2xl p-4" style={{ backgroundColor: '#fff7f0' }}>
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Turnover by Manager (Top 5)</p>
              {d.byManager.map((r) => (
                <SimpleHBar key={r.name} label={r.name} value={r.value} max={25} color="#E65100" />
              ))}
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-2">Turnover Trend (Last 12 Months)</p>
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={d.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} unit="%" domain={[5, 20]} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Line type="monotone" dataKey="value" stroke="#E65100" strokeWidth={2} dot={{ r: 3, fill: '#E65100' }} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-orange-500 font-bold text-right mt-1">TURNOVER TREND</p>
            </div>
          </div>
        </div>

        {/* Right — Leadership Insight */}
        <div className="space-y-4">
          <div className="rounded-2xl p-4 text-center font-black text-sm uppercase tracking-widest text-white" style={{ backgroundColor: '#E65100' }}>
            Leadership Insight
          </div>
          {d.chroAnalysis.map((text, i) => (
            <div key={i} className="bg-orange-50 rounded-2xl p-4 flex gap-3 items-start border border-orange-100">
              <div className="w-10 h-10 rounded-full border-2 border-orange-400 flex items-center justify-center text-orange-500 flex-shrink-0 text-xl">
                ⚠️
              </div>
              <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1">CHRO Analysis</p>
                <p className="text-sm text-gray-700">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
