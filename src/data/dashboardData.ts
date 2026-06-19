// ── Executive Snapshot ──────────────────────────────────────────────────────
export const executiveData = {
  totalHeadcount: 247,
  turnover: { value: '14%', status: 'high' as const },
  attendance: { value: '93%', status: 'watchlist' as const },
  monthlyManpowerCost: 'Rp 2.34B',
  criticalRolesOpen: { value: 8, status: 'high' as const },
  leadershipInsight:
    'Turnover has risen 2% vs last year, concentrated in critical product roles. Immediate intervention on retention and succession is recommended.',
}

// ── Entry ────────────────────────────────────────────────────────────────────
export const entryData = {
  joinersMonthly: 18,
  joinersQuarterly: 52,
  criticalRolesFilled: 7,
  criticalRolesTotal: 12,
  criticalRolesPct: 58,
  newHireStability: 87,
  onboardingCompletion: 71,
  leadershipSignal:
    'Onboarding completion at 71% is below the 85% target. Critical roles hiring backlog risks delivery capacity. Escalate to CHRO for resource review.',
}

// ── Experience ───────────────────────────────────────────────────────────────
export const experienceData = {
  totalHeadcount: 247,
  genderMix: { male: 62, female: 38 },
  employmentStatus: { permanent: 68, contract: 24, other: 8 },
  levelMix: { Director: 5, Manager: 18, AssistantManager: 32, Staff: 45 },
  tenureMix: { lt1: 18, yr1to3: 28, yr3to5: 22, gt5: 32 },
  averageTenure: 3.4,
  attendanceRate: 93,
  absenteeismRate: 2.8,
  leadershipSignal:
    'Team composition is stable. Attendance is on watchlist — monitor closely for absenteeism patterns before it impacts delivery.',
}

// ── Development ──────────────────────────────────────────────────────────────
export const developmentData = {
  promotionRate: 8,
  promotionTarget: 10,
  promotionCount: 18,
  totalEmployees: 220,
  internalMobilityRate: 12,
  internalMobilityTarget: 15,
  internalMobilityCount: 26,
  learningParticipationRate: 74,
  learningParticipationTarget: 80,
  avgCourses: 3.1,
  leadershipSignal:
    'All three development indicators are below target YTD. Internal growth is critically low — risk of talent stagnation and increased attrition if unaddressed.',
}

// ── Turnover ─────────────────────────────────────────────────────────────────
export const turnoverData = {
  turnoverRate: 14,
  turnoverRatePrev: 12,
  voluntaryTurnover: 11,
  voluntaryTurnoverPrev: 9,
  criticalPositionTurnover: 18,
  criticalPositionTurnoverPrev: 13,
  repeatedReplacementRoles: 8,
  timeToBackfill: 45,
  timeToBackfillPrev: 32,
  byRole: [
    { name: 'Business Consultant', value: 28 },
    { name: 'Product Implementor', value: 24 },
    { name: 'Software Engineer', value: 16 },
    { name: 'Digital Marketing', value: 12 },
    { name: 'Product Owner', value: 9 },
  ],
  byManager: [
    { name: 'Manager A', value: 22 },
    { name: 'Manager B', value: 18 },
    { name: 'Manager C', value: 16 },
    { name: 'Manager D', value: 14 },
    { name: 'Manager E', value: 11 },
  ],
  trend: [
    { month: 'Jun', value: 14 },
    { month: 'Jul', value: 13 },
    { month: 'Aug', value: 15 },
    { month: 'Sep', value: 13 },
    { month: 'Oct', value: 16 },
    { month: 'Nov', value: 17 },
    { month: 'Dec', value: 15 },
    { month: 'Jan', value: 14 },
    { month: 'Feb', value: 15 },
    { month: 'Mar', value: 16 },
    { month: 'Apr', value: 15 },
    { month: 'May', value: 14 },
  ],
  chroAnalysis: [
    'Critical roles (Business Consultant, Product Implementor) account for 52% of all exits — immediate retention actions required.',
    'Manager A shows 22% team turnover, significantly above average. Leadership quality review is recommended.',
    'Time-to-backfill has increased 41% vs last year, compounding delivery risk on open critical roles.',
  ],
}

