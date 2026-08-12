import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { logAudit } from '@/lib/auditLog'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    // Ambil semua draft, sekalian join section_key untuk audit log
    const { data: drafts, error: draftError } = await supabase
      .from('draft_content')
      .select('*, dashboard_sections(section_key)')

    if (draftError) {
      return NextResponse.json(
        { error: draftError.message },
        { status: 500 }
      )
    }

    for (const draft of drafts || []) {
      console.log('Publishing section:', draft.section_id)

      const { data: existing, error: existingError } = await supabase
        .from('published_content')
        .select('*')
        .eq('section_id', draft.section_id)
        .maybeSingle()

      if (existingError) {
        return NextResponse.json(
          {
            error: `Failed checking existing row: ${existingError.message}`
          },
          { status: 500 }
        )
      }

      if (!existing) {
        // Insert baru
        const { error: insertError } = await supabase
          .from('published_content')
          .insert({
            section_id: draft.section_id,
            content_json: draft.content_json,
            version: draft.version
          })

        if (insertError) {
          return NextResponse.json(
            {
              error: `Insert failed for ${draft.section_id}: ${insertError.message}`
            },
            { status: 500 }
          )
        }

        await logAudit({
          targetSection: draft.dashboard_sections?.section_key || draft.section_id,
          before: null,
          after: draft.content_json,
          action: 'publish',
        })
      } else {
        // Update existing
        const { error: updateError } = await supabase
          .from('published_content')
          .update({
            content_json: draft.content_json,
            version: draft.version,
            updated_at: new Date().toISOString()
          })
          .eq('section_id', draft.section_id)

        if (updateError) {
          return NextResponse.json(
            {
              error: `Update failed for ${draft.section_id}: ${updateError.message}`
            },
            { status: 500 }
          )
        }

        await logAudit({
          targetSection: draft.dashboard_sections?.section_key || draft.section_id,
          before: existing.content_json,
          after: draft.content_json,
          action: 'publish',
        })
      }
    }

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}