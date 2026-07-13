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
    const { data, error } = await supabase
      .from('published_content')
      .select('updated_at')
      .order('updated_at', { ascending: false })
      .limit(1)

    if (error) {
      return NextResponse.json(
        { error: String(error.message) },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      updatedAt: data?.[0]?.updated_at || null
    })
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}
