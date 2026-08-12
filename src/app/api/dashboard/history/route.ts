import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// theme_color in dashboard_sections is currently the same default for every
// row, so it's not usable for visual distinction — mirror the real per-section
// colors already used across the sidebar/section headers instead.
const COLOR_MAP: Record<string, string> = {
  executive: '#1565C0',
  entry: '#2E7D32',
  experience: '#1D4ED8',
  development: '#6A1B9A',
  turnover: '#E65100',
  exit: '#C62828',
  cost: '#00695C',
  riskHeatmap: '#F58220',
  actionBox: '#F58220',
  governance: '#F58220',
}
const RECRUITMENT_COLOR = '#E8636F'

function groupOf(sectionKey: string): 'core' | 'recruitment' | 'leadership' {
  if (sectionKey === 'recruitment' || sectionKey.startsWith('recruitment_')) return 'recruitment'
  if (['riskHeatmap', 'actionBox', 'governance'].includes(sectionKey)) return 'leadership'
  return 'core'
}

function colorOf(sectionKey: string): string {
  if (groupOf(sectionKey) === 'recruitment') return RECRUITMENT_COLOR
  return COLOR_MAP[sectionKey] || '#64748b'
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: 'Query param "date" is required in YYYY-MM-DD format' },
        { status: 400 }
      )
    }

    const start = `${date}T00:00:00.000Z`
    const end = `${date}T23:59:59.999Z`

    // Full section list first — this is the backbone of the response, since
    // every section must appear regardless of whether it changed that day.
    const { data: sections, error: sectionsError } = await supabase
      .from('dashboard_sections')
      .select('section_key, title, display_order')
      .order('display_order', { ascending: true })
      .order('title', { ascending: true })

    if (sectionsError) {
      return NextResponse.json({ error: sectionsError.message }, { status: 500 })
    }

    // One bounded pull of audit history, newest first. Used both for "what
    // changed on the chosen date" and "when did each untouched section last
    // change" — cheaper than a per-section round trip for ~20 sections.
    const { data: logs, error: logsError } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5000)

    if (logsError) {
      return NextResponse.json({ error: logsError.message }, { status: 500 })
    }

    const allLogs = logs || []

    const results = (sections || [])
      .sort((a, b) => {
        // Pin the "recruitment" parent row first within its group; the DB
        // only gives real display_order to the non-recruitment sections.
        if (a.section_key === 'recruitment') return -1
        if (b.section_key === 'recruitment') return 1
        return 0
      })
      .map((section) => {
        const sectionLogs = allLogs.filter((l) => l.target_section === section.section_key)

        const entriesToday = sectionLogs
          .filter((l) => l.created_at >= start && l.created_at <= end)
          .map((row) => ({
            id: row.id,
            action: row.action,
            changeSummary: row.change_summary,
            editorName: row.metadata?.editor_name || 'Unknown',
            editorRole: row.metadata?.editor_role || null,
            changes: row.metadata?.changes || [],
            createdAt: row.created_at,
          }))

        const lastBefore = sectionLogs.find((l) => l.created_at < start)

        return {
          sectionKey: section.section_key,
          title: section.title,
          group: groupOf(section.section_key),
          color: colorOf(section.section_key),
          changedToday: entriesToday.length > 0,
          entriesToday,
          lastChange: lastBefore
            ? {
                action: lastBefore.action,
                editorName: lastBefore.metadata?.editor_name || 'Unknown',
                createdAt: lastBefore.created_at,
              }
            : null,
        }
      })

    const since = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    const activeDates = Array.from(
      new Set(allLogs.filter((r) => r.created_at >= since).map((r) => String(r.created_at).slice(0, 10)))
    )

    return NextResponse.json({
      success: true,
      date,
      sections: results,
      changedCount: results.filter((r) => r.changedToday).length,
      totalCount: results.length,
      activeDates,
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
