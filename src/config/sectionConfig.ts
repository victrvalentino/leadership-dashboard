export type FieldType = 'text' | 'number' | 'textarea'

export type SectionConfig = {
  fields: {
    key: string
    label: string
    type: FieldType
  }[]
  arrays?: {
    key: string
    title: string
    columns: string[]
  }[]
}

export const sectionConfig: Record<string, SectionConfig> = {
  executive: {
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'totalHeadcount', label: 'Total Headcount', type: 'number' },
      { key: 'turnover', label: 'Turnover', type: 'text' },
      { key: 'attendance', label: 'Attendance', type: 'text' },
      { key: 'monthlyManpowerCost', label: 'Monthly Manpower Cost', type: 'text' },
      { key: 'criticalRolesOpen', label: 'Critical Roles Open', type: 'number' },
      { key: 'leadershipInsight', label: 'Leadership Insight', type: 'textarea' }
    ]
  },

  entry: {
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'joinersMonthly', label: 'Joiners Monthly', type: 'number' },
      { key: 'joinersQuarterly', label: 'Joiners Quarterly', type: 'number' },
      { key: 'criticalRolesFilled', label: 'Critical Roles Filled', type: 'number' },
      { key: 'criticalRolesTotal', label: 'Critical Roles Total', type: 'number' },
      { key: 'criticalRolesPct', label: 'Critical Roles %', type: 'number' },
      { key: 'criticalRolesStatus', label: 'Critical Roles Badge (healthy / watchlist / high / medium / low)', type: 'text' },
      { key: 'newHireStability', label: 'New Hire Stability', type: 'number' },
      { key: 'newHireStabilityCaption', label: 'New Hire Stability Caption', type: 'text' },
      { key: 'newHireStabilityStatus', label: 'New Hire Stability Badge (healthy / watchlist / high / medium / low)', type: 'text' },
      { key: 'onboardingCompletion', label: 'Onboarding Completion', type: 'number' },
      { key: 'onboardingCompletionCaption', label: 'Onboarding Completion Caption', type: 'text' },
      { key: 'onboardingCompletionStatus', label: 'Onboarding Completion Badge (healthy / watchlist / high / medium / low)', type: 'text' },
      { key: 'leadershipSignal', label: 'Leadership Signal', type: 'textarea' }
    ]
  },

  experience: {
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'totalHeadcount', label: 'Total Headcount', type: 'number' },
      { key: 'male', label: 'Male %', type: 'number' },
      { key: 'female', label: 'Female %', type: 'number' },
      { key: 'permanent', label: 'Permanent %', type: 'number' },
      { key: 'contract', label: 'Contract %', type: 'number' },
      { key: 'other', label: 'Other %', type: 'number' },
      { key: 'averageTenure', label: 'Average Tenure', type: 'number' },
      { key: 'attendanceRate', label: 'Attendance Rate', type: 'number' },
      { key: 'attendanceStatus', label: 'Attendance Badge (healthy / watchlist / high / medium / low)', type: 'text' },
      { key: 'absenteeismRate', label: 'Absenteeism Rate', type: 'number' },
      { key: 'absenteeismStatus', label: 'Absenteeism Badge (healthy / watchlist / high / medium / low)', type: 'text' },
      { key: 'leadershipSignal', label: 'Leadership Signal', type: 'textarea' }
    ],
    arrays: [
      { key: 'levelMix', title: 'Level Mix', columns: ['label', 'value'] },
      { key: 'tenureMix', title: 'Tenure Mix', columns: ['label', 'value'] }
    ]
  },

  development: {
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'promotionRate', label: 'Promotion Rate', type: 'number' },
      { key: 'promotionTarget', label: 'Promotion Target', type: 'number' },
      { key: 'promotionCount', label: 'Promotion Count', type: 'number' },
      { key: 'internalMobilityRate', label: 'Internal Mobility Rate', type: 'number' },
      { key: 'internalMobilityTarget', label: 'Internal Mobility Target', type: 'number' },
      { key: 'internalMobilityCount', label: 'Internal Mobility Count', type: 'number' },
      { key: 'learningParticipationRate', label: 'Learning Participation Rate', type: 'number' },
      { key: 'learningParticipationTarget', label: 'Learning Participation Target', type: 'number' },
      { key: 'avgCourses', label: 'Average Courses', type: 'number' },
      { key: 'totalEmployees', label: 'Total Employees', type: 'number' },
      { key: 'leadershipSignal', label: 'Leadership Signal', type: 'textarea' }
    ]
  },

  turnover: {
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'turnoverRate', label: 'Turnover Rate', type: 'number' },
      { key: 'turnoverRatePrev', label: 'Turnover Rate Prev', type: 'number' },
      { key: 'voluntaryTurnover', label: 'Voluntary Turnover', type: 'number' },
      { key: 'voluntaryTurnoverPrev', label: 'Voluntary Turnover Prev', type: 'number' },
      { key: 'criticalPositionTurnover', label: 'Critical Position Turnover', type: 'number' },
      { key: 'criticalPositionTurnoverPrev', label: 'Critical Position Turnover Prev', type: 'number' },
      { key: 'repeatedReplacementRoles', label: 'Repeated Replacement Roles', type: 'number' },
      { key: 'repeatedReplacementRolesCaption', label: 'Repeated Replacement Roles Caption', type: 'text' },
      { key: 'timeToBackfill', label: 'Time To Backfill', type: 'number' },
      { key: 'timeToBackfillPrev', label: 'Time To Backfill Prev', type: 'number' },
      { key: 'chroAnalysis1', label: 'CHRO Analysis 1', type: 'textarea' },
      { key: 'chroAnalysis2', label: 'CHRO Analysis 2', type: 'textarea' },
      { key: 'chroAnalysis3', label: 'CHRO Analysis 3', type: 'textarea' }
    ],
    arrays: [
      { key: 'byRole', title: 'Turnover by Role', columns: ['name', 'value'] },
      { key: 'byManager', title: 'Turnover by Manager', columns: ['name', 'value'] },
      { key: 'trend', title: 'Turnover Trend', columns: ['month', 'value'] }
    ]
  },

  exit: {
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'exitInterviewCompletion', label: 'Exit Interview Completion', type: 'number' },
      { key: 'exitInterviewCompletionPrev', label: 'Exit Interview Completion Prev', type: 'number' },
      { key: 'regrettedLoss', label: 'Regretted Loss', type: 'number' },
      { key: 'regrettedLossPrev', label: 'Regretted Loss Prev', type: 'number' },
      { key: 'avgTenureAtResignation', label: 'Average Tenure at Resignation', type: 'number' },
      { key: 'avgTenureAtResignationPrev', label: 'Average Tenure Prev', type: 'number' },
      { key: 'totalExits', label: 'Total Exits', type: 'number' },
      { key: 'totalExitsPrev', label: 'Total Exits Prev', type: 'number' },
      { key: 'topAffectedRoles', label: 'Top Affected Roles', type: 'number' },
      { key: 'leadershipSignal', label: 'Leadership Signal', type: 'textarea' }
    ],
    arrays: [
      { key: 'resignationReasons', title: 'Top Resignation Reasons', columns: ['reason', 'pct'] },
      { key: 'tenureAtResignation', title: 'Tenure at Resignation', columns: ['name', 'value', 'color'] },
      { key: 'topAffectedRolesList', title: 'Top Affected Roles', columns: ['role', 'exits'] },
      { key: 'signalItems', title: 'Signal Items', columns: ['icon', 'text'] }
    ]
  },

  cost: {
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'monthlyManpowerCost', label: 'Monthly Manpower Cost', type: 'text' },
      { key: 'monthlyManpowerCostPrev', label: 'Monthly Manpower Cost Prev', type: 'text' },
      { key: 'monthlyManpowerCostChg', label: 'Monthly Manpower Cost Change', type: 'text' },
      { key: 'annualizedCost', label: 'Annualized Cost', type: 'text' },
      { key: 'annualizedCostPrev', label: 'Annualized Cost Prev', type: 'text' },
      { key: 'annualizedCostChg', label: 'Annualized Cost Change', type: 'text' },
      { key: 'costPerEmployee', label: 'Cost Per Employee', type: 'text' },
      { key: 'costPerEmployeePrev', label: 'Cost Per Employee Prev', type: 'text' },
      { key: 'costPerEmployeeChg', label: 'Cost Per Employee Change', type: 'text' },
      { key: 'growthTrend', label: 'Growth Trend', type: 'text' },
      { key: 'growthTrendPrev', label: 'Growth Trend Prev', type: 'text' },
      { key: 'growthTrendChg', label: 'Growth Trend Change', type: 'text' },
      { key: 'replacementHiringCost', label: 'Replacement Hiring Cost', type: 'text' },
      { key: 'replacementHiringCostPrev', label: 'Replacement Hiring Cost Prev', type: 'text' },
      { key: 'replacementHiringCostChg', label: 'Replacement Hiring Cost Change', type: 'text' },
      { key: 'leadershipSignal', label: 'Leadership Signal', type: 'textarea' }
    ],
    arrays: [
      { key: 'manpowerTrend', title: 'Manpower Trend', columns: ['month', 'value'] },
      { key: 'costBreakdown', title: 'Cost Breakdown', columns: ['name', 'amount', 'value', 'color'] },
      { key: 'costPerEmployeeTrend', title: 'Cost Per Employee Trend', columns: ['month', 'value'] },
      { key: 'signalItems', title: 'Signal Items', columns: ['icon', 'text'] }
    ]
  },

  riskHeatmap: {
    fields: [
      { key: 'insight', label: 'Leadership Insight', type: 'textarea' }
    ],
    arrays: [
      {
        key: 'rows',
        title: 'Risk Rows',
        columns: ['area', 'icon', 'status', 'signal']
      }
    ]
  },

  actionBox: {
    fields: [
      { key: 'headerTitle', label: 'Header Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' }
    ],
    arrays: [
      {
        key: 'items',
        title: 'Action Items',
        columns: ['number', 'title', 'description', 'color', 'bgColor']
      }
    ]
  },

  governance: {
    fields: [
      { key: 'cadenceTitle', label: 'Cadence Title', type: 'text' },
      { key: 'ownershipTitle', label: 'Ownership Title', type: 'text' },
      { key: 'benefitsTitle', label: 'Benefits Title', type: 'text' }
    ],
    arrays: [
      {
        key: 'cadence',
        title: 'Cadence',
        columns: ['step', 'title', 'bullets']
      },
      {
        key: 'pxResponsibilities',
        title: 'PX Responsibilities',
        columns: ['text']
      },
      {
        key: 'leaderResponsibilities',
        title: 'Leader Responsibilities',
        columns: ['text']
      },
      {
        key: 'benefits',
        title: 'Benefits',
        columns: ['icon', 'text']
      }
    ]
  }
}