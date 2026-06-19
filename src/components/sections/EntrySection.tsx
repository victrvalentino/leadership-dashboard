'use client'
import { entryData } from '@/data/dashboardData'
import { KeyMetricsHeader, LeadershipSignal, StatusBadge, CircularProgress } from '@/components/ui'

export default function EntrySection() {
  const d = entryData
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#2E7D32' }}>
          <span className="text-2xl">🚪</span>
          <span className="text-[8px] font-black tracking-widest">ENTRY</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-green-800">Entry (Hiring &amp; Onboarding)</h1>
          <p className="text-sm text-gray-500 font-medium">Are We Bringing the Right People In?</p>
        </div>
      </div>
      <div className="w-full h-px bg-gray-200" />

      {/* Key Metrics Area */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#f0faf0' }}>
        <KeyMetricsHeader />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Joiners */}
          <div className="bg-white rounded-2xl p-5 flex flex-col items-center gap-2 text-center shadow-sm">
            <div className="text-3xl">👥</div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Joiners (Monthly/Quarterly)</p>
            <div className="w-8 h-px bg-gray-200" />
            <div className="space-y-2 w-full">
              <div>
                <p className="text-xs text-gray-500">Monthly</p>
                <p className="text-3xl font-black text-green-700">{d.joinersMonthly}</p>
              </div>
              <div className="w-full h-px bg-gray-100" />
              <div>
                <p className="text-xs text-gray-500">Quarterly</p>
                <p className="text-3xl font-black text-green-700">{d.joinersQuarterly}</p>
              </div>
            </div>
          </div>

          {/* Critical Roles Hiring Status */}
          <div className="bg-white rounded-2xl p-5 flex flex-col items-center gap-2 text-center shadow-sm">
            <div className="text-3xl">⭐</div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Critical Roles Hiring Status</p>
            <div className="w-8 h-px bg-gray-200" />
            <CircularProgress value={d.criticalRolesPct} size={80} color="#2E7D32" label={`${d.criticalRolesPct}%`} />
            <p className="text-xs text-green-700 font-bold">Filled</p>
            <p className="text-xs text-gray-500">{d.criticalRolesFilled} of {d.criticalRolesTotal} roles filled</p>
            <StatusBadge status="watchlist" />
          </div>

          {/* New Hire Stability */}
          <div className="bg-white rounded-2xl p-5 flex flex-col items-center gap-2 text-center shadow-sm">
            <div className="text-3xl">🛡️</div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">New Hire Stability</p>
            <div className="w-8 h-px bg-gray-200" />
            <p className="text-4xl font-black text-green-700">{d.newHireStability}%</p>
            <p className="text-xs text-gray-500">New hires retained beyond 3 months</p>
            <StatusBadge status="healthy" />
          </div>

          {/* Onboarding Completion */}
          <div className="bg-white rounded-2xl p-5 flex flex-col items-center gap-2 text-center shadow-sm">
            <div className="text-3xl">📋</div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Onboarding Completion</p>
            <div className="w-8 h-px bg-gray-200" />
            <p className="text-4xl font-black text-green-700">{d.onboardingCompletion}%</p>
            <p className="text-xs text-gray-500">Onboarding completed on time</p>
            <StatusBadge status="watchlist" />
          </div>
        </div>
      </div>

      {/* Leadership Signal */}
      <LeadershipSignal
        text={d.leadershipSignal}
        color="#2E7D32"
        bgColor="#f0faf0"
        icon="📢"
      />
    </div>
  )
}