// ── Exit ─────────────────────────────────────────────────────────────────────
export const exitData = {
  exitInterviewCompletion: 82,
  exitInterviewCompletionPrev: 76,
  regrettedLoss: 15,
  regrettedLossPrev: 11,
  avgTenureAtResignation: 2.3,
  avgTenureAtResignationPrev: 2.6,
  totalExits: 124,
  totalExitsPrev: 110,
  topAffectedRoles: 5,
  resignationReasons: [
    { reason: 'Career Growth Opportunities', pct: 28 },
    { reason: 'Compensation', pct: 20 },
    { reason: 'Management/Leadership', pct: 17 },
    { reason: 'Workload', pct: 14 },
    { reason: 'Work-Life Balance', pct: 9 },
    { reason: 'Culture', pct: 6 },
    { reason: 'Other', pct: 6 },
  ],
  tenureAtResignation: [
    { name: '<1 Year', value: 18, color: '#3B82F6' },
    { name: '1-2 Years', value: 28, color: '#22C55E' },
    { name: '2-3 Years', value: 22, color: '#F59E0B' },
    { name: '3-5 Years', value: 17, color: '#8B5CF6' },
    { name: '>5 Years', value: 15, color: '#10B981' },
  ],
  topAffectedRolesList: [
    { role: 'Business Consultant', exits: 26 },
    { role: 'Product Implementor', exits: 21 },
    { role: 'Product Manager', exits: 17 },
    { role: 'Software Engineer', exits: 14 },
    { role: 'Digital Marketing', exits: 10 },
  ],
  leadershipSignal: 'Exits are concentrated in early-tenure employees (< 2 years), indicating onboarding or expectation misalignment. Career growth is the #1 driver — escalate development investment.',
}

// ── Cost ─────────────────────────────────────────────────────────────────────
export const costData = {
  monthlyManpowerCost: 'Rp 2.34B',
  monthlyManpowerCostPrev: 'Rp 2.21B',
  monthlyManpowerCostChg: '+6%',
  annualizedCost: 'Rp 28.1B',
  annualizedCostPrev: 'Rp 25.2B',
  annualizedCostChg: '+11%',
  costPerEmployee: 'Rp 18.7M',
  costPerEmployeePrev: 'Rp 17.1M',
  costPerEmployeeChg: '+9%',
  growthYoY: '11.2%',
  growthYoYPrev: '8.3%',
  replacementHiringCost: 'Rp 847M',
  replacementHiringCostPrev: 'Rp 612M',
  replacementHiringCostChg: '+38%',
  costBreakdown: [
    { name: 'Salary & Wages', value: 42, color: '#1565C0', amount: 'Rp 11.8B' },
    { name: 'Benefits', value: 22, color: '#22C55E', amount: 'Rp 6.2B' },
    { name: 'Allowances', value: 16, color: '#F59E0B', amount: 'Rp 4.5B' },
    { name: 'Overtime', value: 12, color: '#8B5CF6', amount: 'Rp 3.4B' },
    { name: 'Others', value: 8, color: '#10B981', amount: 'Rp 2.2B' },
  ],
  manpowerTrend: [
    { month: 'Jun', value: 1.9 }, { month: 'Jul', value: 1.95 },
    { month: 'Aug', value: 2.0 }, { month: 'Sep', value: 2.05 },
    { month: 'Oct', value: 2.1 }, { month: 'Nov', value: 2.08 },
    { month: 'Dec', value: 2.15 }, { month: 'Jan', value: 2.2 },
    { month: 'Feb', value: 2.22 }, { month: 'Mar', value: 2.28 },
    { month: 'Apr', value: 2.3 }, { month: 'May', value: 2.34 },
  ],
  costPerEmployeeTrend: [
    { month: 'Jun', value: 15.2 }, { month: 'Jul', value: 15.5 },
    { month: 'Aug', value: 15.8 }, { month: 'Sep', value: 16.0 },
    { month: 'Oct', value: 16.3 }, { month: 'Nov', value: 16.5 },
    { month: 'Dec', value: 16.8 }, { month: 'Jan', value: 17.0 },
    { month: 'Feb', value: 17.5 }, { month: 'Mar', value: 18.0 },
    { month: 'Apr', value: 18.4 }, { month: 'May', value: 18.7 },
  ],
  leadershipSignal: 'Repeated turnover creates hidden cost beyond salary. True cost of turnover is 1.5–2.5x annual salary.',
}

