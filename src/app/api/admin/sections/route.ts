import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getSection(sectionKey: string) {
  const { data, error } = await supabase
    .from('dashboard_sections')
    .select('id')
    .eq('section_key', sectionKey)
    .single()

  if (error || !data) {
    throw new Error(`Section not found: ${sectionKey}`)
  }

  return data
}

export async function GET(req: NextRequest) {
  try {
    const sectionKey =
      req.nextUrl.searchParams.get('section')

    if (sectionKey) {
      const section = await getSection(sectionKey)

      const { data, error } = await supabase
        .from('draft_content')
        .select('*')
        .eq('section_id', section.id)
        .order('version', { ascending: false })
        .limit(1)

      if (error) {
        return NextResponse.json(
          { error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        content: data?.[0]?.content_json || null
      })
    }

    const { data, error } = await supabase
      .from('dashboard_sections')
      .select('*')
      .order('section_key')

    if (error) {
      return NextResponse.json(
        { error },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('GET ERROR:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error)
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      section_key,
      content,
      publish = false
    } = body

    if (!section_key || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const section = await getSection(section_key)

    const table = publish
      ? 'published_content'
      : 'draft_content'

    const userColumn = publish
      ? 'published_by'
      : 'edited_by'

    const { data: existingRows, error: existingError } =
      await supabase
        .from(table)
        .select('*')
        .eq('section_id', section.id)
        .order('version', { ascending: false })
        .limit(1)

    if (existingError) {
      return NextResponse.json(
        { error: existingError },
        { status: 500 }
      )
    }

    const existing = existingRows?.[0]
    const nextVersion = existing
      ? (existing.version || 0) + 1
      : 1

    if (existing) {
      const { error } = await supabase
        .from(table)
        .update({
          content_json: content, // overwrite full object
          version: nextVersion,
          updated_at: new Date().toISOString(),
          [userColumn]: null
        })
        .eq('id', existing.id)

      if (error) {
        return NextResponse.json(
          { error },
          { status: 500 }
        )
      }
    } else {
      const { error } = await supabase
        .from(table)
        .insert({
          section_id: section.id,
          content_json: content,
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          [userColumn]: null
        })

      if (error) {
        return NextResponse.json(
          { error },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: publish
        ? 'Published successfully'
        : 'Draft saved successfully'
    })
  } catch (error) {
    console.error('POST ERROR:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error)
      },
      { status: 500 }
    )
  }
}