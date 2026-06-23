'use client'

import { useEffect, useState } from 'react'
import { entryData } from '@/data/dashboardData'
import {
  KeyMetricsHeader,
  LeadershipSignal,
  StatusBadge,
  CircularProgress
} from '@/components/ui'

type EntryContent = {
  title?: string
  subtitle?: string
  joinersMonthly: number
  joinersQuarterly: number
  criticalRolesFilled: number
  criticalRolesTotal: number
  criticalRolesPct: number
  newHireStability: number
  onboardingCompletion: number
  leadershipSignal: string
}

export default function EntrySection() {
  const [data, setData] = useState<EntryContent>(
    entryData as EntryContent
  )

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/dashboard/entry', {
          cache: 'no-store'
        })

        if (!res.ok) return

        const json = await res.json()

        if (json?.data) {
          setData(json.data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    loadData()
  }, [])

  const d = data

  const cardClass =
    'bg-white rounded-2xl p-5 min-h-[320px] flex flex-col items-center text-center shadow-sm'

  const titleClass =
    'text-xs font-bold uppercase tracking-widest text-gray-400 leading-tight'

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <div
          className="w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white"
          style={{ backgroundColor: '#2E7D32' }}
        >
          <span className="text-2xl">🚪</span>
          <span className="text-[8px] font-black tracking-widest">
            ENTRY
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-green-800">
            {d.title || 'Entry'}
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            {d.subtitle || 'Hiring and onboarding metrics'}
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-gray-200" />

      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: '#f0faf0' }}
      >
        <KeyMetricsHeader />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
          {/* Joiners */}
          <div className={cardClass}>
            <div className="text-3xl">👥</div>

            <div className="mt-4 h-[44px] flex items-center justify-center">
              <p className={titleClass}>
                Joiners
                <br />
                (Monthly/Quarterly)
              </p>
            </div>

            <div className="w-8 h-px bg-gray-200 mt-3" />

            {/* FIX: remove mt-auto so content doesn't sink */}
            <div className="w-full mt-8 space-y-4">
              <div>
                <p className="text-xs text-gray-500">Monthly</p>
                <p className="text-3xl font-black text-green-700">
                  {d.joinersMonthly}
                </p>
              </div>

              <div className="w-full h-px bg-gray-100" />

              <div>
                <p className="text-xs text-gray-500">Quarterly</p>
                <p className="text-3xl font-black text-green-700">
                  {d.joinersQuarterly}
                </p>
              </div>
            </div>
          </div>

          {/* Critical Roles */}
          <div className={cardClass}>
            <div className="text-3xl">⭐</div>

            <div className="mt-4 h-[44px] flex items-center justify-center">
              <p className={titleClass}>
                Critical Roles Hiring Status
              </p>
            </div>

            <div className="w-8 h-px bg-gray-200 mt-3" />

            <div className="mt-5">
              <CircularProgress
                value={Number(d.criticalRolesPct)}
                size={80}
                color="#2E7D32"
                label={`${d.criticalRolesPct}%`}
              />
            </div>

            <p className="mt-4 text-xs text-green-700 font-bold">
              Filled
            </p>

            <p className="text-xs text-gray-500 px-2">
              {d.criticalRolesFilled} of {d.criticalRolesTotal} roles filled
            </p>

            <div className="mt-auto pt-5">
              <StatusBadge status="watchlist" />
            </div>
          </div>

          {/* Stability */}
          <div className={cardClass}>
            <div className="text-3xl">🛡️</div>

            <div className="mt-4 h-[44px] flex items-center justify-center">
              <p className={titleClass}>
                New Hire Stability
              </p>
            </div>

            <div className="w-8 h-px bg-gray-200 mt-3" />

            <p className="mt-6 text-4xl font-black text-green-700">
              {d.newHireStability}%
            </p>

            <p className="text-xs text-gray-500 px-2 mt-3">
              New hires retained beyond 3 months
            </p>

            <div className="mt-auto pt-5">
              <StatusBadge status="healthy" />
            </div>
          </div>

          {/* Onboarding */}
          <div className={cardClass}>
            <div className="text-3xl">📋</div>

            <div className="mt-4 h-[44px] flex items-center justify-center">
              <p className={titleClass}>
                Onboarding Completion
              </p>
            </div>

            <div className="w-8 h-px bg-gray-200 mt-3" />

            <p className="mt-6 text-4xl font-black text-green-700">
              {d.onboardingCompletion}%
            </p>

            <p className="text-xs text-gray-500 px-2 mt-3">
              Onboarding completed on time
            </p>

            <div className="mt-auto pt-5">
              <StatusBadge status="watchlist" />
            </div>
          </div>
        </div>
      </div>

      <LeadershipSignal
        text={d.leadershipSignal}
        color="#2E7D32"
        bgColor="#f0faf0"
        icon="📢"
      />
    </div>
  )
}