// src/lib/sheetUtils.ts
// ─────────────────────────────────────────────────────────────────────────
// Defensive helpers used by mappers.ts to turn loosely-typed Google Sheets
// cell values into the exact types the UI components expect — without ever
// throwing or producing NaN/undefined that would leak into the dashboard.
// ─────────────────────────────────────────────────────────────────────────
import type { SheetRow } from './googleSheetsApi'

/** Converts a "Key | Value" tab (rows of {Key, Value}) into a flat object. */
export function rowsToKV(rows: SheetRow[]): Record<string, string | number | boolean | null> {
  const out: Record<string, string | number | boolean | null> = {}
  rows.forEach((row) => {
    const key = row['Key'] ?? row['key']
    const value = row['Value'] ?? row['value']
    if (key !== undefined && key !== null && String(key).trim() !== '') {
      out[String(key).trim()] = value
    }
  })
  return out
}

/** Safe string coercion — falls back if blank/missing. */
export function str(v: unknown, fallback: string): string {
  if (v === undefined || v === null) return fallback
  const s = String(v).trim()
  return s === '' ? fallback : s
}

/**
 * Safe number coercion — strips currency symbols, %, commas, "Rp", "B"/"M"
 * suffixes are NOT expanded (kept as display strings via str() instead).
 * Falls back to `fallback` if the result isn't a finite number.
 */
export function num(v: unknown, fallback: number): number {
  if (v === undefined || v === null || v === '') return fallback
  if (typeof v === 'number') return Number.isFinite(v) ? v : fallback
  const cleaned = String(v).replace(/[^0-9.\-]/g, '')
  const n = parseFloat(cleaned)
  return Number.isFinite(n) ? n : fallback
}

/** Restricts a raw value to one of `allowed`, falling back if it doesn't match. */
export function pickEnum<T extends string>(v: unknown, allowed: readonly T[], fallback: T): T {
  const s = String(v ?? '').trim().toLowerCase()
  return (allowed as readonly string[]).includes(s) ? (s as T) : fallback
}

/**
 * Maps a list-type tab (array of row objects) into typed records, falling
 * back to `defaults` if the tab is missing or empty. This is what gives
 * every chart/list section "safe empty tab" behavior for free.
 */
export function mapList<T>(
  rows: SheetRow[],
  rowMapper: (row: SheetRow, index: number) => T,
  defaults: T[]
): T[] {
  if (!rows || rows.length === 0) return defaults
  return rows.map(rowMapper)
}
