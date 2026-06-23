import { supabase } from './supabase'

export type SheetRow = Record<string, string | number | boolean | null>
export type RawSheetData = Record<string, SheetRow[]>

let cache: { data: RawSheetData; fetchedAt: number } | null = null
const CACHE_TTL_MS = 5 * 60 * 1000

export async function fetchSheetData(force = false): Promise<RawSheetData> {
  if (!force && cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data
  }

  try {
    const { data, error } = await supabase
      .from('published_content')
      .select(`
        content_json,
        dashboard_sections (
          section_key
        )
      `)

    if (error) {
      console.error(error)
      return {}
    }

    const transformed: RawSheetData = {}

    data?.forEach((row: any) => {
      const section = row.dashboard_sections?.section_key
      if (!section) return

      transformed[section] = Array.isArray(row.content_json)
        ? row.content_json
        : [row.content_json]
    })

    cache = {
      data: transformed,
      fetchedAt: Date.now(),
    }

    return transformed
  } catch (err) {
    console.error(err)
    return {}
  }
}

export function getTab(raw: RawSheetData, tabName: string): SheetRow[] {
  const rows = raw[tabName]
  return Array.isArray(rows) ? rows : []
}