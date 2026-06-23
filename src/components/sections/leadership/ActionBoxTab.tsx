'use client'

import { useEffect, useState } from 'react'
import { actionBoxData } from '@/data/dashboardData'

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

function getActionIcon(number: number | string) {
  const n = Number(number)

  if (n === 1) return '🛡️'
  if (n === 2) return '👥'
  if (n === 3) return '🤝'
  if (n === 4) return '📈'
  if (n === 5) return '🔄'

  return '🎯'
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
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black uppercase text-gray-900">
          Leadership Action Box
        </h2>

        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 max-w-xs h-px bg-gray-300" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            What Requires Immediate Action
          </p>
          <div className="flex-1 max-w-xs h-px bg-gray-300" />
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-sm border border-orange-100 bg-white">
        {/* Header */}
        <div
          className="flex items-center gap-4 px-6 py-5 text-white"
          style={{ backgroundColor: '#E65100' }}
        >
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl">
            🎯
          </div>

          <div>
            <p className="font-black uppercase tracking-widest text-lg">
              {data.headerTitle}
            </p>

            <p className="text-sm text-orange-100">
              {data.subtitle}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="divide-y divide-gray-100">
          {(data.items || []).map((item) => (
            <div
              key={item.number}
              className="flex items-center gap-5 px-6 py-5"
            >
              {/* Icon Badge */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                style={{
                  backgroundColor: getBadgeBg(item.number),
                }}
              >
                {getActionIcon(item.number)}
              </div>

              {/* Text */}
              <div
                className="border-l-2 pl-4 flex-1"
                style={{ borderColor: item.color }}
              >
                <p
                  className="text-sm md:text-lg font-black uppercase leading-tight"
                  style={{ color: item.color }}
                >
                  {Number(item.number)}. {item.title}
                </p>

                <p className="text-sm md:text-base text-gray-600 mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}