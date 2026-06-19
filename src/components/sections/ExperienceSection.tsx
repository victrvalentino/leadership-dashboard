'use client'
import { experienceData } from '@/data/dashboardData'
import { KeyMetricsHeader, LeadershipSignal, StatusBadge, DonutChart, CircularProgress } from '@/components/ui'

export default function ExperienceSection() {
  const d = experienceData

  const genderSegments = [
    { value: d.genderMix.male, color: '#1565C0' },
    { value: d.genderMix.female, color: '#EC4899' },
  ]
  const employmentSegments = [
    { value: d.employmentStatus.permanent, color: '#1565C0' },
    { value: d.employmentStatus.contract, color: '#60A5FA' },
    { value: d.employmentStatus.other, color: '#BFDBFE' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#1565C0' }}>
          <span className="text-2xl">👥</span>
          <span className="text-[8px] font-black tracking-widest">EXPERIENCE</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-blue-800">Experience</h1>
          <p className="text-sm text-gray-500 font-medium">What Is The Current Team Condition</p>
        </div>
      </div>
      <div className="w-full h-px bg-gray-200" />

      {/* Key Metrics */}
      <div className="rounded-2xl p-6 bg-blue-50">
        <KeyMetricsHeader color="#1565C0" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Gender Mix */}
          <div className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Gender Mix</p>
            <DonutChart segments={genderSegments} size={90} />
            <div className="space-y-0.5 text-xs text-left w-full">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-700" />
                <span className="text-gray-600">Male {d.genderMix.male}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                <span className="text-gray-600">Female {d.genderMix.female}%</span>
              </div>
            </div>
            <div className="w-full h-px bg-gray-100" />
            <p className="text-xs text-gray-500">Total Headcount</p>
            <p className="text-2xl font-black text-gray-700">{d.totalHeadcount}</p>
          </div>

          {/* Employment Status */}
          <div className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Employment Status</p>
            <DonutChart segments={employmentSegments} size={90} />
            <div className="space-y-0.5 text-xs text-left w-full">
              {[
                { label: 'Permanent', val: d.employmentStatus.permanent, c: '#1565C0' },
                { label: 'Contract', val: d.employmentStatus.contract, c: '#60A5FA' },
                { label: 'Other', val: d.employmentStatus.other, c: '#BFDBFE' },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.c }} />
                  <span className="text-gray-600">{r.label} {r.val}%</span>
                </div>
              ))}
            </div>
            <div className="w-full h-px bg-gray-100" />
            <p className="text-xs text-gray-500">Total Headcount</p>
            <p className="text-2xl font-black text-gray-700">{d.totalHeadcount}</p>
          </div>

          {/* Level Mix */}
          <div className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 text-center">Level Mix</p>
            <div className="w-full space-y-2 mt-2">
              {Object.entries(d.levelMix).map(([lvl, val]) => (
                <div key={lvl} className="flex items-center gap-1.5 text-xs">
                  <span className="w-20 text-gray-500 truncate text-right">{lvl}</span>
                  <div className="flex-1 h-4 bg-blue-100 rounded overflow-hidden">
                    <div className="h-full bg-blue-600 rounded" style={{ width: `${val}%` }} />
                  </div>
                  <span className="w-7 text-gray-600 font-bold">{val}%</span>
                </div>
              ))}
            </div>
            <div className="w-full h-px bg-gray-100 mt-auto" />
            <p className="text-xs text-gray-500">Total Headcount</p>
            <p className="text-2xl font-black text-gray-700">{d.totalHeadcount}</p>
          </div>

          {/* Tenure Mix */}
          <div className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 text-center">Tenure Mix</p>
            <div className="w-full space-y-2 mt-2">
              {[
                { label: '< 1 Year', val: d.tenureMix.lt1 },
                { label: '1 – 3 Years', val: d.tenureMix.yr1to3 },
                { label: '3 – 5 Years', val: d.tenureMix.yr3to5 },
                { label: '> 5 Years', val: d.tenureMix.gt5 },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-1.5 text-xs">
                  <span className="w-16 text-gray-500">{r.label}</span>
                  <div className="flex-1 h-4 bg-blue-100 rounded overflow-hidden">
                    <div className="h-full bg-blue-700 rounded" style={{ width: `${r.val}%` }} />
                  </div>
                  <span className="w-7 text-gray-600 font-bold">{r.val}%</span>
                </div>
              ))}
            </div>
            <div className="w-full h-px bg-gray-100 mt-auto" />
            <p className="text-xs text-gray-500">Average Tenure</p>
            <p className="text-2xl font-black text-gray-700">{d.averageTenure} <span className="text-sm font-semibold text-gray-500">Years</span></p>
          </div>

          {/* Attendance */}
          <div className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Attendance</p>
            <div className="flex items-center justify-center mt-2">
              <CircularProgress value={d.attendanceRate} size={90} color="#F59E0B" label={`${d.attendanceRate}%`} />
            </div>
            <p className="text-xs text-gray-500">Attendance Rate</p>
            <StatusBadge status="watchlist" />
          </div>

          {/* Absenteeism */}
          <div className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Absenteeism</p>
            <div className="flex items-center justify-center mt-2">
              <CircularProgress value={d.absenteeismRate * 10} size={90} color="#1565C0" label={`${d.absenteeismRate}%`} />
            </div>
            <p className="text-xs text-gray-500">Absenteeism Rate</p>
            <StatusBadge status="healthy" />
          </div>
        </div>
      </div>

      <LeadershipSignal text={d.leadershipSignal} color="#1565C0" bgColor="#e8f0fe" icon="📢" />
    </div>
  )
}
