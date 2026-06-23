'use client'

import { useEffect, useState } from 'react'
import { developmentData } from '@/data/dashboardData'
import { LeadershipSignal, ProgressBar } from '@/components/ui'

type DevelopmentContent = {
  title?: string
  subtitle?: string
  promotionRate: number
  promotionTarget: number
  promotionCount: number
  totalEmployees: number
  internalMobilityRate: number
  internalMobilityTarget: number
  internalMobilityCount: number
  learningParticipationRate: number
  learningParticipationTarget: number
  avgCourses: number
  leadershipSignal: string
}

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

function DevCard({
  icon,
  title,
  rateLabel,
  rate,
  target,
  targetLabel,
  detailIcon,
  detailMain,
  detailSub
}: DevCardProps) {
  return (
    <div className="bg-white rounded-[20px] p-4 shadow-sm border border-purple-50 h-full flex flex-col">
      <div className="flex items-center gap-3 min-h-[52px]">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-[11px] leading-tight font-black uppercase tracking-wide text-gray-900">
          {title}
        </h3>
      </div>

      <div className="w-full h-px bg-gray-100 my-3" />

      <div className="flex-1 flex flex-col">
        <p className="text-[11px] text-gray-500 mb-2">{rateLabel}</p>

        <p className="text-[38px] leading-none font-black text-purple-700 mb-2">
          {rate}%
        </p>

        <ProgressBar value={Number(rate)} target={Number(target)} color="#6A1B9A" />

        <p className="text-[11px] text-gray-400 mt-2">{targetLabel}</p>

        <div className="mt-4 bg-purple-50 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm flex-shrink-0">
            {detailIcon}
          </div>

          <div className="leading-tight">
            <p className="text-sm font-black text-purple-800">{detailMain}</p>
            <p className="text-[11px] text-gray-500">{detailSub}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DevelopmentSection() {
  const [data, setData] = useState(
    developmentData as DevelopmentContent
  )

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/dashboard/development', {
          cache: 'no-store'
        })

        if (!res.ok) return

        const json = await res.json()

        if (json?.data) {
          setData(json.data)
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadData()
  }, [])

  const d = data

  return (
    <div className="w-full max-w-[1120px] mx-auto px-4 py-2 space-y-5">
      <div>
        <div className="flex items-center gap-4">
          <div
            className="w-[56px] h-[56px] rounded-2xl flex flex-col items-center justify-center text-white shadow-sm"
            style={{ backgroundColor: '#6A1B9A' }}
          >
            <span className="text-xl">📈</span>
            <span className="text-[6px] font-black tracking-wider mt-0.5">
              DEVELOPMENT
            </span>
          </div>

          <div>
            <h1 className="text-[36px] leading-none font-black text-purple-900">
              {d.title || 'Development'}
            </h1>
            <p className="text-[14px] text-gray-500 font-medium mt-1">
              {d.subtitle || 'Are We Growing Talent or Consuming Talent?'}
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-gray-200 mt-4" />
      </div>

      <div className="rounded-[24px] bg-[#f8effd] px-5 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-purple-200" />
          <p className="text-sm font-black tracking-[0.16em] text-purple-700 uppercase">
            Key Metrics
          </p>
          <div className="flex-1 h-px bg-purple-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          <DevCard
            icon="📊"
            title="Promotion Movement"
            rateLabel="Promotion Rate (YTD)"
            rate={Number(d.promotionRate)}
            target={Number(d.promotionTarget)}
            targetLabel={`vs Target ${d.promotionTarget}%`}
            detailIcon="📈"
            detailMain={`${d.promotionCount} Promotions`}
            detailSub={`out of ${d.totalEmployees} employees`}
          />

          <DevCard
            icon="🔁"
            title="Internal Mobility"
            rateLabel="Internal Mobility Rate (YTD)"
            rate={Number(d.internalMobilityRate)}
            target={Number(d.internalMobilityTarget)}
            targetLabel={`vs Target ${d.internalMobilityTarget}%`}
            detailIcon="👥"
            detailMain={`${d.internalMobilityCount} Employees`}
            detailSub="moved internally"
          />

          <DevCard
            icon="🎓"
            title="Development Participation"
            rateLabel="Learning Participation Rate (YTD)"
            rate={Number(d.learningParticipationRate)}
            target={Number(d.learningParticipationTarget)}
            targetLabel={`vs Target ${d.learningParticipationTarget}%`}
            detailIcon="📖"
            detailMain={`${d.avgCourses} Avg Courses`}
            detailSub="completed per employee"
          />
        </div>
      </div>

      <LeadershipSignal
        text={d.leadershipSignal}
        color="#6A1B9A"
        bgColor="#f5eeff"
        icon="📢"
      />
    </div>
  )
}