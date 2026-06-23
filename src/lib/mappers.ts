// src/lib/mappers.ts
// ─────────────────────────────────────────────────────────────────────────
// One mapper function per dashboard section. Each function:
//   1. Reads the relevant tab(s) from the raw Sheets API response
//   2. Coerces every field defensively (str/num/pickEnum)
//   3. Falls back to the static defaults from dashboardData.ts — per field,
//      not just per section — so a half-filled sheet never breaks the UI.
//
// The return type of every mapper matches the corresponding export in
// dashboardData.ts EXACTLY, so section components don't need any JSX changes.
// ─────────────────────────────────────────────────────────────────────────
import {
  executiveData as defaultExecutive,
  entryData as defaultEntry,
  experienceData as defaultExperience,
  developmentData as defaultDevelopment,
  turnoverData as defaultTurnover,
  exitData as defaultExit,
  costData as defaultCost,
  riskHeatmapData as defaultRiskHeatmap,
  actionBoxData as defaultActionBox,
  governanceData as defaultGovernance,
} from '@/data/dashboardData'
import { getTab, type RawSheetData } from './googleSheetsApi'
import { rowsToKV, str, num, pickEnum, mapList } from './sheetUtils'

const STATUS = ['healthy', 'watchlist', 'high', 'medium', 'low'] as const
const RISK = ['high', 'medium', 'low'] as const

// ── Executive Snapshot ──────────────────────────────────────────────────────
export function mapExecutive(raw: RawSheetData) {
  const kv = rowsToKV(getTab(raw, 'Executive_Snapshot'))
  if (Object.keys(kv).length === 0) return defaultExecutive
  return {
    totalHeadcount: num(kv.Total_Headcount, defaultExecutive.totalHeadcount),
    turnover: {
      value: str(kv.Turnover, defaultExecutive.turnover.value),
      status: pickEnum(kv.turnoverStatus, STATUS, defaultExecutive.turnover.status),
    },
    attendance: {
      value: str(kv.Attendance, defaultExecutive.attendance.value),
      status: pickEnum(kv.attendanceStatus, STATUS, defaultExecutive.attendance.status),
    },
    monthlyManpowerCost: str(kv.Monthly_Manpower_Cost, defaultExecutive.monthlyManpowerCost),
    criticalRolesOpen: {
      value: num(kv.Critical_Replacement_Roles_Open, defaultExecutive.criticalRolesOpen.value),
      status: pickEnum(kv.criticalRolesOpenStatus, STATUS, defaultExecutive.criticalRolesOpen.status),
    },
    leadershipInsight: str(kv.Leadership_Insight, defaultExecutive.leadershipInsight),
  }
}

// ── Entry ────────────────────────────────────────────────────────────────────
export function mapEntry(raw: RawSheetData) {
  const kv = rowsToKV(getTab(raw, 'Entry'))
  if (Object.keys(kv).length === 0) return defaultEntry
  return {
    joinersMonthly: num(kv.Joiners_Monthly, defaultEntry.joinersMonthly),
    joinersQuarterly: num(kv.Joiners_Quarterly, defaultEntry.joinersQuarterly),
    criticalRolesFilled: num(kv.Critical_Roles_Filled, defaultEntry.criticalRolesFilled),
    criticalRolesTotal: num(kv.criticalRolesTotal, defaultEntry.criticalRolesTotal),
    criticalRolesPct: num(kv.criticalRolesPct, defaultEntry.criticalRolesPct),
    criticalRolesStatus: pickEnum(kv.criticalRolesStatus, STATUS, defaultEntry.criticalRolesStatus),
    newHireStability: num(kv.newHireStability, defaultEntry.newHireStability),
    newHireStabilityStatus: pickEnum(kv.newHireStabilityStatus, STATUS, defaultEntry.newHireStabilityStatus),
    onboardingCompletion: num(kv.onboardingCompletion, defaultEntry.onboardingCompletion),
    onboardingCompletionStatus: pickEnum(
      kv.onboardingCompletionStatus,
      STATUS,
      defaultEntry.onboardingCompletionStatus
    ),
    leadershipSignal: str(kv.leadershipSignal, defaultEntry.leadershipSignal),
  }
}

