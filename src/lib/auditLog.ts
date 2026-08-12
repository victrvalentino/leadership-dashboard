import { createClient } from '@supabase/supabase-js'
import { getCurrentUser } from '@/lib/auth'
import { diffContent, summarizeChanges, compactChanges } from '@/lib/diffContent'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function logAudit(params: {
  targetSection: string
  before: Record<string, unknown> | null
  after: Record<string, unknown>
  action: 'draft_save' | 'publish'
}) {
  const user = await getCurrentUser()
  const changes = diffContent(params.before, params.after)

  const { error } = await supabase.from('audit_logs').insert({
    action: params.action,
    target_section: params.targetSection,
    change_summary: summarizeChanges(changes),
    metadata: {
      editor_name: user?.name || 'Unknown',
      editor_role: user?.role || 'unknown',
      changes: compactChanges(changes),
    },
  })

  // Audit logging must never block the actual save/publish action —
  // log and swallow so a logging hiccup can't break the editor's work.
  if (error) {
    console.error('audit_logs insert failed:', error.message)
  }
}
