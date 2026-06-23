'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  executiveData,
  entryData,
  experienceData,
  developmentData,
  turnoverData,
  exitData,
  costData,
  riskHeatmapData,
  actionBoxData,
  governanceData,
} from '@/data/dashboardData'

interface DashboardDataShape {
  executive: typeof executiveData
  entry: typeof entryData
  experience: typeof experienceData
  development: typeof developmentData
  turnover: typeof turnoverData
  exit: typeof exitData
  cost: typeof costData
  riskHeatmap: typeof riskHeatmapData
  actionBox: typeof actionBoxData
  governance: typeof governanceData
  isReady: boolean
  error: string | null
  refresh: () => void
}

const DashboardDataContext =
  createContext<DashboardDataShape | null>(null)

const defaultData = {
  executive: executiveData,
  entry: entryData,
  experience: experienceData,
  development: developmentData,
  turnover: turnoverData,
  exit: exitData,
  cost: costData,
  riskHeatmap: riskHeatmapData,
  actionBox: actionBoxData,
  governance: governanceData,
}

export function DashboardDataProvider({
  children,
}: {
  children: ReactNode
}) {
  const [data, setData] = useState(defaultData)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    async function loadData() {
      try {
        const [
          executiveRes,
          entryRes,
          experienceRes,
          developmentRes,
          turnoverRes,
          exitRes,
          costRes,
          riskRes,
          actionRes,
          governanceRes,
        ] = await Promise.all([
          fetch('/api/dashboard/executive'),
          fetch('/api/dashboard/entry'),
          fetch('/api/dashboard/experience'),
          fetch('/api/dashboard/development'),
          fetch('/api/dashboard/turnover'),
          fetch('/api/dashboard/exit'),
          fetch('/api/dashboard/cost'),
          fetch('/api/dashboard/riskHeatmap'),
          fetch('/api/dashboard/actionBox'),
          fetch('/api/dashboard/governance'),
        ])

        const executiveJson = await executiveRes.json()
        const entryJson = await entryRes.json()
        const experienceJson = await experienceRes.json()
        const developmentJson = await developmentRes.json()
        const turnoverJson = await turnoverRes.json()
        const exitJson = await exitRes.json()
        const costJson = await costRes.json()
        const riskJson = await riskRes.json()
        const actionJson = await actionRes.json()
        const governanceJson = await governanceRes.json()

        setData({
          executive:
            executiveJson?.data ?? executiveData,
          entry:
            entryJson?.data ?? entryData,
          experience:
            experienceJson?.data ?? experienceData,
          development:
            developmentJson?.data ?? developmentData,
          turnover:
            turnoverJson?.data ?? turnoverData,
          exit:
            exitJson?.data ?? exitData,
          cost:
            costJson?.data ?? costData,
          riskHeatmap:
            riskJson?.data ?? riskHeatmapData,
          actionBox:
            actionJson?.data ?? actionBoxData,
          governance:
            governanceJson?.data ?? governanceData,
        })

        setError(null)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed loading dashboard data'
        )
      } finally {
        setIsReady(true)
      }
    }

    loadData()
  }, [refreshTick])

  const value = useMemo(
    () => ({
      ...data,
      isReady,
      error,
      refresh: () =>
        setRefreshTick((prev) => prev + 1),
    }),
    [data, isReady, error]
  )

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  )
}

function useDashboardDataContext(): DashboardDataShape {
  const ctx = useContext(DashboardDataContext)

  if (!ctx) {
    throw new Error(
      'useDashboardData must be used inside DashboardDataProvider'
    )
  }

  return ctx
}

export const useDashboardData =
  useDashboardDataContext

export const useExecutiveData = () =>
  useDashboardDataContext().executive

export const useEntryData = () =>
  useDashboardDataContext().entry

export const useExperienceData = () =>
  useDashboardDataContext().experience

export const useDevelopmentData = () =>
  useDashboardDataContext().development

export const useTurnoverData = () =>
  useDashboardDataContext().turnover

export const useExitData = () =>
  useDashboardDataContext().exit

export const useCostData = () =>
  useDashboardDataContext().cost

export const useRiskHeatmapData = () =>
  useDashboardDataContext().riskHeatmap

export const useActionBoxData = () =>
  useDashboardDataContext().actionBox

export const useGovernanceData = () =>
  useDashboardDataContext().governance