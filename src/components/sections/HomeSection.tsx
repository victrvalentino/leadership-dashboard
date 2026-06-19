'use client'
import { TrendingUp, Target } from 'lucide-react'

type Page =
  | 'home'
  | 'executive'
  | 'entry'
  | 'experience'
  | 'development'
  | 'turnover'
  | 'exit'
  | 'cost'
  | 'leadership'

const LIFECYCLE_CARDS = [
  {
    id: 'entry' as Page,
    label: 'ENTRY',
    icon: '🚪',
    color: '#2E7D32',
    bg: '#f0faf0',
    border: '#2E7D32',
    subtitle: 'Hiring & Onboarding Visibility',
  },
  {
    id: 'experience' as Page,
    label: 'EXPERIENCE',
    icon: '👥',
    color: '#1565C0',
    bg: '#e8f0fe',
    border: '#1565C0',
    subtitle: 'Team & Workforce Health',
  },
  {
    id: 'development' as Page,
    label: 'DEVELOPMENT',
    icon: '📊',
    color: '#6A1B9A',
    bg: '#f5eeff',
    border: '#6A1B9A',
    subtitle: 'Growth & Capability Building',
  },
  {
    id: 'turnover' as Page,
    label: 'TURN OVER',
    icon: '🔄',
    color: '#E65100',
    bg: '#fff3e0',
    border: '#E65100',
    subtitle: 'Workforce Continuity & Replacement Risk',
  },
  {
    id: 'exit' as Page,
    label: 'EXIT',
    icon: '📤',
    color: '#C62828',
    bg: '#fde8e8',
    border: '#C62828',
    subtitle: 'Exit Intelligence & Key Reasons',
  },
  {
    id: 'cost' as Page,
    label: 'COST',
    icon: '💰',
    color: '#00695C',
    bg: '#e0f2f1',
    border: '#00695C',
    subtitle: 'People Cost & Investment',
  },
]

export default function HomeSection({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight uppercase">
          One Leadership Dashboard
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 max-w-xs h-px bg-gray-300" />
          <p className="text-base font-semibold text-gray-600">People Experience Directorate</p>
          <div className="flex-1 max-w-xs h-px bg-gray-300" />
        </div>
      </div>

      {/* Executive Snapshot Banner */}
      <button
        onClick={() => onNavigate('executive')}
        className="w-full rounded-2xl p-6 flex items-center justify-between gap-4 hover:shadow-lg transition-all cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #e8f0fe 0%, #dbeafe 100%)', border: '1px solid #bfdbfe' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-800 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
            📋
          </div>
          <div className="text-left">
            <h2 className="text-xl font-black text-indigo-800 uppercase tracking-wide">Executive Snapshot</h2>
            <p className="text-sm text-indigo-600 font-medium">(a quick leadership view about the workforce condition)</p>
          </div>
        </div>
        <TrendingUp className="w-12 h-12 text-indigo-700 flex-shrink-0 hidden sm:block" />
      </button>

      {/* Lifecycle Intelligence */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-300" />
          <h2 className="text-base font-black tracking-widest uppercase text-gray-700">Lifecycle Intelligence</h2>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {LIFECYCLE_CARDS.map((card) => (
            <button
              key={card.id}
              onClick={() => onNavigate(card.id)}
              className="rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer text-center border"
              style={{ backgroundColor: '#fff', borderColor: '#e5e7eb' }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: card.bg }}
              >
                {card.icon}
              </div>
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: card.color }}>
                {card.label}
              </span>
              <div className="w-8 h-0.5 rounded" style={{ backgroundColor: card.color }} />
              <p className="text-xs text-gray-500 leading-tight">{card.subtitle}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Leadership Action Focus */}
      <button
        onClick={() => onNavigate('leadership')}
        className="w-full rounded-2xl p-6 flex items-center justify-between gap-4 hover:shadow-lg transition-all cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #fff8e1 0%, #fffde7 100%)', border: '1px solid #fde68a' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
            📋
          </div>
          <div className="text-left">
            <h2 className="text-xl font-black text-amber-600 uppercase tracking-wide">Leadership Action Focus</h2>
            <p className="text-sm text-amber-500 font-medium">(What needs intervention now)</p>
          </div>
        </div>
        <Target className="w-12 h-12 text-amber-500 flex-shrink-0 hidden sm:block" />
      </button>
    </div>
  )
}
