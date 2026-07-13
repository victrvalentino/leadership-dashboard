import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { RECRUITMENT_DEPARTMENTS } from '@/config/recruitmentDepartments'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Aggregates the general recruitment section plus every
// directorate's own section into a single response.
export async function GET() {
  try {
    const keys = [
      'recruitment',
      ...RECRUITMENT_DEPARTMENTS.map((d) => d.key),
    ]

    const { data: sections, error: sectionsError } = await supabase
      .from('dashboard_sections')
      .select('id, section_key')
      .in('section_key', keys)

    if (sectionsError) {
      return NextResponse.json(
        { error: String(sectionsError.message) },
        { status: 500 }
      )
    }

    const ids = (sections || []).map((s) => s.id)

    const { data: published, error: publishedError } = await supabase
      .from('published_content')
      .select('section_id, content_json, version')
      .in('section_id', ids)
      .order('version', { ascending: false })

    if (publishedError) {
      return NextResponse.json(
        { error: String(publishedError.message) },
        { status: 500 }
      )
    }

    // Keep only the latest version per section
    const latestBySectionId: Record<string, unknown> = {}
    for (const row of published || []) {
      if (!(row.section_id in latestBySectionId)) {
        latestBySectionId[row.section_id] = row.content_json
      }
    }

    const byKey: Record<string, unknown> = {}
    for (const s of sections || []) {
      if (s.id in latestBySectionId) {
        byKey[s.section_key] = latestBySectionId[s.id]
      }
    }

    return NextResponse.json({
      success: true,
      general: byKey['recruitment'] || null,
      departments: Object.fromEntries(
        RECRUITMENT_DEPARTMENTS.map((d) => [
          d.key,
          byKey[d.key] || null,
        ])
      ),
    })
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}
