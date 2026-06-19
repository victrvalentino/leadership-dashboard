'use client'
import { developmentData } from '@/data/dashboardData'
import { KeyMetricsHeader, LeadershipSignal, ProgressBar } from '@/components/ui'

interface DevCardProps {
  icon: string
  title: string
  rateLabel: string
  rate: number
  target: number
  targetLabel: string
  detailIcon: string
  detailMain: string
  detailSub: string
}

function DevCard({ icon, title, rateLabel, rate, target, targetLabel, detailIcon, detailMain, detailSub }: DevCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-sm font-black uppercase tracking-wider text-gray-800">{title}</h3>
      </div>
      <div className="w-full h-px bg-gray-100" />
      <div>
        <p className="text-xs text-gray-500 mb-1">{rateLabel}</p>
        <div className="flex items-end gap-2">
          <p className="text-4xl font-black text-purple-700">{rate}%</p>
        </div>
        <ProgressBar value={rate} target={target} color="#6A1B9A" />
        <p className="text-xs text-gray-400 mt-1">{targetLabel}</p>
      </div>
      <div className="bg-purple-50 rounded-xl p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-lg flex-shrink-0">
          {detailIcon}
        </div>
        <div>
          <p className="text-sm font-black text-purple-800">{detailMain}</p>
          <p className="text-xs text-gray-500">{detailSub}</p>
        </div>
      </div>
    </div>
  )
}

export default function DevelopmentSection() {
  const d = developmentData
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white" style={{ backgroundColor: '#6A1B9A' }}>
          <span className="text-2xl">📈</span>
          <span className="text-[8px] font-black tracking-widest">DEVELOPMENT</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Development</h1>
          <p className="text-sm text-gray-500 font-medium">Are We Growing Talent or Consuming Talent?</p>
        </div>
      </div>
      <div className="w-full h-px bg-gray-200" />

      {/* Metrics area */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: '#f9f0ff' }}>
        <KeyMetricsHeader color="#6A1B9A" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <DevCard
            icon="📊"
            title="Promotion Movement"
            rateLabel="Promotion Rate (YTD)"
            rate={d.promotionRate}
            target={d.promotionTarget}
            targetLabel={`vs Target ${d.promotionTarget}%`}
            detailIcon="📈"
            detailMain={`${d.promotionCount} Promotions`}
            detailSub={`out of ${d.totalEmployees} employees`}
          />
          <DevCard
            icon="🔁"
            title="Internal Mobility"
            rateLabel="Internal Mobility Rate (YTD)"
            rate={d.internalMobilityRate}
            target={d.internalMobilityTarget}
            targetLabel={`vs Target ${d.internalMobilityTarget}%`}
            detailIcon="👥"
            detailMain={`${d.internalMobilityCount} Employees`}
            detailSub="moved internally"
          />
          <DevCard
            icon="🎓"
            title="Development Participation"
            rateLabel="Learning Participation Rate (YTD)"
            rate={d.learningParticipationRate}
            target={d.learningParticipationTarget}
            targetLabel={`vs Target ${d.learningParticipationTarget}%`}
            detailIcon="📖"
            detailMain={`${d.avgCourses} Avg Courses`}
            detailSub="completed per employee"
          />
        </div>
      </div>

      <LeadershipSignal text={d.leadershipSignal} color="#6A1B9A" bgColor="#f5eeff" icon="📢" />
    </div>
  )
}
