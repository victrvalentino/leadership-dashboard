'use client'
import { executiveData } from '@/data/dashboardData'
import { StatusBadge, LeadershipSignal } from '@/components/ui'

export default function ExecutiveSection() {
  const d = executiveData
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-black text-center uppercase text-gray-900 tracking-tight">
        Executive Snapshot
      </h1>

      {/* Directorate Banner */}
      <div className="rounded-2xl px-6 py-5 flex items-center gap-4" style={{ background: '#0D1B4B' }}>
        <div className="w-14 h-14 rounded-full border-2 border-white/40 flex items-center justify-center text-2xl flex-shrink-0">
          🏢
        </div>
        <div>
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Directorate</p>
          <p className="text-white text-2xl font-black tracking-wide">People Experience</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Headcount */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-blue-300 flex items-center justify-center text-3xl">
            👥
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Total Headcount</p>
          <div className="w-8 h-px bg-gray-300" />
          <p className="text-4xl font-black text-gray-700">{d.totalHeadcount}</p>
          <div className="text-blue-600 text-2xl">👤</div>
        </div>

        {/* Turnover */}
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-red-300 flex items-center justify-center text-3xl">
            🔄
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Turn Over</p>
          <div className="w-8 h-px bg-gray-300" />
          <p className="text-4xl font-black text-gray-700">{d.turnover.value}</p>
          <StatusBadge status="high" />
        </div>

        {/* Attendance */}
        <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-5 flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-yellow-300 flex items-center justify-center text-3xl">
            📅
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Attendance</p>
          <div className="w-8 h-px bg-gray-300" />
          <p className="text-4xl font-black text-gray-700">{d.attendance.value}</p>
          <StatusBadge status="watchlist" />
        </div>

        {/* Monthly Manpower Cost */}
        <div className="rounded-2xl border border-green-100 bg-green-50 p-5 flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-green-300 flex items-center justify-center text-3xl">
            👛
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Monthly Manpower Cost</p>
          <div className="w-8 h-px bg-gray-300" />
          <p className="text-3xl font-black text-gray-700">{d.monthlyManpowerCost}</p>
          <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5 font-bold">Rp</span>
        </div>

        {/* Critical Replacement Roles */}
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5 flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-red-300 flex items-center justify-center text-3xl">
            🎯
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Critical Replacement Roles Open</p>
          <div className="w-8 h-px bg-gray-300" />
          <p className="text-4xl font-black text-gray-700">{d.criticalRolesOpen.value}</p>
          <StatusBadge status="high" />
        </div>
      </div>

      {/* Leadership Insight */}
      <LeadershipSignal
        label="LEADERSHIP INSIGHT"
        text={d.leadershipInsight}
        color="#1565C0"
        bgColor="#e8f4fd"
        icon="💡"
      />
    </div>
  )
}
