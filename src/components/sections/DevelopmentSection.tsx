'use client'

import { useEffect, useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  Repeat,
  GraduationCap,
  Users,
  BookOpen,
  Megaphone,
  CalendarDays,
  type LucideIcon
} from 'lucide-react'
import { developmentData } from '@/data/dashboardData'

const PURPLE = '#6B21A8'
const PURPLE_BRIGHT = '#7C3AED'
const PURPLE_DEEP = '#4A21A8'

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

function TargetBar({
  value,
  target,
  targetLabel
}: {
  value: number
  target: number
  targetLabel: string
}) {
  const scale = Math.max(value, target, 1) * 1.3
  const fill = Math.min((value / scale) * 100, 100)
  const marker = Math.min((target / scale) * 100, 100)

  return (
    <div className="flex-1 min-w-0">
      <div className="relative pt-3">
        {/* target triangle */}
        <div
          className="absolute top-0 -translate-x-1/2 w-0 h-0"
          style={{
            left: `${marker}%`,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `8px solid ${PURPLE_BRIGHT}`
          }}
        />

        <div className="relative h-3 bg-gray-200 rounded-full">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${fill}%`,
              backgroundColor: PURPLE_BRIGHT
            }}
          />

          {/* target tick */}
          <div
            className="absolute -top-0.5 -bottom-0.5 w-[3px] -translate-x-1/2 rounded"
            style={{
              left: `${marker}%`,
              backgroundColor: '#374151'
            }}
          />
        </div>
      </div>

      <p className="text-xs font-semibold text-gray-500 mt-2 text-right">
        {targetLabel}
      </p>
    </div>
  )
}

interface DevCardProps {
  Icon: LucideIcon
  title: string
  rateLabel: string
  rate: number
  target: number
  DetailIcon: LucideIcon
  detailMain: string
  detailSub: string
}

function DevCard({
  Icon,
  title,
  rateLabel,
  rate,
  target,
  DetailIcon,
  detailMain,
  detailSub
}: DevCardProps) {
  return (
    <div className="panel-gradient rounded-[20px] p-5 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-4 min-h-[72px]">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 icon-gradient shadow-badge"
          style={{ backgroundColor: '#F3E8FA' }}
        >
          <Icon
            className="w-8 h-8"
            style={{ color: PURPLE_BRIGHT }}
            strokeWidth={1.5}
          />
        </div>

        <h3 className="text-base leading-snug font-bold uppercase tracking-wide text-gray-600">
          {title}
        </h3>
      </div>

      <div className="w-full h-px bg-gray-200 my-4" />

      <div className="flex-1 flex flex-col">
        <p className="text-sm font-semibold text-gray-500 text-center mb-4">
          {rateLabel}
        </p>

        <div className="flex items-center gap-4">
          <p
            className="text-4xl leading-none font-black flex-shrink-0"
            style={{ color: PURPLE_DEEP }}
          >
            {rate}%
          </p>

          <TargetBar
            value={Number(rate)}
            target={Number(target)}
            targetLabel={`vs Target ${target}%`}
          />
        </div>

        <div
          className="mt-auto pt-5"
        >
          <div
            className="rounded-2xl p-4 flex items-center gap-4"
            style={{ backgroundColor: '#F8EFFC' }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 bg-white icon-gradient shadow-soft"
              style={{ border: `2px solid ${PURPLE_BRIGHT}55` }}
            >
              <DetailIcon
                className="w-7 h-7"
                style={{ color: PURPLE_BRIGHT }}
                strokeWidth={1.75}
              />
            </div>

            <div className="leading-tight">
              <p
                className="text-lg font-black"
                style={{ color: PURPLE_DEEP }}
              >
                {detailMain}
              </p>
              <p className="text-sm font-semibold text-gray-500">
                {detailSub}
              </p>
            </div>
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
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 flex-shrink-0 icon-gradient shadow-badge"
            style={{ backgroundColor: PURPLE_DEEP }}
          >
            <BarChart3 className="w-8 h-8 text-white" strokeWidth={1.75} />
            <span className="text-[8px] font-black tracking-wider text-white">
              DEVELOPMENT
            </span>
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight uppercase">
              {d.title || 'Development'}
            </h1>
            <p className="text-gray-500 font-medium mt-1.5">
              {d.subtitle || 'Learning and growth metrics'}
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
        className="w-full h-px mt-6"
        style={{ backgroundColor: PURPLE }}
      />
      </div>

      {/* Key metrics */}
      <div className="rounded-[24px] panel-gradient border border-gray-100 shadow-soft px-5 py-6">
        <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-800 mb-6">
          Key Metrics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          <DevCard
            Icon={TrendingUp}
            title="Promotion Movement"
            rateLabel="Promotion Rate (YTD)"
            rate={Number(d.promotionRate)}
            target={Number(d.promotionTarget)}
            DetailIcon={BarChart3}
            detailMain={`${d.promotionCount} Promotions`}
            detailSub={`out of ${d.totalEmployees} employees`}
          />

          <DevCard
            Icon={Repeat}
            title="Internal Mobility"
            rateLabel="Internal Mobility Rate (YTD)"
            rate={Number(d.internalMobilityRate)}
            target={Number(d.internalMobilityTarget)}
            DetailIcon={Users}
            detailMain={`${d.internalMobilityCount} Employees`}
            detailSub="moved internally"
          />

          <DevCard
            Icon={GraduationCap}
            title="Development Participation"
            rateLabel="Learning Participation Rate (YTD)"
            rate={Number(d.learningParticipationRate)}
            target={Number(d.learningParticipationTarget)}
            DetailIcon={BookOpen}
            detailMain={`${d.avgCourses} Avg Courses`}
            detailSub="completed per employee"
          />
        </div>
      </div>

      <div
        className="rounded-2xl px-6 py-5 flex items-center gap-4"
        style={{ backgroundColor: '#F8EFFC' }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 icon-gradient shadow-soft"
          style={{ backgroundColor: PURPLE_DEEP }}
        >
          <Megaphone className="w-6 h-6 text-white" strokeWidth={1.75} />
        </div>

        <div className="flex-1">
          <p
            className="text-sm font-extrabold uppercase tracking-wide"
            style={{ color: PURPLE_DEEP }}
          >
            Leadership Signal
          </p>
          <p className="text-sm text-gray-600 mt-0.5">{d.leadershipSignal}</p>
        </div>
      </div>
    </div>
  )
}
