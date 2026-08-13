'use client'

import { useEffect, useState } from 'react'
import {
  Target,
  ShieldCheck,
  Network,
  MessagesSquare,
  TrendingUp,
  RefreshCw,
  type LucideIcon
} from 'lucide-react'
import { actionBoxData } from '@/data/dashboardData'

const ORANGE = '#F58220'
const PALE = '#FFFCF9'

type ActionItem = {
  number: number | string
  title: string
  description: string
  color: string
  bgColor: string
}

type ActionContent = {
  headerTitle?: string
  subtitle?: string
  items?: ActionItem[]
}

function getActionIcon(number: number | string): LucideIcon {
  const n = Number(number)

  if (n === 1) return ShieldCheck
  if (n === 2) return Network
  if (n === 3) return MessagesSquare
  if (n === 4) return TrendingUp
  if (n === 5) return RefreshCw

  return Target
}

function getBadgeBg(number: number | string) {
  const n = Number(number)

  if (n === 1) return '#E8F0FE' // blue
  if (n === 2) return '#EAF7EA' // green
  if (n === 3) return '#FFF6E5' // yellow
  if (n === 4) return '#F5ECFF' // purple
  if (n === 5) return '#FDECEC' // red

  return '#FFF1E6'
}

export default function ActionBoxTab() {
  const [data, setData] = useState<ActionContent>({
    headerTitle: 'Recommended Leadership Focus',
    subtitle:
      'Prioritized action strengthen workforce health and reduce business risk',
    items: actionBoxData,
  })

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/dashboard/actionBox', {
          cache: 'no-store',
        })

        if (!res.ok) return

        const json = await res.json()

        if (json?.data) {
          setData((prev) => ({
            ...prev,
            ...json.data,
            items: json.data.items?.length
              ? json.data.items
              : prev.items,
          }))
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadData()
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-extrabold uppercase text-gray-900 tracking-tight">
          Leadership Action Box
        </h2>

        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 max-w-xs flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          <p className="text-sm md:text-base font-extrabold uppercase tracking-widest text-gray-500 whitespace-nowrap">
            What Requires Immediate Action
          </p>

          <div className="flex-1 max-w-xs flex items-center">
            <div className="flex-1 h-px bg-gray-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
          </div>
        </div>
      </div>

      {/* Outer panel */}
      <div
        className="rounded-2xl p-4"
        style={{ backgroundColor: PALE }}
      >
        <div className="rounded-2xl overflow-hidden shadow-soft panel-gradient border border-gray-100">
          {/* Header banner */}
          <div
            className="flex items-center gap-5 px-6 py-5 text-white rounded-t-2xl"
            style={{ backgroundColor: ORANGE }}
          >
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center flex-shrink-0 icon-gradient shadow-badge">
              <Target
                className="w-10 h-10"
                style={{ color: ORANGE }}
                strokeWidth={1.75}
              />
            </div>

            <div>
              <p className="font-extrabold uppercase tracking-wide text-xl md:text-2xl">
                {data.headerTitle}
              </p>

              <p className="text-sm md:text-base font-bold text-white/95 mt-1">
                {data.subtitle}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="divide-y divide-gray-200">
            {(data.items || []).map((item) => {
              const Icon = getActionIcon(item.number)

              return (
                <div
                  key={item.number}
                  className="flex items-center gap-5 px-6 py-5"
                >
                  {/* Icon badge */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 icon-gradient shadow-soft"
                    style={{
                      backgroundColor:
                        item.bgColor || getBadgeBg(item.number),
                    }}
                  >
                    <Icon
                      className="w-8 h-8"
                      style={{ color: item.color }}
                      strokeWidth={1.75}
                    />
                  </div>

                  <div className="w-px self-stretch bg-gray-300" />

                  {/* Text */}
                  <div className="flex-1">
                    <p
                      className="text-base md:text-xl font-extrabold uppercase leading-tight"
                      style={{ color: item.color }}
                    >
                      {Number(item.number)}. {item.title}
                    </p>

                    <p className="text-sm md:text-base font-semibold text-gray-500 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
