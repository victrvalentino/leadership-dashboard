import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const sectionKey = 'executive'

    const { data: section, error: sectionError } = await supabase
      .from('dashboard_sections')
      .select('id')
      .eq('section_key', sectionKey)
      .single()

    console.log('SECTION:', section)

    if (sectionError || !section) {
      console.log('SECTION ERROR:', sectionError)

      return NextResponse.json(
        { error: 'Executive section not found' },
        { status: 404 }
      )
    }

    const { data, error } = await supabase
      .from('published_content')
      .select('*')
      .eq('section_id', section.id)
      .order('version', { ascending: false })

    console.log(
      'PUBLISHED ROWS:',
      data?.map((x) => ({
        id: x.id,
        version: x.version,
        title: x.content_json?.title
      }))
    )

    if (error) {
      console.log('QUERY ERROR:', error)

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
    console.log('FATAL ERROR:', error)

    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}