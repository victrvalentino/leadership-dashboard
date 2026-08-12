// Computes a human-readable summary of what changed between two
// section content snapshots. Only compares top-level keys — nested
// objects/arrays are reported as "changed" rather than deep-diffed,
// which keeps this fast and avoids over-engineering a generic diff
// for arbitrary per-section JSON shapes.

type Json = Record<string, unknown>

export type FieldChange = {
  field: string
  before: unknown
  after: unknown
}

export function diffContent(before: Json | null | undefined, after: Json): FieldChange[] {
  const b = before || {}
  const changes: FieldChange[] = []
  const keys = Array.from(new Set([...Object.keys(b), ...Object.keys(after)]))

  for (const key of keys) {
    const beforeVal = b[key]
    const afterVal = after[key]
    const same = JSON.stringify(beforeVal) === JSON.stringify(afterVal)
    if (!same) {
      changes.push({ field: key, before: beforeVal, after: afterVal })
    }
  }

  return changes
}

export function summarizeChanges(changes: FieldChange[]): string {
  if (changes.length === 0) return 'No visible field changes'
  const names = changes.map((c) => c.field)
  const preview = names.slice(0, 4).join(', ')
  const extra = names.length > 4 ? ` +${names.length - 4} more` : ''
  return `Updated ${changes.length} field${changes.length === 1 ? '' : 's'}: ${preview}${extra}`
}

// Keeps only primitive before/after pairs in metadata — arrays/objects
// are flagged as changed without embedding potentially large blobs.
export function compactChanges(changes: FieldChange[]) {
  return changes.map((c) => {
    const isPrimitive = (v: unknown) =>
      v === null || ['string', 'number', 'boolean'].includes(typeof v)
    return {
      field: c.field,
      before: isPrimitive(c.before) ? c.before : '[object]',
      after: isPrimitive(c.after) ? c.after : '[object]',
    }
  })
}
