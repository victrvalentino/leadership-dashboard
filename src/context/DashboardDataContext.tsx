// src/context/DashboardDataContext.tsx
'use client'
// ─────────────────────────────────────────────────────────────────────────
// Fetches the Google Sheet once on mount, maps every tab via mappers.ts,
// and exposes the result through React Context. Section components consume
// this via the small useXxxData() hooks at the bottom — each one is a
// drop-in replacement for the old `import { xxxData } from '@/data/dashboardData'`.
//
// Initial render always has data immediately available (the mappers fall
// back to the static defaults when the Sheet hasn't loaded yet), so there
// is no loading spinner and no layout shift — the UI looks identical to
// the static version while the live fetch happens silently in the background.
// ─────────────────────────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchSheetData, type RawSheetData } from '@/lib/googleSheetsApi'
import {
  mapExecutive,
  mapEntry,
  mapExperience,
  mapDevelopment,
  mapTurnover,
  mapExit,
  mapCost,
  mapRiskHeatmap,
  mapActionBox,
  mapGovernance,
} from '@/lib/mappers'

// Silent background refresh — purely optional. Set to 0 to disable.
const AUTO_REFRESH_MS = 5 * 60 * 1000 // 5 minutes

interface DashboardDataShape {
  executive: ReturnType<typeof mapExecutive>
  entry: ReturnType<typeof mapEntry>
  experience: ReturnType<typeof mapExperience>
  development: ReturnType<typeof mapDevelopment>
  turnover: ReturnType<typeof mapTurnover>
  exit: ReturnType<typeof mapExit>
  cost: ReturnType<typeof mapCost>
  riskHeatmap: ReturnType<typeof mapRiskHeatmap>
  actionBox: ReturnType<typeof mapActionBox>
  governance: ReturnType<typeof mapGovernance>
  /** true once the first fetch attempt (success or failure) has completed */
  isReady: boolean
  /** last fetch error message, if any — non-fatal, defaults are shown regardless */
  error: string | null
  /** manually re-fetch from the Sheets API (e.g. wire to a "Refresh" button) */
  refresh: () => void
}

function mapAll(raw: RawSheetData) {
  return {
    executive: mapExecutive(raw),
    entry: mapEntry(raw),
    experience: mapExperience(raw),
    development: mapDevelopment(raw),
    turnover: mapTurnover(raw),
    exit: mapExit(raw),
    cost: mapCost(raw),
    riskHeatmap: mapRiskHeatmap(raw),
    actionBox: mapActionBox(raw),
    governance: mapGovernance(raw),
  }
}

const DashboardDataContext = createContext<DashboardDataShape | null>(null)

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const [mapped, setMapped] = useState(() => mapAll({}))
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    let cancelled = false

    fetchSheetData(refreshTick > 0)
      .then((raw) => {
        if (cancelled) return
        setMapped(mapAll(raw))
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load live data')
      })
      .finally(() => {
        if (!cancelled) setIsReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [refreshTick])

  useEffect(() => {
    if (!AUTO_REFRESH_MS) return
    const id = setInterval(() => setRefreshTick((t) => t + 1), AUTO_REFRESH_MS)
    return () => clearInterval(id)
  }, [])

  const value = useMemo<DashboardDataShape>(
    () => ({
      ...mapped,
      isReady,
      error,
      refresh: () => setRefreshTick((t) => t + 1),
    }),
    [mapped, isReady, error]
  )

  return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>
}

function useDashboardDataContext(): DashboardDataShape {
  const ctx = useContext(DashboardDataContext)
  if (!ctx) {
    throw new Error('useDashboardData hooks must be used within <DashboardDataProvider>')
  }
  return ctx
}

// ── Public hooks — one per section, mirrors the old dashboardData.ts exports ──
export const useDashboardData = useDashboardDataContext
export const useExecutiveData = () => useDashboardDataContext().executive
export const useEntryData = () => useDashboardDataContext().entry
export const useExperienceData = () => useDashboardDataContext().experience
export const useDevelopmentData = () => useDashboardDataContext().development
export const useTurnoverData = () => useDashboardDataContext().turnover
export const useExitData = () => useDashboardDataContext().exit
export const useCostData = () => useDashboardDataContext().cost
export const useRiskHeatmapData = () => useDashboardDataContext().riskHeatmap
export const useActionBoxData = () => useDashboardDataContext().actionBox
export const useGovernanceData = () => useDashboardDataContext().governance