// ── Experience ───────────────────────────────────────────────────────────────
export function mapExperience(raw: RawSheetData) {
  const kv = rowsToKV(getTab(raw, 'Experience'))
  if (Object.keys(kv).length === 0) return defaultExperience
  return {
    totalHeadcount: num(kv.totalHeadcount, defaultExperience.totalHeadcount),
    genderMix: {
      male: num(kv.genderMale, defaultExperience.genderMix.male),
      female: num(kv.genderFemale, defaultExperience.genderMix.female),
    },
    employmentStatus: {
      permanent: num(kv.employmentPermanent, defaultExperience.employmentStatus.permanent),
      contract: num(kv.employmentContract, defaultExperience.employmentStatus.contract),
      other: num(kv.employmentOther, defaultExperience.employmentStatus.other),
    },
    levelMix: {
      Director: num(kv.levelDirector, defaultExperience.levelMix.Director),
      Manager: num(kv.levelManager, defaultExperience.levelMix.Manager),
      AssistantManager: num(kv.levelAssistantManager, defaultExperience.levelMix.AssistantManager),
      Staff: num(kv.levelStaff, defaultExperience.levelMix.Staff),
    },
    tenureMix: {
      lt1: num(kv.tenureLt1, defaultExperience.tenureMix.lt1),
      yr1to3: num(kv.tenureYr1to3, defaultExperience.tenureMix.yr1to3),
      yr3to5: num(kv.tenureYr3to5, defaultExperience.tenureMix.yr3to5),
      gt5: num(kv.tenureGt5, defaultExperience.tenureMix.gt5),
    },
    averageTenure: num(kv.averageTenure, defaultExperience.averageTenure),
    attendanceRate: num(kv.attendanceRate, defaultExperience.attendanceRate),
    attendanceStatus: pickEnum(kv.attendanceStatus, STATUS, defaultExperience.attendanceStatus),
    absenteeismRate: num(kv.absenteeismRate, defaultExperience.absenteeismRate),
    absenteeismStatus: pickEnum(kv.absenteeismStatus, STATUS, defaultExperience.absenteeismStatus),
    leadershipSignal: str(kv.leadershipSignal, defaultExperience.leadershipSignal),
  }
}

// ── Development ──────────────────────────────────────────────────────────────
export function mapDevelopment(raw: RawSheetData) {
  const kv = rowsToKV(getTab(raw, 'Development'))
  if (Object.keys(kv).length === 0) return defaultDevelopment
  return {
    promotionRate: num(kv.promotionRate, defaultDevelopment.promotionRate),
    promotionTarget: num(kv.promotionTarget, defaultDevelopment.promotionTarget),
    promotionCount: num(kv.promotionCount, defaultDevelopment.promotionCount),
    totalEmployees: num(kv.totalEmployees, defaultDevelopment.totalEmployees),
    internalMobilityRate: num(kv.internalMobilityRate, defaultDevelopment.internalMobilityRate),
    internalMobilityTarget: num(kv.internalMobilityTarget, defaultDevelopment.internalMobilityTarget),
    internalMobilityCount: num(kv.internalMobilityCount, defaultDevelopment.internalMobilityCount),
    learningParticipationRate: num(kv.learningParticipationRate, defaultDevelopment.learningParticipationRate),
    learningParticipationTarget: num(kv.learningParticipationTarget, defaultDevelopment.learningParticipationTarget),
    avgCourses: num(kv.avgCourses, defaultDevelopment.avgCourses),
    leadershipSignal: str(kv.leadershipSignal, defaultDevelopment.leadershipSignal),
  }
}

