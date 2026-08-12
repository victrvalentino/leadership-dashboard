'use client'
import { clsx } from 'clsx'
import { ArrowUpRight, ArrowDownRight, Home } from 'lucide-react'
import React from 'react'

// ── Status Badge ─────────────────────────────────────────────────────────────
type StatusType = 'healthy' | 'watchlist' | 'high' | 'medium' | 'low'

const STATUS_CONFIG: Record<StatusType, { label: string; className: string }> = {
  healthy: { label: 'Healthy', className: 'bg-green-100 text-green-800 border border-green-300' },
  watchlist: { label: 'Watchlist', className: 'bg-amber-400 text-white' },
  high: { label: 'HIGH', className: 'bg-red-600 text-white' },
  medium: { label: 'MEDIUM', className: 'bg-amber-500 text-white' },
  low: { label: 'LOW', className: 'bg-green-500 text-white' },
}

export function StatusBadge({ status }: { status: StatusType }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={clsx('px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm', cfg.className)}>
      {cfg.label}
    </span>
  )
}

// ── Risk Dot ─────────────────────────────────────────────────────────────────
const RISK_DOT: Record<string, string> = {
  high: 'bg-red-600',
  medium: 'bg-amber-500',
  low: 'bg-green-500',
}

export function RiskDot({ level }: { level: string }) {
  return <span className={clsx('inline-block w-3.5 h-3.5 rounded-full', RISK_DOT[level] ?? 'bg-gray-300')} />
}

// ── Trend Arrow ──────────────────────────────────────────────────────────────
export function TrendArrow({ up }: { up: boolean }) {
  return up
    ? <ArrowUpRight className="inline w-4 h-4 text-red-500" />
    : <ArrowDownRight className="inline w-4 h-4 text-green-500" />
}

// ── Section Header ───────────────────────────────────────────────────────────
interface SectionHeaderProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  accentColor: string
  badgeBg: string
  badgeText: string
}

export function SectionPageHeader({
  icon,
  title,
  subtitle,
  accentColor,
  badgeBg,
  badgeText
}: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-5">
        <div className={clsx(
          'w-[88px] h-[88px] rounded-[26px] flex flex-col items-center justify-center gap-1 text-white flex-shrink-0 icon-gradient shadow-badge',
          badgeBg
        )}>
          <div className="w-11 h-11 rounded-full border-[1.5px] border-white/60 flex items-center justify-center">
            <div className="text-xl leading-none">{icon}</div>
          </div>
          <span className="text-[8.5px] font-extrabold tracking-[0.14em]">{badgeText}</span>
        </div>

        <div>
          <h1 className={clsx('text-[34px] md:text-[40px] leading-[1.05] font-extrabold tracking-tight', accentColor)}>
            {title}
          </h1>
          <p className="text-gray-500 text-[15px] font-semibold mt-1.5">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="w-full h-px mt-6 bg-gradient-to-r from-gray-200 via-gray-200 to-transparent" />
    </div>
  )
}

// ── Key Metrics Header ───────────────────────────────────────────────────────
export function KeyMetricsHeader({ color = '#374151' }: { color?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex-1 h-px bg-gray-200" />
      <span
        className="text-[13px] font-extrabold tracking-[0.18em] uppercase px-2"
        style={{ color }}
      >
        Key Metrics
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  )
}

// ── Leadership Signal ────────────────────────────────────────────────────────
interface LeadershipSignalProps {
  text: string
  color?: string
  bgColor?: string
  label?: string
  icon?: React.ReactNode
}

export function LeadershipSignal({
  text,
  color = '#1565C0',
  bgColor = '#f0f9ff',
  label = 'LEADERSHIP SIGNAL',
  icon,
}: LeadershipSignalProps) {
  return (
    <div
      className="rounded-2xl p-5 flex items-start gap-4 mt-4 shadow-soft"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xl icon-gradient shadow-soft"
        style={{ backgroundColor: color }}
      >
        {icon ?? '📢'}
      </div>

      <div className="border-l-2 pl-4" style={{ borderColor: `${color}33` }}>
        <p
          className="text-[11px] font-extrabold tracking-[0.16em] uppercase mb-1"
          style={{ color }}
        >
          {label}
        </p>

        <p className="text-[14px] text-gray-700 leading-relaxed font-medium">{text}</p>
      </div>
    </div>
  )
}

// ── Metric Card ──────────────────────────────────────────────────────────────
interface MetricCardProps {
  label: string
  value: string | number
  subValue?: string
  status?: StatusType
  bgColor?: string
  children?: React.ReactNode
}

export function MetricCard({
  label,
  value,
  subValue,
  status,
  bgColor = 'bg-white',
  children
}: MetricCardProps) {
  return (
    <div className={clsx(
      'rounded-3xl p-4 shadow-soft border border-gray-100 flex flex-col items-center text-center gap-2 h-full min-h-[320px] transition-shadow hover:shadow-elevated',
      bgColor
    )}>
      {children}

      <p className="text-[11px] font-extrabold tracking-widest text-gray-400 uppercase">
        {label}
      </p>

      <div className="w-12 h-px bg-gray-200" />

      <p className="text-3xl font-extrabold text-gray-700">{value}</p>

      {subValue && (
        <p className="text-xs text-gray-400 font-medium">{subValue}</p>
      )}

      {status && <StatusBadge status={status} />}
    </div>
  )
}

