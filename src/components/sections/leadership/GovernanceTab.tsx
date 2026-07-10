'use client'

import { Fragment, useEffect, useState } from 'react'
import {
  Monitor,
  Users,
  MessagesSquare,
  AlertTriangle,
  Handshake,
  UserRound,
  CheckCircle2,
  Target,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  type LucideIcon
} from 'lucide-react'
import { governanceData } from '@/data/dashboardData'

const ORANGE = '#F58220'
const PALE = '#FDEEDD'
const NAVY = '#1B2A6B'

const STEP_COLORS = ['#1565C0', '#2E7D32', '#E8811C', '#C62828']
const STEP_ICONS: LucideIcon[] = [
  Monitor,
  Users,
  MessagesSquare,
  AlertTriangle
]

const BENEFIT_COLORS = ['#1565C0', '#2E7D32', '#E8811C', '#C62828']
const BENEFIT_ICONS: LucideIcon[] = [
  TrendingUp,
  ShieldCheck,
  Users,
  BarChart3
]

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

function SectionBanner({ text }: { text: string }) {
  return (
    <div
      className="px-6 py-4 text-white text-center text-xl md:text-2xl font-black uppercase tracking-wide"
      style={{ backgroundColor: ORANGE }}
    >
      {text}
    </div>
  )
}

function CheckList({
  items,
  color
}: {
  items: string[]
  color: string
}) {
  return (
    <ul className="space-y-2">
      {items.map((r, i) => (
        <li
          key={i}
          className="text-sm font-semibold text-gray-700 flex gap-2 items-start"
        >
          <CheckCircle2
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            style={{ color }}
            strokeWidth={2}
          />
          <span>{r}</span>
        </li>
      ))}
    </ul>
  )
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

  const cadence = data.cadence || []
  const benefits = data.benefits || []

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-black uppercase text-gray-900 tracking-tight">
          Governance Model
        </h2>

        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 max-w-xs flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          <p className="text-sm md:text-base font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">
            Monthly Leadership Workforce Review
          </p>

          <div className="flex-1 max-w-xs flex items-center">
            <div className="flex-1 h-px bg-gray-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
          </div>
        </div>
      </div>

      {/* Cadence */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <SectionBanner text={data.cadenceTitle || 'Cadence'} />

        <div className="bg-white p-5 flex flex-col md:flex-row items-stretch gap-2">
          {cadence.map((step, i) => {
            const color = STEP_COLORS[i % STEP_COLORS.length]
            const Icon = STEP_ICONS[i % STEP_ICONS.length]

            return (
              <Fragment key={`${step.step}-${i}`}>
                {i > 0 && (
                  <div className="flex items-center justify-center flex-shrink-0 py-2 md:py-0">
                    <ArrowRight className="w-6 h-6 text-gray-400 rotate-90 md:rotate-0" />
                  </div>
                )}

                <div className="flex-1 bg-[#F4F4F4] rounded-2xl p-4 relative">
                  <div
                    className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-black"
                    style={{ backgroundColor: color }}
                  >
                    {step.step}
                  </div>

                  <div className="flex items-center gap-3 pl-8">
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                      <Icon
                        className="w-8 h-8"
                        style={{ color }}
                        strokeWidth={1.75}
                      />
                    </div>

                    <p
                      className="text-sm font-black uppercase tracking-wide leading-tight"
                      style={{ color }}
                    >
                      {step.title}
                    </p>
                  </div>

                  <ul className="space-y-1.5 mt-4">
                    {normalizeBullets(step.bullets).map((bullet, j) => (
                      <li
                        key={j}
                        className="text-sm font-medium text-gray-700 flex gap-2"
                      >
                        <span className="text-gray-900 font-black leading-snug">
                          •
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>

      {/* Ownership */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <SectionBanner text={data.ownershipTitle || 'Ownership'} />

        <div className="bg-white p-6 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
          {/* PX */}
          <div className="flex items-start gap-5">
            <div className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 bg-[#1565C0]">
              <span className="text-white font-black text-3xl">PX</span>
            </div>

            <div>
              <p className="text-base md:text-lg font-black uppercase tracking-wide text-[#1565C0] mb-3">
                PX = Insight Generation
              </p>

              <CheckList
                items={normalizeResponsibility(data.pxResponsibilities)}
                color="#1565C0"
              />
            </div>
          </div>

          {/* Partnership */}
          <div className="flex items-center gap-3 justify-center">
            <div className="hidden lg:block w-10 h-px bg-gray-400" />

            <div className="flex flex-col items-center text-center gap-2">
              <div
                className="w-28 h-28 rounded-full border-[3px] flex items-center justify-center"
                style={{ borderColor: NAVY }}
              >
                <Handshake
                  className="w-12 h-12"
                  style={{ color: NAVY }}
                  strokeWidth={1.5}
                />
              </div>

              <p
                className="text-sm font-black uppercase tracking-wide leading-tight"
                style={{ color: NAVY }}
              >
                Partnership
                <br />
                For Outcomes
              </p>
            </div>

            <div className="hidden lg:block w-10 h-px bg-gray-400" />
          </div>

          {/* Leader */}
          <div className="flex items-start gap-5">
            <div className="flex-1">
              <p className="text-base md:text-lg font-black uppercase tracking-wide text-[#2E9E44] mb-3">
                Leader = Decision Ownership
              </p>

              <CheckList
                items={normalizeResponsibility(
                  data.leaderResponsibilities
                )}
                color="#2E9E44"
              />
            </div>

            <div className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 bg-[#2E9E44]">
              <UserRound
                className="w-12 h-12 text-white"
                strokeWidth={1.75}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div
        className="rounded-2xl px-6 py-5 flex flex-wrap items-center gap-5"
        style={{ backgroundColor: PALE }}
      >
        <div className="flex items-center gap-3">
          <Target
            className="w-14 h-14"
            style={{ color: ORANGE }}
            strokeWidth={1.75}
          />

          <span
            className="text-2xl md:text-3xl font-black uppercase tracking-wide"
            style={{ color: ORANGE }}
          >
            {data.benefitsTitle || 'Benefits'}
          </span>
        </div>

        {benefits.map((b, i) => {
          const color = BENEFIT_COLORS[i % BENEFIT_COLORS.length]
          const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length]
          const hasCustomIcon =
            b.icon && !/chart|search|people|growth|decision/i.test(b.icon)

          return (
            <Fragment key={i}>
              <div className="hidden md:block w-px self-stretch bg-gray-400/60" />

              <div className="flex items-center gap-3">
                {hasCustomIcon ? (
                  <span className="text-3xl" style={{ color }}>
                    {b.icon}
                  </span>
                ) : (
                  <Icon
                    className="w-10 h-10 flex-shrink-0"
                    style={{ color }}
                    strokeWidth={1.75}
                  />
                )}

                <p className="text-sm font-semibold text-gray-700 max-w-[170px] leading-snug">
                  {b.text}
                </p>
              </div>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
