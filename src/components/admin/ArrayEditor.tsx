'use client'

type Row = Record<string, string | number>

type Props = {
  title: string
  rows: Row[]
  columns: string[]
  onChange: (rows: Row[]) => void
}

export default function ArrayEditor({
  title,
  rows,
  columns,
  onChange
}: Props) {
  function updateRow(
    index: number,
    key: string,
    value: string
  ) {
    const updated = [...rows]

    updated[index] = {
      ...updated[index],
      [key]:
        key === 'value'
          ? Number(value)
          : value
    }

    onChange(updated)
  }

  function addRow() {
    const newRow: Row = {}

    columns.forEach((column) => {
      if (column === 'value') {
        newRow[column] = 0
      } else {
        newRow[column] = ''
      }
    })

    onChange([...rows, newRow])
  }

  function removeRow(index: number) {
    const updated = rows.filter((_, i) => i !== index)
    onChange(updated)
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">{title}</h3>

        <button
          onClick={addRow}
          className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200"
        >
          + Add Row
        </button>
      </div>

      {rows.length === 0 && (
        <div className="text-sm text-gray-400 italic">
          No rows yet
        </div>
      )}

      <div className="space-y-3">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid gap-3 items-center"
            style={{
              gridTemplateColumns: `repeat(${columns.length}, 1fr) auto`
            }}
          >
            {columns.map((column) => (
              <input
                key={column}
                value={String(row[column] ?? '')}
                onChange={(e) =>
                  updateRow(index, column, e.target.value)
                }
                className="w-full border rounded-lg px-3 py-2"
                placeholder={column}
              />
            ))}

            <button
              onClick={() => removeRow(index)}
              className="px-3 py-2 rounded-lg bg-red-100 text-red-600 font-medium hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}