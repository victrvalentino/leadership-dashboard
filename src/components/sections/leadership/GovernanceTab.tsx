'use client'

import { useEffect, useState } from 'react'
import { governanceData } from '@/data/dashboardData'

type Benefit = {
  icon: string
  text: string
}

type CadenceStep = {
  step: string | number
  title: string
  bullets: string[] | string
}

type GovernanceContent = {
  cadenceTitle?: string
  ownershipTitle?: string
  benefitsTitle?: string
  cadence?: CadenceStep[]
  pxResponsibilities?: { text: string }[] | string[]
  leaderResponsibilities?: { text: string }[] | string[]
  benefits?: Benefit[]
}

function normalizeBullets(
  bullets: string[] | string | undefined
): string[] {
  if (!bullets) return []
  if (Array.isArray(bullets)) return bullets
  return bullets
    .split('|')
    .map((x) => x.trim())
    .filter(Boolean)
}

function normalizeResponsibility(
  arr: { text: string }[] | string[] | undefined
): string[] {
  if (!arr) return []
  return arr.map((item) =>
    typeof item === 'string' ? item : item.text
  )
}

function getBenefitIcon(icon?: string) {
  if (!icon) return '🎯'

  const i = icon.toLowerCase()

  if (i.includes('chart')) return '📊'
  if (i.includes('search')) return '🔍'
  if (i.includes('people')) return '👥'
  if (i.includes('growth')) return '📈'
  if (i.includes('decision')) return '📈'

  return icon
}

export default function GovernanceTab() {
  const [data, setData] = useState<GovernanceContent>({
    cadenceTitle: 'Cadence',
    ownershipTitle: 'Ownership',
    benefitsTitle: 'Benefits',
    cadence: governanceData.cadence,
    pxResponsibilities: governanceData.pxResponsibilities,
    leaderResponsibilities: governanceData.leaderResponsibilities,
    benefits: governanceData.benefits,
  })

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/dashboard/governance', {
          cache: 'no-store',
        })

        if (!res.ok) return

        const json = await res.json()

        if (json?.data) {
          setData((prev) => ({
            ...prev,
            ...json.data,
            cadence:
              json.data.cadence?.length
                ? json.data.cadence
                : prev.cadence,
            pxResponsibilities:
              json.data.pxResponsibilities?.length
                ? json.data.pxResponsibilities
                : prev.pxResponsibilities,
            leaderResponsibilities:
              json.data.leaderResponsibilities?.length
                ? json.data.leaderResponsibilities
                : prev.leaderResponsibilities,
            benefits:
              json.data.benefits?.length
                ? json.data.benefits
                : prev.benefits,
          }))
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadData()
  }, [])

  const stepColors = ['#1565C0', '#2E7D32', '#E65100', '#C62828']

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black uppercase text-gray-900">
          Governance Model
        </h2>

        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 max-w-xs h-px bg-gray-300" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Monthly Leadership Workforce Review
          </p>
          <div className="flex-1 max-w-xs h-px bg-gray-300" />
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-sm border border-orange-100">
        <div
          className="px-6 py-3 text-white text-center font-black uppercase tracking-widest"
          style={{ backgroundColor: '#E65100' }}
        >
          {data.cadenceTitle}
        </div>

        <div className="bg-white p-5 grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {(data.cadence || []).map((step, i) => (
            <div key={String(step.step)} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black"
                  style={{
                    backgroundColor:
                      stepColors[i] || '#999',
                  }}
                >
                  {step.step}
                </div>

                <p
                  className="text-xs font-black uppercase tracking-wider"
                  style={{
                    color: stepColors[i] || '#333',
                  }}
                >
                  {step.title}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex-1">
                <ul className="space-y-1.5">
                  {normalizeBullets(step.bullets).map(
                    (bullet, j) => (
                      <li
                        key={j}
                        className="text-xs text-gray-600 flex gap-1.5"
                      >
                        <span className="text-gray-400 mt-0.5">
                          •
                        </span>
                        <span>{bullet}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-sm border border-orange-100">
        <div
          className="px-6 py-3 text-white text-center font-black uppercase tracking-widest"
          style={{ backgroundColor: '#E65100' }}
        >
          {data.ownershipTitle}
        </div>

        <div className="bg-white p-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-full bg-blue-800 flex items-center justify-center text-white font-black text-lg">
              PX
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-blue-800 mb-2">
                PX = Insight Generation
              </p>

              <ul className="space-y-1">
                {normalizeResponsibility(
                  data.pxResponsibilities
                ).map((r, i) => (
                  <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                    <span className="text-blue-600">✓</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-gray-400 flex items-center justify-center text-3xl">
              🤝
            </div>

            <p className="text-xs font-black uppercase tracking-widest text-gray-500">
              Partnership
              <br />
              For Outcomes
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-white text-3xl">
              👤
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-green-700 mb-2">
                Leader = Decision Ownership
              </p>

              <ul className="space-y-1">
                {normalizeResponsibility(
                  data.leaderResponsibilities
                ).map((r, i) => (
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

      <div className="rounded-2xl p-4 flex flex-wrap items-center gap-6 bg-orange-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-lg">
            🎯
          </div>

          <span className="text-sm font-black uppercase tracking-wider text-orange-700">
            {data.benefitsTitle}
          </span>
        </div>

        {(data.benefits || []).map((b, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-lg">
              {getBenefitIcon(b.icon)}
            </div>

            <p className="text-xs text-gray-700 max-w-[120px]">
              {b.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}