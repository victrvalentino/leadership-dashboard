// Single source of truth for the recruitment directorates.
// Each one is its own editable section in the admin CMS.
export const RECRUITMENT_DEPARTMENTS = [
  { key: 'recruitment_marketing', label: 'Marketing' },
  { key: 'recruitment_operations', label: 'Operations' },
  { key: 'recruitment_technology', label: 'Technology' },
  { key: 'recruitment_ceo_office', label: 'CEO Office' },
  { key: 'recruitment_finance_legal', label: 'Finance & Legal' },
  { key: 'recruitment_people_experience', label: 'People Experience' },
] as const

export type RecruitmentDeptKey =
  (typeof RECRUITMENT_DEPARTMENTS)[number]['key']
