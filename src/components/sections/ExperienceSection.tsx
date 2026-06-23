'use client'

import { useEffect, useState } from 'react'
import { experienceData } from '@/data/dashboardData'
import {
  SectionPageHeader,
  KeyMetricsHeader,
  LeadershipSignal,
  DonutChart,
  CircularProgress,
  StatusBadge,
  SimpleHBar
} from '@/components/ui'

type MixItem = {
  label: string
  value: number
}

type ExperienceContent = {
  title?: string
  subtitle?: string
  totalHeadcount: number
  male?: number
  female?: number
  permanent?: number
  contract?: number
  other?: number
  averageTenure: number
  attendanceRate: number
  absenteeismRate: number
  leadershipSignal: string
  levelMix: MixItem[] | Record<string, number>
  tenureMix: MixItem[] | Record<string, number>
}

function normalizeLevelMix(
  mix: MixItem[] | Record<string, number> | undefined
): MixItem[] {
  if (!mix) return []
  if (Array.isArray(mix)) return mix

  return Object.entries(mix).map(([label, value]) => ({
    label:
      label === 'AssistantManager'
        ? 'Assistant Manager'
        : label,
    value
  }))
}

function normalizeTenureMix(
  mix: MixItem[] | Record<string, number> | undefined
): MixItem[] {
  if (!mix) return []
  if (Array.isArray(mix)) return mix

  const mapper: Record<string, string> = {
    lt1: '< 1 Year',
    yr1to3: '1 – 3 Years',
    yr3to5: '3 – 5 Years',
    gt5: '> 5 Years'
  }

  return Object.entries(mix).map(([label, value]) => ({
    label: mapper[label] || label,
    value
  }))
}

export default function ExperienceSection() {
  const [data, setData] = useState(
    experienceData as unknown as ExperienceContent
  )

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/dashboard/experience', {
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

  const levelMix = normalizeLevelMix(d.levelMix)
  const tenureMix = normalizeTenureMix(d.tenureMix)

  const male = d.male ?? 0
  const female = d.female ?? 0
  const permanent = d.permanent ?? 0
  const contract = d.contract ?? 0
  const other = d.other ?? 0

  const cardClass =
    'bg-white rounded-3xl p-4 shadow-sm min-h-[320px] flex flex-col'

  return (
    <div className="w-full max-w-[1120px] mx-auto px-4 py-2">
      <SectionPageHeader
        icon="👥"
        title={d.title || 'Experience'}
        subtitle={d.subtitle || 'What Is The Current Team Condition'}
        accentColor="text-blue-700"
        badgeBg="bg-blue-600"
        badgeText="EXPERIENCE"
      />

      <div className="bg-blue-50 rounded-3xl p-5 border border-blue-100">
        <KeyMetricsHeader color="#2563EB" />

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {/* Gender */}
          <div className={cardClass}>
            <h3 className="text-sm font-black text-blue-600 uppercase mb-3 text-center">
              Gender Mix
            </h3>

            <div className="flex justify-center">
              <DonutChart
                size={84}
                segments={[
                  { value: male, color: '#2563EB' },
                  { value: female, color: '#EC4899' }
                ]}
              />
            </div>

            <div className="mt-3 space-y-1 text-sm">
              <p>🔵 Male {male}%</p>
              <p>🩷 Female {female}%</p>
            </div>

            <div className="border-t mt-auto pt-3 text-center">
              <p className="text-xs text-gray-500">Total Headcount</p>
              <p className="text-3xl font-black text-gray-700">
                {d.totalHeadcount}
              </p>
            </div>
          </div>

          {/* Employment */}
          <div className={cardClass}>
            <h3 className="text-sm font-black text-blue-600 uppercase mb-3 text-center">
              Employment Status
            </h3>

            <div className="flex justify-center">
              <DonutChart
                size={84}
                segments={[
                  { value: permanent, color: '#2563EB' },
                  { value: contract, color: '#60A5FA' },
                  { value: other, color: '#BFDBFE' }
                ]}
              />
            </div>

            <div className="mt-3 space-y-1 text-sm">
              <p>🔵 Permanent {permanent}%</p>
              <p>🔷 Contract {contract}%</p>
              <p>🔹 Other {other}%</p>
            </div>

            <div className="border-t mt-auto pt-3 text-center">
              <p className="text-xs text-gray-500">Total Headcount</p>
              <p className="text-3xl font-black text-gray-700">
                {d.totalHeadcount}
              </p>
            </div>
          </div>

          {/* Level */}
          <div className={cardClass}>
            <h3 className="text-sm font-black text-blue-600 uppercase mb-3 text-center">
              Level Mix
            </h3>

            <div className="space-y-2">
              {levelMix.map(item => (
                <SimpleHBar
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  max={100}
                  color="#2563EB"
                />
              ))}
            </div>

            <div className="border-t mt-auto pt-3 text-center">
              <p className="text-xs text-gray-500">Total Headcount</p>
              <p className="text-3xl font-black text-gray-700">
                {d.totalHeadcount}
              </p>
            </div>
          </div>

          {/* Tenure */}
          <div className={cardClass}>
            <h3 className="text-sm font-black text-blue-600 uppercase mb-3 text-center">
              Tenure Mix
            </h3>

            <div className="space-y-2">
              {tenureMix.map(item => (
                <SimpleHBar
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  max={100}
                  color="#2563EB"
                />
              ))}
            </div>

            <div className="border-t mt-auto pt-3 text-center">
              <p className="text-xs text-gray-500">Average Tenure</p>
              <p className="text-3xl font-black text-gray-700">
                {d.averageTenure}
                <span className="text-sm ml-1 font-medium">Years</span>
              </p>
            </div>
          </div>

          {/* Attendance */}
          <div className={cardClass}>
            <h3 className="text-sm font-black text-blue-600 uppercase mb-3 text-center">
              Attendance
            </h3>

            <div className="flex justify-center mt-4">
              <CircularProgress
                value={Number(d.attendanceRate)}
                color="#F59E0B"
                label={`${d.attendanceRate}%`}
              />
            </div>

            <p className="text-sm text-gray-500 mt-auto text-center">
              Attendance Rate
            </p>

            <div className="mt-3 flex justify-center">
              <StatusBadge status="watchlist" />
            </div>
          </div>

          {/* Absenteeism */}
          <div className={cardClass}>
            <h3 className="text-sm font-black text-blue-600 uppercase mb-3 text-center">
              Absenteeism
            </h3>

            <div className="flex justify-center mt-4">
              <CircularProgress
                value={Number(d.absenteeismRate)}
                color="#2563EB"
                label={`${d.absenteeismRate}%`}
              />
            </div>

            <p className="text-sm text-gray-500 mt-auto text-center">
              Absenteeism Rate
            </p>

            <div className="mt-3 flex justify-center">
              <StatusBadge status="healthy" />
            </div>
          </div>
        </div>
      </div>

      <LeadershipSignal
        text={d.leadershipSignal}
        color="#2563EB"
        bgColor="#EEF4FF"
        icon="📢"
      />
    </div>
  )
}