// ── Risk Heatmap ─────────────────────────────────────────────────────────────
export const riskHeatmapData = [
  { area: 'Hiring', icon: '👥', status: 'medium' as const, signal: 'Critical hiring backlog' },
  { area: 'Experience', icon: '🛡️', status: 'low' as const, signal: 'Stable' },
  { area: 'Development', icon: '📈', status: 'high' as const, signal: 'Low internal growth' },
  { area: 'Turnover', icon: '🔄', status: 'high' as const, signal: 'Critical roles repeatedly replaced' },
  { area: 'Exit', icon: '💬', status: 'medium' as const, signal: 'Career concerns increasing' },
  { area: 'Cost', icon: '💰', status: 'high' as const, signal: 'Replacement cost increasing' },
]

// ── Action Box ────────────────────────────────────────────────────────────────
export const actionBoxData = [
  {
    number: 1,
    color: '#1565C0',
    bgColor: '#e8f0fe',
    title: 'STABILIZE CRITICAL BUSINESS ROLES',
    description: 'Focus on roles with highest turnover, longest time-to-backfill, and greatest impact on delivery.',
  },
  {
    number: 2,
    color: '#2E7D32',
    bgColor: '#f0faf0',
    title: 'REVIEW MANAGER-SPECIFIC TURNOVER PATTERNS',
    description: 'Identify managers with high exits and assess leadership, workload, and team dynamics.',
  },
  {
    number: 3,
    color: '#E65100',
    bgColor: '#fff3e0',
    title: 'STRENGTHEN RETENTION DISCUSSIONS FOR VULNERABLE TEAMS',
    description: 'Have proactive career, growth, and engagement conversations with at-risk employees.',
  },
  {
    number: 4,
    color: '#6A1B9A',
    bgColor: '#f5eeff',
    title: 'ACCELERATE SUCCESSION READINESS',
    description: 'Build bench strength for critical roles and ensure internal talent is development-ready.',
  },
  {
    number: 5,
    color: '#C62828',
    bgColor: '#fde8e8',
    title: 'REASSESS REPEATED REPLACEMENT HIRING',
    description: 'Investigate root causes of repeated exits and adjust role design, expectation, or compensation.',
  },
]

// ── Governance ────────────────────────────────────────────────────────────────
export const governanceData = {
  cadence: [
    {
      step: 1,
      color: '#1565C0',
      title: 'MONTHLY DASHBOARD RELEASE',
      bullets: [
        'PX publishes the latest workforce dashboard',
        'Data refreshed and validated',
        'Distributed to leaders before review',
      ],
    },
    {
      step: 2,
      color: '#2E7D32',
      title: 'DIRECTORATE REVIEW SESSION',
      bullets: [
        'Directorate leadership review insights and trends',
        'Discuss risk, root causes, and impact',
        'Agree on key action',
      ],
    },
    {
      step: 3,
      color: '#E65100',
      title: 'PBX SUPPORT INTERPRETATION',
      bullets: [
        'PX provides context, benchmarking, and deeper analysis',
        'Helps interpret signals and validate findings',
        'Recommends possible interventions',
      ],
    },
    {
      step: 4,
      color: '#C62828',
      title: 'ESCALATIONS FOR CRITICAL RISKS',
      bullets: [
        'Critical risks escalated to PBX / Executive',
        'Agree on Mitigation plan and timeline',
        'Follow-up progress tracked monthly',
      ],
    },
  ],
  pxResponsibilities: [
    'Generate accurate and timely workforce insights',
    'Provide interpretation, benchmarking, and context',
    'Flag risks, and recommend possible actions',
    'Ensure data quality and continuous improvements',
  ],
  leaderResponsibilities: [
    'Own the decision and action plans',
    'Drive interventions and allocate resources',
    'Monitor progress and hold teams accountable',
    'Ensure outcomes and business impact',
  ],
  benefits: [
    { icon: '📊', text: 'Consistent visibility across directorates' },
    { icon: '🔍', text: 'Faster identification of emerging risks' },
    { icon: '👥', text: 'Stronger leadership focus and alignment' },
    { icon: '📈', text: 'Improved decisions and business outcomes' },
  ],
}
