import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: section } = await supabase
      .from('dashboard_sections')
      .select('*')
      .eq('section_key', 'turnover')
      .single()

    if (!section) {
      return NextResponse.json(
        { error: 'Turnover section not found' },
        { status: 404 }
      )
    }

    const { data: published } = await supabase
      .from('published_content')
      .select('*')
      .eq('section_id', section.id)
      .single()

    return NextResponse.json({
      success: true,
      data: published?.content_json || null
    })
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}