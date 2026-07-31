// Single source of truth for the recruitment directorates.
// Each one is its own editable section in the admin CMS.
export const RECRUITMENT_DEPARTMENTS = [
  { key: 'recruitment_marketing', label: 'Marketing' },
  { key: 'recruitment_operations', label: 'Business Operations' },
  { key: 'recruitment_technology', label: 'Technology' },
  { key: 'recruitment_ceo_office', label: 'CEO Office' },
  { key: 'recruitment_finance_legal', label: 'Finance & Legal' },
  { key: 'recruitment_people_experience', label: 'People Experience' },
  { key: 'recruitment_operations_support', label: 'Operations Support' },
  { key: 'recruitment_account_management', label: 'Account Management' },
] as const

export type RecruitmentDeptKey =
  (typeof RECRUITMENT_DEPARTMENTS)[number]['key']
