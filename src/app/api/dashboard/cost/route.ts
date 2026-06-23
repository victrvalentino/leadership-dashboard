import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: section, error: sectionError } = await supabase
      .from('dashboard_sections')
      .select('*')
      .eq('section_key', 'cost')
      .single()

    if (sectionError || !section) {
      return NextResponse.json(
        { error: 'Cost section not found' },
        { status: 404 }
      )
    }

    const { data: published, error: publishedError } = await supabase
      .from('published_content')
      .select('*')
      .eq('section_id', section.id)
      .order('version', { ascending: false })
      .limit(1)

    if (publishedError) {
      return NextResponse.json(
        { error: String(publishedError.message) },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: published?.[0]?.content_json || null
    })
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}