// ── Turnover ─────────────────────────────────────────────────────────────────
export function mapTurnover(raw: RawSheetData) {
  const kv = rowsToKV(getTab(raw, 'Turnover'))
  const hasScalars = Object.keys(kv).length > 0

  const byRole = mapList(
    getTab(raw, 'Turnover_ByRole'),
    (r) => ({ name: str(r.name, ''), value: num(r.value, 0) }),
    defaultTurnover.byRole
  )
  const byManager = mapList(
    getTab(raw, 'Turnover_ByManager'),
    (r) => ({ name: str(r.name, ''), value: num(r.value, 0) }),
    defaultTurnover.byManager
  )
  const trend = mapList(
    getTab(raw, 'Turnover_Trend'),
    (r) => ({ month: str(r.month, ''), value: num(r.value, 0) }),
    defaultTurnover.trend
  )
  const chroAnalysis = mapList(
    getTab(raw, 'Turnover_Insights'),
    (r) => str(r.text, ''),
    defaultTurnover.chroAnalysis
  ).filter((t) => t !== '')

  return {
    turnoverRate: num(kv.turnoverRate, defaultTurnover.turnoverRate),
    turnoverRatePrev: num(kv.turnoverRatePrev, defaultTurnover.turnoverRatePrev),
    voluntaryTurnover: num(kv.voluntaryTurnover, defaultTurnover.voluntaryTurnover),
    voluntaryTurnoverPrev: num(kv.voluntaryTurnoverPrev, defaultTurnover.voluntaryTurnoverPrev),
    criticalPositionTurnover: num(kv.criticalPositionTurnover, defaultTurnover.criticalPositionTurnover),
    criticalPositionTurnoverPrev: num(kv.criticalPositionTurnoverPrev, defaultTurnover.criticalPositionTurnoverPrev),
    repeatedReplacementRoles: num(kv.repeatedReplacementRoles, defaultTurnover.repeatedReplacementRoles),
    timeToBackfill: num(kv.timeToBackfill, defaultTurnover.timeToBackfill),
    timeToBackfillPrev: num(kv.timeToBackfillPrev, defaultTurnover.timeToBackfillPrev),
    byRole,
    byManager,
    trend,
    chroAnalysis: chroAnalysis.length > 0 ? chroAnalysis : defaultTurnover.chroAnalysis,
    _hasScalars: hasScalars, // internal flag, unused by UI — harmless to ignore
  }
}

// ── Exit ─────────────────────────────────────────────────────────────────────
export function mapExit(raw: RawSheetData) {
  const kv = rowsToKV(getTab(raw, 'Exit'))

  const resignationReasons = mapList(
    getTab(raw, 'Exit_ResignationReasons'),
    (r) => ({ reason: str(r.reason, ''), pct: num(r.pct, 0) }),
    defaultExit.resignationReasons
  )
  const tenureAtResignation = mapList(
    getTab(raw, 'Exit_TenureAtResignation'),
    (r) => ({ name: str(r.name, ''), value: num(r.value, 0), color: str(r.color, '#94A3B8') }),
    defaultExit.tenureAtResignation
  )
  const topAffectedRolesList = mapList(
    getTab(raw, 'Exit_TopAffectedRoles'),
    (r) => ({ role: str(r.role, ''), exits: num(r.exits, 0) }),
    defaultExit.topAffectedRolesList
  )

  return {
    exitInterviewCompletion: num(kv.exitInterviewCompletion, defaultExit.exitInterviewCompletion),
    exitInterviewCompletionPrev: num(kv.exitInterviewCompletionPrev, defaultExit.exitInterviewCompletionPrev),
    regrettedLoss: num(kv.regrettedLoss, defaultExit.regrettedLoss),
    regrettedLossPrev: num(kv.regrettedLossPrev, defaultExit.regrettedLossPrev),
    avgTenureAtResignation: num(kv.avgTenureAtResignation, defaultExit.avgTenureAtResignation),
    avgTenureAtResignationPrev: num(kv.avgTenureAtResignationPrev, defaultExit.avgTenureAtResignationPrev),
    totalExits: num(kv.totalExits, defaultExit.totalExits),
    totalExitsPrev: num(kv.totalExitsPrev, defaultExit.totalExitsPrev),
    topAffectedRoles: num(kv.topAffectedRoles, defaultExit.topAffectedRoles),
    resignationReasons,
    tenureAtResignation,
    topAffectedRolesList,
    leadershipSignal: str(kv.leadershipSignal, defaultExit.leadershipSignal),
  }
}