// ── Icon Badge (shared circular icon used inside metric cards) ──────────────
export function IconBadge({
  children,
  color = '#2563EB',
}: {
  children: React.ReactNode
  color?: string
}) {
  return (
    <div className="flex justify-center mb-2">
      <div
        className="w-14 h-14 rounded-full border-2 bg-white flex items-center justify-center icon-gradient shadow-soft"
        style={{ borderColor: `${color}33`, color }}
      >
        {children}
      </div>
    </div>
  )
}

// ── Home Button ──────────────────────────────────────────────────────────────
export function HomeButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-12 h-12 bg-indigo-800 text-white rounded-xl icon-gradient shadow-badge flex items-center justify-center hover:bg-indigo-900 transition-all z-50"
      aria-label="Go to home"
    >
      <Home className="w-5 h-5" />
    </button>
  )
}

// ── Progress Bar ─────────────────────────────────────────────────────────────
export function ProgressBar({
  value,
  target,
  color = '#6A1B9A',
}: {
  value: number
  target: number
  color?: string
}) {
  const pct = Math.min(Number(value), 100)
  const tpct = Math.min(Number(target), 100)

  return (
    <div className="relative w-full h-3 bg-gray-200 rounded-full mt-2">
      <div
        className="h-3 rounded-full"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />

      <div
        className="absolute top-0 h-3 flex flex-col items-center"
        style={{ left: `${tpct}%`, transform: 'translateX(-50%)' }}
      >
        <div
          className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent"
          style={{ borderTopColor: color }}
        />
      </div>
    </div>
  )
}

// ── Circular Progress ────────────────────────────────────────────────────────
export function CircularProgress({
  value,
  size = 80,
  color = '#2E7D32',
  strokeWidth = 8,
  label,
}: {
  value: number
  size?: number
  color?: string
  strokeWidth?: number
  label?: string
}) {
  const numericValue = Number(value)
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const dash = (numericValue / 100) * circ

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>

      <span className="absolute text-sm font-black" style={{ color }}>
        {label ?? `${numericValue}%`}
      </span>
    </div>
  )
}

// ── Donut Chart (FIXED) ─────────────────────────────────────────────────────
export function DonutChart({
  segments,
  size = 100,
  center,
}: {
  segments: { value: number | string; color: string }[]
  size?: number
  center?: React.ReactNode
}) {
  const normalized = segments.map(seg => ({
    ...seg,
    value: Number(seg.value) || 0
  }))

  const total = normalized.reduce((s, x) => s + x.value, 0)

  if (total <= 0) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-full bg-gray-200"
      />
    )
  }

  const cx = size / 2
  const cy = size / 2
  const r = size * 0.38
  const iR = size * 0.24

  let cumAngle = -Math.PI / 2

  // An SVG arc spanning a full 360° has identical start/end points and
  // renders as nothing, so cap any slice just below a full circle.
  const FULL = 2 * Math.PI - 0.0001

  const slices = normalized.map((seg) => {
    const angle = Math.min((seg.value / total) * 2 * Math.PI, FULL)

    const x1 = cx + r * Math.cos(cumAngle)
    const y1 = cy + r * Math.sin(cumAngle)
    const x2 = cx + r * Math.cos(cumAngle + angle)
    const y2 = cy + r * Math.sin(cumAngle + angle)

    const ix1 = cx + iR * Math.cos(cumAngle)
    const iy1 = cy + iR * Math.sin(cumAngle)
    const ix2 = cx + iR * Math.cos(cumAngle + angle)
    const iy2 = cy + iR * Math.sin(cumAngle + angle)

    const large = angle > Math.PI ? 1 : 0

    const d = `M${x1},${y1}
      A${r},${r} 0 ${large} 1 ${x2},${y2}
      L${ix2},${iy2}
      A${iR},${iR} 0 ${large} 0 ${ix1},${iy1}
      Z`

    cumAngle += angle
    return { d, color: seg.color }
  })

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((s, i) => (
          <path
            key={i}
            d={s.d}
            fill={s.color}
            stroke="white"
            strokeWidth={1}
          />
        ))}
      </svg>

      {center && (
        <div className="absolute inset-0 flex items-center justify-center text-center">
          {center}
        </div>
      )}
    </div>
  )
}

// ── Simple Horizontal Bar ────────────────────────────────────────────────────
export function SimpleHBar({
  label,
  value,
  max,
  color
}: {
  label: string
  value: number
  max: number
  color: string
}) {
  const pct = Math.min((Number(value) / Number(max)) * 100, 100)

  return (
    <div className="grid grid-cols-[55px_1fr_40px] items-center gap-2 text-xs w-full">
      <span className="text-gray-600 text-[11px] leading-tight truncate">
        {label}
      </span>

      <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            backgroundColor: color
          }}
        />
      </div>

      <span className="text-right font-bold text-gray-700">
        {value}%
      </span>
    </div>
  )
}