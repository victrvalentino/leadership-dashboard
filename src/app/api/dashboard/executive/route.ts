import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const executiveSectionId =
      '21fce94f-5285-46d0-af9b-c3afdfc5cd66'

    const { data, error } = await supabase
      .from('published_content')
      .select('*')
      .eq('section_id', executiveSectionId)
      .order('version', { ascending: false })
      .limit(1)

    if (error) {
      return NextResponse.json(
        { error },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No published content found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data[0].content_json
    })
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}