// ── Cost ─────────────────────────────────────────────────────────────────────
export function mapCost(raw: RawSheetData) {
  const kv = rowsToKV(getTab(raw, 'Cost'))

  const costBreakdown = mapList(
    getTab(raw, 'Cost_Breakdown'),
    (r) => ({
      name: str(r.name, ''),
      value: num(r.value, 0),
      color: str(r.color, '#94A3B8'),
      amount: str(r.amount, ''),
    }),
    defaultCost.costBreakdown
  )
  const manpowerTrend = mapList(
    getTab(raw, 'Cost_ManpowerTrend'),
    (r) => ({ month: str(r.month, ''), value: num(r.value, 0) }),
    defaultCost.manpowerTrend
  )
  const costPerEmployeeTrend = mapList(
    getTab(raw, 'Cost_PerEmployeeTrend'),
    (r) => ({ month: str(r.month, ''), value: num(r.value, 0) }),
    defaultCost.costPerEmployeeTrend
  )

  return {
    monthlyManpowerCost: str(kv.monthlyManpowerCost, defaultCost.monthlyManpowerCost),
    monthlyManpowerCostPrev: str(kv.monthlyManpowerCostPrev, defaultCost.monthlyManpowerCostPrev),
    monthlyManpowerCostChg: str(kv.monthlyManpowerCostChg, defaultCost.monthlyManpowerCostChg),
    annualizedCost: str(kv.annualizedCost, defaultCost.annualizedCost),
    annualizedCostPrev: str(kv.annualizedCostPrev, defaultCost.annualizedCostPrev),
    annualizedCostChg: str(kv.annualizedCostChg, defaultCost.annualizedCostChg),
    costPerEmployee: str(kv.costPerEmployee, defaultCost.costPerEmployee),
    costPerEmployeePrev: str(kv.costPerEmployeePrev, defaultCost.costPerEmployeePrev),
    costPerEmployeeChg: str(kv.costPerEmployeeChg, defaultCost.costPerEmployeeChg),
    growthYoY: str(kv.growthYoY, defaultCost.growthYoY),
    growthYoYPrev: str(kv.growthYoYPrev, defaultCost.growthYoYPrev),
    replacementHiringCost: str(kv.replacementHiringCost, defaultCost.replacementHiringCost),
    replacementHiringCostPrev: str(kv.replacementHiringCostPrev, defaultCost.replacementHiringCostPrev),
    replacementHiringCostChg: str(kv.replacementHiringCostChg, defaultCost.replacementHiringCostChg),
    costBreakdown,
    manpowerTrend,
    costPerEmployeeTrend,
    leadershipSignal: str(kv.leadershipSignal, defaultCost.leadershipSignal),
  }
}

// ── Leadership: Risk Heatmap ──────────────────────────────────────────────────
export function mapRiskHeatmap(raw: RawSheetData) {
  return mapList(
    getTab(raw, 'Leadership_RiskHeatmap'),
    (r) => ({
      area: str(r.area, ''),
      icon: str(r.icon, '⚪'),
      status: pickEnum(r.status, RISK, 'medium' as const),
      signal: str(r.signal, ''),
    }),
    defaultRiskHeatmap
  )
}

// ── Leadership: Action Box ────────────────────────────────────────────────────
export function mapActionBox(raw: RawSheetData) {
  return mapList(
    getTab(raw, 'Leadership_ActionBox'),
    (r, i) => ({
      number: num(r.number, i + 1),
      color: str(r.color, '#1565C0'),
      bgColor: str(r.bgColor, '#e8f0fe'),
      title: str(r.title, ''),
      description: str(r.description, ''),
    }),
    defaultActionBox
  )
}

// ── Leadership: Governance Model ──────────────────────────────────────────────
export function mapGovernance(raw: RawSheetData) {
  const cadence = mapList(
    getTab(raw, 'Leadership_Cadence'),
    (r, i) => ({
      step: num(r.step, i + 1),
      color: str(r.color, '#1565C0'),
      title: str(r.title, ''),
      bullets: str(r.bullets, '')
        .split('|')
        .map((b) => b.trim())
        .filter(Boolean),
    }),
    defaultGovernance.cadence
  )

  const pxResponsibilities = mapList(
    getTab(raw, 'Leadership_PX'),
    (r) => str(r.text, ''),
    defaultGovernance.pxResponsibilities
  ).filter((t) => t !== '')

  const leaderResponsibilities = mapList(
    getTab(raw, 'Leadership_Leader'),
    (r) => str(r.text, ''),
    defaultGovernance.leaderResponsibilities
  ).filter((t) => t !== '')

  const benefits = mapList(
    getTab(raw, 'Leadership_Benefits'),
    (r) => ({ icon: str(r.icon, '⭐'), text: str(r.text, '') }),
    defaultGovernance.benefits
  )

  return {
    cadence: cadence.length > 0 ? cadence : defaultGovernance.cadence,
    pxResponsibilities: pxResponsibilities.length > 0 ? pxResponsibilities : defaultGovernance.pxResponsibilities,
    leaderResponsibilities:
      leaderResponsibilities.length > 0 ? leaderResponsibilities : defaultGovernance.leaderResponsibilities,
    benefits,
  }
}
