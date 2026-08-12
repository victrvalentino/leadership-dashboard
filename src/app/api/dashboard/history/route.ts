import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Section metadata (title/color/icon) for turning a bare section_key
// like "experience" into something readable in the timeline.
const SECTION_LABELS: Record<string, { label: string; color: string }> = {
  home: { label: 'Home', color: '#374151' },
  executive: { label: 'Executive Snapshot', color: '#1565C0' },
  recruitment: { label: 'Recruitment', color: '#E8636F' },
  entry: { label: 'Entry', color: '#2E7D32' },
  experience: { label: 'Experience', color: '#1D4ED8' },
  development: { label: 'Development', color: '#6A1B9A' },
  turnover: { label: 'Turnover', color: '#E65100' },
  exit: { label: 'Exit', color: '#C62828' },
  cost: { label: 'Cost', color: '#00695C' },
  leadership: { label: 'Leadership Action', color: '#E65100' },
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date') // expected format: YYYY-MM-DD

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: 'Query param "date" is required in YYYY-MM-DD format' },
        { status: 400 }
      )
    }

    // Treat the date as a local-day window in UTC — good enough for a
    // single-org internal dashboard; not attempting per-user timezone math.
    const start = `${date}T00:00:00.000Z`
    const end = `${date}T23:59:59.999Z`

    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .gte('created_at', start)
      .lte('created_at', end)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const entries = (data || []).map((row) => ({
      id: row.id,
      action: row.action,
      targetSection: row.target_section,
      sectionLabel: SECTION_LABELS[row.target_section]?.label || row.target_section,
      sectionColor: SECTION_LABELS[row.target_section]?.color || '#64748b',
      changeSummary: row.change_summary,
      editorName: row.metadata?.editor_name || 'Unknown',
      editorRole: row.metadata?.editor_role || null,
      changes: row.metadata?.changes || [],
      createdAt: row.created_at,
    }))

    // Also return which distinct dates have any activity at all, within
    // a 60-day lookback, so the UI can hint "there's data on these days"
    // without the user guessing.
    const since = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    const { data: recentDates } = await supabase
      .from('audit_logs')
      .select('created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(500)

    const activeDates = Array.from(
      new Set((recentDates || []).map((r) => String(r.created_at).slice(0, 10)))
    )

    return NextResponse.json({ success: true, date, entries, activeDates })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
