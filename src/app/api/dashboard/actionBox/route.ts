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
      .eq('section_key', 'actionBox')
      .single()

    if (!section) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const { data } = await supabase
      .from('published_content')
      .select('*')
      .eq('section_id', section.id)
      .order('version', { ascending: false })
      .limit(1)

    return NextResponse.json({
      success: true,
      data: data?.[0]?.content_json || null
    })
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}