import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { id, title, subtitle, ...dynamicFields } = body

    const { error: sectionError } = await supabase
      .from('dashboard_sections')
      .update({ title, subtitle })
      .eq('id', id)

    if (sectionError) {
      return NextResponse.json(
        { error: sectionError.message },
        { status: 500 }
      )
    }

    const { data: existing, error: existingError } = await supabase
      .from('draft_content')
      .select('*')
      .eq('section_id', id)
      .maybeSingle()

    if (existingError) {
      return NextResponse.json(
        { error: existingError.message },
        { status: 500 }
      )
    }

    const newContent = {
      ...(existing?.content_json || {}),
      title,
      subtitle,
      ...dynamicFields
    }

    if (!existing) {
      const { error } = await supabase
        .from('draft_content')
        .insert({
          section_id: id,
          content_json: newContent,
          version: 1
        })

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
      }
    } else {
      const { error } = await supabase
        .from('draft_content')
        .update({
          content_json: newContent,
          version: (existing.version || 1) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('section_id', id)

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        )
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